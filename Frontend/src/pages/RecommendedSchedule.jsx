import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const RecommendedAlgorithm = () => {
    const [targetDate, setTargetDate] = useState("");
    const [scheduleResults, setScheduleResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [executionTime, setExecutionTime] = useState(null);
    const [vesselNotifications, setVesselNotifications] = useState([]);
    const [token, setToken] = useState(null);
    const [recommendedAlgorithm, setRecommendedAlgorithm] = useState("");
    const [selectionReason, setSelectionReason] = useState("");

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

    const chooseAlgorithm = (vessels, ops, timeLimitSeconds = 30) => {
        if (ops < 150 && timeLimitSeconds > 120)
            return {
                algo: "optimal",
                reason: "Small operation set (<150 ops) and long time budget.",
            };
        if (ops < 400)
            return { algo: "heuristic", reason: "Medium-sized instance (<400 ops)." };
        return { algo: "genetic", reason: "Large or time-constrained instance." };
    };

    const handleGenerateSchedule = async () => {
        if (!targetDate) return alert("Please select a date");
        if (!token) return alert("Token not ready");

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
            setRecommendedAlgorithm(algo);
            setSelectionReason(reason);

            const scheduleRes = await fetch(
                `http://localhost:5107/api/Scheduling/calculate-schedule?date=${isoDate}&algorithm=${algo}`,
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

            for (const dockId in parsedJSON) {
                const dockInfo = parsedJSON[dockId];
                let scheduleText = dockInfo.schedule.trim();

                // Remove leading [ and trailing ] even if there is whitespace
                scheduleText = scheduleText.replace(/^\s*\[|\]\s*$/g, "").trim();

                // Optional: remove any remaining [ or ] inside the text
                scheduleText = scheduleText.replace(/\[|\]/g, "")
                // Extract execution time if heuristic
                if (algo === "heuristic") {
                    const execMatch = scheduleText.match(
                        /Heuristic Execution Time:\s*([\d.e-]+)/i
                    );
                    if (execMatch) {
                        setExecutionTime(parseFloat(execMatch[1]));
                        scheduleText = scheduleText.replace(execMatch[0], "").trim();
                    }
                } else {
                    setExecutionTime(null);
                }

                const lines = scheduleText.split("),").filter((line) => line.trim() !== "");

                lines.forEach((lineRaw) => {
                    const line = lineRaw.replace(/[\(\)]/g, "").trim();
                    const parts = line.split(",").map((p) => p.trim());
                    if (parts.length >= 3) {
                        results.push({
                            vessel: parts[0],
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
        <div style={{ padding: 20, textAlign: "center" }}>
            <h1>Recommended Algorithm</h1>
            <p style={{ color: "#555" }}>
                The system automatically selects the best algorithm based on the number of
                vessels, operations, and available time.
            </p>

            <div style={{ marginBottom: 20 }}>
                <label>
                    Target Date:{" "}
                    <input type="date" value={targetDate} onChange={handleDateChange} />
                </label>
                <button onClick={handleGenerateSchedule} style={{ marginLeft: 10 }}>
                    Generate Recommended Schedule
                </button>
            </div>

            {recommendedAlgorithm && (
                <div style={{ marginTop: 10, fontSize: 18 }}>
                    <strong>Selected Algorithm: </strong>
                    {recommendedAlgorithm}
                    <br />
                    <em style={{ color: "#777" }}>{selectionReason}</em>
                </div>
            )}

            {loading && <p>Generating schedule...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {scheduleResults.length > 0 && (
                <div
                    style={{
                        width: "100%",
                        marginTop: 20,
                        paddingBottom: "1rem",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            tableLayout: "auto",  // auto sizing according to text
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={th}>Vessel</th>
                                <th style={th}>Dock</th>
                                <th style={th}>Crane</th>
                                <th style={th}>Start</th>
                                <th style={th}>End</th>
                                <th style={th}>Staff</th>
                                <th style={th}>Area</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleResults.map((row, i) => (
                                <tr key={i}>
                                    <td style={td}>{row.vessel}</td>
                                    <td style={td}>{row.dock}</td>
                                    <td style={td}>{row.crane}</td>
                                    <td style={td}>{row.start}</td>
                                    <td style={td}>{row.end}</td>
                                    <td style={td}>{row.staff}</td>
                                    <td style={td}>{row.area}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

const th = { border: "1px solid black", padding: 5 };
const td = { border: "1px solid black", padding: 5 };

export default RecommendedAlgorithm;
