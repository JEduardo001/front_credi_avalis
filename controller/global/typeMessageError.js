import { errorGeneral,errorBadCredentials,errorNotUserFound,errorDataInIncorrectFormat,
    errorUsernameInUse,errorEmailInUse
 } from "../../constants/errorLogin/index.js"
const messageModal = document.getElementById("messageModal")

export function getTypeMessageError(message){
    switch(message){
        case "Error: The user with the granted credentials was not found":
            insertTypeMessageErrorModal(errorBadCredentials)
        break
        case "Error: The user with the username granted was not found":
            insertTypeMessageErrorModal(errorNotUserFound)
        break
        case "Error. Make sure you provide the required data in correct format and correct specifications":
         insertTypeMessageErrorModal(errorDataInIncorrectFormat)
        break
        case "Error. Username is now in use.":
         insertTypeMessageErrorModal(errorUsernameInUse)
        break
        case "Error. Email is now in use":
         insertTypeMessageErrorModal(errorEmailInUse)
        break
        default:
            insertTypeMessageErrorModal(errorGeneral)
        break
    }
}

export function insertTypeMessageErrorModal(message){
    messageModal.textContent = message
}