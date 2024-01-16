const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector(".data-length");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector(".data-indicate");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = `~!@#$%^&*()_-+=}{][|:;"'?>.<,`;

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

//set password length according to slider
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

//indicator setter

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123)); // ascii value converter
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91)); // ascii value converter
}

function generateSymbols() {
  const random = getRandomInteger(0, symbols.length);
  return symbols.charAt(random);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#0f0");
  } else {
    setIndicator("#FF0000");
  }
}

async function copyContent() {
  try {
    const copyText = passwordDisplay.value;
    await navigator.clipboard.writeText(copyText);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

function shufflePassword(shufflePassword) {
  //Fisher Yates Method
  for (let i = shufflePassword.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shufflePassword[i];
    shufflePassword[i] = shufflePassword[j];
    shufflePassword[j] = temp;
  }
  let str = "";
  shufflePassword.forEach((el) => {
    str += el;
  });
  return str;
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  password = "";

  let functArr = [];

  if (upperCaseCheck.checked) {
    functArr.push(generateUpperCase);
  }
  if (lowerCaseCheck.checked) {
    functArr.push(generateLowerCase);
  }
  if (numberCheck.checked) {
    functArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    functArr.push(generateSymbols);
  }

  for (let i = 0; i < functArr.length; i++) {
    password += functArr[i]();
  }

  for (let i = 0; i < passwordLength - functArr.length; i++) {
    let RandomInteger = getRandomInteger(0, functArr.length);
    password += functArr[RandomInteger]();
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});
