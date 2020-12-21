var renderevents = function(eventsToRender, containerId){
  var container = document.getElementById(containerId);
  console.log(eventsToRender);
  var ulist = document.createElement("ul");
  ulist.className = "tdbc-lg-column-container";
  container.appendChild(ulist);  
  eventsToRender.forEach(function(item){
    var listItem = document.createElement("li");
    listItem.className = "tdbc-card";
    var itemDiv = document.createElement("div");
    itemDiv.className = "eventContainer tdbc-card__content";

    var itemName = document.createElement("h3");
    itemName.className = "eventName";
    itemName.appendChild(document.createTextNode(item.name));
    itemDiv.appendChild(itemName);

    var itemDescription = document.createElement("div")
    item.description.content.forEach(firstLevelDesc => {
      if(firstLevelDesc.nodeType === "paragraph"){
        var para = document.createElement("p");
        firstLevelDesc.content.forEach(secondLevelDesc => {
          if (secondLevelDesc.nodeType === "text"){
            para.appendChild(document.createTextNode(secondLevelDesc.value));
          }
        })
        itemDescription.appendChild(para);
      }
    });
    itemDiv.appendChild(itemDescription);

    var itemImg = document.createElement("img");
    itemImg.src = item.url;
    itemImg.className = "eventImg";
    itemDiv.appendChild(itemImg);
    
    listItem.appendChild(itemDiv);
    ulist.appendChild(listItem)
  })
}

var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      renderevents(JSON.parse(this.responseText), "eventsContainer");
    }
  };
  xhttp.open("GET", "/api/events/all.json", true);
  xhttp.send();
