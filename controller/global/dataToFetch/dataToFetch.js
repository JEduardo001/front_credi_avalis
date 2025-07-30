
export function getToken(){
    const token = localStorage.getItem("token")
    if(!token){
        console.error("Empty token")
        alert("Ocurrió un problema, porfavor vuelve a iniciar sesión")
        window.location.href = "../public/auth/login.html";
        return false
    }
    return token
}

export function getIdUser(){
    const id = localStorage.getItem("idUser")
    if(!id){
        console.error("Empty id user")
        alert("Ocurrió un problema, porfavor vuelve a iniciar sesión")
        window.location.href = "../public/auth/login.html";
        return false
    }
    return id
}