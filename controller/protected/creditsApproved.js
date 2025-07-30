import {getToken,getIdUser} from "../global/dataToFetch/dataToFetch.js"

document.addEventListener("DOMContentLoaded",async function () {
    const idUser = getIdUser()
    if(!idUser){
        return
    }
    const creditsApproved = await getCreditsApproved(idUser)
    const contenedor = document.getElementById("listaCreditos");
    const divTxtCreditsApprovedEmpty = document.getElementById("divTxtEmptyCreditsApproved");

    if(creditsApproved.length == 0){
        divTxtCreditsApprovedEmpty.style.display = "flex"
        return
    }
    creditsApproved.forEach(c => {
      const div = document.createElement("div");
      div.className = "credito";
      div.innerHTML = `
        <h3>${c.name}</h3>
        <p><strong>Monto aprobado:</strong> ${c.amountPaid}</p>
        <p><strong>Fecha de aprobación:</strong> ${c.aprovedDate}</p>
      `;
      div.onclick = () => {
        window.location.href = `detalle-credito.html?id=${c.id}`;
      };
      contenedor.appendChild(div);
    });
})


async function getCreditsApproved(idUser){
    try{
        const token = getToken()
        if(!token){
            return
        }
        const response = await fetch("http://localhost:8080/auth/authData?idUser=" + idUser, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        const result = await response.json()
        if(!response.ok){
            console.error("Error. result: " + result.data + " response: " + response )
        }
        return result.data.creditsObtained
    }catch(error){
        console.error("Error fetch credits creditsObtained. ", error)
    }
}