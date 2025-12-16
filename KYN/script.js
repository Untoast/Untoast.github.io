// dates
const startDate = new Date(1993, 10, 14);
const endDate   = new Date(2025, 9, 10);

//helper functions
function yearsBetween(start, end) {
  let years = end.getFullYear() - start.getFullYear();

  // if end date is before the anniversary in the end year, subtract 1
  if (
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
  ) {
    years--;
  }

  return years;
}

// calculate functions
function BK(date) {
  return yearsBetween(date, startDate)
};

function DK(date) {
  return yearsBetween(startDate, date)
};

function AK(date) {
  return yearsBetween(endDate, date)
}

// ref table
const timeCategories = {
  1: {
    "function": BK,
    "suffix"  : "B.K."
  },
  2: {
    "function": DK,
    "suffix"  : "D.K."
  },
  3: {
    "function": AK,
    "suffix"  : "A.K."
  },
};

// determines which category date belongs to 
function determineCategory(date) {
  var category = -1
  // before start date
  if      (date < startDate) 
  {category = 1}
  // after end date
  else if (date > endDate)   
  {category = 3}
  // inbetween start & end dates
  else                       
  {category = 2}
  
  
  return category;
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// define elements
const yearTextBox     = document.getElementById("year")
const yearDisplayText = document.getElementById("text") 
const submitButton    = document.getElementById("submit")

// vars
var prevInput = ""
var newText = ""

//update function
function updateYear() {
  // values
  const text  = yearTextBox.value;
  var   valid = true;
  
  if (text == prevInput) {return}
  
  // initial values
  var month = -1
  var day   = -1
  var year  = 0
  
  
  // if input is a 4 digit number
  if (isNumeric(text) && text.length == 4) {
    year = Number(text);
  }
  // try to seperate by slashes
  else {
    nums = text.split("/")
    if (nums.length == 3) {
      for (var i = 0; i < nums.length; i++) {
        value = nums[i]
        if (!isNumeric(value)) {
          valid = false
          break
        }
        if (i == 0 || i == 1) {
          if (value.length != 2) {
            valid = false;
            break;
          }
          else {
            if (i == 0) {
              month = Number(value)
            }
            if (i == 1) {
              day = Number(value)
            }
          }
        }
        if (i == 2) {
          if (value.length != 4) {
            valid = false;
            break;
          }
          else {
            year = Number(value);
          }
        }  
      }
    }
  }
  
  if (valid) {
    const date = new Date(year, month, day);
    const dateCategory = determineCategory(date)
    
    const yearFrameInfo = timeCategories[dateCategory]
    const yearNum       = yearFrameInfo.function(date)
    const yearSuffix    = yearFrameInfo.suffix
  
    const newText = `${yearNum} ${yearSuffix}`;

      // restart animation
      yearDisplayText.classList.remove("fade");
      void yearDisplayText.offsetWidth; // force reflow
      yearDisplayText.classList.add("fade");

      // listen for the iteration or end
      const onIteration = () => {
        yearDisplayText.innerHTML = newText;
      };

      const onEnd = () => {
        yearDisplayText.classList.remove("fade");
        yearDisplayText.removeEventListener("animationiteration", onIteration);
        yearDisplayText.removeEventListener("animationend", onEnd);
      };

      yearDisplayText.addEventListener("animationiteration", onIteration);
      yearDisplayText.addEventListener("animationend", onEnd);
  }
  
  prevInput = text;
}

//listen for kirkulate press
submitButton.addEventListener("click", updateYear, false);

///////////////////
//INFO TAB
///////////////////

const KYNinfo     = document.getElementById("KYN-info");
const infoButton  = document.getElementById("info");
const closeButton = document.getElementById("closeInfo");

function openInfo() {
  document.body.style.overflowY = "hidden"
  KYNinfo.classList.remove('hidden');
}
function closeInfo() {
  document.body.style.overflowY = "scroll"
  KYNinfo.classList.add('hidden');
}

infoButton.addEventListener("click", openInfo)
closeButton.addEventListener("click", closeInfo)