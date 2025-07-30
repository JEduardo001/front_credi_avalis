import {getToken,getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {showModal,hideModal} from "../global/modal.js"
import {errorMessageCreditApplicationCancel,
    errorTitleMessageCreditApplicationCancel,
    messageTitleSuccessCancelCreditoApplication,
    messageContentSuccessCancelCreditApplication
} from "../../constants/applicationCredit/index.js"

document.addEventListener("DOMContentLoaded",async function () {
    const idUser = getIdUser()
    if(!idUser){
        return
    }
    const contenedor = document.getElementById("listaSolicitudes");
    const divTxtCreditsApplicationEmpty = document.getElementById("divTxtEmptyCreditsApplication");
    const titleModal = document.getElementById("titleModal");
    const messageModal = document.getElementById("messageModal");
    const btnCloseModal = document.getElementById("btnCloseModal");

    const listCreditsApplication = await getCreditsApplication(idUser)
    if(listCreditsApplication.length == 0){
        divTxtCreditsApplicationEmpty.style.display = "flex"
        return
    }

    listCreditsApplication.forEach(creditApplication => {
        const div = document.createElement("div");
        div.className = "solicitud";

        let estadoClass = creditApplication.status.toLowerCase();

        div.innerHTML = `
            <h3>${creditApplication.name}</h3>
            <p><strong>Fecha:</strong> ${creditApplication.createdAt}</p>
            <p><strong>Monto solicitado:</strong> ${creditApplication.amountRequested}</p>
            <p><strong>Estado:</strong> <span class="estado ${estadoClass}">${creditApplication.status}</span></p>
        `;
        if(estadoClass == 'pending'){
            div.innerHTML += `<p id="${creditApplication.id}" class="btn-cancel-application" >Cancelar</p>`
        }

        contenedor.appendChild(div);
    })

    const btnsCancelApplication = document.getElementsByClassName("btn-cancel-application");

    Array.from(btnsCancelApplication).forEach(btn => {
        btn.addEventListener("click", e => {
            const idCreditApplication = e.target.id
            showModal()
            //cancelCreditApplication(idCreditApplication,titleModal,messageModal,btnCloseModal)
        });
    });
})


async function getCreditsApplication(idUser){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch("http://localhost:8080/auth/authData?idUser=" + idUser, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        const result = await response.json()
        if(!response.ok){
            console.error("Error. result: " + result.data + " response: " + response )
        }
        return result.data.listCreditsApplication
    }catch(error){
        console.error("Error fetch credits application. ", error)
    }
}

async function cancelCreditApplication(idCreditApplication,titleModal,messageModal){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch("http://localhost:8080/credit/cancelCreditApplication?idCreditApplication=" + idCreditApplication, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        const result = await response.json()
        if(!response.ok){
            console.error("Error. result: " + result.message + " response: " + response )
        }
        setSuccessMessageInModal(titleModal,messageModal,btnCloseModal)

        return result.message
    }catch(error){
        console.error("Error cancel credit application. ", error)
        setErrorMessageInModal(titleModal,messageModal,btnCloseModal)
    }
}

function setSuccessMessageInModal(titleModal,messageModal,btnCloseModal){
    titleModal.textContent = messageTitleSuccessCancelCreditoApplication
    messageModal.textContent = messageContentSuccessCancelCreditApplication
    btnCloseModal.style.display = "flex"
}

function setErrorMessageInModal(titleModal,messageModal,btnCloseModal){
    titleModal.textContent = errorTitleMessageCreditApplicationCancel
    messageModal.textContent = errorMessageCreditApplicationCancel
    btnCloseModal.style.display = "flex"
}