const overlay = document.getElementById('overlay');
const popup = document.getElementById("popup")
const FakePopup = document.getElementById("Fakepopup")
const statsButton = document.getElementById("Stats")
const closePopupButton = document.getElementById('closePopup');

const wordsPageButton = document.getElementById("WordsPageButton")

const mainpage = document.getElementById("statsMain")
const wordspage = document.getElementById("statsWords")

const wordsBack = document.getElementById("wordsBack")

const StatsGuessesList = document.getElementById("StatsGuesses")


const StatsGuessed = document.getElementById("StatsGuessed")
const StatsGivenUp = document.getElementById("StatsGivenUp")
const StatsAvgGuesses = document.getElementById("StatsAvgGuesses")
const StatsGivenUpPerc = document.getElementById("StatsGivenUpPerc")

function getScores() {
    return JSON.parse(sessionStorage.getItem('scores')) || {};
}

var TotalGivenUp = 0
var TotalCorrect = 0
var Total  = 0

var GuessesAmtList = []

const ScoresArray = Object.values(getScores())

function average(array) {
    if (array.length === 0) {
      return 0;
    }
  
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    let avg = sum / array.length;
    
    return Math.round(avg * 100) / 100;
}


//<div class="StatsWordDiv"><span class="LetterSpan CorrectBackground">?</span><span class="LetterSpan CorrectBackground">?</span><span class="LetterSpan CorrectBackground">?</span><span class="LetterSpan CorrectBackground">?</span><span class="LetterSpan CorrectBackground">?</span><span style="min-width: fit-content;" class="LetterSpan">12</span></div>
function DisplayWord(Word, Guesses, GaveUp, Color) {
    if (!Color) {Color = {1: "CorrectBackground", 2: "CorrectBackground", 3: "CorrectBackground", 4: "CorrectBackground", 5: "CorrectBackground"}}
    const div = document.createElement('div')
    div.style.marginBottom = "0.5svh"
    div.style.justifyContent = "center"
    div.style.display = "flex"
    for (let i = 1; i < Word.length + 1; i++) {
        const span = document.createElement("span")
        span.innerHTML = Word[i - 1]
        span.style.fontSize = "2.8em"
        span.classList.add("LetterSpan")
        span.classList.add(Color[i])
        div.appendChild(span)
    }
    const GuessesLabel = document.createElement("Span")
    GuessesLabel.style.color = "#fff"
    GuessesLabel.innerHTML = Guesses
    GuessesLabel.classList.add("LetterSpan")
    GuessesLabel.style.minWidth = "fit-content"
    GuessesLabel.style.fontSize = "2.8em"
    div.appendChild(GuessesLabel)
    StatsGuessesList.appendChild(div)
    //<span style="min-width: fit-content;" class="LetterSpan">12</span></div>
}

for (i = 0; i < ScoresArray.length; i++) {
    let obj = ScoresArray[i]
    if (obj.Colors === "Correct") {
        DisplayWord(obj.Word, obj.GuessesAmt, obj.GaveUp)
    }
    else {
        DisplayWord(obj.Word, obj.GuessesAmt, obj.GaveUp, obj.Colors)
    }
    if (obj.GaveUp === false) {TotalCorrect++; GuessesAmtList.push(obj.GuessesAmt)} else {TotalGivenUp++}
}

Total = TotalCorrect + TotalGivenUp

var AverageGuesses = average(GuessesAmtList)
var GivenUpPercent = Total === 0? 0 : Math.round(TotalGivenUp / Total * 100)


StatsGuessed.innerHTML = TotalCorrect
StatsGivenUp.innerHTML = TotalGivenUp
StatsAvgGuesses.innerHTML = AverageGuesses
StatsGivenUpPerc.innerHTML = GivenUpPercent + "%"


// DisplayWord("Mecca", '3', false)
// DisplayWord("Pouch", '6', false)
// DisplayWord("Sleep", '4', true, {1: "WrongPosBackground", 2: "CorrectBackground", 3: "IncorrectBackground", 4: "CorrectBackground", 5: "CorrectBackground"})

var can = false
var adjust = true

//Page changers
async function SetPage(prev, to) {
    prev.classList.add("hiddenpage");

    toRect = to.getBoundingClientRect();
    FakePopup.style.width = toRect.width + "px";
    FakePopup.style.height = toRect.height + "px";

    // Start transition
    setTimeout(() => {
        setTimeout(() => {
        to.classList.remove("hiddenpage");
        }, 100);
    }, 100);
}

async function fix() {
    await SetPage(document.getElementById("NoStats"), mainpage)

    toRect = document.getElementsByClassName("page")[0].getBoundingClientRect();
    FakePopup.style.width = toRect.width + "px";
    FakePopup.style.height = toRect.height + "px";
}

//Set page to main if stats
if (ScoresArray.length > 0) {fix(); adjust = false}
//

wordsPageButton.addEventListener("click", (e) => {
    SetPage(mainpage, wordspage)
})

wordsBack.addEventListener("click", (e) => {
    SetPage(wordspage, mainpage)
})

//Popup controller
statsButton.addEventListener('click', () => {
    overlay.style.display = 'flex'; // Show the overlay
    setTimeout(() => {
        if (can == false) {
            doc = document.getElementsByClassName("page")[0]
            if (adjust) {
                doc = popup
                adjust = false
            }
            toRect = doc.getBoundingClientRect();
            FakePopup.style.width = toRect.width + "px";
            FakePopup.style.height = toRect.height + "px";
        }
        overlay.style.filter = "opacity(1)"
        popup.style.filter = "opacity(1)"
        popup.style.marginBottom = "0px"
        can = true
    }, 1);
});
function closeStats() {
    overlay.style.filter = "opacity(0)"
    popup.style.filter = "opacity(0)"
    popup.style.marginBottom = "20px"
    setTimeout(() => {
            overlay.style.display = 'none'; 
    }, 500);
}

for (const element of document.getElementsByClassName("page")) {
    //set visisbility to visisble
element.style.visibility = "visible"
}

closePopupButton.addEventListener('click', closeStats);

overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        closeStats()
    }
});


obs = document.addEventListener("click", (e) => {
    if (can) {
        FakePopup.classList.remove("pagefix");
        document.removeEventListener("click", obs);
    }
})

