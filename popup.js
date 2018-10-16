var settings = {}

chrome.storage.sync.get(['shopifyPartnerId', 'codeEditor'], function(data) {
  settings = data;
  partnerIdField = document.getElementById("shopifyPartnerIdField");
  if(data.codeEditor){
    document.getElementById("editorTypeCode").checked = true;
  }
  else{
    document.getElementById("editorTypeOptions").checked = true;
  }
  if(data.shopifyPartnerId && data.shopifyPartnerId.length){
    partnerIdField.value = settings.shopifyPartnerId;
    document.getElementById('settings').style.display = 'none';
    document.getElementById('results').style.display = 'block';
  }
});

var updateFields = function(data){
  if(data.shop && data.shop != "false"){
    document.getElementById('shop').innerHTML = data.shop;
    if(data.theme && data.theme != "false"){
      document.getElementById('theme').innerHTML = data.theme;
      if(data.themeId != "null"){
        document.getElementById('notPurchasedAlert').style.display = 'none';
      }
      else{
        document.getElementById('notPurchasedAlert').style.display = 'block';
      }
    }

    var node = document.createElement("a");
    node.href = "https://partners.shopify.com/" + settings.shopifyPartnerId + "/managed_stores/new?shop_domain=" + data.shop;
    node.target = "_blank";
    node.className = "btn btn-primary";
    node.appendChild(document.createTextNode("Get Access"));
    document.getElementById('access').innerHTML = "";
    document.getElementById('access').appendChild(node);

    var node = document.createElement("a");
    node.href = "https://" + data.shop + "/admin/themes/current";
    if(!settings.codeEditor){
      node.href = node.href + "/editor"
    }
    node.target = "_blank";
    node.className = "btn btn-primary";
    node.appendChild(document.createTextNode("Edit Theme"));
    document.getElementById('edit').innerHTML = "";
    document.getElementById('edit').appendChild(node);

    var node = document.createElement("a");
    if(data.shopId && data.shopId != "false"){
      node.href = "https://partners.shopify.com/" + settings.shopifyPartnerId + "/stores/" + data.shopId;
    }
    else{
      node.href = "https://partners.shopify.com/" + settings.shopifyPartnerId + "/managed_stores?status=active&q=" + data.shop
    }
    node.target = '_blank';
    node.className = "btn btn-primary"
    node.appendChild(document.createTextNode("View in Partner Account"));
    document.getElementById('login').innerHTML = "";
    document.getElementById('login').appendChild(node);
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
  var shopifyPartnerId = document.getElementById("shopifyPartnerIdField").value;
  var codeEditor = document.getElementById("editorTypeCode").checked;
  chrome.storage.sync.set({ shopifyPartnerId: shopifyPartnerId, codeEditor: codeEditor });
});

document.getElementById('settingsLink').addEventListener('click', function(){
  document.getElementById('results').style.display = 'none';
  document.getElementById('settings').style.display = 'block';
});
