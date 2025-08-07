import {loadingPaymentTittle,loadingPaymentMessage,
    paymentSuccesTitle,paymentSuccesMessage,
    errorPaymenTitle,errorPaymentMessage } 
from "../../constants/payCredit/index.js"

import {getToken,getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {showModal} from "../global/modal.js"
import {insertTypeMessageModal,insertTitleModal} from "../global/typeMessageError.js"
import { apiUrl } from "../../constants/api.js";

const urlParams = new URLSearchParams(window.location.search);
const idCreditObtained = urlParams.get('idCreditObtained');
const btnPage = document.getElementById("btnPage")
const divTxtCreditPaidFull = document.getElementById("divTxtCreditPaidFull")
const txtNoPayments = document.getElementById("txtNoPayments")
const divBtnPage = document.getElementById("divBtnPage")

const btnCloseModal = document.getElementById("btnCloseModal")
const historialDiv = document.getElementById("historialPagos");

btnPage.addEventListener("click", async e => {
    e.preventDefault()
   const dataNewPay = await payCredit()
   setPayElement(dataNewPay)
   hiddenTxtNoPayments()
   if(dataNewPay.creditFinishedPaying){
       hidePayButton()
   }
})

document.addEventListener("DOMContentLoaded",async function () {
    const detailCredit = await getDataCreditApproved(idCreditObtained)
    if(detailCredit.creditFinishedPaying){
        hidePayButton()
    }else{
        showPayButton()
    }
    setDetailsCreditObtained(detailCredit.credit)
    setPaymentHistory(detailCredit.payments)
})

function hidePayButton(){
    divTxtCreditPaidFull.style.display = "flex"
    divBtnPage.style.display = "none"
}

function showPayButton(){
    divTxtCreditPaidFull.style.display = "none"
    divBtnPage.style.display = "flex"
}

function hiddenTxtNoPayments(){
    txtNoPayments.style.display = "none"
}

function showTxtNoPayments(){
    txtNoPayments.style.display = "flex"
}

async function setPaymentHistory(paymnets){
    if(paymnets.length > 0){
        paymnets.forEach(payment => {
            setPayElement(payment)
        });
    }else{
        showTxtNoPayments()
    }
}

async function setDetailsCreditObtained(detailCredit){
    const detalleDiv = document.getElementById("detalleCredito");
    detalleDiv.innerHTML = `
        <h2>${detailCredit.name}</h2>
        <p><strong>Monto:</strong> ${detailCredit.amountRequested}</p>
        <p><strong>Tasa de interés:</strong> ${detailCredit.interestRate} %</p>
        <p><strong>Plazo:</strong> ${detailCredit.monthsToPay} Meses</p>
    `;

}

function setPayElement(payment){

    const pagoDiv = document.createElement("div");
    pagoDiv.className = `pago ${payment.status.toLowerCase()}`;
    pagoDiv.innerHTML = `
      <p><strong>Fecha:</strong> ${payment.paymentDate}</p>
      <p><strong>Cantidad de pago:</strong> ${payment.amountPaid}</p>
      <p><strong>Estado:</strong> ${payment.status}</p>
    `;
    historialDiv.appendChild(pagoDiv);
}

function setMessagesModal(messageModal,titleModal){
    insertTitleModal(titleModal)
    insertTypeMessageModal(messageModal)
    showModal()
}

async function getDataCreditApproved(idCreditObtained) {
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch(apiUrl + "credit/getDataCreditObtained?idCreditObtained=" + idCreditObtained, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        const result = await response.json()
        if(!response.ok){
            throw new Error("Error. result: " + result.data + " response: " + response )
        }
        return result.data
    }catch(error){
        console.error("Error fetch data credit obtained. ", error)
    }
}

async function payCredit() {
    try{
        const token = getToken()
        const idUser = getIdUser()
        if(!token || !idUser){
            return
        }
        setMessagesModal(loadingPaymentMessage,loadingPaymentTittle)
        showModal()

        const response = await fetch(apiUrl + "payment/pay?idCreditObtained=" + idCreditObtained, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        const result = await response.json()
        if(!response.ok){
            throw new Error()
        }
        btnCloseModal.style.display = "flex"
        setMessagesModal(paymentSuccesMessage,paymentSuccesTitle)
        return result.data
    }catch(error){
        console.error("Error when paying the credit obtained. ", error)
        btnCloseModal.style.display = "flex"
        setMessagesModal(errorPaymentMessage,errorPaymenTitle)
        showModal()
    }
}