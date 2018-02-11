var defaultSettings = {
  'globs' : [['father','daddy']],
  'suggestions' : [
    ['data','fungus'],
    ['innovate','dogwrestle'],
    ['president','fallow-lord']
  ]
};

function onError(e){
  console.log(e);
}

function checkStoredSettings(storedSettings){
  if (!storedSettings.since || !storedSettings.dataTypes){
    browser.storage.local.set(defaultSettings);
  }
}

function isEmpty(o){
  return (Object.keys(o).length === 0);
}

const storedSettings = browser.storage.local.get();
storedSettings.then(checkStoredSettings, onError);

/*
function initialize(){
  var global_list = browser.storage.local.get('globs');
  var suggestions = browser.storage.local.get('suggestions');

  console.log("global_list: " + global_list);
  console.log("suggestions"   + suggestions);

  //I would like to move this to a background script that runs first
  global_list.then( function(gl){
  }, onError);

  suggestions.then( function(sg){
    if (isEmpty(sg)){
      sg = [
      ];
      console.log("new suggestions: " + sg);
      saveSuggestions(sg);
    }
  }, onError);
}
function saveGlobalList(e){
  browser.storage.local.set({'globs' : e}).then(null,onError);
}
function saveSuggestions(e){
  browser.storage.local.set({'suggestions' : e}).then(null,onError);
}

initialize();
*/
