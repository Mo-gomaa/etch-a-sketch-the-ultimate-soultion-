const gridWidth = getComputedStyle(document.body).getPropertyValue(
  "--grid-width"
);
const accentColor = getComputedStyle(document.body).getPropertyValue(
  "--accent-color"
);
const inactiveColor = getComputedStyle(document.body).getPropertyValue(
  "--inactive-color"
);
// define the variable names you're going to need:
// numOfSideSquares
// numOfSquares
// squareCellSideLength
const sketchArea = document.querySelector(".sketch-area");
const gridBtn = document.querySelector(".inputs-container__grid-btn");
const clearBtn = document.querySelector(".inputs-container__clear-btn");
const shadeBtn = document.querySelector(".inputs-container__shade-btn");
const randomBtn = document.querySelector(".inputs-container__random-btn");
const eraseBtn = document.querySelector(".inputs-container__erase-btn");
const colorBtn = document.querySelector(".inputs-container__color-btn");
const slider = document.querySelector(".slider");
const sliderValue = document.querySelector(".slider-value");

let numOfSideSquares = 16;
slider.value = 16;

let gridLinesVisible = false;
let sketching = false;
let randomizingColors = false;
let shading = false;
let erasing = false;
let squarePainted = false;

let penColor = "#000000";
let colorPickerColor = "#000000";
let shadeAmountHex = "00";

function toggleGridLinesVisibility() {
  gridLinesVisible = gridLinesVisible ? false : true;
  gridBtn.style.color = gridLinesVisible ? accentColor : inactiveColor;
  if (gridLinesVisible) {
    squareCellSideLength = `${parseInt(gridWidth) / numOfSideSquares - 2}px`;
    sketchArea.childNodes.forEach((square) => {
      square.style.border = "1px solid whitesmoke";
    });
  } else if (!gridLinesVisible) {
    squareCellSideLength = `${parseInt(gridWidth) / numOfSideSquares}px`;
    sketchArea.childNodes.forEach((square) => {
      square.style.border = "none";
    });
  }
  sketchArea.childNodes.forEach((square) => {
    square.style.width = square.style.height = squareCellSideLength;
  });
}
function setSquareBackgroundColor(e) {
  let currentShade = "0";
  let color = "";

  if (e.type === "mousedown") {
    sketching = true;
    if (randomizingColors) penColor = createRandomColor();
    // By default e.target.style.background = ""
    if (shading) {
      if (e.target.style.backgroundColor != "") {
        // e.target.style.backgroundColor returns an rgba string
        // it needs to be converted and broken into penColor and shadingPercentage(opacity)
        // eg. "rgba(0, 0, 0, 0.7)"
        penColor = convertRGBAToHexA(e.target.style.backgroundColor);
        color = e.target.style.backgroundColor;
        currentShade = color.substring(color.length - 4, color.length - 1);
        penColor = penColor.substring(0, 7) + createShading(currentShade);
      } else penColor = penColor.substring(0, 7) + "1A";
    }
    e.target.style.backgroundColor = penColor;
  } else if (e.type === "mouseover" && sketching) {
    if (randomizingColors) penColor = createRandomColor();
    if (shading) {
      if (e.target.style.backgroundColor != "") {
        penColor = convertRGBAToHexA(e.target.style.backgroundColor);
        color = e.target.style.backgroundColor;
        currentShade = color.substring(color.length - 4, color.length - 1);
        penColor = penColor.substring(0, 7) + createShading(currentShade);
      } else penColor = penColor.substring(0, 7) + "1A";
    }
    e.target.style.backgroundColor = penColor;
  } else sketching = false;
}

function drawGridSquares() {
  numOfSquares = numOfSideSquares * numOfSideSquares;
  let squareCellSideLength = 0;
  for (let i = 0; i < numOfSquares; i++) {
    const gridSquare = document.createElement("div");

    if (gridLinesVisible) {
      squareCellSideLength = `${parseInt(gridWidth) / numOfSideSquares - 2}px`;
      gridSquare.style.border = "1px solid whitesmoke";
    } else if (!gridLinesVisible) {
      squareCellSideLength = `${parseInt(gridWidth) / numOfSideSquares}px`;
      gridSquare.style.border = "none";
    }
    gridSquare.style.width = gridSquare.style.height = squareCellSideLength;

    gridSquare.addEventListener("mousedown", (e) =>
      setSquareBackgroundColor(e)
    );
    gridSquare.addEventListener("mouseover", (e) =>
      setSquareBackgroundColor(e)
    );
    gridSquare.addEventListener("mouseup", (e) => setSquareBackgroundColor(e));

    gridSquare.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });

    sketchArea.appendChild(gridSquare);
  }
}

function removeGridSquares() {
  while (sketchArea.firstChild) {
    sketchArea.removeChild(sketchArea.firstChild);
  }
}

colorBtn.addEventListener("input", (e) => {
  penColor = colorPickerColor = e.target.value;
  if (shading) toggleShading();
  if (randomizingColors) toggleUseOfRandomColors();
  if (erasing) toggleEraser();
});

function toggleUseOfRandomColors() {
  randomizingColors = randomizingColors ? false : true;
  if (randomizingColors && erasing) toggleEraser();
  randomBtn.style.color = randomizingColors ? accentColor : inactiveColor;
  penColor = !randomizingColors ? colorPickerColor : penColor;
}

function createRandomColor() {
  let newColor = "#";
  let possibleChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
  ];
  for (let i = 0; i < 6; i++) {
    randomIndex = Math.floor(Math.random() * (possibleChars.length + 1));
    newColor += possibleChars[randomIndex];
  }
  return newColor;
}

function toggleShading() {
  shading = shading ? false : true;
  if (shading && erasing) toggleEraser();
  shadeBtn.style.color = shading ? accentColor : inactiveColor;
  penColor = !shading ? colorPickerColor : penColor;
}
function createShading(currentShade) {
  let shadePercentage = currentShade * 100;
  if (shadePercentage < 100) shadePercentage += 10;

  shadeAmountHex = Math.round((shadePercentage / 100) * 255).toString(16);
  return shadeAmountHex;
}

function createShading(currentShade) {
  let shadePercentage = currentShade * 100;
  if (shadePercentage < 100) shadePercentage += 10;

  shadeAmountHex = Math.round((shadePercentage / 100) * 255).toString(16);
  return shadeAmountHex;
}

function toggleEraser() {
  erasing = erasing ? false : true;
  if (erasing) {
    if (randomizingColors) toggleUseOfRandomColors();
    if (shading) toggleShading();
  }
  eraseBtn.style.color = erasing ? accentColor : inactiveColor;
  penColor = erasing ? "" : colorPickerColor;
}

function clearSketch() {
  removeGridSquares();
  drawGridSquares();
}

function confirmClear() {
  if (confirm("Your Sketch Wound Be Deleted!")) clearSketch();
}

function convertRGBAToHexA(rgba, forceRemoveAlpha = false) {
  return (
    "#" +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
      .split(",") // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map((string) => parseFloat(string)) // Converts to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map((number) => number.toString(16)) // Converts numbers to hex
      .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
      .join("")
  ); // Puts the array to togehter to create a string
}

gridBtn.addEventListener("click", toggleGridLinesVisibility);
shadeBtn.addEventListener("click", toggleShading);
randomBtn.addEventListener("click", toggleUseOfRandomColors);
eraseBtn.addEventListener("click", toggleEraser);
clearBtn.addEventListener("click", confirmClear);

slider.addEventListener("change", () => {
  numOfSideSquares = slider.value;
  sliderValue.textContent = `${slider.value} x ${slider.value}`;
  removeGridSquares();
  drawGridSquares();
});
drawGridSquares();
