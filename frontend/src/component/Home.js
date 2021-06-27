import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { postJob, getJobs,applyJob,deleteJob } from '../services/axiosServices'

export default function Home(props){
    if(!localStorage.getItem("token")){
        props.history.push("/login")
    }
    let role = localStorage.getItem("role");
    const [jobs,setJobs] = useState([]);
    const [company,setCompany] = useState("");
    const [position,setPosition] = useState("");
    const [ctc,setCtc] = useState("");
    const [jd,setJd] = useState("");
    const [qualification,setQualification] = useState("");
    const [selectedJob, setSelectedJob] = useState({});
    const [message, setMessage] = useState("");
    const [applied, setApplied] = useState([]);
    const [loaded,setLoaded] = useState(false);
    const [ modalLoaded,setModalLoaded ] = useState(true);

    useEffect(()=>{
        get();
    }, [])

    async function get(){
        setLoaded(false);
        let res = await getJobs();
        if(role==="candidate"){
            setApplied(res.applied[0]["applied_jobs"]);
            setJobs(res.jobs)
        }
        else{
            setJobs(res);
        }
        
        setLoaded(true);
    
    }

    async function post(){
        setModalLoaded(false);
        let res = await postJob({ company: company, position: position, CTC : ctc, "Job description": jd, Qualification: qualification });
        setModalLoaded(true);
        window.$("#staticBackdrop").modal('hide');
        clear();
        get();
    }

    function clear(){
        setCtc("");
        setCompany("");
        setPosition("");
        setJd("");
        setQualification("");
        setMessage("");
    }

    async function view(job){
        props.history.push("/view/"+job["_id"]);
    }

    async function apply(){
        setLoaded(false);
        let res = await applyJob(message,selectedJob["_id"]);
        clear();
        alert(res);
        get();
    }

    async function remove(job){
        setLoaded(false);
        let res = await deleteJob(job["_id"]);
        alert(res);
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
            {loaded && <div className="home_container">
                <div className="container-sm m-0 m-sm-5 mt-5 mt-sm-5 jobs_container">
                    <ul className="list-group list-group-flush " >
                        { jobs.map((job,index)=>{
                            return (
                                <div key={index}>
                                    <li className="list-group-item"  style={{backgroundColor: "lightgray",borderRadius:"20px",marginBottom:"20px"}} >
                                    <div style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center"}}>
                                        <div style={{display: "flex",flexDirection: "column",padding: "20px"}}>
                                            <div>                
                                                <b>{job["company"]}</b>
                                            </div>
                                            <div>
                                                <span>{job["position"]} ( {job["CTC"]} )</span>
                                            </div>
                                        </div>
                                        
                                        {role ==="candidate" && <div style={{marginLeft: "auto"}}>
                                            <button onClick={()=>{setSelectedJob(job)}} type="button" data-bs-toggle= "offcanvas" data-bs-target="#offcanvasRight" 
                                                aria-controls="offcanvasRight" className="btn btn-outline-success" disabled = {applied.includes(job["_id"]) ? true : false}>
                                                {applied.includes(job["_id"]) ? "Applied" : "Apply"}
                                            </button>
                                        </div>
                                        }
                                        {role ==="recruiter" && <div style={{marginLeft: "auto"}}>
                                            <button onClick={()=>{view(job)}} type="button" className="btn btn-outline-success mb-2" style={{marginRight:"10px"}}>
                                                View
                                            </button>
                                            <button onClick={()=>{remove(job)}} type="button" className="btn btn-outline-success mb-2">
                                                Delete
                                            </button>
                                        </div>
                                        }

                                    </div>
                                    
                                    </li>
                                </div>
                            )
                        })
                            
                        }      
                    </ul>
                </div>
                {role === "recruiter" && <div>
                    <button className="btn btn-dark m-5 job_btn px-4" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Post a job</button>
                </div>
                }

            </div>}

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header">
                <h5 id="offcanvasRightLabel">Apply for job</h5>
                <button type="button" onClick={clear} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                { Object.keys(selectedJob).length!==0 &&
                    <>
                        <h6><b>Company :</b></h6>
                        <p>{selectedJob["company"]}</p>
                        <h6><b>Role :</b></h6>
                        <p>{selectedJob["position"]}</p>
                        <h6><b>CTC :</b></h6>
                        <p>{selectedJob["CTC"]}</p>
                        <h6><b>Job description :</b></h6>
                        <p>{selectedJob["Job description"]}</p>
                        <h6><b>Qualification :</b></h6>
                        <p>{selectedJob["Qualification"]}</p>
                        <div className="mb-4">
                            <label htmlFor="msg" className="form-label"><b>Message for {selectedJob["company"]} :</b></label>
                            <textarea onChange={(event)=>{setMessage(event.target.value)}} name="msg" className="form-control" id="msg" rows="3"></textarea>
                        </div>
                        <div className="row justify-content-around">
                            <button onClick={clear} className="col-md-4 btn-secondary canvas_btn mb-3" data-bs-dismiss="offcanvas" aria-label="Close">
                                <b>Cancel</b>
                            </button>
                            <button onClick={apply} className="col-md-4 btn-primary canvas_btn mb-3" data-bs-dismiss="offcanvas" aria-label="Close">
                                <b>Apply</b>
                            </button>
                        </div>
                    </>
                }
            </div>
            </div>


            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Post Job</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <input onChange={(event)=>{setCompany(event.target.value)}} value={company} className="form-control mb-3" type="text" placeholder="Company name" />
                        <input onChange={(event)=>{setPosition(event.target.value)}} value={position} className="form-control mb-3" type="text" placeholder="Role" />
                        <input onChange={(event)=>{setCtc(event.target.value)}} value={ctc} className="form-control mb-3" type="text" placeholder="CTC" />
                        <div className="mb-3">
                            <label htmlFor="jd" className="form-label">Job description</label>
                            <textarea onChange={(event)=>{setJd(event.target.value)}} value={jd} name="jd" className="form-control" id="jd" rows="3"></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="qualification" className="form-label">Qualification</label>
                            <textarea onChange={(event)=>{setQualification(event.target.value)}} value={qualification} name="qualification" className="form-control" id="qualification" rows="3"></textarea>
                        </div>
                        
                    </div>
                    <div className="modal-footer">
                        <button onClick={clear} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={post} type="button" className="btn btn-primary" disabled={modalLoaded ? false:true}>
                            { modalLoaded ? "Post" : <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...</> }
                        </button>
                    </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}