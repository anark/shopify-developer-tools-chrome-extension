var settings = {}

chrome.storage.sync.get('shopifyPartnerId', function(data) {
  settings.shopifyPartnerId = data.shopifyPartnerId;
  field = document.getElementById("shopifyPartnerIdField");
  field.value = settings.shopifyPartnerId;
  if(data.shopifyPartnerId.length){
    document.getElementById('settings').style.display = 'none';
  }
});

var updateFields = function(data){
  if(data.shop && data.theme && data.shop != "false" && data.theme != "false"){
    document.getElementById('shop').innerHTML = data.shop;
    document.getElementById('theme').innerHTML = data.theme;
    if(data.themeId != "null"){
      document.getElementById('theme').classList.add("alert-success")
    }
    else{
      document.getElementById('theme').classList.add("alert-danger")
    }

    var node = document.createElement("a");
    node.href = "https://partners.shopify.com/" + settings.shopifyPartnerId + "/managed_stores/new?shop_domain=" + data.shop;
    node.target = "_blank";
    node.className = "btn btn-primary";
    node.appendChild(document.createTextNode("Get Access"));
    document.getElementById('access').innerHTML = "";
    document.getElementById('access').appendChild(node);

    var node = document.createElement("a");
    node.href = "https://" + data.shop + "/admin/themes/current/editor";
    node.target = "_blank";
    node.className = "btn btn-primary";
    node.appendChild(document.createTextNode("Edit Theme"));
    document.getElementById('edit').innerHTML = "";
    document.getElementById('edit').appendChild(node);
  }
  else if(data.shop == "false"){
    document.getElementById('shop').innerHTML = "Not a Shopify Store";
  }
}
window.onload = function() {
  chrome.tabs.executeScript({
    file: 'inject.js'
  });
  chrome.runtime.sendMessage({msg:"popup-opened"},function(response){
    updateFields(response.data);
  });
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.msg === "data-updated") {
        updateFields(request.data);
      }
    }
  )
};

object = document.getElementById("shopifySettings");
object.addEventListener("submit", function(object){
  field = document.getElementById("shopifyPartnerIdField");
  chrome.storage.sync.set({ shopifyPartnerId: field.value });
});
