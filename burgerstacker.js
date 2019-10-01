var egBurgerDivPrefix = "egBurger-";
var playerBurgerDivPrefix = "playerBurger-";
var winOverlayWrapper = document.querySelector("#winOverlayWrapper");

//game stuff
var layerCounter = 0;
var maxBurgerStack = 10;
var covered = false;
var playerBurger = [];
var egBurger = [];
var maxIngredients = 3;
var clearedBurgerCounter = 0;
var ingredientLookup = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//initialize game - SHOULD ONLY BE CALLED ONCE ON PAGE LOAD
function InitializeGameBoard()
{
  var wrapper = document.querySelector("#ingredientsWrapper");
  if(!wrapper)
  {
    alert("Error loading game!");
    return;
  }

  document.querySelector("#next").addEventListener('click', ResetAndStartGame);

  ingredientLookup = Object.keys(ingredientDictionary);

  for(var elem in ingredientDictionary)
  {
    //create button
    var newBtn = document.createElement("button");

    //add id, class and change name
    newBtn.id = "btn-" + elem;
    newBtn.className += "btn col-3 ingredient-btn";
    newBtn.innerHTML = elem;
    newBtn.style.backgroundColor = ingredientDictionary[elem]["color"];

    //add event listener
    newBtn.addEventListener('click', ingredientDictionary[elem]["playerPushFn"]);
    //append
    wrapper.appendChild(newBtn);
  }

  //bun cap cover case
  var bunCapCoverButton = document.querySelector("#bunCap");
  if(bunCapCoverButton)
  {
    bunCapCoverButton.addEventListener('click', BunCapCover);
  }

  //add event listener for removing ingredients
  for(var i = 0; i < maxBurgerStack; ++i)
  {
    var playerBunDiv = document.querySelector("#" + playerBurgerDivPrefix + i.toString());
    if(playerBunDiv)
    {
      playerBunDiv.addEventListener('click', RemovePreviousIngredient);
    }
  }

  //randomize example burger
  StartGame();
}

InitializeGameBoard();

function StartGame()
{
  winOverlayWrapper.style.opacity = 0;
  winOverlayWrapper.style.display = "none";

  //random ingredients in example burger
  for(var i = 0; i < maxIngredients; ++i)
  {
    var bunDiv = document.querySelector("#" + egBurgerDivPrefix + i.toString());
    var ingredientName = ingredientLookup[getRandomInt(0, ingredientLookup.length)];
    //bunDiv.style.backgroundColor = ingredientDictionary[ingredientName]["color"];
    bunDiv.style.backgroundImage = "url(" + ingredientDictionary[ingredientName]["imgSrc"] + ")";

    //push into array
    egBurger.push(ingredientName);
  }

  var cap = document.querySelector("#" + egBurgerDivPrefix + maxIngredients.toString());
  //cap.style.backgroundColor = "orange";
  cap.classList.add("bunCap");
}

//fn for when player picks ingredient
function PickIngredient(ingredientName)
{
  //check if covered
  if(covered)
  {
    alert("Cannot put ingredients on top of bun cap!");
    return;
  }

  //reserve last slot for burger bun
  if(layerCounter >= (maxBurgerStack - 1))
  {
    alert("Must top off burger with bun!");
    return;
  }

    //get player bun div id and change style stuff
    var playerBunDiv = document.querySelector("#" + playerBurgerDivPrefix + layerCounter.toString());
    //playerBunDiv.style.backgroundColor = ingredientDictionary[ingredientName]["color"];

    var bg = "url(" + ingredientDictionary[ingredientName]["imgSrc"] + ")";
    playerBunDiv.style.backgroundImage = bg;

    //push into array
    playerBurger.push(ingredientName);

  ++layerCounter;
  if(layerCounter >= maxBurgerStack)
  {
    //-1 cos index start from 0
    layerCounter = maxBurgerStack - 1;
  }
}

//buncap cover function - called when player tops off bun
function BunCapCover()
{
  if(covered)
  {
    alert("TWO bun caps?? Are you mad?");
    return;
  }

  var playerBunDiv = document.querySelector("#" + playerBurgerDivPrefix + layerCounter.toString());
  if(playerBunDiv)
  {
    //playerBunDiv.style.backgroundColor = "orange";
    playerBunDiv.classList.add("bunCap");
    covered = true;
  }

  if(CheckGameWon())
  {
    setTimeout(NextLevel(), 10000);
  }
  else {
    setTimeout(LoseLevel(), 10000);
  }
}

//remove last ingredient
function RemovePreviousIngredient()
{
  //if lesser than 0; return;
  if(layerCounter < 0)
  {
    layerCounter = 0;
    return;
  }

  //get current playerDiv
  var playerBunDiv = document.querySelector("#" + playerBurgerDivPrefix + layerCounter.toString());
  if(!playerBunDiv)
    return;

  //if covered, remove bun cap
  if(covered)
  {
    covered = false;
    playerBunDiv.classList.remove("bunCap");
  }
  else
  {
    playerBurger.pop();
  }

  playerBunDiv.style.backgroundColor = "";
  playerBunDiv.style.backgroundImage = "";

  --layerCounter;
  //make sure cant go below 0
  if(layerCounter < 0)
  {
    layerCounter = 0;
  }
}

function CheckGameWon()
{
  //if length not same, means not won
  if(egBurger.length !== playerBurger.length)
    return false;

  //check through each burger - guarantees same length
  for(var i = 0; i < egBurger.length; ++i)
  {
    if(playerBurger[i] !== egBurger[i])
      return false;
  }

  return true;
}

//won game, proceed to next level
function NextLevel()
{
  winOverlayWrapper.style.opacity = 1;
  winOverlayWrapper.style.display = "flex";

  //inc ingredients
  if(++clearedBurgerCounter > 2)
  {
    maxIngredients = 5;

    if(clearedBurgerCounter > 4)
      maxIngredients = 7;

    if(clearedBurgerCounter > 6)
      maxIngredients = 9;
  }
}

//lost level
function LoseLevel()
{
  RestartLevel();
}

//restart level - does not reset eg burger
function RestartLevel()
{
  playerBurger.length = 0;
  covered = false;
  layerCounter = 0;

  for(var i = 0; i < maxBurgerStack; ++i)
  {
    //get player bun div id and change style stuff
    var playerBunDiv = document.querySelector("#" + playerBurgerDivPrefix + i.toString());
    playerBunDiv.style.backgroundColor = "";
    playerBunDiv.style.backgroundImage = "";
    playerBunDiv.classList.remove("bunCap");
  }
}

//used to reset after game ended
function ResetGame()
{
  //reset arrays
  egBurger.length = playerBurger.length = 0;
  covered = false;
  layerCounter = 0;

  for(var i = 0; i < maxBurgerStack; ++i)
  {
    //get player bun div id and change style stuff
    var playerBunDiv = document.querySelector("#" + playerBurgerDivPrefix + i.toString());
    playerBunDiv.style.backgroundColor = "";
    playerBunDiv.style.backgroundImage = "";
    playerBunDiv.classList.remove("bunCap");
  }
}

//resets and starts a new game
function ResetAndStartGame()
{
  ResetGame();
  StartGame();
}
