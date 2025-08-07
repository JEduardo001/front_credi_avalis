import {getToken,getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {showModal} from "../global/modal.js"
import {insertTypeMessageModal} from "../global/typeMessageError.js"
import {apiUrl} from "../../constants/api.js"
import {messageTitleSuccesCreditApplication,
    messageContentSuccesCreditApplication,
    messageErrorCeditApplication,
    messageContentErrorCeditApplication
} from "../../constants/applicationCredit/index.js"
import {setPages} from "./paginationToListCredits.js"

var actualPageSelected

document.addEventListener("DOMContentLoaded",async function () {
    const idUser = getIdUser()
    if(!idUser){
       return
    }
    const dataUser = await fetchDataUser(idUser)
    const totalCredits =  await fetchTotalCredits()
    setPages(0,totalCredits,idUser)
    const listCredits = await fetchListCredits(0)
    setCredits(listCredits,dataUser)

});

export function setCredits(listCredits,dataUser){
    const idUser = dataUser.id
    var labelCreditAppication
    var txtCreditSolicited
    const contenedor = document.getElementById("listaCreditos");
    contenedor.innerHTML = ""
    listCredits.forEach(credito => {
        const creditSolicited = creditAlreadySolicitedOrObtained(credito,dataUser.creditsObtained,dataUser.listCreditsApplication)
        if(creditSolicited){
            labelCreditAppication = `<a id="${credito.id}" style="display: none;" name="txtCreditSolicited${credito.id}" class="btn-solicitar">Solicitar</a>`
            txtCreditSolicited = `<p id="txtCreditSolicited${credito.id}" style="display: flex;  color: #4ef86a;">Crédito solicitado</p>`
        }else{
            labelCreditAppication = `<a id="${credito.id}" name="txtCreditSolicited${credito.id}" class="btn-solicitar">Solicitar</a>`
            txtCreditSolicited = `<p id="txtCreditSolicited${credito.id}" style="display: none;  color: #4ef86a;">Crédito solicitado</p>`
        }
        const div = document.createElement("div");
        div.className = "credito";
        div.innerHTML = `
        <h3>${credito.name}</h3>
        <p><strong>Monto máximo:</strong> ${credito.amountRequested}</p>
        <p><strong>Tasa de interés:</strong> ${credito.interestRate}</p>
        <p><strong>Plazo:</strong> ${credito.monthsToPay}</p>
        ${labelCreditAppication}
        ${txtCreditSolicited}

        `;
     
        contenedor.appendChild(div)
    });

    const btnsApplicationCredit = document.getElementsByClassName("btn-solicitar");
    Array.from(btnsApplicationCredit).forEach(btn => {
        btn.addEventListener("click", e => {
            const idCredit = e.target.id
            const valueIdLabelTxtCreditSolicited = e.target.name
            applicationCredit(idCredit,idUser,valueIdLabelTxtCreditSolicited)
        });
    });
}

function creditAlreadySolicitedOrObtained(credit,creditsObtained,listCreditsApplication){
    for(const creditObtained in creditsObtained){
        if(credit.id == creditsObtained[creditObtained].credit.id){
            return true
        }   
    }
    for(const creditApply in listCreditsApplication){
        if(credit.id == listCreditsApplication[creditApply].credit.id){
            return true
        }   
    }
    return false
}

async function applicationCredit(idCredit,idUser,valueIdLabelTxtCreditSolicited){
    showModal()
    const titleModal = document.getElementById("titleModal")
    const messageModal = document.getElementById("messageModal")
    const btnCloseModal = document.getElementById("btnCloseModal")

    try{
        const token = getToken()
        const idUserSave = getIdUser()
        if(!idUserSave || !token){
           return
        }
       
        const content = "?idCredit=" + idCredit + "&idUser=" + idUser 
        const response = await fetch(apiUrl + "credit" + content, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        const result = response.json()
        if(!response.ok){
            throw new Error("Error when trying to apply for credit. result", result.message ,+ " response: ", response)
        }

        //hide request button and show message
        document.getElementById(idCredit).style.display = "none"
        document.getElementById(valueIdLabelTxtCreditSolicited).style.display = "flex"
        btnCloseModal.style.display = "flex"
        titleModal.textContent = messageTitleSuccesCreditApplication
        insertTypeMessageModal(messageContentSuccesCreditApplication)
        

    }catch(error){
        console.error("Error. application credit",error)
        btnCloseModal.style.display = "flex"
        titleModal.textContent = messageErrorCeditApplication
        messageModal.textContent = messageContentErrorCeditApplication
        getTypeMessageError(errorGeneral)
    }

}

export async function fetchListCredits(page){
    try{
        const token = getToken()
        const idUser = getIdUser()
        if(!token || !idUser){
           return
        }

        const response = await fetch(apiUrl + "credit/getAllCredits?pageNumber=" + page, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
         }
        )
        const result = await response.json()
        if(!response.ok){
            throw new Error("Error: details: ", result.message, " result: ", response)
            
        }
        return result.data.content
    }catch(error){
        console.error("Error loading credits", error)
    }
}

export async function fetchDataUser(idUser){
    try{
        const token = getToken()
        if(!token){
           return
        }
        const response = await fetch(apiUrl + "auth/authData?idUser=" + idUser, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
         }
        )
        const result = await response.json()
        if(!response.ok){
            throw new Error("Error: details: ", result.message, " result: ", response)
        }
      
        return result.data
    }catch(error){
        console.error("Error loading credits", error)
    }
}

async function fetchTotalCredits(){
    try{
        const token = getToken()
        if(!token){
           return
        }
        const response = await fetch(apiUrl + "credit/totalCredits", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
         }
        )
        const result = await response.json()
        if(!response.ok){
            throw new Error("Error when obtaining all credits")
        }
        return result.data
    }catch(error){
        console.error("Error", error)
    }
}
