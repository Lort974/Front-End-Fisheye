function displayModal() {
    const modal = document.getElementById("contact_modal");
    const modalBg = document.getElementById("modal-bg");
	modal.style.display = "block";
	modalBg.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    const modalBg = document.getElementById("modal-bg");
    modal.style.display = "none";
    modalBg.style.display = "none";
}
