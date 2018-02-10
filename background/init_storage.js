function initGlobalLists(){
  var global_list = browser.storage.local.get('globs');
  var suggestions = browser.storage.local.get('suggestions');

  //I would like to move this to a background script that runs first
  if (global_list == null){
    global_list = [
      ['father','daddy']
    ];  
    saveGlobalList(global_list);
  }
  if (suggestions == null){
    suggestions = [
      ['data','fungus'],
      ['innovate','dogwrestle'],
      ['donald trump','undying lord']
    ];
    saveSuggestions(suggestions);
  }
}

/*shouldn't actually be used here*/
function saveGlobalList(e){
  browser.storage.local.set({'globs' : e});
}
function saveSuggestions(e){
  browser.storage.local.set({'suggestions' : e});
}

initGlobalLists();
