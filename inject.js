existingScript = document.getElementById("shopifyChromeDeveloperTools")

var shopLabel = document.querySelectorAll("[data-attr-identifier='custom_data.shop']")[0]

if(shopLabel){
  var shopUrl = shopLabel.nextElementSibling.querySelectorAll('[data-content]')[0].getAttribute('data-content')
  chrome.runtime.sendMessage({msg: "shop-data", data: { shop: shopUrl } } );
}
else if(existingScript){
  var shopUrl = existingScript.getAttribute("data-shopify-shop");
  var themeName = existingScript.getAttribute("data-shopify-theme");
  var themeId = existingScript.getAttribute("data-shopify-theme-id");
  var shopId = existingScript.getAttribute("data-shopify-shop-id");
  chrome.runtime.sendMessage({msg: "shop-data", data: { shop: shopUrl, theme: themeName, themeId: themeId, shopId: shopId } } );
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
        var shopId = script.getAttribute("data-shopify-shop-id");
        chrome.runtime.sendMessage({msg: "shop-data", data: { shop: shopUrl, theme: themeName, themeId: themeId, shopId: shopId } } );
      }
    });
  });

  observer.observe(script, {
    attributes: true //configure it to listen to attribute changes
  });

  node.appendChild(script);
}
