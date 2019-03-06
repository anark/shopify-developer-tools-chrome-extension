var data = {};
chrome.tabs.onActivated.addListener(function(activeInfo){
  data = {};
})
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg === "shop-data") {
      data = request.data;
      chrome.runtime.sendMessage({msg:"data-updated", data: data})
    }
    if (request.msg === "popup-opened") {
      sendResponse({data: data});
    }
  }
);
