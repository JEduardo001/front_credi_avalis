import * as CreditTexts from "../../constants/adminOperationToCreditApplication/index.js";
import {getToken,getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {showModal} from "../global/modal.js"

document.addEventListener("DOMContentLoaded",async function () {
    
    const idUser = getIdUser()
    if(!idUser){
        return
    }

    const creditsApplication = await getAllCreditsApplication()
    const divCreditList = document.getElementById("creditList")
    
    creditsApplication.forEach(creditApplication => {
        const divTarjetCreditApplication = document.createElement("div")
        divTarjetCreditApplication.innerHTML = `
         <div class="credit-card">
            <h3>Crédito: ${creditApplication.name}</h3>
            <div class="credit-info">
                <div><strong>ID Crédito:</strong>${creditApplication.credit.id}</div>
                <div><strong>ID Solicitud:</strong> ${creditApplication.id}</div>
                <div><strong>Monto:</strong> $${creditApplication.amountRequested}</div>
                <div><strong>Meses a pagar:</strong> ${creditApplication.monthsToPay}</div>
                <div><strong>Interés:</strong> ${creditApplication.interestRate}%</div>
                <div><strong>Estado:</strong> <span id="status${creditApplication.id}" class="${creditApplication.status}">${creditApplication.status}</span></div>
                <div><strong>ID Usuario:</strong> ${creditApplication.user.id}</div>
                <div id="divBtns${creditApplication.id}">
                    ${setButtons(creditApplication.status,creditApplication.id)}
                </div>
            </div>
        </div>
        `

        divCreditList.appendChild(divTarjetCreditApplication)
    })

    const btnsApprovedApplicationCredit = document.getElementsByClassName("btn-approved");

    Array.from(btnsApprovedApplicationCredit).forEach(btn => {
        btn.addEventListener("click", e => {
            const idCreditApplication = e.target.id
            const actionType = "APPROVED"
            insertLoadingMessageModal(actionType)
            showModal()
           
            approveApplicationCredit(idCreditApplication,idUser,actionType)
        });
    });

    const btnsRejectApplicationCredit = document.getElementsByClassName("btn-reject");

    Array.from(btnsRejectApplicationCredit).forEach(btn => {
        btn.addEventListener("click", e => {
            const idCreditApplication = e.target.id
            const actionType = "REJECTED"

            insertLoadingMessageModal(actionType)
            showModal()
           
            rejectApplicationCredit(idCreditApplication,actionType)
        });
    });
    
})

function setButtons(status,idCreditApplication){
    if(status == "PENDING"){
        return `
            <a id="${idCreditApplication}"  class="btn-approved">Aprovar</a>
            <a id="${idCreditApplication}"  class="btn-reject">Rechazar</a>
        `
    }
    return ""
    
}

async function getAllCreditsApplication(){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch("http://localhost:8080/credit/getAllCreditsApplication", {
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
        console.error("Error. fetch all credits application", error)
    }
}

async function approveApplicationCredit(idCreditApplication,idUser,actionType){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch("http://localhost:8080/admin/credits/approve?idCreditApplication=" + idCreditApplication + "&idUser=" + idUser, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token 
            }
        })
        if(!response.ok){
            throw new Error(response)
        }
        updateFrontNewStatus(actionType)
        insertSuccessMessageInModal(actionType)

    }catch(error){
        console.error("Error. Approve credit application", error)
        insertErrorMessageInModal(actionType)
    }
}

async function rejectApplicationCredit(idCreditApplication,actionType){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch("http://localhost:8080/admin/credits/reject?idCreditApplication=" + idCreditApplication, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token 
            }
        })
        if(!response.ok){
            throw new Error(response)
        }

        updateFrontNewStatus()
        insertSuccessMessageInModal(actionType)

    }catch(error){
        console.error("Error. Approve credit application", error)
        insertErrorMessageInModal(actionType)
    }
}

function updateFrontNewStatus(){
    //hide btns and update status credit application
    document.getElementById("divBtns"+idCreditApplication).style.display = "none"
    document.getElementById("status"+idCreditApplication).className = actionType
    document.getElementById("status"+idCreditApplication).textContent = actionType

}

function insertErrorMessageInModal(typeStatus){
    document.getElementById("btnCloseModal").style.display = "flex"

    switch(typeStatus){
        case "REJECTED":
            document.getElementById("titleModal").textContent = CreditTexts.titleErrorRejectingCreditApplication
            document.getElementById("messageModal").textContent = CreditTexts.messageErrorRejectingCreditApplication
        break
        case "APPROVED":
            document.getElementById("titleModal").textContent = CreditTexts.titleErrorApprovingCreditApplication
            document.getElementById("messageModal").textContent = CreditTexts.messageErrorApprovingCreditApplication
        break
        default: 
            document.getElementById("titleModal").textContent = CreditTexts.notDefinedMessage
            document.getElementById("messageModal").textContent = CreditTexts.notDefinedMessage
        
        break
    }

}
function insertSuccessMessageInModal(typeStatus){
    document.getElementById("btnCloseModal").style.display = "flex"

    switch(typeStatus){
        case "REJECTED":
            document.getElementById("titleModal").textContent = CreditTexts.titleSuccessRejectingCreditApplication
            document.getElementById("messageModal").textContent = CreditTexts.messageSuccessRejectingCreditApplication
        break
        case "APPROVED":
            document.getElementById("titleModal").textContent = CreditTexts.titleSuccessApprovingCreditApplication
            document.getElementById("messageModal").textContent = CreditTexts.messageSuccessApprovingCreditApplication
        break
        default: 
            document.getElementById("titleModal").textContent = CreditTexts.notDefinedMessage
            document.getElementById("messageModal").textContent = CreditTexts.notDefinedMessage
        break
    }
}

function insertLoadingMessageModal(typeStatus){
    document.getElementById("messageModal").textContent = CreditTexts.messageLoading

    switch(typeStatus){
        case "REJECTED":
            document.getElementById("titleModal").textContent = CreditTexts.titleRejectingCreditApplication
        break
        case "APPROVED":
            document.getElementById("titleModal").textContent = CreditTexts.titleApprovingCreditApplication
        break
        default: 
            document.getElementById("titleModal").textContent = CreditTexts.notDefinedMessage    
            document.getElementById("messageModal").textContent = CreditTexts.notDefinedMessage    
        break
    }
}