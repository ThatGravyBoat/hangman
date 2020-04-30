let params = new URLSearchParams( location.search );
var wordLists = wordList.replace(/ /g, '');
var words = wordLists.split( "," );
var selectedWord = "";
var revealedWord = "";
var turnCount = 6;
var usedLetters = [];
var answer = document.querySelector( "#answer" );
var topic = document.querySelector( "#topic" );
var turns = document.querySelector( "#turns" );

function newWord() { 
  var randomNumber =  Math.floor( Math.random() * words.length);
  selectedWord = words[randomNumber];
  revealedWord = "_".repeat( selectedWord.length );
  turnCount = 6;
  turns.innerText = `Turns: ${turnCount}`
  usedLetters = [];
  console.log(selectedWord)
  document.getElementById("hangman").style.backgroundImage = `url('base.png')`;
  answer.innerText = revealedWord.split( "" ).join( " " );
  topic.innerText = wordTopicList[randomNumber]
  document.querySelectorAll(`.letters`).forEach(element => {
    element.classList.remove("usedWrong")
    element.classList.remove("usedRight")
  })
}

newWord();

function checkLetter(selectedWord, letter) {
  if (usedLetters.toString().includes(letter)){
    console.log("Letter used twice")
    //Maybe add a message to say you cant use the same letter twice
  }
  else if (selectedWord.includes(letter.toLowerCase())){
    usedLetters.push(letter)
    var parts = revealedWord.split( "" );
    for(var i =0; i <= selectedWord.length; i++){
      if (i < selectedWord.length){
        if (selectedWord[i] === letter){
          parts[ i ] = letter;
          revealedWord = parts.toString().split( "," ).join( "" );
          document.querySelector(`#letter${letter.toUpperCase()}`).classList.add("usedRight")
        }
      }
      if (i === selectedWord.length){
        answer.innerText = revealedWord.split( "" ).join( " " );
        if (!revealedWord.includes( "_" )){
          setTimeout( () => {
            newWord(); 
          }, 3000 );
        }
      }
    }
  }
  else if (!selectedWord.includes(letter)){
    var letters = /^[A-Za-z]+$/;
    if (letter.match(letters)){
      usedLetters.push(letter.toLowerCase())
      turnCount--
      turns.innerText = `Turns: ${turnCount}`
      document.getElementById("hangman").style.backgroundImage = `url('./${6 - turnCount}.png')`;
    }
    if (turnCount === 0){
      setTimeout( () => {
        newWord()
      }, 3000 );
      //DO message with the word they fucked up
    }
    document.querySelector(`#letter${letter.toUpperCase()}`).classList.add("usedWrong")
  }
}

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if(command === "letter" ) {
    if( extra.sinceLastCommand.user > 15000 || extra.sinceLastCommand.user === 0 ) {
      if (message.length === 1){
        checkLetter(selectedWord.toLowerCase(), message.toLowerCase())
      }        
    }
  }
  if(command === "word" ) {
    if (message.toLowerCase() === selectedWord.toLowerCase()){
      answer.innerText = message.split( "" ).join( " " );
      setTimeout( () => {
        newWord(); 
      }, 3000 );
    }
  }
}

/*
ComfyJS.onChat = ( user, message,flags, self, extra ) => {
  if (message.length === 1){
    checkLetter(selectedWord.toLowerCase(), message.toLowerCase())
  }
  if (message.toLowerCase() === selectedWord.toLowerCase()){
    answer.innerText = message.split( "" ).join( " " );
    setTimeout( () => {
      newWord(); 
    }, 3000 );
  }
}
*/

ComfyJS.Init( params.get( "botname" ), "oauth:" + params.get( "oauth" ),  params.get( "channel" ) );