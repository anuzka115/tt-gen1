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
        format: [450, 200]
      });
      let centerX = doc.internal.pageSize.getWidth() / 2;
      doc.text('IISERB Timetable', centerX, 5, { align: 'center' });
    autoTable(doc,{
        html: 'table',
        theme: 'plain',
        styles: {
          lineColor: 10,
          lineWidth: .5,
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle'
      }
        
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
      <h2 className="heading">View Timetable</h2>
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
      <button onClick={exportToPDF} className="button-pdf">Export to PDF</button>
      </div>
      <h4 className="heading"> Slot Information</h4>
      <div>
      <table border="1">
  <thead>
    <tr>
      <th>Day</th>
      <th>9:00 - 9:55 AM</th>
      <th>10:00 - 10:55 AM</th>
      <th>11:00 - 11:55 AM</th>
      <th>12:00 - 12:55 PM</th>
      <th>Lunch Break</th>
      <th>2:00 - 2:55 PM</th>
      <th>3:00 - 3:55 PM</th>
      <th>4:00 - 4:55 PM</th>
      <th>5:00 - 5:55 PM</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Monday</td>
      <td>A</td>
      <td>C</td>
      <td>D</td>
      <td>G</td>
      <td rowspan="5" align="center"><strong>Lunch Break</strong></td>
      <td>H</td>
      <td>I</td>
      <td>J</td>
      <td>K</td>
    </tr>
    <tr>
      <td>Tuesday</td>
      <td>A</td>
      <td>D</td>
      <td>E</td>
      <td>F</td>
      <td>H</td>
      <td>I</td>
      <td>J</td>
      <td>L</td>
    </tr>
    <tr>
      <td>Wednesday</td>
      <td>C</td>
      <td>B</td>
      <td>D</td>
      <td>F</td>
      <td>H</td>
      <td>I</td>
      <td>J</td>
      <td>M</td>
    </tr>
    <tr>
      <td>Thursday</td>
      <td>A</td>
      <td>B</td>
      <td>E</td>
      <td>F</td>
      <td>G</td>
      <td>K</td>
      <td>L</td>
      <td>M</td>
    </tr>
    <tr>
      <td>Friday</td>
      <td>C</td>
      <td>B</td>
      <td>E</td>
      <td>G</td>
      <td>K</td>
      <td>M</td>
      <td>L</td>
      <td>I</td>
    </tr>
  </tbody>
</table>

      </div>
    </div>
  );
};

export default View;
