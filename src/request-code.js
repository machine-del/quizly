document.addEventListener("DOMContentLoaded", () => {
    const valueCode = document.getElementById("access-code");
    const btnLink = document.getElementById("btn-link");
    const message = document.getElementById("message");
    message.style.marginTop = "10px";
    message.style.display = "flex";

    btnLink.addEventListener("click", async () => {
        if (valueCode.value.trim() !== "") {
            try {
                const response = await fetch(`https://team-1.internship.api.visiflow-ai.ru/api/Quiz/${valueCode.value}`);
                if (!response.ok) throw new Error('Тест не найден');
                const testData = await response.json();
                localStorage.setItem('currentTest', JSON.stringify(testData));
                location.href = `testing.html?code=${valueCode.value}`;
            } catch (error) {
                message.textContent = error.message;
                setTimeout(() => message.textContent = "", 3000);
            }
        } else {
            message.textContent = "Введите access code теста!";
            setTimeout(() => message.textContent = "", 3000);
        }
    });
});