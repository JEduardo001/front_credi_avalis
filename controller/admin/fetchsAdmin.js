import {getToken,getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {apiUrl} from "../../constants/api.js"
import {updateFrontNewStatusOfCreditsApplication,setMessageToFetchData} from "./admin.js"
import {insertErrorMessageInModal,insertSuccessMessageInModal} from "./messagesModal.js"


export async function getCreditsApplicationUser(idUser){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch(apiUrl +"auth/authData?idUser=" + idUser, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })

        if(!response.ok){
            throw new Error()
        }
        const result = await response.json()
        return result.data.listCreditsApplication
    }catch(error){
        console.error("Error obtaining credits from the user application. ", error)
    }
}

export async function getAllCreditsApplication(pageNumber){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch(apiUrl +"credit/getAllCreditsApplication?pageNumber=" + pageNumber, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token 
            }
        })
        if(!response.ok){
            throw new Error(response)
        }
        const result = await response.json()
        return result.data.content
    }catch(error){
        setMessageToFetchData("Ocurrió un error")
        console.error("Error. fetch all credits application", error)
    }
}

export async function approveApplicationCredit(idCreditApplication,actionType,idUser){
    try{
        const token = getToken()
        if(!token){
            return
        }
        console.log("id user : " + idUser)
        const response = await fetch(apiUrl + "admin/credits/approve?idCreditApplication=" + idCreditApplication + "&idUser=" + idUser, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token 
            }
        })
        if(!response.ok){
            throw new Error(response)
        }
        updateFrontNewStatusOfCreditsApplication(idCreditApplication,actionType)
        insertSuccessMessageInModal(actionType)
    }catch(error){
        console.error("Error. Approve credit application", error)
        insertErrorMessageInModal(actionType)
    }
}

export async function rejectApplicationCredit(idCreditApplication,actionType){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch(apiUrl + "admin/credits/reject?idCreditApplication=" + idCreditApplication, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token 
            }
        })
        if(!response.ok){
            throw new Error(response)
        }

        updateFrontNewStatusOfCreditsApplication(idCreditApplication,actionType)
        insertSuccessMessageInModal(actionType)

    }catch(error){
        insertErrorMessageInModal(actionType)
        console.error("Error. Approve credit application", error)
    }
}

export async function getDataUserFiltered(idUser,filter){
    try{
        const token = getToken()
        if(!token){
            return
        }

        const response = await fetch(apiUrl + "credit/getUserCreditsApplicationFiltered?idUser=" + idUser + "&filter=" + filter,{
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        if(!response.ok){
            throw new Error()
        }
        const result = await response.json()
        return result.data
    }catch(error){
        console.error("Error obtaining leaked data", error)
        setMessageToFetchData("Ocurrió un error")
    }
}

export async function getDataFiltered(typeFilter){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch(apiUrl + "admin/credits/filterCreditsApplication?typeFilter=" + typeFilter,{
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        if(!response.ok){
            throw new Error()
        }
        const result = await response.json()
        return result.data
    }catch(error){
        console.error("Error obtaining leaked data", error)
        setMessageToFetchData("Ocurrió un error")
    }
}

export async function getTotalCreditsApplication(){
    try{
        const token = getToken()
        if(!token){
            return
        }

        const response = await fetch(apiUrl + "credit/getTotalCreditsApplication",{
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        if(!response.ok){
            throw new Error()
        }
        const result = await response.json()
        return result.data
    }catch(error){
        console.error("Error obtaining total crredits application", error)
        setMessageToFetchData("Ocurrió un error")
    }
}