import {errorNotSamePassword,errorGeneral,errorInputEmpty} from "../../constants/errorLogin/index.js"
import {insertTypeMessageErrorModal} from "../global/typeMessageError.js"
import {showModal} from "../global/modal.js"

const form = document.getElementById("form")

form.addEventListener("submit", async e => {
    e.preventDefault()  
    const username = document.getElementById("inputUsername").value
    const password = document.getElementById("inputPassword").value
    const passwordRepeat = document.getElementById("inputRepeatPassword").value

    if(validateInputs(username,password,passwordRepeat)){
        insertTypeMessageErrorModal(errorInputEmpty)
        showModal()
        return
    }
    if(!validatePasswords(password,passwordRepeat)){
        insertTypeMessageErrorModal(errorNotSamePassword)
        showModal()
        return
    }

    const data = {
        username: username,
        password: password,
        passwordRepeat: passwordRepeat
    }

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
        }
        window.location.href = "./login.html"
    }catch(error){
        console.error("Error in register", error)
        insertTypeMessageErrorModal(errorNotSamePassword)
        showModal(errorGeneral)
    }

})

function validatePasswords(password,repeatPassword){
    if(password === repeatPassword){
      return true
    }
    return false
}

function validateInputs(username,password,passwordRepeat){
    if(!username || username.trim() === '' ||
        !password || password.trim() === '' ||
        !passwordRepeat || passwordRepeat.trim() === ''){
            return true
    }
    return false
}