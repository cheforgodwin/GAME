
    const board = document.getElementById("gameBoard");
    const timerDisplay = document.getElementById("timer");
    const levelInfo = document.getElementById("level-info");
    const message = document.getElementById("message");
    const nextBtn = document.getElementById("nextBtn");

    const baseSymbols = ["hashiatu", "david", "flynn", "kebu", "daniel", "shanelle", "zenith", "prince"];
    let level = 1;
    let timeLeft = 60;
    let timer;
    let matchedCount = 0;
    let firstCard = null;
    let secondCard = null;
    let cards = [];
    let gameOver = false;

    function startLevel() {
      board.innerHTML = "";
      message.textContent = "";
      nextBtn.style.display = "none";
      levelInfo.textContent = `Level: ${level}`;
      timeLeft = 60 - (level - 1) * 4;
      if (timeLeft <= 5) timeLeft = 4;

      const symbols = baseSymbols.slice(0, Math.min(baseSymbols.length, 4 + level));
      cards = [...symbols, ...symbols].sort(() => 0.5 - Math.random());

      matchedCount = 0;
      firstCard = null;
      secondCard = null;
      gameOver = false;

      cards.forEach((symbol, index) => {
        const card = document.createElement("div");
        card.classList.add("card", "hidden");
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.textContent = symbol;

        card.addEventListener("click", () => {
          if (gameOver || card.classList.contains("matched") || card === firstCard) return;

          card.classList.remove("hidden");

          if (!firstCard) {
            firstCard = card;
          } else {
            secondCard = card;
            setTimeout(() => {
              if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
                firstCard.classList.add("matched");
                secondCard.classList.add("matched");
                matchedCount += 2;

                if (matchedCount === cards.length) {
                  clearInterval(timer);
                  message.textContent = " Success! Next Level";
                  message.className = "message win";
                  nextBtn.style.display = "inline-block";
                  gameOver = true;
                }
              } else {
                firstCard.classList.add("hidden");
                secondCard.classList.add("hidden");
              }

              firstCard = null;
              secondCard = null;
            }, 700);
          }
        });

        board.appendChild(card);
      });

      startTimer();
    }

    function startTimer() {
      timerDisplay.textContent = `Time Left: ${timeLeft}s`;
      timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          endGame(false);
        }
      }, 1000);
    }

    function endGame(success) {
      gameOver = true;
      document.querySelectorAll(".card").forEach(card => {
        card.style.pointerEvents = "none";
      });
      if (!success) {
        message.textContent = " You Failed! Try Again.";
        message.className = "message fail";
        nextBtn.textContent = "Retry Level";
        nextBtn.style.display = "inline-block";
      }
    }

    nextBtn.addEventListener("click", () => {
      if (message.classList.contains("win")) {
        level++;
        nextBtn.textContent = "Next Level";
      }
      startLevel();
    });

    // Start first level
    startLevel();
  