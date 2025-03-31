import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Student.css"

const Student = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [slotMapping, setSlotMapping] = useState({});
  const [studentTimetable, setStudentTimetable] = useState({});
  const [conflicts, setConflicts] = useState([]);
  
  const classroomMap = [
    "LHC-L1", "LHC-L3", "LHC-L4", "LHC-L5", "LHC-L6", "LHC-L7", "LHC-L8", "LHC-L9", "LHC-L10", "LHC-L11",
    "AB1-A1", "AB1-A2", "AB1-108", "AB1-308",
    "AB2-401", "AB2-402", "AB2-403", "AB2-404",
    "AB3-401", "AB3-402", "AB3-403"
  ];
  
  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));

    fetch("http://localhost:5000/api/slots")
      .then((res) => res.json())
      .then((data) => setSlotMapping(data))
      .catch((err) => console.error("Error fetching slot mapping:", err));

    fetch("http://localhost:5000/api/timetable")
      .then((res) => res.json())
      .then((data) => setTimetable(data.slots || []))
      .catch((err) => console.error("Error fetching timetable:", err));
  }, []);

  const handleCourseSelection = (course) => {
    let newStudentTimetable = { ...studentTimetable };
    let newConflicts = [];

    if (selectedCourses.includes(course)) {
      setSelectedCourses((prev) => prev.filter((c) => c !== course));

      for (let day in newStudentTimetable) {
        for (let time in newStudentTimetable[day]) {
          if (newStudentTimetable[day][time].startsWith(course)) {
            newStudentTimetable[day][time] = "";
          }
        }
      }
      setStudentTimetable(newStudentTimetable);
      return;
    }

    timetable.forEach((row, slotIndex) => {
      row.forEach((entry, classroomIndex) => {
        if (entry.includes(course)) {
          const slotName = String.fromCharCode(65 + slotIndex);
          const classroomNumber = classroomMap[classroomIndex];

          if (slotMapping[slotName]) {
            slotMapping[slotName].schedule.forEach(({ day, time }) => {
              if (!newStudentTimetable[day]) {
                newStudentTimetable[day] = {};
              }

              if (newStudentTimetable[day][time]) {
                newConflicts.push({ day, time, course });
              } else {
                newStudentTimetable[day][time] = `${course} ${classroomNumber}`;
              }
            });
          }
        }
      });
    });

    if (newConflicts.length > 0) {
      alert(`Conflict detected! ${course} overlaps with another course.`);
      setConflicts(newConflicts);
      return;
    }

    setStudentTimetable(newStudentTimetable);
    setSelectedCourses([...selectedCourses, course]);
    setConflicts([]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
      });
      let centerX = doc.internal.pageSize.getWidth() / 2;
      doc.text('Student Timetable', centerX, 25, { align: 'center' });
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
    doc.save("student_timetable.pdf");

  };

  return (
    <div>
      <h2>Student, select the courses you are taking this semester!</h2>
      <div>
        {courses.map((course) => (
          <button
            key={course}
            onClick={() => handleCourseSelection(course)}
            style={{
              backgroundColor: selectedCourses.includes(course) ? "black" : "white",
              color:selectedCourses.includes(course) ? "white" : "black",
            }}
            className="button-course"
          >
            {course}
          </button>
        ))}
      </div>

      <h2>Personalized Timetable</h2>
      <table>
        <thead backgroundColor="whitesmoke"> 
          <tr>
            <th ackgroundColor="whitesmoke">Day / Time</th>
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
              <th key={time} backgroundColor="whitesmoke">{time}</th>
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
              ].map((time) => {
                const isConflict = conflicts.some((c) => c.day === day && c.time === time);
                return (
                  <td
                    key={time}
                  >
                    {studentTimetable[day]?.[time] || ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
          <div className="button">
          <button onClick={exportToPDF} className="button-pdf">
        Download as PDF
      </button>
          </div>
    </div>
  );
};

export default Student;
