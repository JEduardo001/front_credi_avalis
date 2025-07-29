import {errorNotSamePassword,errorGeneral,errorInputEmpty,errorLengthPassword} from "../../constants/errorLogin/index.js"
import {getTypeMessageError,insertTypeMessageErrorModal} from "../global/typeMessageError.js"
import {showModal} from "../global/modal.js"

const form = document.getElementById("form")

form.addEventListener("submit", async e => {
    e.preventDefault()  
    const fullName = document.getElementById("inputFullName").value;
    const username = document.getElementById("inputUsername").value;
    const email = document.getElementById("inputEmail").value;
    const birthDate = document.getElementById("fechaNacimiento").value;
    const rfc = document.getElementById("inputRfc").value;
    const password = document.getElementById("inputPassword").value;
    const passwordRepeat = document.getElementById("inputRepeatPassword").value;
    
    if (validateInputs(fullName, username, email, birthDate, rfc, password, passwordRepeat)) {
        insertTypeMessageErrorModal(errorInputEmpty)
        showModal()     
        return;
    }
    
    if(password != passwordRepeat){
        insertTypeMessageErrorModal(errorNotSamePassword)
        showModal()
        return
    }

    if(password.length < 8){
        insertTypeMessageErrorModal(errorLengthPassword)
        showModal()
        return
    }

    const data = {
        fullName: fullName,
        username: username,
        email: email,
        birthDate: birthDate,
        rfc: rfc,
        password: password,
        passwordRepeat: passwordRepeat
    };

    try{
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const dataResult = await response.json()

        if(!response.ok){
            console.log("Error problem occurred in register ", dataResult.message)
            getTypeMessageError(dataResult.message)
            showModal()
            return
        }
        window.location.href = "./login.html"
    }catch(error){
        console.error("Error in register", error)
        getTypeMessageError(errorGeneral)
        showModal()
    }

})


function validateInputs(...fields) {
    return fields.some(field => !field || field.trim() === '');
}