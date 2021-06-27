import { Link } from 'react-router-dom';

export default function Navbar(props){
    function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
    }

    return (
        
        <>
            <nav className="navbar bg-dark">
                <div className="container d-flex" style={{minWidth:"100%"}}>
                    <div className="nav-item d-flex">
                        <h2 style={{fontFamily:"Snell Roundhand, cursive",marginRight:"20px"}}><b style={{color:"#07f"}}>Dream</b><b style={{color:"white"}}>Job</b></h2>
                        <Link to="/home" className="nav-link text-white" aria-current="page" href="#"><b>Jobs</b></Link>
                        
                    </div>
                
                    <form className="d-flex">
                        <Link to="/login" ><button type="button" className="btn btn-outline-light px-4" onClick={logout} ><b>Logout</b></button></Link>
                    </form>
                
                </div>
            </nav>
        </>

    )
}