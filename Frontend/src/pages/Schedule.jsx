import React, { useState } from "react";

const Schedule = () => {
  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDateChange = (e) => setTargetDate(e.target.value);

  // --- Helper to parse Prolog output ---
  const parsePrologResult = (resultString, dockName, craneCode, staffID, areaID) => {
    if (!resultString) return [];

    const cleaned = resultString.replace(/\[|\]/g, "").trim();
    if (!cleaned) return [];

    return cleaned.split(/\),/).map((item) => {
      const clean = item.replace(/\(|\)/g, "").trim();
      const parts = clean.split(",");

      return {
        vessel: parts[0]?.trim() || "",
        start: parts[1]?.trim() || "",
        end: parts[2]?.trim() || "",
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

    try {
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
      const parsedResults = Object.entries(data).flatMap(([dockId, dockInfo]) =>
        parsePrologResult(
          dockInfo.schedule,
          dockInfo.dock || dockId,
          dockInfo.crane,
          dockInfo.staff
        )
      );

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
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Vessel</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Dock</th>
                <th>Assigned Crane</th>
                <th>Staff</th>
              </tr>
            </thead>
            <tbody>
              {scheduleResults.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.vessel}</td>
                  <td>{item.start}</td>
                  <td>{item.end}</td>
                  <td>{item.dock}</td>
                  <td>{item.crane}</td>
                  <td>{item.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Schedule;
