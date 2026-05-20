let timeInterval = undefined;
let difficulty = "medium";
let timeRemaining = 60;

function setup() {
  timeRemaining = 60;
  clearInterval(timeInterval);
  $("#start").show();
  $("#gameover").hide();
  $(".card").removeClass("flip matched");
  $("body").removeClass("game-over");

  // restart button
  $("#restart").off("click").on("click", setup);

  $("#easy")
    .off("click")
    .on("click", () => {
      difficulty = "easy";
      $("#easy").prop("disabled", true);
      $("#medium").prop("disabled", false);
      $("#hard").prop("disabled", false);
      $("#total").text("3");
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
      setup();
    });

  $("#hard")
    .off("click")
    .on("click", () => {
      difficulty = "hard";
      $("#easy").prop("disabled", false);
      $("#medium").prop("disabled", false);
      $("#hard").prop("disabled", true);
      $("#total").text("3");
      setup();
    });

  $("#timer").text(`${timeRemaining}`);

  $("#clicks").text(0);
  $("#matched").text(0);
  $("#pairs").text($(".card").length / 2);

  $("#start")
  .off("click")
  .on("click", () => {
    $("#start").hide();
    playGame();
  });
}

function playGame() {
  let firstCard = undefined;
  let secondCard = undefined;

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
}

$(document).ready(() => {
  setup();
});
