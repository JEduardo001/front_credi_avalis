import {getToken,getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {apiUrl} from "../../constants/api.js"

document.addEventListener("DOMContentLoaded", async () => {
   
    const idUser = getIdUser()
    if(!idUser){
        return
    }

    const user = await getDataUser(idUser)

    document.getElementById("username").textContent = user.username;
    document.getElementById("fullName").textContent = user.fullName;
    document.getElementById("email").textContent = user.email;
    document.getElementById("rfc").textContent = user.rfc;
    document.getElementById("registredDate").textContent = user.registredDate;
    document.getElementById("creditsApplication").textContent = user.creditsApplication;
    document.getElementById("creditApproved").textContent = user.creditApproved;
});

async function getDataUser(idUser){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch(apiUrl + "auth/getDataUserAllData?idUser=" + idUser, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        const result = await response.json()
        if(!response.ok){
            throw new Error(response)
        }
        return result.data
    }catch(error){
        console.error("Error obtaining user data", error)
    }
}
  