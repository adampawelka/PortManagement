// src/pages/TestAlgorithms.jsx
import React, { useState } from "react";

const TestAlgorithms = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bruteforce");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const algorithms = [
    { value: "bruteforce", label: "Brute Force (Optimal)" },
    { value: "edt", label: "EDT Heuristic (Early Departure Time)" },
    { value: "spt", label: "SPT Heuristic (Shortest Processing Time)" },
    { value: "dynamic_mst", label: "Dynamic MST (Minimum Slack Time)" },
    { value: "hill_climbing", label: "Hill Climbing (Local Search)" }
  ];

  const handleAlgorithmChange = (e) => {
    setSelectedAlgorithm(e.target.value);
    setResult(null);
    setError("");
  };

  const handleTest = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `http://localhost:5107/api/Scheduling/test-algorithms?algorithm=${selectedAlgorithm}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to test algorithm");
      console.error("Error testing algorithm:", err);
    } finally {
      setLoading(false);
    }
  };

  // Parse the sequence from Prolog output
  const parseSequence = (sequenceString) => {
    if (!sequenceString) return [];
    
    try {
      // Remove brackets and split by vessel entries
      const cleaned = sequenceString.trim()
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .replace(/\n/g, '');
      
      // Match pattern: (vessel_name, start_slot, end_slot)
      const regex = /\(([^,]+),\s*(\d+),\s*(\d+)\)/g;
      const matches = [];
      let match;
      
      while ((match = regex.exec(cleaned)) !== null) {
        matches.push({
          vessel: match[1],
          startSlot: parseInt(match[2]),
          endSlot: parseInt(match[3])
        });
      }
      
      return matches;
    } catch (err) {
      console.error("Error parsing sequence:", err);
      return [];
    }
  };

  const parsedSequence = result ? parseSequence(result.sequence) : [];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        IARTI - Algorithm Testing
      </h1>
      
      <div style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "20px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h3 style={{ marginTop: 0 }}>Test Data (Hardcoded)</h3>
        <p style={{ fontFamily: "monospace", fontSize: "12px", margin: "10px 0" }}>
          vessel(va, 6, 63, 10, 16) | vessel(vb, 23, 50, 9, 7) | vessel(vc, 8, 40, 5, 12)<br/>
          vessel(vd, 27, 40, 0, 8) | vessel(ve, 36, 70, 12, 0) | vessel(vf, 40, 60, 8, 6)<br/>
          vessel(vg, 52, 80, 9, 10) | vessel(vi, 61, 90, 13, 8) | vessel(vj, 74, 100, 7, 7)<br/>
          vessel(vk, 81, 110, 6, 8)
        </p>
        <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
          Format: vessel(name, arrival_hour, departure_hour, unload_time, load_time)
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
          Select Algorithm:
        </label>
        <select
          value={selectedAlgorithm}
          onChange={handleAlgorithmChange}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        >
          {algorithms.map((alg) => (
            <option key={alg.value} value={alg.value}>
              {alg.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "20px"
        }}
      >
        {loading ? "Testing..." : "Test Algorithm"}
      </button>

      {error && (
        <div style={{
          padding: "15px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px"
        }}>
          <h2 style={{ marginTop: 0, color: "#333" }}>Results</h2>
          
          <div style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "10px", fontSize: "16px" }}>
              <strong>Algorithm:</strong> {result.algorithm}
            </div>
            <div style={{ marginBottom: "10px", fontSize: "16px" }}>
              <strong>Execution Time:</strong>{" "}
              {result.executionTime !== "N/A" 
                ? result.executionTime
                : "N/A"}
            </div>
            <div style={{ marginBottom: "10px", fontSize: "16px" }}>
              <strong>Total Delay:</strong>{" "}
              {result.totalDelay !== "N/A" 
                ? `${result.totalDelay} hours`
                : "N/A"}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "10px" }}>Vessel Sequence</h3>
            {parsedSequence.length > 0 ? (
              <div style={{
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "14px"
              }}>
                {parsedSequence.map((item, index) => (
                  <div key={index} style={{ marginBottom: "5px" }}>
                    {index + 1}. {item.vessel} (slots {item.startSlot}-{item.endSlot})
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: "15px",
                backgroundColor: "#fff3cd",
                color: "#856404",
                borderRadius: "4px"
              }}>
                Could not parse sequence. Raw output:
                <pre style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "12px"
                }}>
                  {result.sequence}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAlgorithms;

