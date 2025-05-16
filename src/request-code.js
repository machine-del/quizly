document.addEventListener("DOMContentLoaded", () => {
    let valueCode = document.getElementById("access-code");
    let btnLink = document.getElementById("btn-link");
    let message = document.getElementById("message");
    message.style.marginTop = "10px";

    btnLink.addEventListener("click", () => {
        if (valueCode.value.trim() !== "")
        {
            location.href = `testing.html?=${valueCode.value}`;
        } else {
            message.textContent = "Введите access code теста!";
            setTimeout(() => {
                message.textContent = "";
            }, 2000);
        }
    });
});