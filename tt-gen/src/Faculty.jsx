import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import "./Faculty.css"

const Faculty = () => {
  const [facultyName, setFacultyName] = useState("");
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [slotMapping, setSlotMapping] = useState({});
  const [facultyTimetable, setFacultyTimetable] = useState({});

  useEffect(() => {

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
  const classroomMap = [
    "LHC-L1", "LHC-L3", "LHC-L4", "LHC-L5", "LHC-L6", "LHC-L7", "LHC-L8", "LHC-L9", "LHC-L10", "LHC-L11",
    "AB1-A1", "AB1-A2", "AB1-108", "AB1-308",
    "AB2-401", "AB2-402", "AB2-403", "AB2-404",
    "AB3-401", "AB3-402", "AB3-403"
  ];

  const generateFacultyTimetable = (facultyCourses) => {
    let newFacultyTimetable = {};

    facultyCourses.forEach((course) => {
      timetable.forEach((row, slotIndex) => {
        row.forEach((entry, classroomIndex) => {
          if (entry.includes(course)) {
            const slotName = String.fromCharCode(65 + slotIndex); 
            const classroomNumber = classroomMap[classroomIndex];

            if (slotMapping[slotName]) {
              slotMapping[slotName].schedule.forEach(({ day, time }) => {
                if (!newFacultyTimetable[day]) {
                  newFacultyTimetable[day] = {};
                }
                newFacultyTimetable[day][time] = `${course}
                 ${classroomNumber}`;
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
        unit: "pt",
      });
      let centerX = doc.internal.pageSize.getWidth() / 2;
      doc.text('Faculty Timetable', centerX, 25, { align: 'center' });
    autoTable(doc,{
      html: 'table',
      theme: 'plain',
      styles: {
          cellPadding: 10,
          fontSize: 12,
          lineColor: 10,
          lineWidth: .5,
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle'
      }});
    doc.save("faculty_timetable.pdf");

  };

      
  return (
    <div>
      <div className="heading">
      <h2>Faculty, enter your ID</h2>
      </div>

      <div className="main-section">
        <input
          type="text"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
          placeholder="Enter Faculty Name"
          className="input-field"
        />
        <button onClick={fetchFacultyCourses} className="get-courses">Get Courses</button>
      </div>

      {courses.length > 0 && (
        <>
        <div className="course">
        <h3>Courses Taught:</h3>
          <ul>
            {courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
          

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
                    <td key={time}>
                      {facultyTimetable[day]?.[time] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="button">
          <button onClick={exportToPDF} className="button-pdf">
        Download as PDF
      </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Faculty;
