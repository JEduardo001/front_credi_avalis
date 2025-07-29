import {errorGeneral} from "../../constants/errorLogin/index.js"
import { getTypeMessageError} from "../global/typeMessageError.js"
import {showModal} from "../global/modal.js"

const form = document.getElementById("form")

form.addEventListener("submit", async e => {
    e.preventDefault()
    const username = document.getElementById("inputUsername").value
    const password = document.getElementById("inputPassword").value
    const content = "?username=" + username + "&password=" + password 
    try{
        
        const response = await fetch("http://localhost:8080/auth/login" + content ,{
            method: "POST",
            }
        )
        const data = await response.json()

        if(!response.ok){
            getTypeMessageError(data.message)
            showModal()
            return
        }
        if(!data.token){
            console.error("No token")
            getTypeMessageError(errorGeneral)
            showModal()
            return
        }
        localStorage.setItem("token", data.token);
        console.log("todo bien")
    }catch(error){
        console.log("Error login: ", error)
        getTypeMessageError(errorGeneral)
        showModal()
    }
})