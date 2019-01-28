//read the json file only for first visit and create
//sessionStorage variable. All operations from now on will use
//sessionStorage and not reading from json.
$.getJSON('images_data.json' , (data) => {
  if(sessionStorage.firstVisit == null){
    sessionStorage.items = JSON.stringify(data);
    console.log(sessionStorage.items);
    sessionStorage.firstVisit = 1;//non-null
  }

  updateGallary();
});
// function to render images
function updateGallary(){
    let json = JSON.parse(sessionStorage.items);
    let items = json.items;
    let gallary = document.getElementsByClassName('gallary')[0];
    let count = 0;
    let imageDiv = document.createElement('div');
    let image;
    imageDiv.className = 'row';
    for(item of items){
        image = document.createElement('img');
        image.src = item.url;
        image.title = "Name: " + item.name + "\n";
        image.title += "Description: " + item.information + "\n";
        image.title += "Upload Date: " + item.uploadDate;
        count++;
        if(count%3 != 0){
           imageDiv.appendChild(image);
         }
        else{
          imageDiv.appendChild(image);
          gallary.appendChild(imageDiv);
          imageDiv = document.createElement('div');
          imageDiv.className = 'row';
        }

    }
    if(count%3!=0){
      imageDiv.appendChild(image);
      gallary.appendChild(imageDiv);
    }
}
