existingScript = document.getElementById("shopifyChromeDeveloperTools")
if(existingScript){
  var shopUrl = existingScript.getAttribute("data-shopify-shop");
  var themeName = existingScript.getAttribute("data-shopify-theme");
  var themeId = existingScript.getAttribute("data-shopify-theme-id");
  chrome.runtime.sendMessage({msg: "shop-data", data: { shop: shopUrl, theme: themeName, themeId: themeId } } );
}
else{
  var node = document.getElementsByTagName('body')[0];
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.extension.getURL('content.js'));
  script.setAttribute('id', "shopifyChromeDeveloperTools");

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type == "attributes") {
        var shopUrl = script.getAttribute("data-shopify-shop");
        var themeName = script.getAttribute("data-shopify-theme");
        var themeId = script.getAttribute("data-shopify-theme-id");
        chrome.runtime.sendMessage({msg: "shop-data", data: { shop: shopUrl, theme: themeName, themeId: themeId } } );
      }
    });
  });

  observer.observe(script, {
    attributes: true //configure it to listen to attribute changes
  });

  node.appendChild(script);
}
