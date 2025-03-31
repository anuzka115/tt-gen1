import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css"
import { Link, useNavigate } from 'react-router-dom'
import logo from "./assets/IISERB_logo.png"
import ttLogo from "./assets/undraw_calendar_8r6s.svg"

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <>
     <div className='navbar'>
      <div className='links'>
      <Link to="student">Student</Link>
        <Link to="faculty">Faculty</Link>
        <Link to="Admin">Admin</Link>
      </div>
        <div>
          <img src={logo} alt="logo" height="100" width="100" className='logoimg'/>
        </div>
         {isAdmin ? (
          <button onClick={handleLogout} className='login-btn'>
            Logout
          </button>
        ) : (
          <Link to="login/signup" className='login-btn'>Admin Login</Link>
        )}
     </div>
     <div className='main'>
      <div className='text'>
      <h1>ScheduleEase</h1>
<h4>Effortless Timetable Generation</h4>

<ul>
  <li>Automatically generate a conflict-free timetable</li>
  <li>Ensure no instructor or student has overlapping classes</li>
  <li>Get a personalized timetable tailored to your selections</li>
  <li>Seamlessly export your timetable to PDF</li>
  <li>Streamline the scheduling process with ease</li>
</ul>

      </div>
      <div>
        <img src={ttLogo} alt="tt" height="400" width="400"/>
      </div>
     </div>
    </>
  )
}

export default App
