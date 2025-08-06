import * as CreditTexts from "../../constants/adminOperationToCreditApplication/index.js"
export function insertErrorMessageInModal(typeStatus){
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

export function insertLoadingMessageModal(typeStatus){
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