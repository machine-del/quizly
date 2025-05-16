document.addEventListener("DOMContentLoaded", function () {
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

  notification.style.display = "none";
  sectionFormanswer.style.display = "none";

  const questions = [
    {
      text: "Какое из этих зданий является символом Санкт-Петербурга?",
      options: ["Кремль", "Петропавловская крепость", "Красная площадь"],
      correct: 1,
    },
    {
      text: "В каком году был основан Санкт-Петербург?",
      options: ["1703", "1801", "1917"],
      correct: 0,
    },
    {
      text: "Какая река протекает через центр города?",
      options: ["Нева", "Волга", "Днепр"],
      correct: 0,
    },
    {
      text: "Какое из этих музеев находится в Санкт-Петербурге?",
      options: ["Эрмитаж", "Третьяковская галерея", "Русский музей"],
      correct: 0,
    },
    {
      text: "Как называется знаменитая улица, на которой расположены многие исторические здания?",
      options: ["Арбат", "Невский проспект", "Тверская"],
      correct: 1,
    },
    {
      text: "Кто был основателем Санкт-Петербурга?",
      options: ["Петр I", "Екатерина II", "Иван Грозный"],
      correct: 0,
    },
    {
      text: "Какое из этих событий связано с историей города?",
      options: [
        "Основание Петербурга в 1703 году",
        "Основание Москвы в 1147 году",
        "Строительство Бостонского университета",
      ],
      correct: 0,
    },
    {
      text: "Что из этого является популярным туристическим местом в Санкт-Петербурге?",
      options: ["Красная площадь", "Петергоф", "Красный квартал"],
      correct: 1,
    },
    {
      text: "Какая из этих достопримечательностей находится в Петергофе?",
      options: ["Зимний дворец", "Фонтаны и парки", "Московский Кремль"],
      correct: 1,
    },
    {
      text: "Какое море омывает Санкт-Петербург?",
      options: ["Балтийское море", "Черное море", "Северное море"],
      correct: 0,
    },
  ];

  const userAnswers = new Array(questions.length);
  let currentQuestion = 0;
  let navButtons = [];

  function showNotification(msg) {
    notification.textContent = msg;
    notification.style.display = "flex";
    setTimeout(() => (notification.style.display = "none"), 3000);
  }

  function createQuestionButtons() {
    questions.forEach((_, index) => {
      const btn = document.createElement("button");
      btn.className = "test-card__question-tag jost nav-disabled";
      btn.textContent = `№${index + 1}`;
      btn.disabled = true;
      questionsNav.appendChild(btn);
      navButtons.push(btn);
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
      if (userAnswers[index] === i) {
        label.classList.add("test-card__option_checked");
      }

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "question";
      input.value = i;
      input.checked = userAnswers[index] === i;

      input.addEventListener("change", () => {
        userAnswers[index] = i;
        optionsContainer
          .querySelectorAll("label")
          .forEach((l) => l.classList.remove("test-card__option_checked"));
        label.classList.add("test-card__option_checked");
        updateButtons();
        updateActiveButton();
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt));
      optionsContainer.appendChild(label);
    });

    buttonLeft.disabled = index === 0;
    updateButtons();
    updateQuestionNumber();
    updateActiveButton();
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
    sectionReview.style.display = "flex";
    reviewContainer.innerHTML = "";

    questions.forEach((q, qi) => {
      const cardContainer = document.createElement("div");
      cardContainer.className = "test-card__box";

      const tagsDiv = document.createElement("div");
      tagsDiv.className = "test-card__tags";

      const questionNumberDiv = document.createElement("div");
      questionNumberDiv.className = "test-card__question jost";
      questionNumberDiv.textContent = `Вопрос №${qi + 1}`;
      tagsDiv.appendChild(questionNumberDiv);

      const titleDiv = document.createElement("div");
      titleDiv.className = "test-card__title";
      titleDiv.innerHTML = `<h2 class="jost">Тест "Санкт-Петербург"</h2>`;
      tagsDiv.appendChild(titleDiv);

      cardContainer.appendChild(tagsDiv);

      const questionText = document.createElement("div");
      questionText.className = "test-card__description jost";
      questionText.textContent = q.text;
      cardContainer.appendChild(questionText);

      const optionsWrap = document.createElement("div");
      optionsWrap.className = "test-card__options";

      q.options.forEach((opt, oi) => {
        const label = document.createElement("label");
        label.className = "test-card__option jost";

        const input = document.createElement("input");
        input.type = "radio";
        input.disabled = true;
        if (userAnswers[qi] === oi) input.checked = true;

        if (oi === q.correct) {
          label.classList.add("test-card__option_correct");
        }

        if (userAnswers[qi] === oi && oi !== q.correct) {
          label.classList.add("test-card__option_wrong");
        }

        label.appendChild(input);
        label.appendChild(document.createTextNode(opt));
        optionsWrap.appendChild(label);
      });

      cardContainer.appendChild(optionsWrap);
      reviewContainer.appendChild(cardContainer);
    });
  }

  buttonRight.addEventListener("click", () => {
    if (userAnswers[currentQuestion] === undefined) {
      showNotification("Пожалуйста, выберите ответ!");
      return;
    }

    const isLast = currentQuestion === questions.length - 1;
    const allAnswered = userAnswers.every((a) => a !== undefined);

    if (isLast) {
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
    } else {
      showQuestion(currentQuestion + 1);
    }
  });

  buttonLeft.addEventListener("click", () => {
    if (currentQuestion > 0) {
      showQuestion(currentQuestion - 1);
    }
  });

  retryButton.addEventListener("click", () => {
    userAnswers.fill(undefined);
    showQuestion(0);
    sectionReview.style.display = "none";
    sectionFormanswer.style.display = "none";
    sectionTestcard.style.display = "flex";
  });

  stars.forEach((star, idx) => {
    star.addEventListener("click", () => {
      stars.forEach((s) => s.classList.remove("checked"));
      for (let i = 0; i <= idx; i++) stars[i].classList.add("checked");
    });
  });

  createQuestionButtons();
  showQuestion(0);
});
