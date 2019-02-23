// Simple extension to redirect all requests to RS Wikia to RS Wiki
(function(){
  'use strict';
  let isPluginDisabled = false;
  let storage = window.storage || chrome.storage;

<<<<<<< master
  const RSWIKIA_REGEX = /^(runescape|oldschoolrunescape)\.(wikia|fandom)\.com$/i;
=======
  const RSWIKIA_REGEX = /^(http|https):\/\/([^\.]+)\.(wikia|fandom)\.com(.*)$/i;

  const REDIRECTS = {
    "oldschoolrunescape":"oldschool.runescape.wiki",
    "runescape":"runescape.wiki"
  };

  function splitURL(url){
    return RSWIKIA_REGEX.exec(url);
  }/*
>>>>>>> master

  chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
      if(isPluginDisabled) {
        console.log("RSWikia intercepted, ignoring because plugin is disabled.");
        return;
      }

      const url = new URL(info.url);

      const isWikia = RSWIKIA_REGEX.test(url.host); // is this necessary? we already filter by URL
      // If domain isn't subdomain of wikia.com, ignore, also if it's not in the redirect filter
      if (!isWikia) return;

      // Generate new url
<<<<<<< master

      const host = url.host.includes('oldschool') ? 'oldschool.runescape' : 'runescape'
      const redirectUrl = `https://${host}.wiki${url.pathname.replace(/^\/wiki\//i,"/w/")}`;
      console.log(`RSWikia intercepted:  ${info.url}\nRedirecting to ${redirectUrl}`);
      // Redirect the old wikia request to new wiki
=======
      let redirectUrl = "https://"+newDomain+splitUrl[4].replace(/^\/wiki\//i,"/w/");
      console.log("RSWikia intercepted: " + info.url + "\nRedirecting to "+redirectUrl);
      // Redirect the old wikia request to new wiki 
>>>>>>> master
      return {redirectUrl:redirectUrl};
    },
    // filters
    {
      urls: [
        "*://oldschoolrunescape.wikia.com/*",
        "*://runescape.wikia.com/*",
        "*://oldschoolrunescape.fandom.com/*",
        "*://runescape.fandom.com/*",
      ]
    },
    // extraInfoSpec
    ["blocking"]);*/

  chrome.webNavigation.onBeforeNavigate.addListener( function (details) {
    var tabId = details.tabId;
    var tabUrl = details.url;
    if(RSWIKIA_REGEX.test(tabUrl)) {
      let splitUrl = splitURL(tabUrl);
      let newDomain = REDIRECTS[splitUrl[2]];
      // If domain isn't subdomain of wikia.com, ignore, also if it's not in the redirect filter
      if(splitUrl===null || newDomain===undefined) return;
      // Check if plugin is disabled, if so put a message logged
      if(isPluginDisabled) {
        console.log("RSWikia intercepted, ignoring because plugin is disabled.");
        return;
      }
      // Generate new url
      let redirectUrl = "https://"+newDomain+splitUrl[4].replace(/^\/wiki\//i,"/w/");
      console.log("RSWikia intercepted: " + tabUrl + "\nRedirecting to "+redirectUrl);
      // Redirect the old wikia request to new wiki 
      chrome.tabs.update(tabId,{url:redirectUrl});
    }
})

  function updateIcon(){
    chrome.browserAction.setIcon({ path: isPluginDisabled?"icon32_black.png":"icon32.png"  });
  }

  storage.local.get(['isDisabled'],(result)=>{
      isPluginDisabled= result ? result.isDisabled : false;
      updateIcon();
  });

  storage.onChanged.addListener(
      function(changes, areaName) {
        // If isDisabled changed, update isPluginDisabled
        if(changes["isDisabled"]!==undefined && changes["isDisabled"].newValue!=changes["isDisabled"].oldValue) {
          console.log(`RS Wiki Redirector is now ${changes["isDisabled"].newValue?'disabled':'enabled'}`);
          isPluginDisabled=changes["isDisabled"].newValue;
          updateIcon();
        }
      }
    );
})();
