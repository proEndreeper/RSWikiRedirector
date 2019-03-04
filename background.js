// Simple extension to redirect all requests to RS Wikia to RS Wiki
(function(){
  'use strict';
  let isPluginDisabled = false; // Variable storing whether or not the plugin is disabled.
  let storage = window.storage || chrome.storage; // Make sure we have a storage API.

  const RSWIKIA_REGEX = /^(runescape|oldschoolrunescape)\.(wikia|fandom)\.com$/i; // Used to match the domain of the old wikia/fandom to make sure we are redirecting the correct domain.

  // Listen to before anytime the browser attempts to navigate to the old Wikia/Fandom sites.
  chrome.webNavigation.onBeforeNavigate.addListener(
    function(info) {
      if(isPluginDisabled) { // Ignore all navigation requests when the extension is disabled.
        console.log("RSWikia intercepted, ignoring because plugin is disabled.");
        return;
      }

      // Create a native URL object to more easily determine the path of the url and the domain.
      const url = new URL(info.url);

      const isWikia = RSWIKIA_REGEX.test(url.host); // Check to ensure the redirect is occurring on either the fandom/wikia domain.
      // If domain isn't subdomain of wikia.com, ignore, also if it's not in the redirect filter
      if (!isWikia) return;

      // Generate new url
      const host = url.host.includes('oldschool') ? 'oldschool.runescape' : 'runescape'; // Determine what host to change to, if oldschool, sub domain is oldschool.runescape, otherwise is juist runescape
      const redirectUrl = `https://${host}.wiki${url.pathname.replace(/^\/wiki\//i,"/w/")}`; // Create the redirect URL
      console.log(`RSWikia intercepted:  ${info.url}\nRedirecting to ${redirectUrl}`); 
      // Redirect the old wikia request to new wiki
      chrome.tabs.update(info.tabId,{url:redirectUrl});
    });

  function updateIcon(){
    // Change the icon to match the state of the plugin.
    chrome.browserAction.setIcon({ path: isPluginDisabled?"icon32_black.png":"icon32.png"  });
  }

  storage.local.get(['isDisabled'],(result)=>{
      // Get the initial condition of whether or not the extension is disabled
      isPluginDisabled= result ? result.isDisabled : false;
      updateIcon(); // Update icon to match new state
  });

  // Anytime the state of the plugin changes, update the internal state of the background script.
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
