import { useNavigate } from "react-router-dom";
import logo from "./assets/IISERB_logo.png"
import profs from "./assets/undraw_professor_d7zn.svg"

const Admin = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true"; 

  const handleEditClick = () => {
    if (isAdmin) {
      navigate("edit"); 
    } else {
      alert("Sorry, you don't have permission.");
    }
  };

  const handleViewClick = () => {
    navigate("view");
  };

  return (
    <div>
        <div className="navbar">
        <h1>Admin Dashboard</h1>
        <div>
                  <img src={logo} alt="logo" height="100" width="100" className='logoimg'/>
                </div>
        </div>    
        <div className="main">
        <div className="text">      
      <section>
        <h2>Manage Timetable</h2>
        <p>Use the following options to view or modify the timetable:</p>
        
            <button onClick={handleViewClick} className='login-btn'> View Timetable</button>
            <p>Check the latest generated timetable.</p>
          
            <button onClick={handleEditClick} className='login-btn'> Edit Timetable</button>
            <p>Add instructors and courses, then generate a new timetable.</p>
          
      </section>

      <section>
        <p>*Only authorized administrators can edit the timetable. If you do not have permission, you will receive an alert.</p>
      </section>
      </div>
      <div>
        <img src={profs} height="400" width="400"/>
      </div>
            </div>  
            </div>
  );
};

export default Admin;
