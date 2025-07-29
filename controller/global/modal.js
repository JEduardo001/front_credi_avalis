const modal = document.getElementById("modal")
const btnCloseModal = document.getElementById("btnCloseModal")

btnCloseModal.addEventListener("click", e => {
    hideModal()
})

export function showModal() {
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

export function hideModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}


