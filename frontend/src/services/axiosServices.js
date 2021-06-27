
import axios from 'axios'

let base_url = "http://localhost:5000";

async function sendCode(number,email,flag){
    let res = await axios.post(base_url+"/sendCode/"+flag, {phone: number,email: email});
    return res.data;
}

async function verifyCode(data,flag){
    console.log(data);
    let res = await axios.post(base_url+"/verifyCode/"+flag, data);
    return res.data;
}

async function axiosLogin(data){
    let res = await axios.post(base_url+"/login",data);
    return res.data
}

async function updatePassword(data){
    let res = await axios.post(base_url+"/updatePassword",data);
    return res.data;
}

async function getJobs(){
    let res = await axios.get(base_url+"/user/getAllJobs",{headers:{ authorization: "Bearer "+localStorage.getItem('token')}});
    return res.data;
}

async function postJob(data){
    
    let res = await axios.post(base_url+"/user/postJob", data,{headers:{ authorization: "Bearer "+localStorage.getItem('token')}});
    return res.data
}

async function viewJob(job_id){
    let res = await axios.get(base_url+"/user/viewJob/"+job_id,{headers:{ authorization: "Bearer "+localStorage.getItem('token')}});
    return res.data
}

async function applyJob(message,job_id){
    let res = await axios.put(base_url+"/user/applyJob/"+job_id,{message:message},{headers:{ authorization: "Bearer "+localStorage.getItem('token')}});
    return res.data
}

async function updateJobStatus(status,id,job_id){
    let res = await axios.put(base_url+"/user/updateStatus",{status: status, id: id, job_id:job_id},{headers:{ authorization: "Bearer "+localStorage.getItem('token')}});
    return res.data
}

async function deleteJob(job_id){
    let res = await axios.delete(base_url+"/user/deleteJob/"+job_id,{headers:{ authorization: "Bearer "+localStorage.getItem('token')}});
    return res.data
}

export {sendCode, verifyCode, axiosLogin, updatePassword,postJob, getJobs, viewJob, applyJob, updateJobStatus, deleteJob}





