# Plug-in that detects and suggests replacements for buzz-words

TODO:
-Add (clickable) suggestions above entry form
-Add extension page

WebExtension Notes:
-Content scripts can communicate with background scripts with the messaging API
\-> https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts
-Background scripts can access all the WebExtension APIs, but Content-Scripts can only do the following: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts#WebExtension_APIs

-Content-scripts can be loaded either (a) at install-time, into pages mathcing URL patterns (b) at run-time into pages matching URL patterns, (c) at run-time into specific tabs

-Web-accessible-resources are basically things you want to be able to access with URI's, like an embedded image

-It's probably most efficient to look at these other examples and adapt what I want: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Examples

-I might want to save things as files: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Working_with_files

-Finally, I might want to collect statistics on most popular buzzwords to substitute
