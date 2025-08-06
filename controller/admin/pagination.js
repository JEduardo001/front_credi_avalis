import {getAllCreditsApplication,getCreditsApplicationUser,
    getDataUserFiltered,getDataFiltered
} from "./fetchsAdmin.js"
import {setDataCreditsApplication} from "./admin.js"
import {getIdUser} from "../global/dataToFetch/dataToFetch.js"

export function setPages(actualPageSelected,totalCreditsApplication){
    const totalPages = Math.ceil(totalCreditsApplication / 3);
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
            btn.addEventListener("click", e => {
                const idPage = e.target.id
                const page = e.target.getAttribute("numberPage");

                actualPageSelected.style.color = "white"
                actualPageSelected = document.getElementById(idPage)
                actualPageSelected.style.color = "blue"

                validateToFetchCreditsApplicationByPagination(page)
            });
        });
    }
}

export async function validateToFetchCreditsApplicationByPagination(page){
    const idUser = getIdUser()
    if(!idUser){
        return
    }
    const selectFilter = document.getElementById("filterStatus");
    const isSearchByUser = document.getElementById("filterUser").value
    const selectedValueFilter = selectFilter.value;
    var data
    
   //Validation of the type of fetch that will be made to the backend
    if(isSearchByUser){
        if(selectedValueFilter != "NoFilter"){
            data = await getDataUserFiltered(idUser,selectedValueFilter)
        }else{
            data = await getCreditsApplicationUser(idUser)
        }
    }else{
        if(selectedValueFilter != "NoFilter"){
            data = await getDataFiltered(page,selectedValueFilter)
        }else{
            data = await getAllCreditsApplication(page)
        }
    }
    setDataCreditsApplication(data)
  
}

export function hiddenPagination(){
  const divPages = document.getElementById("divPages");
  divPages.style.display = "none"
}

export function showPagination(){
    const divPages = document.getElementById("divPages");
    divPages.style.display = "flex"
}