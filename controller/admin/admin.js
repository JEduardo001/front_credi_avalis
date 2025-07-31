import {getToken,getIdUser} from "../global/dataToFetch/dataToFetch.js"


document.addEventListener("DOMContentLoaded",async function () {
    
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
                <div><strong>Estado:</strong> <span class="status approved">${creditApplication.status}</span></div>
                <div><strong>ID Usuario:</strong> ${creditApplication.user.id}</div>
            </div>
        </div>
        `
        divCreditList.appendChild(divTarjetCreditApplication)
    })
    
})

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
        console.log("Data :", result.data.content)
        return result.data.content
    }catch(error){
        console.error("Error. fetch all credits application", error)
    }
}