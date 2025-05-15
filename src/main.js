document.addEventListener("DOMContentLoaded", async function () {
  const buttonLeft = document.querySelector(".test-card .buttons__left");
  const buttonRight = document.querySelector(".test-card .buttons__right");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const notification = document.getElementById("notification");
  const questionsNav = document.getElementById("questions-nav");
  const currentQuestionEl = document.getElementById("current-question-number");
  const formResult = document.querySelector(".form-answer__result");
  const sectionTestcard = document.querySelector(".test-card");
  const sectionFormanswer = document.querySelector(".form-answer");
  const retryButton = document.querySelector(".form-answer .buttons__left");
  const sectionReview = document.querySelector(".review");
  const stars = document.querySelectorAll(".form-answer__feedback .fa-star");
  const reviewContainer = document.getElementById("review-container");
  const titleCardTest = document.getElementById("test-card__title");

  notification.style.display = "none";
  sectionFormanswer.style.display = "none";
  sectionReview.style.display = "none";

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const accessCode = urlParams.get("code");

    let testData = await loadTestData(accessCode);
    setupTest(testData);
  } catch (error) {
    handleLoadingError(error);
  }

  async function loadTestData(accessCode) {
    const savedTest = localStorage.getItem("currentTest");
    if (savedTest) return JSON.parse(savedTest);

    const response = await fetch(
      `https://team-1.internship.api.visiflow-ai.ru/api/Quiz/${accessCode}`
    );
    if (!response.ok) throw new Error("Не удалось загрузить тест");
    return await response.json();
  }

  function handleLoadingError(error) {
    console.error("Ошибка загрузки теста:", error);
    notification.textContent = error.message;
    notification.style.display = "flex";
    sectionTestcard.style.display = "none";
  }

  function setupTest(testData) {
    const testTitle = testData.title;
    titleCardTest.querySelector("h2").textContent = testTitle;
    document
      .querySelectorAll(".test-card__title h2, .form-answer__title h2")
      .forEach((el) => {
        el.textContent = testTitle;
      });

    const questions = testData.questions.map((q) => ({
      text: q.text,
      options: q.answers.map((a) => a.text),
      correct: q.answers.findIndex((a) => a.isCorrect),
    }));

    initTest(questions, testTitle);
  }

  function initTest(questions, testTitle) {
    let currentQuestion = 0;
    const userAnswers = new Array(questions.length).fill(undefined);
    let navButtons = [];

    function showNotification(msg) {
      notification.textContent = msg;
      notification.style.display = "flex";
      setTimeout(() => (notification.style.display = "none"), 3000);
    }

    function createQuestionButtons() {
      questionsNav.innerHTML = "";
      navButtons = questions.map((_, index) => {
        const btn = document.createElement("button");
        btn.className = "test-card__question-tag jost nav-disabled";
        btn.textContent = `№${index + 1}`;
        btn.disabled = true;
        questionsNav.appendChild(btn);
        return btn;
      });
    }

    function updateActiveButton() {
      navButtons.forEach((btn, index) => {
        btn.classList.toggle("active", index === currentQuestion);
        btn.classList.toggle("answered", userAnswers[index] !== undefined);
      });
    }

    function updateQuestionNumber() {
      currentQuestionEl.textContent = `Вопрос №${currentQuestion + 1}`;
    }

    function showQuestion(index) {
      currentQuestion = index;
      const q = questions[index];
      questionText.textContent = q.text;
      optionsContainer.innerHTML = "";

      q.options.forEach((opt, i) => {
        const label = document.createElement("label");
        label.className = "test-card__option jost";
        if (userAnswers[index] === i)
          label.classList.add("test-card__option_checked");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "question";
        input.value = i;
        input.checked = userAnswers[index] === i;

        input.addEventListener("change", () => {
          userAnswers[index] = i;
          updateSelections();
          updateButtons();
          updateActiveButton();
        });

        label.append(input, opt);
        optionsContainer.appendChild(label);
      });

      buttonLeft.disabled = index === 0;
      updateButtons();
      updateQuestionNumber();
      updateActiveButton();
    }

    function updateSelections() {
      optionsContainer
        .querySelectorAll("label")
        .forEach((l) => l.classList.remove("test-card__option_checked"));
      if (userAnswers[currentQuestion] !== undefined) {
        optionsContainer.children[userAnswers[currentQuestion]].classList.add(
          "test-card__option_checked"
        );
      }
    }

    function updateButtons() {
      const isLast = currentQuestion === questions.length - 1;
      const allAnswered = userAnswers.every((a) => a !== undefined);

      buttonRight.textContent = isLast ? "Завершить" : "Далее";
      buttonRight.disabled = isLast
        ? !allAnswered
        : userAnswers[currentQuestion] === undefined;
    }

    function renderReview() {
      reviewContainer.innerHTML = "";
      questions.forEach((q, qi) => {
        const card = document.createElement("div");
        card.className = "test-card__box";

        card.innerHTML = `
                <div class="test-card__tags">
                    <div class="test-card__question jost">Вопрос №${
                      qi + 1
                    }</div>
                    <div class="test-card__title"><h2 class="jost">${testTitle}</h2></div>
                </div>
                <div class="test-card__description jost">${q.text}</div>
                <div class="test-card__options"></div>
            `;

        q.options.forEach((opt, oi) => {
          const label = document.createElement("label");
          label.className = "test-card__option jost";
          if (oi === q.correct)
            label.classList.add("test-card__option_correct");
          if (userAnswers[qi] === oi && oi !== q.correct)
            label.classList.add("test-card__option_wrong");

          const input = document.createElement("input");
          input.type = "radio";
          input.disabled = true;
          input.checked = userAnswers[qi] === oi;

          label.append(input, opt);
          card.querySelector(".test-card__options").appendChild(label);
        });

        reviewContainer.appendChild(card);
      });
      sectionReview.style.display = "flex";
    }

    const handleNextQuestion = () => {
      if (userAnswers[currentQuestion] === undefined) {
        showNotification("Пожалуйста, выберите ответ!");
        return;
      }

      const isLast = currentQuestion === questions.length - 1;
      if (isLast) finishTest();
      else showQuestion(currentQuestion + 1);
    };

    const finishTest = () => {
      const allAnswered = userAnswers.every((a) => a !== undefined);
      if (!allAnswered) {
        showNotification("Пожалуйста, ответьте на все вопросы!");
        return;
      }

      const correctCount = userAnswers.reduce(
        (sum, ans, idx) => sum + (ans === questions[idx].correct ? 1 : 0),
        0
      );

      formResult.textContent = `${correctCount}/${questions.length}`;
      sectionTestcard.style.display = "none";
      sectionFormanswer.style.display = "flex";
      renderReview();
    };

    const handlePrevQuestion = () => {
      if (currentQuestion > 0) showQuestion(currentQuestion - 1);
    };

    const restartTest = () => {
      userAnswers.fill(undefined);
      currentQuestion = 0;
      showQuestion(0);
      sectionReview.style.display = "none";
      sectionFormanswer.style.display = "none";
      sectionTestcard.style.display = "flex";
    };

    const handleStarRating = (selectedIndex) => {
      stars.forEach((star, idx) =>
        star.classList.toggle("checked", idx <= selectedIndex)
      );
    };

    buttonRight.addEventListener("click", handleNextQuestion);
    buttonLeft.addEventListener("click", handlePrevQuestion);
    retryButton.addEventListener("click", restartTest);
    stars.forEach((star, idx) =>
      star.addEventListener("click", () => handleStarRating(idx))
    );

    createQuestionButtons();
    showQuestion(0);
  }
});
