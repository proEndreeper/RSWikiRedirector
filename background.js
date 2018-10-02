// Simple extension to redirect all requests to RS Wikia to RS Wiki

const RSWIKIA_REGEX = /^(http|https):\/\/([^\.]+)\.wikia\.com(.*)$/i;

const REDIRECTS = {
  "oldschoolrunescape":"oldschool.runescape.wiki",
  "runescape":"runescape.wiki"
};

function splitURL(url){
  return RSWIKIA_REGEX.exec(url);
}

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    let splitUrl = splitURL(info.url);
    let newDomain = REDIRECTS[splitUrl[2]];
    // If domain isn't subdomain of wikia.com, ignore, also if it's not in the redirect filter
    if(splitUrl===null || newDomain===undefined) return;
    // Generate new url
    let redirectUrl = "https://"+newDomain+splitUrl[3].replace(/^\/wiki\//i,"/w/");
    console.log("RSWikia intercepted: " + info.url + "\nRedirecting to "+redirectUrl);
    // Redirect the old wikia request to new wiki	
    return {redirectUrl:redirectUrl};
  },
  // filters
  {
    urls: [
      "*://oldschoolrunescape.wikia.com/*",
      "*://runescape.wikia.com/*"
    ]
  },
  // extraInfoSpec
  ["blocking"]);
