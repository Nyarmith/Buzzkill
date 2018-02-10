/* initialise variables */
//ok, so structure
//left_input : key, right_input: subst, button to right
//on enter(or button), if fields not filled out redden them, if fields filled out, clear color and submit them to database, then update "displayed substitutions"(div at bottom). Finally, there should be a clear button at the very bottom right (but I'd like it to be a right-click active-bar option)
//
//between input and "displayed substs", there should be a "suggestions" area, which displays something like (key1=>subst1). Ideally these should come from online, or some regular source. They will be from just a static background script for now
//
//id's
//left_input = #key_input, right_input = #subst_input, button=#submit_button
//suggestions_area = #suggestions, displayed substitutions = #live_substs
//                                              clear_button=#clear_button
//
//active subst:
//-The individual displayed substs are of .active_subst class, which will take care of drawing them properly I think


//getting the elements
var key_input         = document.querySelector('#key_input');
var subst_input       = document.querySelector('#right_input');
var submit_button     = document.querySelector('#submit_button');
var suggestion_holder = document.querySelector('#suggestions');
var active_substs     = document.querySelector('#live_substs');
var clear_button      = document.querySelector('#clear_button');

/*  add event listeners to buttons */

submit_button.addEventListener('click', addSubst);
key_input.addEventListener('keypress', onEnter);
subst_input.addEventListener('keypress', onEnter);
clear_button.addEventListener('click', clearAll);


/* display previously-saved stored notes on startup */

initialize();

function onEnter(e){
  var key = e.which || e.keyCode;
  if (key === 13){
    addSubst();
  }
}

/* generic error handler */
function onError(error) {
  console.log(error);
}

// TODO : redefine this
function initialize() {
  //load storage and display substitutes and suggestions
  var suggestions = browser.storage.local.get('suggestions');
  var globals     = browser.storage.local.get('globs');
  //TODO: some kind of coordinatio between this and future background script here

  /*
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
      var curValue = results[noteKey];
      displayNote(noteKey,curValue);
    }
  }, onError);
  */
}

/* Add a note to the display, and storage */

function redden(){
  key_input.style.backgroundColor = "red";
  subst_input.style.backgroundColor = "red";
}
function deredden(){
  key_input.style.backgroundColor = "";
  subst_input.style.backgroundColor = "";
}

function validInput(e){
  //is empty
  if (e === '')
    return false;
  //check that it's not just whitespace
  var spaces = /(\s|\t|\n)+/
  if (spaces.test(e))
    return false;
  
  //check it doesn't have any newlines
  var newlines=/.*\n.*/
  if (newlines.test(e))
    return false;

  return true;
}

function addSubst() {
  var key    =  key_input.value;
  var subst  =  subst_input.value;
  if (!validInput(key) || !validInput(subst)){
    redden();
    return 0;
  } else {
    deredden();
  }

  //clean input
  key = key.trim();
  subst = subst.trim();

  //save to storage
  var globals = browser.storage.local.get('glob');
  globals.push([key, subst]);
  browser.storage.local.set('glob');

  //send message to content script to do a new substitution
  browser.runtime.sendMessage({"update":true})

  //update displaying of notes
  displaySubsts(globals);
  
  /*var gettingItem = browser.storage.local.get(noteTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && noteTitle !== '' && noteBody !== '') {
      inputTitle.value = '';
      inputBody.value = '';
      storeNote(noteTitle,noteBody);
    }
  }, onError);
  */
}

/* function to store a new note in storage */


/* function to display a note in the note box */
function displaySubsts(mySubsts){
  /* adding stuff to the active_substs element*/
  var subst = document.createElement('div');
  subst.setAttribute('class','active_subst');
  active_substs.appendChild(subst);
  //TODO: Add functionality here to edit the elements LIVE
}

function storeNote(title, body) {
  var storingNote = browser.storage.local.set({ [title] : body });
  storingNote.then(() => {
    displayNote(title,body);
  }, onError);
}


function displayNote(title, body) {

  /* create note display box */
  var note = document.createElement('div');
  var noteDisplay = document.createElement('div');
  var noteH = document.createElement('h2');
  var notePara = document.createElement('p');
  var deleteBtn = document.createElement('button');
  var clearFix = document.createElement('div');

  note.setAttribute('class','note');

  noteH.textContent = title;
  notePara.textContent = body;
  deleteBtn.setAttribute('class','delete');
  deleteBtn.textContent = 'Delete note';
  clearFix.setAttribute('class','clearfix');

  noteDisplay.appendChild(noteH);
  noteDisplay.appendChild(notePara);
  noteDisplay.appendChild(deleteBtn);
  noteDisplay.appendChild(clearFix);

  note.appendChild(noteDisplay);

  /* set up listener for the delete functionality */

  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(title);
  })

  /* create note edit box */
  var noteEdit = document.createElement('div');
  var noteTitleEdit = document.createElement('input');
  var noteBodyEdit = document.createElement('textarea');
  var clearFix2 = document.createElement('div');

  var updateBtn = document.createElement('button');
  var cancelBtn = document.createElement('button');

  updateBtn.setAttribute('class','update');
  updateBtn.textContent = 'Update note';
  cancelBtn.setAttribute('class','cancel');
  cancelBtn.textContent = 'Cancel update';

  noteEdit.appendChild(noteTitleEdit);
  noteTitleEdit.value = title;
  noteEdit.appendChild(noteBodyEdit);
  noteBodyEdit.textContent = body;
  noteEdit.appendChild(updateBtn);
  noteEdit.appendChild(cancelBtn);

  noteEdit.appendChild(clearFix2);
  clearFix2.setAttribute('class','clearfix');

  note.appendChild(noteEdit);

  noteContainer.appendChild(note);
  noteEdit.style.display = 'none';

  /* set up listeners for the update functionality */

  noteH.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  })

  notePara.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  }) 

  cancelBtn.addEventListener('click',() => {
    noteDisplay.style.display = 'block';
    noteEdit.style.display = 'none';
    noteTitleEdit.value = title;
    noteBodyEdit.value = body;
  })

  updateBtn.addEventListener('click',() => {
    if(noteTitleEdit.value !== title || noteBodyEdit.value !== body) {
      updateNote(title,noteTitleEdit.value,noteBodyEdit.value);
      note.parentNode.removeChild(note);
    } 
  });
}


/* function to update notes */

function updateNote(delNote,newTitle,newBody) {
  var storingNote = browser.storage.local.set({ [newTitle] : newBody });
  storingNote.then(() => {
    if(delNote !== newTitle) {
      var removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
        displayNote(newTitle, newBody);
      }, onError);
    } else {
      displayNote(newTitle, newBody);
    }
  }, onError);
}

/* Clear all notes from the display/storage */

function clearAll() {
  browser.runtime.sendMessage({"clear":true})
}

