function setup() {
  let firstCard = undefined
  let secondCard = undefined

  $(".card").on("click", function () {
    if ($(this).hasClass("matched")) return  // ignore matched cards
    if ($(this).hasClass("flip")) return     // ignore already-flipped cards
    if(firstCard && secondCard) return        // ignore if two cards are already flipped

    $(this).toggleClass("flip");

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0]
    } else {
      secondCard = $(this).find(".front_face")[0]

      if (firstCard.src == secondCard.src) {
        console.log("match")
        $(`#${firstCard.id}`).parent().addClass("matched")
        $(`#${secondCard.id}`).parent().addClass("matched")
        firstCard = undefined   // reset
        secondCard = undefined  // reset
      } else {
        console.log("no match")
        let f = firstCard
        let s = secondCard
        firstCard = undefined   // reset immediately so player can't
        secondCard = undefined  // click a third card during timeout
        setTimeout(() => {
          $(`#${f.id}`).parent().toggleClass("flip")
          $(`#${s.id}`).parent().toggleClass("flip")
        }, 1000)
      }
    }
  });
}

$(document).ready(setup)