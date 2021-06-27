import { viewJob,updateJobStatus } from '../services/axiosServices'
import { useEffect,useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

export default function Recruit(props){
    if(!localStorage.getItem("token")){
        props.history.push("/login")
    }
    
    const [job,setJob] = useState({});
    const [loaded,setLoaded] = useState(false);

    useEffect(()=>{
        get();
        
    },[])

    
    async function get(){
        setLoaded(false)
        let res = await viewJob(props.match.params["job_id"]);
        setLoaded(true);
        setJob(res);
    }

    async function setStatus(status,id){
        let res = await updateJobStatus(status,id,props.match.params["job_id"]);
        get();
    }

    return(
        <>
        <Navbar/>
        { !loaded && <div className="container d-flex justify-content-center align-items-center" style={{minHeight:"91vh"}}>
                <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
        {loaded && Object.keys(job).length !== 0 && <div className="container view_container my-5" >
            <Link style={{textDecoration:"none"}} to="/home" className="text-dark"><h1>&larr; </h1></Link>
            <div className="row p-3">
                <h5 className="col-12 mb-4"><b>Company : </b>{job["company"]}</h5>
                <h5 className="col-6"><b>Role : </b>{job["position"]}</h5>
                <h5 className="col-6"><b>CTC : </b>{job["CTC"]}</h5>
                <h5 className="mt-4"><b>Job description :</b></h5>
                <p>{job["Job description"]}</p>
                <h5><b>Qualification :</b></h5>                                                                                                                                                                                        
                <p>{job["Qualification"]}</p>
            </div>
        
        <hr/>
        <div>
            <h5>Applicants :</h5>
            <ul className="list-group list-group-flush " >
                { job["applied_by"].map((candidate,index)=>{
                    return (
                        <div key={index}>
                            <li className="list-group-item"  style={{backgroundColor: "lightgray",borderRadius:"20px",marginBottom:"20px"}} >
                            <div className="row" style={{display: "flex", flexDirection: "row", width: "100%"}}>
                                <div className="col-12 col-md-6" style={{display: "flex",flexDirection: "column",padding: "20px"}}>
                                    <div>                
                                        <b>{candidate["id"]["fullname"]} ( {candidate["id"]["email"]} )</b>
                                    </div>
                                    <div>
                                        <span>{candidate["id"]["mobile"]}</span>
                                    </div>
                                    <div className="my-3">
                                        <textarea className="form-control" id="msg" value={candidate["message"]} readOnly/>
                                    </div>
                                    { candidate["status"] === "Not reviewed" && <div>
                                        <span><b>Status : </b>{candidate["status"]}</span>
                                    </div>}
                                </div>
                                <div className="col-0 col-md-3"></div>
                                <div className="col-12 col-md-3" style={{marginTop:"20px"}}>
                                    { candidate["status"] === "Not reviewed" && 
                                    <>
                                        <button onClick={()=>{setStatus("Accepted",candidate["id"]["_id"])}}  type="button" className="btn btn-outline-success mb-2" style={{marginRight:"10px"}}>
                                            Accept
                                        </button>
                                        <button onClick={()=>{setStatus("Declined",candidate["id"]["_id"])}} type="button" className="btn btn-outline-success mb-2">
                                            Decline
                                        </button> 
                                    </>
                                    }
                                    { candidate["status"] !== "Not reviewed" &&
                                        <button type="button" className={candidate["status"] !=="Accepted" ? "btn status_green" : "btn status_red"} disabled>
                                            <b>{candidate["status"]}</b>
                                        </button>
                                    }
                                </div>                                
                            </div>
                            </li>
                        </div>
                    )
                })   
                }      
            </ul>

        </div>
        </div>}
        </>
    )

}