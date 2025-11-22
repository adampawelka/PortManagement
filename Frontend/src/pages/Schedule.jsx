import React, { useState } from "react";

const Schedule = () => {
  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [vesselNotifications, setVesselNotifications] = useState([]);

  const handleDateChange = (e) => setTargetDate(e.target.value);

  // --- Helper to convert slot number to time format ---
  const slotToTime = (slot) => {
    const slotNum = parseInt(slot);
    if (isNaN(slotNum)) return slot;
    
    const hours = slotNum % 24;
    const days = Math.floor(slotNum / 24);
    const timeStr = `${hours.toString().padStart(2, '0')}:00`;
    
    return days > 0 ? `${timeStr} (+${days}d)` : timeStr;
  };

  // --- Helper to get vessel notification by name ---
  const getVesselNotification = (vesselName) => {
    return vesselNotifications.find(n => 
      n.vesselName.toLowerCase().replace(/\s+/g, '_') === vesselName.toLowerCase()
    );
  };

  // --- Helper to calculate delay in hours ---
  const calculateDelay = (endSlot, etd) => {
    const endSlotNum = parseInt(endSlot);
    if (isNaN(endSlotNum) || !etd) return "N/A";
    
    const etdDate = new Date(etd);
    const etdHour = etdDate.getHours();
    
    const delay = endSlotNum - etdHour;
    return delay > 0 ? `${delay}h` : "On time";
  };

  // --- Helper to extract execution time from Prolog output ---
  const extractExecutionTime = (resultString) => {
    const match = resultString.match(/Execution Time:\s*([\d.e-]+)/i);
    return match ? parseFloat(match[1]) : null;
  };

  // --- Helper to parse Prolog output ---
  const parsePrologResult = (resultString, dockName, craneCode, staffID, areaID) => {
    if (!resultString) return [];

    // Remove execution time message if present
    let cleaned = resultString.replace(/Execution Time:.*?\n/i, "").trim();
    
    cleaned = cleaned.replace(/\[|\]/g, "").trim();
    if (!cleaned) return [];

    return cleaned.split(/\),/).map((item) => {
      const clean = item.replace(/\(|\)/g, "").trim();
      const parts = clean.split(",");
      
      const startSlot = parts[1]?.trim() || "";
      const endSlot = parts[2]?.trim() || "";

      return {
        vessel: parts[0]?.trim() || "",
        start: slotToTime(startSlot),
        end: slotToTime(endSlot),
        startSlot: parseInt(startSlot),  // Store raw slot number
        endSlot: parseInt(endSlot),      // Store raw slot number
        dock: dockName || "Unknown Dock",
        crane: craneCode || "Unassigned",
        staff: staffID || "Unassigned",
        area: areaID || "Unassigned"
      };
    });
  };

  // --- Fetch and process schedule from backend ---
  const handleGenerateSchedule = async () => {
    if (!targetDate) return alert("Please select a date");

    const isoDate = new Date(targetDate).toISOString().split('T')[0];

    setLoading(true);
    setError("");
    setScheduleResults([]);
    setExecutionTime(null);
    setVesselNotifications([]);

    try {
      // Try to fetch vessel notifications (non-critical)
      try {
        const notificationsResponse = await fetch(
          `http://localhost:5000/api/VesselVisitNotifications`
        );
        
        if (notificationsResponse.ok) {
          const allNotifications = await notificationsResponse.json();
          // Filter for approved vessels on the target date
          const dateNotifications = allNotifications.filter(n => 
            n.status === "Approved" && 
            new Date(n.eta).toISOString().split('T')[0] === isoDate
          );
          setVesselNotifications(dateNotifications);
        }
      } catch (notifError) {
        console.warn("Could not fetch vessel notifications:", notifError);
        // Continue anyway - ETA/ETD columns will show "N/A"
      }

      // Fetch schedule
      const response = await fetch(
        `http://localhost:5107/api/Scheduling/calculate-schedule?date=${isoDate}`
      );

      // Read the response body as text — even if not 200 OK
      const text = await response.text();

      if (!response.ok) {
        // Try to parse JSON { message: "..."} or just show plain text
        let errorMessage = text;
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || json.error || text;
        } catch (_) { }

        throw new Error(errorMessage);
      }

      // Parse valid JSON response
      const data = JSON.parse(text);

      // The API returns an object of dock schedules
      const parsedResults = Object.entries(data).flatMap(([dockId, dockInfo]) => {
        // Extract execution time from the first dock's schedule
        const execTime = extractExecutionTime(dockInfo.schedule);
        if (execTime !== null) setExecutionTime(execTime);

        return parsePrologResult(
          dockInfo.schedule,
          dockInfo.dock || dockId,
          dockInfo.crane,
          dockInfo.staff
        );
      });

      setScheduleResults(parsedResults);
    } catch (err) {
      // Show backend message
      setError("Scheduling failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  // --- Render ---
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Scheduling</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Target Date:{" "}
          <input type="date" value={targetDate} onChange={handleDateChange} />
        </label>
        <button onClick={handleGenerateSchedule} style={{ marginLeft: "10px" }}>
          Generate Schedule
        </button>
      </div>

      {loading && <p>Generating schedule...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {scheduleResults.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Vessel</th>
                  <th>ETA</th>
                  <th>Expected Departure</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Delay</th>
                  <th>Dock</th>
                  <th>Assigned Crane</th>
                  <th>Staff</th>
                </tr>
              </thead>
              <tbody>
                {scheduleResults.map((item, idx) => {
                  const notification = getVesselNotification(item.vessel);
                  const eta = notification ? new Date(notification.eta).toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}) : "N/A";
                  const etd = notification ? new Date(notification.etd).toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}) : "N/A";
                  const delay = notification ? calculateDelay(item.endSlot, notification.etd) : "N/A";
                  
                  return (
                    <tr key={idx}>
                      <td>{item.vessel}</td>
                      <td>{eta}</td>
                      <td>{etd}</td>
                      <td>{item.start}</td>
                      <td>{item.end}</td>
                      <td>{delay}</td>
                      <td>{item.dock}</td>
                      <td>{item.crane}</td>
                      <td>{item.staff}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {executionTime !== null && (
            <div style={{ textAlign: "center", marginTop: "10px", color: "#666" }}>
              <strong>Brute Force Execution Time:</strong> {(executionTime * 1000).toFixed(4)} ms
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
