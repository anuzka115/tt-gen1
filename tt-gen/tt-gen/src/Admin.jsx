import { Link } from "react-router-dom";
const Admin=()=>{
    return(
        <div>
            <h1>
                <Link to="view">View TT </Link>
            </h1>
            <h1> 
            <Link to="edit">Edit TT </Link>
            </h1>
        </div>
    );
};

export default Admin;