//code taken from millenial->snake_person plugin
function walk(rootNode)
{
  // Find all the text nodes in rootNode
  var walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    null,
    false
  ),
    node;

  // Modify each text node's value
  while (node = walker.nextNode()) {
    handleText(node);
  }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

//load state
function initGlobalList(){
  global_list = browser.storage.local.get('globs');
}

initGlobalList();

var suggestions = [
  ['data','fungus'],
  ['innovate','dogwrestle'],
  ['donald trump','undying lord']
];

//running list of substitutes
var global_list = [
['father','daddy']
];  

var substitute_list = global_list;


function compose_match(s){
  l = s[0].toLowerCase();
  u = s[0].toUpperCase();
  exp = '\\b(' + l + '|' + u + ')' + s.substr(1) + '?\\b'
  return new RegExp(exp,'g');
}

function compose_replace(s){
  return s;
}

function replaceText(v)
{
  for (var i=0; i<substitute_list.length; i++){
    w = substitute_list[i]
    console.log(w);
    //modify w[0], w[1] to be suitable for regex
    match   = compose_match(w[0])
    replace = compose_replace(w[1])
    v = v.replace(match, replace);
    console.log(match);
    console.log(replace);
  }

  return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
  return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
      node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
  var i, node;

  mutations.forEach(function(mutation) {
    for (i = 0; i < mutation.addedNodes.length; i++) {
      node = mutation.addedNodes[i];
      if (isForbiddenNode(node)) {
        // Should never operate on user-editable content
        continue;
      } else if (node.nodeType === 3) {
        // Replace the text for text nodes
        handleText(node);
      } else {
        // Otherwise, find text nodes within the given node and replace text
        walk(node);
      }
    }
  });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
  var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
      characterData: true,
      childList: true,
      subtree: true
    },
    bodyObserver, titleObserver;

  // Do the initial text replacements in the document body and title
  walk(doc.body);
  doc.title = replaceText(doc.title);

  // Observe the body so that we replace text in any added/modified nodes
  bodyObserver = new MutationObserver(observerCallback);
  bodyObserver.observe(doc.body, observerConfig);

  // Observe the title so we can handle any modifications there
  if (docTitle) {
    titleObserver = new MutationObserver(observerCallback);
    titleObserver.observe(docTitle, observerConfig);
  }
}

function saveGlobalList(){
  browser.storage.local.set({'globs' : global_list});
}

function updateSubsts(pair){
  substitute_list = [pair];
  walkAndObserve(document);

  global_list.push(pair);
  saveGlobalList();
}

function msgHandler(request, sender, sendResponse){
  if (request.key){
    updateSubsts([request.key, request.image])
  } else if(request.clear){
    //reverse-substitute and clear globals
    // TODO
    global_list = [];
    saveGlobalList();
  }
}


// message listener
browser.runtime.onMessage.addListener(msgHandler);

walkAndObserve(document);

