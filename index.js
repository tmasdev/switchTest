'use strict';
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1)); // Get a random index
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]]; // Swap elements
  }
  return array;
}
function randint(min, max) {
  // Ensure min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);

  // Generate random integer between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function arrayInArray(arr1, arr2) {
  for (let l=0; l<arr2.length;l++){
    if (JSON.stringify(arr2[l])==JSON.stringify(arr1))
      return(true);
  }
  return(false);
}
function updateScore(){
  document.getElementById("score").innerHTML = "Score: "+wins+"/"+answered;
}
function resetBoard(){
  updateScore();
  inPlay = [false,false,false];
  let win = [false, false, false];
  // Initial Shuffle so shapes are in different positions each time
  let newShapes = [];
  let initialShuffle = shuffleArray([1,2,3,4])
  for (let i=0; i<4; i++){
    newShapes.push(shapes[initialShuffle[i]-1]);
    let element = document.getElementById("question"+i);
    element.className = "shapeBox "+newShapes[i];
  }
  let shapesThroughout = [newShapes]
  let shuffleCodesThroughout = [];
  // For each mid row codes container
  let shuffleOptions = [];
  for (let i=1; i<4; i++){
    // Clear row's previous state
    document.getElementById("codesContainer"+(i-1)).innerHTML = "";
    // shuffleOptions represents whether this row has 1 or 3 codes
    // shuffleRealLocation is the location on each row of where the correct (real) code is
    let shuffleRealLocation;
    if (randint(1,2) == 1){
      shuffleOptions.push(1);
      shuffleRealLocation = 0;
      win[i-1] = true;
    } else {
      shuffleOptions.push(3);
      shuffleRealLocation  = randint(0,2);
    }
    // Generating the new real code
    let layerShuffle = shuffleArray([1,2,3,4]);
    shuffleCodesThroughout.push([...layerShuffle]);
    // Generating the newly shuffled shapes array
    let layerShapes = [];
    for (let k=0; k<4; k++){
      layerShapes.push(shapesThroughout[i-1][layerShuffle[k]-1]);
    }
    shapesThroughout.push(layerShapes);
    // Add each code in the row
    let rowCodes = [shuffleCodesThroughout[i-1]]
    for (let j=0; j<shuffleOptions[i-1]; j++){
      let ele = document.createElement("div");
      document.getElementById("codesContainer"+(i-1)).appendChild(ele);
      ele.className = "code";
      if (j==shuffleRealLocation){
        ele.innerHTML = shuffleCodesThroughout[i-1];
        ele.onclick = function(){
          win[i-1] = true;
          let shuffleOption = shuffleOptions[i-1];
          if (shuffleOption==3&&inPlay[i-1]){
            inPlay[i-1] = false;
            let oldColor = ele.style.backgroundColor;
            ele.style.backgroundColor = "green";
            if (win[0] && win[1] && win[2]){
              // on Win
              answered +=1;
              wins+=1;
              setTimeout(() => {
                ele.style.backgroundColor = oldColor;
                inPlay[i-1] = true;
                resetBoard();
                return(true);
              }, timeDelay);
            }
          }
        }
      } else {
        // Setting the decoy codes
        let newShuffle = shuffleArray([1,2,3,4]);
        // Ensuring no duplicate codes in a row
        if (arrayInArray(newShuffle,rowCodes)){
          resetBoard();
          return(false);
        }
        rowCodes.push(newShuffle);
        ele.innerHTML = newShuffle;
        ele.onclick = function(){
          if (shuffleOptions[i-1]==3 && inPlay[i-1]){
            inPlay[i-1] = false;
            let oldColor = ele.style.backgroundColor;
            ele.style.backgroundColor = "red";
            if (!(win[0] && win[1] && win[2])){
              // On Loss
              answered +=1;
              setTimeout(() => {
                ele.style.backgroundColor = oldColor;
                inPlay[i-1] = true;
                resetBoard();
                return(false);
              }, timeDelay);
            }
          }
        }
      }
    }
    // if there are no rows of 3 or 3 rows of 3, then regenerate board
    if ((shuffleOptions[0]==1 && shuffleOptions[1]==1 && shuffleOptions[2]==1)||(shuffleOptions[0]==3 && shuffleOptions[1]==3 && shuffleOptions[2]==3)){
      resetBoard();
      return(false)
    }
  }
  // Setting answer shapes
  for (let i=0; i<4; i++){
    let element = document.getElementById("answer"+i);
    element.className = "shapeBox "+shapesThroughout[3][i];
  }
  // Start game when fully loaded
  inPlay = [true,true,true]
}
const shapes = ["crossShape", "squareShape", "triangleShape", "circleShape"];
const timeDelay = 20;
let wins = 0;
let answered = 0;
let inPlay = [false,false,false];
resetBoard();