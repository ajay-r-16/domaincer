import '../styles/login-register.css'
import logo from '../assets/jobs_logo.png'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { axiosLogin,sendCode,verifyCode,updatePassword } from '../services/axiosServices'

export default function Login(props){

    if(localStorage.getItem("token")){
        props.history.push("/home");
    }
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [ resetpassword, setResetPassword] = useState("");
    const [ confirmpassword, setConfirmPassword] = useState("");
    const [ loaded,setLoaded ] = useState(true);
    const [ modalLoaded,setModalLoaded ] = useState(true);


    async function send(){
        if(username === ""){
            alert("Please provide Email / mobile No and try again");
            return;
        }
        setLoaded(false);
        let res = await sendCode(username,username,"forgotPassword");
        setLoaded(true);
        setUsername("");
        setPassword("");
        if(res.status === "pending" ){
            setPhone(res.phone);
            window.$("#staticBackdrop1").modal('show');
        }
        else{
            alert(res);
        }
    }

    async function login(){
        if(username === "" || password === ""){
            alert("Username and password required");
            return;
        }
        setLoaded(false);
        let res = await axiosLogin({ username:username,password:password });
        setLoaded(true);
        if(res.token){
            localStorage.setItem("token",res.token);
            localStorage.setItem("name",res.name);
            localStorage.setItem("role",res.role);
            props.history.push("/home");
        }
        else{
            alert(res.message);
        }
    }

    async function verify(){

        setModalLoaded(false);
        let res = await verifyCode({details:{ mobile: phone},code: code},"forgotPassword");
        setModalLoaded(true);
        if(res.status === "approved"){
            window.$("#staticBackdrop1").modal('hide');
            window.$("#staticBackdrop2").modal('show');
        }
        else{
            alert("Invalid code");
        }
    }

    async function update(){
        if(resetpassword !== confirmpassword){
            alert("Password do not match");
            return;
        }
        setModalLoaded(false);
        let res = await updatePassword({phone: phone, password: resetpassword});
        setModalLoaded(true);
        if(res === "password updated"){
            window.$("#staticBackdrop2").modal('hide');
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
                    <div className="top-right">
                        <span><b>New here ? </b>&nbsp;</span><Link className="link" to="/register"><span className="switch_a"><b> Register &rarr;</b></span></Link>
                    </div>
                    <h2 className="text-dark mb-3">LOGIN</h2>
                    <div className="card p-1 p-sm-3 p-lg-5">
                        <div className="card-body">
                            <form>
                                <input onChange={(event)=>{setUsername(event.target.value)}} value={username} className="form-control mb-3" type="text" placeholder="Email or Mobile No" />
                                <input onChange={(event)=>{setPassword(event.target.value)}} value={password} className="form-control mb-3" type="password" placeholder="Password" />
                                
                                <span><b>Forgot password ? </b>&nbsp;</span><span className="switch_a"><b onClick={send}> Click here &rarr;</b></span>
                                <div style={{textAlign:"right"}}>
                                    <button onClick={login} className="btn mt-4 px-3" type="button" disabled={loaded ? false:true}>
                                        <b>Login</b> 
                                    </button>
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

            <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Verification</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input onChange={(event)=>{setCode(event.target.value)}} className="form-control mb-3" type="text" placeholder="Enter Code" />
                        <p>Verify your mobile for resetting password</p>
                        
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

            <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Verification</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input onChange={(event)=>{setResetPassword(event.target.value)}} className="form-control mb-3" type="password" placeholder="Enter new password" />
                        <input onChange={(event)=>{setConfirmPassword(event.target.value)}} className="form-control mb-3" type="password" placeholder="confirm new password" />
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={update} type="button" className="btn btn-primary" disabled={modalLoaded ? false:true}>
                            { modalLoaded ? "Update" : <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...</> }
                        </button>
                    </div>
                    </div>
                </div>
            </div>

            
        </>
    )
}