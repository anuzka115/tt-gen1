import { useEffect, useState } from "react";
import "./Generated.css";

const Generated = () => {
  const [slots, setSlots] = useState(Array(13).fill().map(() => Array(22).fill("")));

  useEffect(() => {
    fetch("http://localhost:5000/api/instructors")
      .then((res) => res.json())
      .then((data) => generateTimetable(data))
      .catch((err) => console.error("Error fetching instructors:", err));
  }, []);

  const generateTimetable = (instructors) => {
    let newSlots = Array(13).fill().map(() => Array(21).fill(""));
    let row = 0, col = 0;

    for (let inst of instructors) {
      for (let course of inst.courses) {
        if (row >= 13) {
          row = 0;
          col++;
        }
        if (col < 22) {
          newSlots[row][col] = course;
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

  const slotLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  const classrooms = [
    "LHC-L1", "LHC-L3", "LHC-L4", "LHC-L5", "LHC-L6", "LHC-L7", "LHC-L8", "LHC-L9", "LHC-L10", "LHC-L11",  // LHC
    "AB1-A1", "AB1-A2", "AB1-108", "AB1-308",  // AB1
    "AB2-401", "AB2-402", "AB2-403", "AB2-404",  // AB2
    "AB3-401", "AB3-402", "AB3-403"  // AB3
  ];

  return (
    <div>
      <h2 className="heading">Generated Timetable</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Slot</th>
            {classrooms.map((room, index) => (
              <th key={index}>{room}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((row, i) => (
            <tr key={i}>
              <td>{slotLabels[i]}</td>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button">
      <button onClick={saveTimetable} className="button-pdf">Save Timetable</button>
      </div>
    </div>
  );
};

export default Generated;
