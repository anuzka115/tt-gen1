import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { Link } from 'react-router-dom'
import logo from "./assets/IISERB_logo.png"
import ttLogo from "./assets/undraw_calendar_8r6s.svg"

function App() {
  return (
    <>
     <div className='navbar'>
      <div className='links'>
      <Link to="student">Student</Link>
        <Link to="faculty">Faculty</Link>
        <Link to="Admin">Admin</Link>
      </div>
        <div>
          <img src={logo} alt="logo" height="80" width="80"/>
        </div>
        <Link to="login/signup">Login/SignUp</Link>
     </div>
     <div className='main'>
      <div>
        <h1>ScheduleEase</h1>
        <h4>Make TT generation eaiser</h4>
        <ul>
          <li>
            gen conflict free tt
          </li>
          <li>
            get a copy of personalised tt
          </li>
          <li>
            export to pdf
          </li>
          <li>
            ease the process!!!
          </li>
        </ul>
        <button>Start</button>
      </div>
      <div>
        <img src={ttLogo} alt="tt" height="400" width="400"/>
      </div>
     </div>
    </>
  )
}

export default App
