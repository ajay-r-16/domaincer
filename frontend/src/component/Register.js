import '../styles/login-register.css'
import logo from '../assets/jobs_logo.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { sendCode,verifyCode } from '../services/axiosServices'



export default function Register(props){

    if(localStorage.getItem("token")){
        props.history.push("/home");
    }
    
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [role, setRole]= useState("candidate");
    const [password, setPassword] = useState("");
    const [ loaded,setLoaded ] = useState(true);
    const [code, setCode] = useState("");
    const [ modalLoaded,setModalLoaded ] = useState(true);
    
    async function send(){
        if(name==="" || email === "" || phone ==="" || password===""){
            alert("Fill all fields");
            return;
        }
        setLoaded(false);
        let res = await sendCode(phone,email,"register");
        setLoaded(true);
        setName("");
        setEmail("");
        setPhone("");
        setRole("candidate");
        setPassword("");
        if(res.status === "pending" ){
            window.$("#staticBackdrop").modal('show');
        }
        alert(res);
    }

    async function verify(){
        if(code===""){
            alert("Enter code");
            return;
        }
        setModalLoaded(false);
        let res = await verifyCode({details:{fullname: name, email: email, mobile: phone, password: password, role: role}, code: code},"register");
        setModalLoaded(true);
        setCode("");
        if(res.status === "approved"){
            localStorage.setItem("token",res.token);
            localStorage.setItem("name",res.name);
            localStorage.setItem("role",res.role);
            window.$("#staticBackdrop").modal('hide');
            props.history.push("/home");
        }
        else{
            alert("Invalid code")
        }
    }

    return(
        <>
            <div className="container-fluid p-0">
                <div className="left half">
                    <img className="logo" src={logo} alt="logo" />
                    <h3 className="text-white mt-5">Land on your dream job</h3>
                </div>
                <div className="right half">
                    <h2 className="text-dark mb-3">REGISTER</h2>
                    <div className="card p-1 p-sm-3 p-lg-5">
                        <div className="card-body">
                            <form>
                                <input onChange={(event)=>{setName(event.target.value)}} value={name} className="form-control mb-3" type="text" placeholder="Fullname" />
                                <input onChange={(event)=>{setEmail(event.target.value)}} value={email} className="form-control mb-3" type="text" placeholder="Email" />
                                <input onChange={(event)=>{setPhone(event.target.value)}} value={phone} className="form-control mb-3" type="text" placeholder="Mobile number" />
                                <div>
                                    <label htmlFor="role" className="form-label"><b>Role :</b></label>
                                    <select name="role" onChange={(event)=>{setRole(event.target.value)}} value={role} className="form-select mb-3">
                                        <option value="candidate">Candidate</option>
                                        <option value="recruiter">Recruiter</option>
                                    </select>
                                </div>
                                <input onChange={(event)=>{setPassword(event.target.value)}} value={password} className="form-control mb-3" type="password" placeholder="Password" />
                                
                                <span><b>Already have an account ? </b>&nbsp;</span><Link className="link" to="/login"><span className="switch_a"><b> Login &rarr;</b></span></Link>
                                <div style={{textAlign:"right"}}>
                                    <button className="btn mt-4 px-3" onClick={send} type="button" disabled={loaded ? false:true}> <b>Register</b> </button>
                                </div>

                            </form>
                            {!loaded && <div>
                                <div className="spinner-grow text-primary" role="status" >
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div className="spinner-grow text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div className="spinner-grow text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Phone verification</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input onChange={(event)=>{setCode(event.target.value)}} value={code} className="form-control mb-3" type="text" placeholder="Enter Code" />
                        
                        <p>* Note: Account will be created only when the mobile number is verified</p>
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={verify} type="button" className="btn btn-primary" disabled={modalLoaded ? false:true}>
                            { modalLoaded ? "Verify Code" : <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...</> }
                        </button>
                    </div>
                    </div>
                </div>
            </div>

            
        </>
    )
}