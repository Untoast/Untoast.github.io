const overlay = document.getElementById('overlay');
const popup = document.getElementById("popup")
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
  
    return sum / array.length;
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
        span.classList.add("LetterSpan")
        span.classList.add(Color[i])
        div.appendChild(span)
    }
    const GuessesLabel = document.createElement("Span")
    GuessesLabel.style.color = GaveUp ? "#ff0000" : "#fff"
    GuessesLabel.innerHTML = Guesses
    GuessesLabel.classList.add("LetterSpan")
    GuessesLabel.style.minWidth = "fit-content"
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


//Page changers
function SetPage(prev, to) {
    popup.style.filter = "blur(15px)"


    setTimeout(() => {
        prev.classList.add("hiddenpage"); 
        to.classList.remove("hiddenpage"); 
        setTimeout(() => {
            popup.style.filter = "blur(0px)"
        }, 100);
        
    }, 100);
}

//Set page to main if stats
if (ScoresArray.length > 0) {SetPage(document.getElementById("NoStats"), mainpage)}
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
        overlay.style.filter = "opacity(1)"
        popup.style.filter = "opacity(1)"
        popup.style.marginBottom = "0px"
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

closePopupButton.addEventListener('click', closeStats);

overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        closeStats()
    }
});


