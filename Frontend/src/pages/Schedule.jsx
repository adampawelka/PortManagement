import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Schedule = () => {
  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [vesselNotifications, setVesselNotifications] = useState([]);
  const [token, setToken] = useState(null); // <-- store token here

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // --- Fetch token when user is authenticated ---
  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const t = await getAccessTokenSilently();
          setToken(t);
          console.log("token:" + t);
        } catch (err) {
          console.error("Failed to get access token:", err);
        }
      }
    };
    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleDateChange = (e) => setTargetDate(e.target.value);

  // --- Helpers (slotToTime, getVesselNotification, calculateDelay, etc.) ---
  const slotToTime = (slot) => {
    const slotNum = parseInt(slot);
    if (isNaN(slotNum)) return slot;

    const hours = slotNum % 24;
    const days = Math.floor(slotNum / 24);
    const timeStr = `${hours.toString().padStart(2, "0")}:00`;
    return days > 0 ? `${timeStr} (+${days}d)` : timeStr;
  };

  const getVesselNotification = (vesselName) =>
    vesselNotifications.find(
      (n) => n.vesselName.toLowerCase().replace(/\s+/g, "_") === vesselName.toLowerCase()
    );

  const calculateDelay = (endSlot, etd) => {
    const endSlotNum = parseInt(endSlot);
    if (isNaN(endSlotNum) || !etd) return "N/A";
    const etdDate = new Date(etd);
    const etdHour = etdDate.getHours();
    const delay = endSlotNum - etdHour;
    return delay > 0 ? `${delay}h` : "On time";
  };

  const extractExecutionTime = (resultString) => {
    const patterns = [
      /Brute Force Execution Time:\s*([\d.e-]+)/i,
      /Execution Time:\s*([\d.e-]+)/i,
    ];
    for (const pattern of patterns) {
      const match = resultString.match(pattern);
      if (match) return parseFloat(match[1]);
    }
    return null;
  };

  const parsePrologResult = (resultString, dockName, craneCode, allStaff, areaID) => {
    if (!resultString) return [];
    let cleaned = resultString.replace(/Brute Force Execution Time:.*?\n/i, "")
      .replace(/Execution Time:.*?\n/i, "").trim();
    cleaned = cleaned.replace(/\[|\]/g, "").trim();
    if (!cleaned) return [];

    return cleaned.split(/\),/).map((item) => {
      const clean = item.replace(/\(|\)/g, "").trim();
      const parts = clean.split(",");
      const startSlot = parts[1]?.trim() || "";
      const endSlot = parts[2]?.trim() || "";

      const availableStaff = (allStaff || []).filter((s) => {
        const [startOp, endOp] = s.operationalWindow.split("-").map(Number);
        return startSlot >= startOp && endSlot <= endOp;
      });


      const assignedStaff = availableStaff.length > 0
        ? availableStaff[Math.floor(Math.random() * availableStaff.length)]
        : null;

      return {
        vessel: parts[0]?.trim() || "",
        start: slotToTime(startSlot),
        end: slotToTime(endSlot),
        startSlot: parseInt(startSlot),
        endSlot: parseInt(endSlot),
        dock: dockName || "Unknown Dock",
        crane: craneCode || "Unassigned",
        staff: assignedStaff ? assignedStaff.MecanographicNumber : "Unassigned",
        area: areaID || "Unassigned",
      };
    });
  };

  // --- Fetch schedule ---
  const handleGenerateSchedule = async () => {
    if (!targetDate) return alert("Please select a date");
    if (!token) return alert("Token not ready yet, please wait a moment");


    const isoDate = new Date(targetDate).toISOString().split("T")[0];
    setLoading(true);
    setError("");
    setScheduleResults([]);
    setExecutionTime(null);
    setVesselNotifications([]);

    try {
      // Fetch vessel notifications
      console.log("Before1:", token);

      try {
        const notificationsResponse = await fetch(
          `http://localhost:5000/api/VesselVisitNotifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("after:", token);


        if (notificationsResponse.ok) {
          const allNotifications = await notificationsResponse.json();
          const dateNotifications = allNotifications.filter(
            (n) =>
              n.status === "Approved" &&
              new Date(n.eta).toISOString().split("T")[0] === isoDate
          );
          setVesselNotifications(dateNotifications);
        }
      } catch (notifError) {
        console.warn("Could not fetch vessel notifications:", notifError);
      }

      // Fetch schedule
      const response = await fetch(
        `http://localhost:5107/api/Scheduling/calculate-schedule?date=${isoDate}&algorithm=bruteforce`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = await response.text();

      if (!response.ok) {
        let errorMessage = text;
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || json.error || text;
        } catch (_) { }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(text);

      const parsedResults = Object.entries(data).flatMap(([dockId, dockInfo]) => {
        const execTime = extractExecutionTime(dockInfo.schedule);
        if (execTime !== null) setExecutionTime(execTime);

        return parsePrologResult(
          dockInfo.schedule,
          dockInfo.dock || dockId,
          dockInfo.crane,
          dockInfo.staff,
          dockInfo.area
        );
      });

      setScheduleResults(parsedResults);
    } catch (err) {
      setError("Scheduling failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Optimal Scheduling (Brute Force)</h1>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Target Date: <input type="date" value={targetDate} onChange={handleDateChange} />
        </label>
        <button onClick={handleGenerateSchedule} style={{ marginLeft: "10px" }}>
          Generate Optimal Schedule
        </button>
      </div>
      {loading && <p>Generating schedule...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {scheduleResults.length > 0 && (
        <table style={{ margin: "0 auto", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "5px" }}>Vessel</th>
              <th style={{ border: "1px solid black", padding: "5px" }}>Dock</th>
              <th style={{ border: "1px solid black", padding: "5px" }}>Crane</th>
              <th style={{ border: "1px solid black", padding: "5px" }}>Start</th>
              <th style={{ border: "1px solid black", padding: "5px" }}>End</th>
              <th style={{ border: "1px solid black", padding: "5px" }}>Staff</th>
              <th style={{ border: "1px solid black", padding: "5px" }}>Area</th>
            </tr>
          </thead>
          <tbody>
            {scheduleResults.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "5px" }}>{item.vessel}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{item.dock}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{item.crane}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{item.start}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{item.end}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{item.staff}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{item.area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default Schedule;
