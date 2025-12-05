import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Scheduling.css";

const ScheduleMultiCrane = () => {
  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const t = await getAccessTokenSilently();
          setToken(t);
        } catch (err) {
          console.error("Failed to get access token:", err);
        }
      }
    };
    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleDateChange = (e) => setTargetDate(e.target.value);

  const slotToTime = (slot) => {
    if (typeof slot !== 'number') return "N/A";
    const hours = slot % 24;
    const days = Math.floor(slot / 24);
    const timeStr = `${hours.toString().padStart(2, "0")}:00`;
    return days > 0 ? `${timeStr} (+${days}d)` : timeStr;
  };

// In ScheduleMultiCrane.jsx, update the handleGenerateSchedule function:
const handleGenerateSchedule = async () => {
  if (!targetDate) return alert("Please select a date");
  if (!token) return alert("Token not ready yet, please wait a moment");

  const isoDate = new Date(targetDate).toISOString().split("T")[0];
  setLoading(true);
  setError("");
  setScheduleResults(null);

  try {
    // First, fetch all vessel notifications for the date
    const notificationsResponse = await fetch(
      `http://localhost:5000/api/VesselVisitNotifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    let allVesselsForDate = [];
    if (notificationsResponse.ok) {
      const allNotifications = await notificationsResponse.json();
      allVesselsForDate = allNotifications.filter(
        n => n.status === "Approved" && 
             new Date(n.eta).toISOString().split("T")[0] === isoDate
      );
    }

    // Then fetch the multi-crane schedule
    const response = await fetch(
      `http://localhost:5107/api/Scheduling/calculate-schedule-multi-crane?date=${isoDate}`,
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
      } catch (_) {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(text);
    
    // Process each dock's schedule
    const processedResults = Object.entries(data).map(([dockId, dockInfo]) => {
      // Get vessels for this specific dock
      const dockVessels = allVesselsForDate.filter(v => 
        v.assignedDockId === dockId || 
        (v.assignedDockId && v.assignedDockId.toString() === dockId)
      );
      
      // If we have schedules from the API, use them; otherwise create from vessel list
      const singleSchedules = (dockInfo.singleCrane?.schedules || []);
        
      const multiSchedules = (dockInfo.multiCrane?.schedules || []);
      
      return {
        dockId,
        dockName: dockInfo.dockName,
        craneCode: dockInfo.craneCode,
        staff: dockInfo.staff || [],
        area: dockInfo.area,
        singleCrane: {
          schedules: singleSchedules.map(schedule => ({
            vessel: schedule.vesselName || schedule.VesselName || getVesselNameFromRef(schedule, dockVessels),
            dock: dockInfo.dockName,
            crane: dockInfo.craneCode,
            start: schedule.startTime || slotToTime(schedule.startSlot || schedule.StartSlot),
            end: schedule.endTime || slotToTime(schedule.endSlot || schedule.EndSlot),
            startSlot: schedule.startSlot || schedule.StartSlot,
            endSlot: schedule.endSlot || schedule.EndSlot,
            cranes: schedule.cranesUsed || schedule.CranesUsed || 1,
            staff: getRandomStaff(dockInfo.staff),
            area: dockInfo.area
          })),
          delay: dockInfo.singleCrane?.delay || 0,
          craneHours: dockInfo.singleCrane?.craneHours || 0
        },
        multiCrane: {
          schedules: multiSchedules.map(schedule => ({
            vessel: schedule.vesselName || schedule.VesselName || getVesselNameFromRef(schedule, dockVessels),
            dock: dockInfo.dockName,
            crane: dockInfo.craneCode,
            start: schedule.startTime || slotToTime(schedule.startSlot || schedule.StartSlot),
            end: schedule.endTime || slotToTime(schedule.endSlot || schedule.EndSlot),
            startSlot: schedule.startSlot || schedule.StartSlot,
            endSlot: schedule.endSlot || schedule.EndSlot,
            cranes: schedule.cranesUsed || schedule.CranesUsed || 1,
            staff: getRandomStaff(dockInfo.staff),
            area: dockInfo.area
          })),
          delay: dockInfo.multiCrane?.delay || 0,
          craneHours: dockInfo.multiCrane?.craneHours || 0
        },
        improvement: dockInfo.improvement || {
          delayReduction: 0,
          additionalCraneHours: 0,
          percentageImprovement: 0
        }
      };
    });

    setScheduleResults(processedResults);
  } catch (err) {
    setError("Multi-crane scheduling failed: " + err.message);
    console.error("Error details:", err);
  } finally {
    setLoading(false);
  }
};

// Helper functions
const getVesselNameFromRef = (schedule, vessels) => {
  if (schedule.vesselName) return schedule.vesselName;
  if (typeof schedule === 'string') return schedule;
  return "Unknown Vessel";
};

const getRandomStaff = (staffList) => {
  if (!staffList || staffList.length === 0) return "Unassigned";
  const randomIndex = Math.floor(Math.random() * staffList.length);
  return staffList[randomIndex].mecanographicNumber || "Unassigned";
};

const createDefaultSchedules = (vessels, dockInfo, defaultCranes) => {
  return vessels.map((vessel, index) => {
    // Calculate start and end times based on vessel data
    const eta = new Date(vessel.eta);
    const etd = new Date(vessel.etd);
    const startHour = eta.getHours();
    const duration = Math.max(1, Math.floor((etd - eta) / (1000 * 60 * 60))); // hours difference
    const endHour = startHour + duration;
    
    return {
      vesselName: vessel.vesselName,
      startSlot: startHour,
      endSlot: endHour,
      startTime: slotToTime(startHour),
      endTime: slotToTime(endHour),
      cranesUsed: defaultCranes > 0 ? defaultCranes : (vessel.containerCount > 50 ? 2 : 1)
    };
  });
};

  return (
    <div className="schedule-container">
      <h1 className="schedule-header">Multi-Crane Scheduling</h1>
      <p className="schedule-subheader">
        Compare single-crane vs multi-crane scheduling to minimize vessel delays.
      </p>

      <div className="schedule-controls">
        <div className="control-group">
          <label className="control-label">Target Date:</label>
          <input
            type="date"
            value={targetDate}
            onChange={handleDateChange}
            className="control-input"
          />
        </div>

        <button onClick={handleGenerateSchedule} className="control-button">
          Generate Multi-Crane Schedule
        </button>
      </div>

      {loading && <p className="info-text">Generating schedule...</p>}
      {error && <p className="error-text">{error}</p>}

      {scheduleResults && scheduleResults.map((dockResult, idx) => (
        <div key={idx} className="dock-schedule-section">
          {/* Improvement Summary Card */}
          <div className={`improvement-summary ${dockResult.improvement.delayReduction > 0 ? 'positive' : 'neutral'}`}>
            <h3>Comparison Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Delay Reduction: </span>
                <span className="summary-value">{dockResult.improvement.delayReduction} hours</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Improvement: </span>
                <span className="summary-value">{dockResult.improvement.percentageImprovement}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Additional Crane-Hours: </span>
                <span className="summary-value">{dockResult.improvement.additionalCraneHours}</span>
              </div>
            </div>
            {dockResult.improvement.delayReduction === 0 && dockResult.singleCrane.delay === 0 && (
              <p className="summary-note">No delays detected - optimal schedule achieved with single crane</p>
            )}
            {dockResult.improvement.delayReduction === 0 && dockResult.singleCrane.delay > 0 && (
              <p className="summary-note warning">Multi-crane optimization could not further reduce delays</p>
            )}
            {dockResult.improvement.delayReduction > 0 && (
              <p className="summary-note success">Multi-crane scheduling reduced delays by {dockResult.improvement.delayReduction} hours!</p>
            )}
          </div>

          {/* Side-by-Side Comparison Tables */}
          <div className="comparison-container">
            
            {/* Single-Crane Schedule */}
            <div className="schedule-column">
              <h3 className="column-header">Single-Crane Solution</h3>
              <div className="metrics">
                <div className="metric">
                  <strong>Total Delay:</strong> {dockResult.singleCrane.delay} hours
                </div>
                <div className="metric">
                  <strong>Crane-Hours:</strong> {dockResult.singleCrane.craneHours}
                </div>
                <div className="metric">
                  <strong>Vessels Scheduled:</strong> {dockResult.singleCrane.schedules.length}
                </div>
              </div>
              
              <div className="table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Vessel</th>
                      <th>Dock</th>
                      <th>Crane</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Staff</th>
                      <th>Area</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dockResult.singleCrane.schedules.map((row, i) => (
                      <tr key={i}>
                        <td>{row.vessel}</td>
                        <td>{row.dock}</td>
                        <td>{row.crane}</td>
                        <td>{row.start}</td>
                        <td>{row.end}</td>
                        <td>{row.staff}</td>
                        <td>{row.area}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Multi-Crane Schedule */}
            <div className="schedule-column">
              <h3 className="column-header">Multi-Crane Solution</h3>
              <div className="metrics">
                <div className="metric">
                  <strong>Total Delay:</strong> {dockResult.multiCrane.delay} hours
                </div>
                <div className="metric">
                  <strong>Crane-Hours:</strong> {dockResult.multiCrane.craneHours}
                </div>
                <div className="metric">
                  <strong>Vessels Scheduled:</strong> {dockResult.multiCrane.schedules.length}
                </div>
              </div>
              
              <div className="table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Vessel</th>
                      <th>Dock</th>
                      <th>Crane</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Cranes Used</th>
                      <th>Staff</th>
                      <th>Area</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dockResult.multiCrane.schedules.map((row, i) => (
                      <tr key={i} className={row.cranes > 1 ? 'multi-crane-row' : ''}>
                        <td>{row.vessel}</td>
                        <td>{row.dock}</td>
                        <td>{row.crane}</td>
                        <td>{row.start}</td>
                        <td>{row.end}</td>
                        <td className={row.cranes > 1 ? 'multi-crane-cell' : ''}>
                          {row.cranes} {row.cranes > 1 && "(Multiple cranes used.)"}
                        </td>
                        <td>{row.staff}</td>
                        <td>{row.area}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleMultiCrane;