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

    eventTitle = renderTitle(item);
    itemDiv.appendChild(eventTitle);

    eventSchedule = renderSchedule(item);
    itemDiv.appendChild(eventSchedule);

    eventDescription = renderDescription(item)
    itemDiv.appendChild(eventDescription);

    eventImage = renderEventImage(item);
    itemDiv.appendChild(eventImage);
    
    listItem.appendChild(itemDiv);
    ulist.appendChild(listItem)
  })
}

var renderTitle = (eventDetail) => {
  var itemName = document.createElement("h3");
  itemName.className = "eventName";
  titleLink = document.createElement("a");
  titleLink.href = eventDetail.slug;
  titleLink.className = "tdbc-card__title";
  
  titleLink.appendChild(document.createTextNode(eventDetail.name));
  itemName.appendChild(titleLink);

  return itemName;
}

var renderSchedule = (eventDetail) => {
  var eventSchedule = document.createElement("div");
  eventSchedule.appendChild(document.createTextNode(eventDetail.friendlySchedule))
  return eventSchedule;
}

var renderDescription = (eventDetail) => {
  var itemDescription = document.createElement("div");
  eventDetail.description.content.forEach(firstLevelDesc => {
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

  return itemDescription;
}

var renderEventImage = (eventDetail) => {
  var itemImg = document.createElement("img");
  itemImg.src = eventDetail.url;
  itemImg.className = "eventImg";

  return itemImg;
}

var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      renderevents(JSON.parse(this.responseText), "eventsContainer");
    }
  };
  xhttp.open("GET", "/api/events/all.json", true);
  xhttp.send();
