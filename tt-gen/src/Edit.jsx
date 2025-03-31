import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Edit.css"

const Edit = () => {
  const [instructors, setInstructors] = useState([]);
  const [name, setName] = useState("");
  const [courses, setCourses] = useState([""]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch("http://localhost:5000/api/instructors")
      .then((res) => res.json())
      .then((data) => setInstructors(data))
      .catch((err) => console.error("Error fetching instructors:", err));
  }, []);

  const addInstructor = () => {
    fetch("http://localhost:5000/api/instructors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, courses }),
    })
      .then(() => {
        setInstructors([...instructors, { name, courses }]);
        setName("");
        setCourses([""]);
      })
      .catch((err) => console.error("Error adding instructor:", err));
  };

  const addCourseField = () => setCourses([...courses, ""]);

  const updateCourse = (index, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = value;
    setCourses(updatedCourses);
  };

  const generateTimetable = () => navigate("generated");

  const resetTimetable = () => {
    if (window.confirm("Are you sure you want to reset the timetable? This cannot be undone!")) {
      fetch("http://localhost:5000/api/timetable/reset", { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          alert("Timetable and instructors list have been reset.");
          setInstructors([]); 
        })
        .catch((err) => console.error("Error resetting timetable:", err));
    }
  };

  return (
    <div>
      <h2 className="heading">Edit Timetable</h2>
      <div className="inst">
      <input
        type="text"
        placeholder="Instructor Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
      />
      <div className="courses-inst">
      {courses.map((course, index) => (
        <input
          key={index}
          type="text"
          placeholder="Course Name"
          value={course}
          onChange={(e) => updateCourse(index, e.target.value)}
           className="input-field"
        />
      ))}
      <button onClick={addCourseField} className="button-pdf">+ Add Course</button>
      </div>
      <button onClick={addInstructor} className="button-pdf">Add Instructor</button>

      </div>
      <div className="id3">
      <div className="text-sec">
      <h3>Instructors List</h3>
      <ul>
        {instructors.map((inst, index) => (
          <li key={index}>{inst.name} - {inst.courses.join(", ")}</li>
        ))}
      </ul>
      </div>
        <div className="button3">
        <button onClick={generateTimetable} className="button-pdf">Generate Timetable</button>
      <button onClick={resetTimetable} className="button-reset">
        Reset Timetable
      </button>
        </div>

      </div>
     
    </div>
  );
};

export default Edit;