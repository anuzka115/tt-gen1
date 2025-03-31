import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const View = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/timetable")
      .then((res) => res.json())
      .then((data) => setSlots(data?.slots || []))
      .catch((err) => console.error("Error fetching timetable:", err));
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [450, 200],
        styles:{
            cellPadding: 10,
        }
      });
      
    doc.text("Admin Timetable", 10, 10);
    autoTable(doc,{
        html: 'table',
        theme: 'plain',
        });
    doc.save("admin_timetable.pdf");

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
      <h2>View Timetable</h2>
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
      <button onClick={exportToPDF}>Export to PDF</button>
    </div>
  );
};

export default View;
