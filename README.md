# Plug-in that detects and suggests replacements for buzz-words

TODO:
-Make capitalization conserved in substitution
-Make plural-forms substitutable
-Highlight actual buzzwords on the screen, give user option to replace it right there w/ right-clicking.
-Add extension page
-Make buttons react more actively to being clicked(i.e. grow highlighted w/ x or + when hovered on)
\\-it should be more obvious that they're clickable
-Make simultaneous resolution possible (e.g. in substitution-list men=>women, women=>men should swap genders, not turn both to men)
-Give a point-score to a page for buzzword-use
-Make "submit" and "clear all" buttons look good(probably by matching the format of the sug/sub lists
-Enable phrase support(?)
-Investigate phone pop-up support
-Finally, I might want to collect statistics on most popular buzzwords to substitute, maybe suggest real-time updates
-Create a system where peopel can suggest "suggested" substitutions
-Improve logo (reflect about X-axis, make yellow more visible, make bee motif more obvious)
-Continually fill suggestions to its size, but turn substitutions into a scrollable area when it gets big enough

WebExtension Notes:
-Content scripts can communicate with background scripts with the messaging API
\\-> https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts
-Background scripts can access all the WebExtension APIs, but Content-Scripts can only do the following: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts#WebExtension_APIs

-Content-scripts can be loaded either (a) at install-time, into pages mathcing URL patterns (b) at run-time into pages matching URL patterns, (c) at run-time into specific tabs

-Web-accessible-resources are basically things you want to be able to access with URI's, like an embedded image

-It's probably most efficient to look at these other examples and adapt what I want: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Examples

-I might want to save things as files: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Working_with_files


