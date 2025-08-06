import {hiddenPagination} from "./pagination.js"
import {showPagination} from "./pagination.js"
import {setDataCreditsApplication} from "./admin.js"
import {getAllCreditsApplication,getCreditsApplicationUser,
    getDataUserFiltered,getDataFiltered,
} from "./fetchsAdmin.js"
//filter
const selectFilter = document.getElementById("filterStatus");

selectFilter.addEventListener("change", async function () {
  const selectedValue = selectFilter.value;
  const idUser = document.getElementById("filterUser").value

  if(selectedValue == "NoFilter"){
    //pagination visible
    showPagination()
    var creditsApplication
    if(idUser){
        creditsApplication = await getCreditsApplicationUser(idUser)
    }else{
        creditsApplication = await getAllCreditsApplication(0)
    }
    setDataCreditsApplication(creditsApplication)
    return
  }
  hiddenPagination()
  var dataFiltered;
  if(idUser){
    dataFiltered = await getDataUserFiltered(idUser,selectedValue)  
  }else{
    dataFiltered = await getDataFiltered(selectedValue)  
  }
  setDataCreditsApplication(dataFiltered)

})