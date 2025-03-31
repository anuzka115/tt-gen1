import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div>
      <h2>Admin Section</h2>
      <ul>
        <li>
          <Link to="view">View TT</Link>
        </li>
        <li>
          <button onClick={handleEditClick}>Edit TT</button>
        </li>
      </ul>
    </div>
  );
};

export default Admin;
