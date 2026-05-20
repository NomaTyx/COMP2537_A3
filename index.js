let timeInterval = undefined;
let difficulty = "medium";
let timeRemaining = 60;
let numPairs = 3; // default to medium
let powerUpUsed = false; // track if power-up has been used

let cardhtml = `<div class="card">
        <img id="img1" class="front_face" src="001.png" alt="" />
        <img class="back_face" src="back.webp" alt="" />
      </div>`;

async function setup() {
  powerUpUsed = false;
  timeRemaining = 60;
  $("#timer").text(`${timeRemaining}`);
  clearInterval(timeInterval);
  $("gameover").hide();
  $("#start").show();
  $("#game_grid").hide();
  $("#game_grid").empty();
  $("body").removeClass("game-over");
  $("#powerup").prop("disabled", true);

  // restart button
  $("#restart").off("click").on("click", setup);

  $("#easy")
    .off("click")
    .on("click", () => {
      difficulty = "easy";
      $("#easy").prop("disabled", true);
      $("#medium").prop("disabled", false);
      $("#hard").prop("disabled", false);
      $("#total").text("2");
      $("#pairs").text("2");
      numPairs = 2;
      timeRemaining = 70;
      $("#timer").text(`${timeRemaining}`);
      setup();
    });

  $("#medium")
    .off("click")
    .on("click", () => {
      difficulty = "medium";
      $("#easy").prop("disabled", false);
      $("#medium").prop("disabled", true);
      $("#hard").prop("disabled", false);
      $("#total").text("3");
      $("#pairs").text("3");
      numPairs = 3;
      timeRemaining = 60;
      $("#timer").text(`${timeRemaining}`);
      setup();
    });

  $("#hard")
    .off("click")
    .on("click", () => {
      difficulty = "hard";
      $("#easy").prop("disabled", false);
      $("#medium").prop("disabled", false);
      $("#hard").prop("disabled", true);
      $("#total").text("4");
      $("#pairs").text("4");
      numPairs = 4;
      timeRemaining = 50;
      $("#timer").text(`${timeRemaining}`);
      setup();
    });

  $("#clicks").text(0);
  $("#matched").text(0);
  $("#pairs").text(numPairs);

  $("#start")
    .off("click")
    .on("click", async () => {
      $("#start").hide();
      let chosenIds = [];
      let cards = [];
      for (let i = 0; i < numPairs; i++) {
        let pid;
        do {
          pid = Math.floor(Math.random() * 898) + 1;
        } while (chosenIds.includes(pid)); //very unlikely to repeat pokemon in the same thing but directions required it sooooo
        chosenIds.push(pid);

        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pid}&limit=1`);
        let jsonObj = await response.json();
        let pokemon = jsonObj.results[0];
        let imgResponse = await fetch(pokemon.url);
        let imgJsonObj = await imgResponse.json();
        let imgUrl = imgJsonObj.sprites.front_default;

        let card1 = $(cardhtml);
        card1.find(".front_face").attr("src", imgUrl).attr("id", `card${i}a`);
        let card2 = $(cardhtml);
        card2.find(".front_face").attr("src", imgUrl).attr("id", `card${i}b`);
        card1.addClass(`card${i}`);
        card2.addClass(`card${i}`);
        cards.push(card1);
        cards.push(card2);
      }
      cards.sort(function () {
        return 0.5 - Math.random();
      }); //sorts the array randomly
      cards.forEach((card) => $("#game_grid").append(card));

      playGame();
    });
}

function playGame() {
  $("#game_grid").show();
  let firstCard = undefined;
  let secondCard = undefined;
  $("#powerup").prop("disabled", false); // enable power-up button at the start of the game

  timeInterval = setInterval(() => {
    timeRemaining--;
    $("#timer").text(`${timeRemaining}`);
    if (timeRemaining <= 0) {
      clearInterval(timeInterval);
      $("#gameover").show();
      $("#gameover").text("you lose!");
      $("body").addClass("game-over");
    }
  }, 1000);

  $(".card")
    .off("click")
    .on("click", function () {
      if ($(this).hasClass("matched")) return; // ignore matched cards
      if ($(this).hasClass("flip")) return; // ignore already-flipped cards
      if (firstCard && secondCard) return; // ignore if two cards are already flipped
      if ($("body").hasClass("game-over")) return; // ignore clicks if game is over

      $(this).toggleClass("flip");
      $("#clicks").text(parseInt($("#clicks").text()) + 1);

      if (!firstCard) {
        firstCard = $(this).find(".front_face")[0];
      } else {
        secondCard = $(this).find(".front_face")[0];

        if (firstCard.src == secondCard.src) {
          $("#matched").text(parseInt($("#matched").text()) + 1);
          $("#pairs").text(parseInt($("#pairs").text()) - 1);
          $(`#${firstCard.id}`).parent().addClass("matched");
          $(`#${secondCard.id}`).parent().addClass("matched");

          if ($(".card").length == $(".matched").length) {
            $("#gameover").text("You win!!");
            clearInterval(timeInterval);
            $("#gameover").show();
            $("body").addClass("game-over");
            return;
          }

          firstCard = undefined; // reset
          secondCard = undefined; // reset
        } else {
          let f = firstCard;
          let s = secondCard;
          setTimeout(() => {
            $(`#${f.id}`).parent().toggleClass("flip");
            $(`#${s.id}`).parent().toggleClass("flip");
            setTimeout(() => {
              firstCard = undefined; //reset during timeout so that players
              secondCard = undefined; //can't click while the cards are flipping back
            }, 500); //delay after cards flip before they can click again
          }, 1000);
        }
      }
    });

  $("#powerup")
    .off("click")
    .on("click", function () {
      if(powerUpUsed) return; // only allow one use of the power-up
      console.log("power-up used");
      powerUpUsed = true;
      $(".card").each((index, element) => {
        $(element).toggleClass("flip");
        setTimeout(() => {
          $(element).toggleClass("flip");
        }, 500);
      });
    });
}

$(document).ready(() => {
  $("#theme-toggle").on("click", function () {
    if ($("body").hasClass("bg-dark")) {
      // switch to light
      $("body").removeClass("bg-dark text-light").addClass("bg-light text-dark");
      $(".bg-secondary").removeClass("bg-secondary").addClass("bg-white border");
      $(".text-light").removeClass("text-light").addClass("text-dark");
      $("#restart").removeClass("btn-outline-light").addClass("btn-outline-dark");
      $("#powerup").removeClass("btn-outline-light").addClass("btn-outline-dark");
      $(this).text("☀️ Light").removeClass("btn-outline-light").addClass("btn-outline-dark");
    } else {
      // switch to dark
      $("body").removeClass("bg-light text-dark").addClass("bg-dark text-light");
      $(".bg-white.border").removeClass("bg-white border").addClass("bg-secondary");
      $(".text-dark").removeClass("text-dark").addClass("text-light");
      $("#restart").removeClass("btn-outline-light").addClass("btn-outline-dark");
      $("#powerup").removeClass("btn-outline-light").addClass("btn-outline-dark");
      $(this).text("🌙 Dark").removeClass("btn-outline-dark").addClass("btn-outline-light");
    }
  });

  setup();
});
