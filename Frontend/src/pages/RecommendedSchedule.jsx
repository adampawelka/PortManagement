import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Scheduling.css";

const RecommendedSchedule = () => {
    const [targetDate, setTargetDate] = useState("");
    const [scheduleResults, setScheduleResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [executionTime, setExecutionTime] = useState(null);
    const [vesselNotifications, setVesselNotifications] = useState([]);
    const [token, setToken] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
    const [selectionReason, setSelectionReason] = useState("");
    const [userAlgorithm, setUserAlgorithm] = useState(""); // manual override

    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        const fetchToken = async () => {
            if (isAuthenticated) {
                try {
                    const t = await getAccessTokenSilently();
                    setToken(t);
                } catch (err) {
                    console.error("Failed to get token:", err);
                }
            }
        };
        fetchToken();
    }, [isAuthenticated, getAccessTokenSilently]);

    const handleDateChange = (e) => setTargetDate(e.target.value);
    const handleAlgorithmChange = (e) => setUserAlgorithm(e.target.value);

    const chooseAlgorithm = (vessels, ops, timeLimitSeconds = 30) => {
        if (ops < 10 && timeLimitSeconds > 120)
            return { algo: "optimal", reason: "Small operation set (<150 ops) and long time budget." };
        if (ops > 10 && ops < 20)
            return { algo: "heuristic", reason: "Medium-sized instance (<400 ops)." };
        return { algo: "genetic", reason: "Large or time-constrained instance." };
    };

    const extractExecutionTime = (scheduleText) => {
        const patterns = [
            /Heuristic Execution Time:\s*([\d.e-]+)/i,
            /Brute Force Execution Time:\s*([\d.e-]+)/i,
            /Genetic Execution Time:\s*([\d.e-]+)/i,
            /Execution Time:\s*([\d.e-]+)/i
        ];
        for (const pattern of patterns) {
            const match = scheduleText.match(pattern);
            if (match) return parseFloat(match[1]);
        }
        return null;
    };

    const handleGenerateSchedule = async () => {
        if (!targetDate) return alert("Please select a date");
        if (!token) return alert("Token not ready");

        // Skip fetching for genetic algorithm
        if (userAlgorithm === "genetic") {
            setSelectedAlgorithm("genetic");
            setSelectionReason("User-selected override");
            setScheduleResults([]);
            setExecutionTime(null);
            return;
        }

        const isoDate = new Date(targetDate).toISOString().split("T")[0];

        setLoading(true);
        setError("");
        setScheduleResults([]);
        setExecutionTime(null);

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

            if (!notificationsResponse.ok) throw new Error("Failed to load VVNs");

            const allNotifications = await notificationsResponse.json();
            const dateNotifications = allNotifications.filter(
                (n) =>
                    n.status === "Approved" &&
                    new Date(n.eta).toISOString().split("T")[0] === isoDate
            );

            setVesselNotifications(dateNotifications);

            const vesselCount = dateNotifications.length;
            const operations = dateNotifications.reduce(
                (sum, v) => sum + (v.estimatedOperations || 30),
                0
            );

            const { algo, reason } = chooseAlgorithm(vesselCount, operations);

            // Select algorithm based on user override or default choice
            const selectedAlgo = userAlgorithm || algo;
            const selectedReason = userAlgorithm ? "User-selected override" : reason;

            setSelectedAlgorithm(selectedAlgo);
            setSelectionReason(selectedReason);

            const scheduleRes = await fetch(
                `http://localhost:5107/api/Scheduling/calculate-schedule?date=${isoDate}&algorithm=${selectedAlgo}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const text = await scheduleRes.text();
            if (!scheduleRes.ok) throw new Error(text);

            const parsedJSON = JSON.parse(text);
            const results = [];

            let isFirstRow = true;

            for (const dockId in parsedJSON) {
                const dockInfo = parsedJSON[dockId];
                let scheduleText = dockInfo.schedule.trim();

                scheduleText = scheduleText.replace(/^\s*\[|\]\s*$/g, "").trim();
                scheduleText = scheduleText.replace(/\[|\]/g, "");

                const execTime = extractExecutionTime(scheduleText);
                if (execTime !== null) setExecutionTime(execTime);

                scheduleText = scheduleText.replace(/Execution Time:.*\n?/i, "")
                    .replace(/Heuristic Execution Time:.*\n?/i, "")
                    .replace(/Brute Force Execution Time:.*\n?/i, "")
                    .replace(/Genetic Execution Time:.*\n?/i, "")
                    .trim();

                const lines = scheduleText.split("),").filter((line) => line.trim() !== "");

                lines.forEach((lineRaw) => {
                    const line = lineRaw.replace(/[\(\)]/g, "").trim();
                    const parts = line.split(",").map((p) => p.trim());

                    let vesselName = parts[0]?.trim();
                    if (isFirstRow && selectedAlgo === algo) {
                        vesselName = vesselName.split(" ")[1];
                    }

                    isFirstRow = false;

                    // Ensure that vesselName is added correctly
                    if (vesselName && parts.length >= 3) {
                        results.push({
                            vessel: vesselName, // Only add the vessel name
                            dock: dockInfo.dock || dockId,
                            crane: dockInfo.crane,
                            start: parts[1],
                            end: parts[2],
                            staff: "Assigned Staff TBD",
                            area: dockInfo.area,
                        });
                    }
                });
            }

            setScheduleResults(results);
        } catch (err) {
            console.error(err);
            setError("Scheduling failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="schedule-container">
            <h1 className="schedule-header">Recommended Algorithm</h1>
            <p className="schedule-subheader">
                The system automatically selects the best algorithm based on the number of vessels, operations, and available time.
            </p>

            <div className="schedule-controls">
                <div className="control-group">
                    <label className="control-label">Target Date:</label>
                    <input type="date" value={targetDate} onChange={handleDateChange} className="control-input" />
                </div>

                <div className="control-group">
                    <label className="control-label">Algorithm Override:</label>
                    <select value={userAlgorithm} onChange={handleAlgorithmChange} className="control-input">
                        <option value="">Auto (recommended)</option>
                        <option value="optimal">Optimal</option>
                        <option value="heuristic">Heuristic</option>
                        <option value="genetic">Genetic</option>
                    </select>
                </div>

                <button onClick={handleGenerateSchedule} className="control-button">
                    Generate Schedule
                </button>
            </div>

            {selectedAlgorithm && (
                <div className="result-box">
                    <strong>Selected Algorithm: </strong>{selectedAlgorithm}
                    <br />
                    <em style={{ color: "#555" }}>{selectionReason}</em>
                    {executionTime && <div>Execution Time: {executionTime}s</div>}
                </div>
            )}

            {loading && <p className="info-text">Generating schedule...</p>}
            {error && <p className="error-text">{error}</p>}


            {scheduleResults.length > 0 && (
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
                            {scheduleResults.map((row, i) => (
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
            )}

        </div>
    );
};

export default RecommendedSchedule;
