import { errorGeneral,errorBadCredentials,errorNotUserFound } from "../../constants/errorLogin/index.js"
const messageModal = document.getElementById("messageModal")

export function getTypeMessageError(message){
    switch(message){
        case "Error: The user with the granted credentials was not found":
            insertTypeMessageErrorModal(errorBadCredentials)
        break
        case "Error: The user with the username granted was not found":
            insertTypeMessageErrorModal(errorNotUserFound)
        break
        default:
            insertTypeMessageErrorModal(errorGeneral)
        break
    }
}

export function insertTypeMessageErrorModal(message){
    messageModal.textContent = message
}