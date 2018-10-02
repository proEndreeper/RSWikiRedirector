// Simple extension to redirect all requests to RS Wikia to RS Wiki

const RSWIKIA_REGEX = /^(http|https):\/\/(oldschoolrunescape|runescape|2007\.runescape)\.wikia\.com(.*)$/i;

const REDIRECTS = {
  "oldschoolrunescape":"oldschool.runescape.wiki",
  "2007.runescape":"oldschool.runescape.wiki",
  "runescape":"runescape.wiki"
};

function splitURL(url){
  return RSWIKIA_REGEX.exec(url);
}

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    let splitUrl = splitURL(info.url);
    if(splitUrl===null) return;
    let redirectUrl = "https://"+REDIRECTS[splitUrl[2]]+splitUrl[3].replace(/^\/wiki\//i,"/w/");
    console.log("RSWiki intercepted: " + info.url + "\nRedirecting to "+redirectUrl);
    // Redirect the old wikia request to new wiki	
	return {redirectUrl:redirectUrl};
  },
  // filters
  {
    urls: [
      "*://oldschoolrunescape.wikia.com/*",
      "*://2007.runescape.wikia.com/*",
      "*://runescape.wikia.com/*"
    ]
  },
  // extraInfoSpec
  ["blocking"]);
