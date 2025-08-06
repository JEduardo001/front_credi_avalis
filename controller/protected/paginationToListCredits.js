import {getIdUser} from "../global/dataToFetch/dataToFetch.js"
import {fetchDataUser, fetchListCredits,setCredits} from "./listCredit.js"
export function setPages(actualPageSelected,totalCredits,idUser){
    const totalPages = Math.ceil(totalCredits / 3);
    const divPages = document.getElementById("divPages");

    if(totalPages>0){
        //set total pages
        for(var i=0;i<totalPages;i++){
            divPages.innerHTML += `<a id="page${i}" numberPage="${i}" class="class-number-page"> ${i + 1} </a> `
        }
        actualPageSelected = document.getElementById("page0")
        actualPageSelected.style.color = "blue"
    
        const divPagesBtns = document.getElementsByClassName("class-number-page");
        //set listeners to pages
        Array.from(divPagesBtns).forEach(btn => {
            btn.addEventListener("click", async e => {
                const idPage = e.target.id
                const page = e.target.getAttribute("numberPage");

                actualPageSelected.style.color = "white"
                actualPageSelected = document.getElementById(idPage)
                actualPageSelected.style.color = "blue"

                const listCredits = await fetchListCredits(page)
                const dataUser = await fetchDataUser(idUser)
                setCredits(listCredits,dataUser)
            });
        });
    }
}