import * as CreditTexts from "../../constants/adminOperationToCreditApplication/index.js";
import {getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {showModal} from "../global/modal.js"
import {getAllCreditsApplication,getCreditsApplicationUser,approveApplicationCredit,
    rejectApplicationCredit,getDataUserFiltered,getDataFiltered
} from "./fetchsAdmin.js"

//Data user
const textIdUser = document.getElementById("idUser");
const textNameUser = document.getElementById("NameUser");
const textUsernameUser = document.getElementById("UsernameUser");
const textAmountCreditsApplication = document.getElementById("amountCreditsApplication");
const textAmountCreditsApproved = document.getElementById("amountCreditsApproved");
const textRegistredDate = document.getElementById("registredDate");
//filter
const selectFilter = document.getElementById("filterStatus");
//buttons search by user
const btnSearchByUser = document.getElementById("btnSearchByUser");
const btnCancelSearchByUser = document.getElementById("btnCancelSearchByUser");
//div container credits application
const divCreditList = document.getElementById("creditList")


//modal to show data user
const modalDataUser = document.getElementById("modalDataUser");
const btnCloseModalDataUser = document.getElementById("btnCloseModalDataUser");

//listeners
btnSearchByUser.addEventListener("click", async e => {
    const idUser = document.getElementById("filterUser").value
    if(idUser){
        const creditsApplicationUser = await getCreditsApplicationUser(idUser)
        setDataCreditsApplication(creditsApplicationUser)
    }
   
})

btnCancelSearchByUser.addEventListener("click", async e => {
    document.getElementById("filterUser").value = ""
    document.getElementById("filterStatus").value = "NoFilter"
    const creditsApplication = await getAllCreditsApplication()
    setDataCreditsApplication(creditsApplication)

})

btnCloseModalDataUser.addEventListener("click", e => {
    modalDataUser.style.display = "none"
    modalDataUser.classList.remove("show");
})

selectFilter.addEventListener("change", async function () {
  const selectedValue = selectFilter.value;
  const idUser = document.getElementById("filterUser").value

  if(selectedValue == "NoFilter"){
    var creditsApplication
    if(idUser){
        creditsApplication = await getCreditsApplicationUser(idUser)
    }else{
        creditsApplication = await getAllCreditsApplication()
    }
    setDataCreditsApplication(creditsApplication)
    return
  }
  var dataFiltered;
  if(idUser){
    dataFiltered = await getDataUserFiltered(idUser,selectedValue)  
  }else{
    dataFiltered = await getDataFiltered(selectedValue)  
  }
  setDataCreditsApplication(dataFiltered)

})

document.addEventListener("DOMContentLoaded",async function () {
    const idUser = getIdUser()
    if(!idUser){
        return
    }
  
    const creditsApplication = await getAllCreditsApplication()
    setDataCreditsApplication(creditsApplication)
})

function setDataCreditsApplication(dataCreditsApplication){
    divCreditList.innerHTML = ""

    if(dataCreditsApplication.length == 0){
        setMessageToFetchData("Sin datos")
    }
    dataCreditsApplication.forEach(creditApplication => {
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
                <div id="divBtnShowDataUser">
                    <strong>ID Usuario:</strong> ${creditApplication.user.id}
                    <button  data-user='{
                            "creditApproved": "${creditApplication.user.creditApproved}",
                            "creditsApplication": "${creditApplication.user.creditsApplication}",
                            "email":  "${creditApplication.user.email}",
                            "fullName": "${creditApplication.user.fullName}",
                            "id": "${creditApplication.user.id}",
                            "registredDate": "${creditApplication.user.registredDate}",
                            "rfc": "${creditApplication.user.rfc}",
                            "username": "${creditApplication.user.username}"
                        }'
                    class="btn-show-data-user"> Ver Usuario </button>
                </div>
                <div id="divBtns${creditApplication.id}">
                    ${setButtons(creditApplication.status,creditApplication.id)}
                </div>
            </div>
        </div>
        `

        divCreditList.appendChild(divTarjetCreditApplication)
    })
    
    const btnsShowDataUser = document.getElementsByClassName("btn-show-data-user");

    Array.from(btnsShowDataUser).forEach(btn => {
        btn.addEventListener("click", e => {
            var dataUser = e.target.getAttribute("data-user")
            dataUser = JSON.parse(dataUser)
            showModalDataUser(dataUser)
        })
    })

    const btnsApprovedApplicationCredit = document.getElementsByClassName("btn-approved");

    Array.from(btnsApprovedApplicationCredit).forEach(btn => {
        btn.addEventListener("click", e => {
            const idCreditApplication = e.target.dataUser
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
}

export function setMessageToFetchData(message){
    divCreditList.innerHTML =  `<p id="txtNoData"> ${message} </p> `

}

function showModalDataUser(dataUser) {
    textIdUser.textContent = "USUARIO ID: " + dataUser.id;
    textNameUser.textContent = "NOMBRE COMPLETO: " + dataUser.fullName;
    textUsernameUser.textContent = "NOMBRE DE USUARIO: " + dataUser.username;
    textAmountCreditsApplication.textContent = "TOTAL SOLICITUDES DE CRÉDITO: " + dataUser.creditsApplication;
    textAmountCreditsApproved.textContent = "TOTAL CRÉDITOS APROVADOS: " + dataUser.creditApproved;
    textRegistredDate.textContent = "FECHA DE REGISTRO: "  + dataUser.registredDate;
    modalDataUser.style.display = "flex"
    modalDataUser.classList.add("show");
}


function setButtons(status,idCreditApplication){
    if(status == "PENDING"){
        return `
            <a id="${idCreditApplication}"  class="btn-approved">Aprovar</a>
            <a id="${idCreditApplication}"  class="btn-reject">Rechazar</a>
        `
    }
    return ""
    
}


export function updateFrontNewStatus(){
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
export function insertSuccessMessageInModal(typeStatus){
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