import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Ensure autoTable is imported correctly

const Faculty = () => {
  const [facultyName, setFacultyName] = useState("");
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [slotMapping, setSlotMapping] = useState({});
  const [facultyTimetable, setFacultyTimetable] = useState({});

  useEffect(() => {
    // Fetch slot-to-time mapping
    fetch("http://localhost:5000/api/slots")
      .then((res) => res.json())
      .then((data) => setSlotMapping(data))
      .catch((err) => console.error("Error fetching slot mapping:", err));

    // Fetch the full timetable
    fetch("http://localhost:5000/api/timetable")
      .then((res) => res.json())
      .then((data) => setTimetable(data.slots || []))
      .catch((err) => console.error("Error fetching timetable:", err));
  }, []);

  const fetchFacultyCourses = () => {
    fetch(`http://localhost:5000/api/faculty/${facultyName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          return;
        }
        setCourses(data.courses || []);
        generateFacultyTimetable(data.courses || []);
      })
      .catch((err) => console.error("Error fetching faculty courses:", err));
  };

  const generateFacultyTimetable = (facultyCourses) => {
    let newFacultyTimetable = {};

    facultyCourses.forEach((course) => {
      timetable.forEach((row, slotIndex) => {
        row.forEach((entry, classroomIndex) => {
          if (entry.includes(course)) {
            const slotName = String.fromCharCode(65 + slotIndex); // Convert 0 → 'A', 1 → 'B', etc.
            const classroomNumber = classroomIndex + 1;

            if (slotMapping[slotName]) {
              slotMapping[slotName].schedule.forEach(({ day, time }) => {
                if (!newFacultyTimetable[day]) {
                  newFacultyTimetable[day] = {};
                }
                newFacultyTimetable[day][time] = `${course} (Classroom ${classroomNumber})`;
              });
            }
          }
        });
      });
    });


    setFacultyTimetable(newFacultyTimetable);

  };
  const exportToPDF = () => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [400, 100],
        styles:{
            cellPadding: 10,
        }
      });
      
    doc.text("Faculty Timetable", 10, 10);
    autoTable(doc,{
        html: 'table',
        theme: 'plain',
        });
    doc.save("Faculty_timetable.pdf");
      };

  return (
    <div>
      <h2>Faculty Timetable</h2>

      <div>
        <input
          type="text"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
          placeholder="Enter Faculty Name"
        />
        <button onClick={fetchFacultyCourses}>Get Courses</button>
      </div>

      {courses.length > 0 && (
        <>
          <h3>Courses Taught:</h3>
          <ul>
            {courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>

          <h3>Timetable</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Day / Time</th>
                {[
                  "9:00 - 9:55 AM",
                  "10:00 - 10:55 AM",
                  "11:00 - 11:55 AM",
                  "12:00 - 12:55 PM",
                  "Lunch",
                  "2:00 - 2:55 PM",
                  "3:00 - 3:55 PM",
                  "4:00 - 4:55 PM",
                  "5:00 - 5:55 PM",
                ].map((time) => (
                  <th key={time}>{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <tr key={day}>
                  <td>{day}</td>
                  {[
                    "9:00 AM - 9:55 AM",
                    "10:00 AM - 10:55 AM",
                    "11:00 AM - 11:55 AM",
                    "12:00 PM - 12:55 PM",
                    "Lunch",
                    "2:00 PM - 2:55 PM",
                    "3:00 PM - 3:55 PM",
                    "4:00 PM - 4:55 PM",
                    "5:00 PM - 5:55 PM",
                  ].map((time) => (
                    <td key={time} style={{ backgroundColor: facultyTimetable[day]?.[time] ? "#f0f8ff" : "white" }}>
                      {facultyTimetable[day]?.[time] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportToPDF} style={{ marginTop: "20px", padding: "10px", backgroundColor: "blue", color: "white" }}>
        Download as PDF
      </button>
        </>
      )}
    </div>
  );
};

export default Faculty;
