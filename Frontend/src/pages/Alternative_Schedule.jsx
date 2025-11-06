// src/pages/Scheduling.jsx
import React, { useState } from "react";

const Schedule = () => {
  const [targetDate, setTargetDate] = useState("");
  const [scheduleResults, setScheduleResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDateChange = (e) => setTargetDate(e.target.value);

  const handleGenerateSchedule = async () => {
    if (!targetDate) return alert("Please select a date");

    setLoading(true);
    setError("");

    try {
      const results = await fakeScheduleAPI(targetDate);
      setScheduleResults(results);
    } catch (err) {
      setError("Scheduling failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Scheduling</h1>

      {/* Date Picker */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Target Date:{" "}
          <input type="date" value={targetDate} onChange={handleDateChange} />
        </label>
        <button onClick={handleGenerateSchedule} style={{ marginLeft: "10px" }}>
          Generate Schedule
        </button>
      </div>

      {/* Feedback */}
      {loading && <p>Generating schedule...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Centered Summary Table */}
      {scheduleResults.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Vessel</th>
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

// Fake API for demonstration
const fakeScheduleAPI = async (date) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { vessel: "Vessel A", start: "08:00", end: "12:00", crane: "Crane 1", staff: 5 },
    { vessel: "Vessel B", start: "12:30", end: "17:00", crane: "Crane 2", staff: 4 },
  ];
};

export default Schedule;
