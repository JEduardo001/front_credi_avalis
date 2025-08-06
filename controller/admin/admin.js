import {getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {showModal} from "../global/modal.js"
import {getAllCreditsApplication,getCreditsApplicationUser,approveApplicationCredit,
    rejectApplicationCredit,
    getTotalCreditsApplication
} from "./fetchsAdmin.js"
import {insertLoadingMessageModal} from "./messagesModal.js"
import {setPages,hiddenPagination,showPagination} from "./pagination.js"

//Data user
const textIdUser = document.getElementById("idUser");
const textNameUser = document.getElementById("NameUser");
const textUsernameUser = document.getElementById("UsernameUser");
const textAmountCreditsApplication = document.getElementById("amountCreditsApplication");
const textAmountCreditsApproved = document.getElementById("amountCreditsApproved");
const textRegistredDate = document.getElementById("registredDate");

//buttons search by user
const btnSearchByUser = document.getElementById("btnSearchByUser");
const btnCancelSearchByUser = document.getElementById("btnCancelSearchByUser");
//div container credits application
const divCreditList = document.getElementById("creditList")
//variables for pagination
var pageNumber = 0
var actualPageSelected

//modal to show data user
const modalDataUser = document.getElementById("modalDataUser");
const btnCloseModalDataUser = document.getElementById("btnCloseModalDataUser");

document.addEventListener("DOMContentLoaded",async function () {
    const idUser = getIdUser()
    if(!idUser){
        return
    }
    const totalCreditsApplication = await getTotalCreditsApplication()
    setPages(actualPageSelected,totalCreditsApplication)
    const creditsApplication = await getAllCreditsApplication(pageNumber)
    setDataCreditsApplication(creditsApplication)
})

//listeners
btnSearchByUser.addEventListener("click", async e => {
    const idUser = document.getElementById("filterUser").value
    hiddenPagination()
    if(idUser){
        const creditsApplicationUser = await getCreditsApplicationUser(idUser)
        setDataCreditsApplication(creditsApplicationUser)
    }
})

btnCancelSearchByUser.addEventListener("click", async e => {
    document.getElementById("filterUser").value = ""    
    document.getElementById("filterStatus").value = "NoFilter"
    showPagination()
    const creditsApplication = await getAllCreditsApplication(0)
    setDataCreditsApplication(creditsApplication)

})

btnCloseModalDataUser.addEventListener("click", e => {
    modalDataUser.style.display = "none"
    modalDataUser.classList.remove("show");
})

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

function setButtons(status,idCreditApplication,idUser){
    if(status == "PENDING"){
        return `
            <a id="${idCreditApplication}" idUser="${idUser}"  class="btn-approved">Aprovar</a>
            <a id="${idCreditApplication}" idUser="${idUser}" class="btn-reject">Rechazar</a>
        `
    }
    return ""   
}
export function updateFrontNewStatusOfCreditsApplication(idCreditApplication,actionType){
    //hide btns and update status credit application
    document.getElementById("divBtns"+idCreditApplication).style.display = "none"
    document.getElementById("status"+idCreditApplication).className = actionType
    document.getElementById("status"+idCreditApplication).textContent = actionType
}

export function setDataCreditsApplication(dataCreditsApplication){
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
                    ${setButtons(creditApplication.status,creditApplication.id,creditApplication.user.id)}
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
            const idCreditApplication = e.target.id
            const idUser = e.target.getAttribute("idUser")

            const actionType = "APPROVED"
            insertLoadingMessageModal(actionType)
            showModal()
           
            approveApplicationCredit(idCreditApplication,actionType,idUser)
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