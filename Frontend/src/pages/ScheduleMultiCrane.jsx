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
    const slotNum = parseInt(slot);
    if (isNaN(slotNum)) return slot;
    const hours = slotNum % 24;
    const days = Math.floor(slotNum / 24);
    const timeStr = `${hours.toString().padStart(2, "0")}:00`;
    return days > 0 ? `${timeStr} (+${days}d)` : timeStr;
  };

  const parsePrologSchedule = (scheduleString) => {
    if (!scheduleString) return [];
    
    // Remove brackets and clean
    let cleaned = scheduleString.replace(/\[|\]/g, "").trim();
    if (!cleaned) return [];

    // Split by "), (" pattern to separate triplets
    return cleaned.split(/\),\s*\(/).map((item) => {
      // Remove any remaining parentheses
      const clean = item.replace(/\(|\)/g, "").trim();
      const parts = clean.split(",").map(p => p.trim());
      
      return {
        vessel: parts[0] || "",
        start: slotToTime(parts[1] || ""),
        end: slotToTime(parts[2] || ""),
        cranes: parseInt(parts[3]) || 1,
        startSlot: parseInt(parts[1]),
        endSlot: parseInt(parts[2])
      };
    });
  };

  const handleGenerateSchedule = async () => {
    if (!targetDate) return alert("Please select a date");
    if (!token) return alert("Token not ready yet, please wait a moment");

    const isoDate = new Date(targetDate).toISOString().split("T")[0];
    setLoading(true);
    setError("");
    setScheduleResults(null);

    try {
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
      const processedResults = Object.entries(data).map(([dockId, dockInfo]) => ({
        dockId,
        dockName: dockInfo.dock,
        singleCrane: {
          schedule: parsePrologSchedule(dockInfo.singleCrane.schedule),
          delay: dockInfo.singleCrane.delay,
          craneHours: dockInfo.singleCrane.craneHours
        },
        multiCrane: {
          schedule: parsePrologSchedule(dockInfo.multiCrane.schedule),
          delay: dockInfo.multiCrane.delay,
          craneHours: dockInfo.multiCrane.craneHours
        },
        improvement: dockInfo.improvement
      }));

      setScheduleResults(processedResults);
    } catch (err) {
      setError("Multi-crane scheduling failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-container">
      <h1 className="schedule-header">Multi-Crane Scheduling (US 3.4.5)</h1>
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
          <h2 className="dock-header">📍 Dock: {dockResult.dockName}</h2>

          {/* Improvement Summary Card */}
          <div className={`improvement-summary ${dockResult.improvement.delayReduction > 0 ? 'positive' : 'neutral'}`}>
            <h3>📊 Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Delay Reduction:</span>
                <span className="summary-value">{dockResult.improvement.delayReduction} hours</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Improvement:</span>
                <span className="summary-value">{dockResult.improvement.percentageImprovement}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Additional Crane-Hours:</span>
                <span className="summary-value">{dockResult.improvement.additionalCraneHours}</span>
              </div>
            </div>
            {dockResult.improvement.delayReduction === 0 && (
              <p className="summary-note">No delays detected - multi-crane optimization not needed</p>
            )}
            {dockResult.improvement.delayReduction > 0 && (
              <p className="summary-note success">Multi-crane scheduling successfully reduced delays!</p>
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
              </div>
              
              <div className="table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Vessel</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Cranes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dockResult.singleCrane.schedule.map((row, i) => (
                      <tr key={i}>
                        <td>{row.vessel}</td>
                        <td>{row.start}</td>
                        <td>{row.end}</td>
                        <td>{row.cranes}</td>
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
              </div>
              
              <div className="table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Vessel</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Cranes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dockResult.multiCrane.schedule.map((row, i) => (
                      <tr key={i} className={row.cranes > 1 ? 'multi-crane-row' : ''}>
                        <td>{row.vessel}</td>
                        <td>{row.start}</td>
                        <td>{row.end}</td>
                        <td className={row.cranes > 1 ? 'multi-crane-cell' : ''}>
                          {row.cranes} {row.cranes > 1 && "Multiple cranes used"}
                        </td>
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