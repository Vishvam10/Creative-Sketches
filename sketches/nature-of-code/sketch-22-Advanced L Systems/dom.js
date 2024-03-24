var modal = document.getElementById("rules_modal");

document.getElementById("rules").addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
});
document.getElementById("closeModal").addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "none";
});

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};