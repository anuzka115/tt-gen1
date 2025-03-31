import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Ensure autoTable is imported correctly

const View = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/timetable")
      .then((res) => res.json())
      .then((data) => setSlots(data?.slots || []))
      .catch((err) => console.error("Error fetching timetable:", err));
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Generated Timetable", 10, 10); // Title

    autoTable(doc, { body: slots }); // ✅ Use autoTable correctly

    doc.save("timetable.pdf");
  };

  return (
    <div>
      <h2>View Timetable</h2>
      <table border="1">
        <tbody>
          {slots.map((row, i) => (
            <tr key={i}>
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
