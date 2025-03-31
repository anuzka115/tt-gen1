import { useEffect, useState } from "react";
import "./Generated.css"

const Generated = () => {
  const [slots, setSlots] = useState(Array(13).fill().map(() => Array(22).fill("")));

  useEffect(() => {
    fetch("http://localhost:5000/api/instructors")
      .then((res) => res.json())
      .then((data) => generateTimetable(data))
      .catch((err) => console.error("Error fetching instructors:", err));
  }, []);

  const generateTimetable = (instructors) => {
    let newSlots = Array(13).fill().map(() => Array(22).fill(""));
    let row = 0, col = 0;

    for (let inst of instructors) {
      for (let course of inst.courses) {
        if (row >= 13) {
          row = 0;
          col++;
        }
        if (col < 22) {
          newSlots[row][col] = `${course} (${inst.name})`;
          row++;
        }
      }
    }

    setSlots(newSlots);
  };

  const saveTimetable = () => {
    fetch("http://localhost:5000/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    })
      .then(() => alert("Timetable saved!"))
      .catch((err) => console.error("Error saving timetable:", err));
  };

  return (
    <div>
      <h2>Generated Timetable</h2>
      <table border="1">
        <tbody>
          {slots.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveTimetable}>Save Timetable</button>
    </div>
  );
};

export default Generated;
