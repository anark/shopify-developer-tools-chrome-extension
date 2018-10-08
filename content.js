if (typeof Shopify != 'undefined' && location.href.indexOf('/admin') == -1) {
  document.getElementById("shopifyChromeDeveloperTools").setAttribute("data-shopify-shop", Shopify.shop)
  document.getElementById("shopifyChromeDeveloperTools").setAttribute("data-shopify-theme", Shopify.theme.name)
  document.getElementById("shopifyChromeDeveloperTools").setAttribute("data-shopify-theme-id", Shopify.theme.theme_store_id)
}
else{
  document.getElementById("shopifyChromeDeveloperTools").setAttribute("data-shopify-shop", false)
  document.getElementById("shopifyChromeDeveloperTools").setAttribute("data-shopify-theme", false)
  document.getElementById("shopifyChromeDeveloperTools").setAttribute("data-shopify-theme-id", false)
}
