var settings = {}

function addCustomButtonField(options={}){
  var customButtonSection = document.getElementById('customButtonInputs')
  var node = document.createElement("div");
  node.className = "customButtonInput";
  node.style="margin-bottom: 20px";

  var nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "form-control customButtonName";
  nameInput.placeholder = "Button Name";
  nameInput.value = options.name;

  var linkInput = document.createElement("input");
  linkInput.type = "text";
  linkInput.className = "form-control customButtonURL";
  linkInput.placeholder = "Button URL use Can use {{ shop }} and {{ shopId }} and {{ theme }} and {{ themeId }}";
  linkInput.value = options.url;
  node.appendChild(nameInput);
  node.appendChild(linkInput);
  customButtonSection.appendChild(node);
}

chrome.storage.sync.get(['shopifyPartnerId', 'codeEditor', 'customButtons'], function(data) {
  settings = data;
  partnerIdField = document.getElementById("shopifyPartnerIdField");
  if(data.codeEditor){
    document.getElementById("editorTypeCode").checked = true;
  }
  else{
    document.getElementById("editorTypeOptions").checked = true;
  }
  if(data.customButtons){
    for(var i=0; i< data.customButtons.length; i = i + 1){
      var customButton = data.customButtons[i];
      addCustomButtonField({name: customButton.name, url: customButton.url})
    }
  }
  if(data.shopifyPartnerId && data.shopifyPartnerId.length){
    partnerIdField.value = settings.shopifyPartnerId;
    document.getElementById('settings').style.display = 'none';
    document.getElementById('results').style.display = 'block';
  }
});

addButtonLink = document.getElementById('addCustomButton');
addButtonLink.addEventListener('click', function(){
  addCustomButtonField({name: '', url: ''})
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
    node.href = "https://partners.shopify.com/" + settings.shopifyPartnerId + "/stores/new?store_type=managed_store&store_domain=" + data.shop;
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
      node.href = "https://partners.shopify.com/" + settings.shopifyPartnerId + "/managed_stores?&q=" + data.shop
    }
    node.target = '_blank';
    node.className = "btn btn-primary"
    node.appendChild(document.createTextNode("View in Partner Account"));
    document.getElementById('login').innerHTML = "";
    document.getElementById('login').appendChild(node);
    document.getElementById('custom').innerHTML = "";
    if(settings.customButtons.length){
      for(var i=0; i < settings.customButtons.length; i = i + 1){
        var wrapper = document.createElement("li");
        wrapper.className = "list-group-item";
        var customButton = settings.customButtons[i];
        var node = document.createElement("a");
        node.href = Mustache.render(customButton.url, data);
        node.target = "_blank";
        node.className = "btn btn-primary";
        node.appendChild(document.createTextNode(customButton.name));
        wrapper.appendChild(node);
        document.getElementById('custom').appendChild(wrapper);
      }
    }
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
  var customButtons = document.querySelectorAll('.customButtonInput');
  var customButtonsData = [];
  Array.prototype.forEach.call(customButtons, function(el, i){
    customButtonsData.push({name: el.querySelector('.customButtonName').value, url: el.querySelector('.customButtonURL').value})
  });
  chrome.storage.sync.set({ shopifyPartnerId: shopifyPartnerId, codeEditor: codeEditor, customButtons: customButtonsData });
});

document.getElementById('settingsLink').addEventListener('click', function(){
  document.getElementById('results').style.display = 'none';
  document.getElementById('settings').style.display = 'block';
});
