import React, { useState } from "react";

const Schedule = () => {
  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDateChange = (e) => setTargetDate(e.target.value);

  const parsePrologResult = (resultString) => {
    // Remove all brackets and whitespace/newlines
    const cleaned = resultString.replace(/\[|\]/g, "").trim();
    if (!cleaned) return [];

    return cleaned.split(/\),/).map((item) => {
      const clean = item.replace(/\(|\)/g, "").trim();
      const parts = clean.split(",");

      return {
        vessel: parts[0] || "",
        start: parts[1] || "",
        end: parts[2] || "",
        dock: "",
        crane: "",
        staff: "",
      };
    });
  };


  const handleGenerateSchedule = async () => {
    if (!targetDate) return alert("Please select a date");

    setLoading(true);
    setError("");
    setScheduleResults([]);

    try {
      const response = await fetch(
        `http://localhost:5107/api/Scheduling/calculate-schedule?date=${targetDate}`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const parsedResults = parsePrologResult(data.scheduleResult);
      setScheduleResults(parsedResults);
    } catch (err) {
      setError("Scheduling failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
                <th>Dock</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Assigned Crane</th>
                <th>Staff</th>
              </tr>
            </thead>
            <tbody>
              {scheduleResults.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.vessel}</td>
                  <td>{item.dock}</td>
                  <td>{item.start}</td>
                  <td>{item.end}</td>
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
