import { errorGeneral,errorBadCredentials,errorNotUserFound,errorDataInIncorrectFormat,
    errorUsernameInUse,errorEmailInUse
 } from "../../constants/errorLogin/index.js"
const messageModal = document.getElementById("messageModal")
const titleModal = document.getElementById("titleModal")

export function getTypeMessageError(message){
    switch(message){
        case "Error: The user with the granted credentials was not found":
            insertTypeMessageModal(errorBadCredentials)
        break
        case "Error: The user with the username granted was not found":
            insertTypeMessageModal(errorNotUserFound)
        break
        case "Error. Make sure you provide the required data in correct format and correct specifications":
            insertTypeMessageModal(errorDataInIncorrectFormat)
        break
        case "Error. Username is now in use.":
            insertTypeMessageModal(errorUsernameInUse)
        break
        case "Error. Email is now in use":
            insertTypeMessageModal(errorEmailInUse)
        break
        default:
            insertTypeMessageModal(errorGeneral)
        break
    }
}

export function insertTitleModal(title){
    titleModal.textContent = title
}

export function insertTypeMessageModal(message){
    messageModal.textContent = message
}