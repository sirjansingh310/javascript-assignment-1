//return today's date in format compatible with input[type = "date"] tag
function getTodaysDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
// add value attribute to input[type = "date"]
$("#date").attr("value",getTodaysDate());
$("#date").attr("max",getTodaysDate());

// validate urls using regular expressions
function ValidURL(str) {
  var pattern = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
  if(pattern.test(str))
    return true;
  alert("Please enter a valid url");
    return false;
}
// render the table on gallary admin page. Get values from
// sessionStorage
var json = JSON.parse(sessionStorage.items);
for (item of json.items){
  let name = item.name;
  let url = item.url;
  let information = item.information;
  let uploadDate = item.uploadDate;
  let row = "<tr class = \"item\"><td><input type='checkbox' class='record'></td><td>" + name + "</td><td>" + url + "</td><td><img src = \" " + url + "\"/></td><td>" + information + "</td><td>" + "<input class = \"upload-date\" type = \"date\" readonly value = \"" + uploadDate +"\">"+ "</td><td><button class = \"edit\">Edit</button><button class = \"save\" style = \"display: none;\">Save</button></td></tr>";
  $("table tbody").append(row);
}

// on clicking on add image button, the fields are validated and
// and if they are valid, the new data is appended to the table
// and in sessionStorage.
$("#add-button").click(function (){
  let name = $("#name").val();
  let url = $("#url").val();
  if(!ValidURL(url))
   return;
  let information = $("#information").val();
  let uploadDate = $("#date").val();
  if(name.length==0 || url.length == 0 || information.length == 0 || uploadDate.length == 0)
   {
     return;
   }
  json.items.push({
    "name": name,
    "url": url,
    "information": information,
    "uploadDate": uploadDate
  });
  sessionStorage.items = JSON.stringify(json);
  let row = "<tr class = \"item\"><td><input type='checkbox' class='record'></td><td>" + name + "</td><td>" + url + "</td><td><img src = \" " + url + "\"/></td><td>" + information + "</td><td>" + "<input class = \"upload-date\" type = \"date\" readonly value = \"" + uploadDate +"\">"+ "</td><td><button class = \"edit\">Edit</button><button class = \"save\" style = \"display: none;\">Save</button></td></tr>";
  $("table tbody").append(row);
});

// user can select multiple rows to delete.
$("#delete-button").click(function(){
    let index = 0;
    $("tr.item").each(function(){
       if($(this).find("input.record").is(":checked")){
         $(this).remove();
         json.items.splice(index,1);
       }
       else
       index++; // only update index value if item is not checked.
               // This is done because splice method will
               // remove element and reset the indexes.
    });
    sessionStorage.items = JSON.stringify(json);
  });

 // Edit values of row
  $("table tbody").on("click",".edit",function (){
     let parent = $(this).closest('tr');
     let parentCopy = parent;
     $(this).hide();
     parent.find("button.save").show();
     let index = parent.index();
     let uploadDateInput = parent.find("input.upload-date");
     uploadDateInput.removeAttr("readonly");
     uploadDateInput.attr("max",getTodaysDate());
     parent.children().each(function (){
        if($(this).find("input.record").length || $(this).find("button.edit").length || $(this).find("img").length)
           return;
        $(this).attr("contenteditable","true");
      });
     // save changes to sessionStorage
      $("table tbody").on("click",".save",function(){
          let updatedValues = [];
          parent.children().each(function(){
            if($(this).find("input.record").length || $(this).find("button.edit").length || $(this).find("img").length)
               return;
            else{
              if($(this).html().length==0){
                alert("Fields can't be left empty after editing");
                $(this).closest("tr") = parentCopy;
                $(this).hide();
                $(this).parent().find("button.edit").show();
                return;
              }
              updatedValues.push($(this).html());
              $(this).attr("contenteditable","false");
            }
          });
          uploadDateInput.attr("readonly","true");
          if(!ValidURL(updatedValues[1]))
             return;
          updatedValues[3] = uploadDateInput.val();
          let jsonObj = JSON.parse(sessionStorage.items);
          let newObj = {
            "name": updatedValues[0],
            "url": updatedValues[1],
            "information": updatedValues[2],
            "uploadDate": updatedValues[3]
          }
          jsonObj.items[index] = newObj;
          sessionStorage.items = JSON.stringify(jsonObj);
          $(this).hide();
          $(this).parent().find("button.edit").show();
      });
  });
