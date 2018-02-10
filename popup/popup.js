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

//globals
var suggestions =[];
var globals =[];


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

function messageTabs(msg){
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then( function(tabs){
    for (let tab of tabs) {
      browser.tabs.sendMessage(
        tab.id,
        msg
      ).then(rsp => {
        console.log(response);
        console.log(rsp);
      }).catch(onError);
    }
  }).catch(onError);
}

function saveStates(){
  browser.storage.local.set({
    'globs' : globals,
    'suggestions' : suggestions
  }).then( function(e){
    //send message to content script to do a new substitution
    messageTabs({"update":true})
    //update displaying of notes
    drawSubstitutions();
    drawSuggestions();
  }
    ,onError);
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

  console.log("key gotten:"+key);
  console.log("subst gotten:"+subst);

  //clean input
  key = key.trim();
  subst = subst.trim();

  //add to array
  globals.push([key,subst]);
  saveStates();
}


//clear all stored substs
function clearAll() {
  messageTabs({"clear":true});
  globals = [];
  drawSubstitutions();
}

function drawSuggestions(){
  //remove all children
  while(suggestion_holder.firstChild){
    suggestion_holder.removeChild(suggestion_holder.firstChild);
  }
  suggestions.forEach( function(e) {
    var sugst = document.createElement('li')
    sugst.setAttribute('class','active_sugst');
    sugst.innerText = e[0] + '=>' + e[1];
    sugst.addEventListener('click',( function() {
      var kv = e;
      suggestions = suggestions.filter(e => (e[0]!==kv[0] || e[1]!==kv[1]));
      globals.push(kv);
      drawSuggestions();
      drawSubstitutions();
      browser.storage.local.set({
        'globs' : globals,
        'suggestions' : suggestions
      })
    } ));
    suggestion_holder.appendChild(sugst);
  });
}

function drawSubstitutions(){
  while(active_substs.firstChild){
    active_substs.removeChild(active_substs.firstChild);
  }
  globals.forEach( function(e) {
    var subst = document.createElement('li')
    subst.setAttribute('class','active_subst');
    subst.innerText = e[0] + '=>' + e[1];
    subst.addEventListener('click',( function() {
      var kv = e;
      globals = globals.filter(e => (e[0]!==kv[0] || e[1]!==kv[1]));
      drawSubstitutions();
      browser.storage.local.set({
        'globs' : globals,
        'suggestions' : suggestions
      })
    } ));

    active_substs.appendChild(subst);
  });
  //TODO: Add functionality here to edit the elements LIVE
}

function UpdateUI(e){
  console.log('loading storage stuff');
  suggestions = e.suggestions;
  globals     = e.globs;
  console.log('suggestions: '+suggestions+'-globals: ' + globals);
  //actually draw the states here
  drawSuggestions();
  drawSubstitutions();
}

const getStoredSettings = browser.storage.local.get();
getStoredSettings.then(UpdateUI, onError);

//  add event listeners to buttons
submit_button.addEventListener('click', addSubst);
key_input.addEventListener('keypress', onEnter);
subst_input.addEventListener('keypress', onEnter);
clear_button.addEventListener('click', clearAll);

