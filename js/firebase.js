// Initialize Firebase
var config = {
	apiKey: "AIzaSyBL91UQeyuvzCfvWr5orfZhH_wFrZ2eLLQ",
    authDomain: "test-firebase-d97ae.firebaseapp.com",
    databaseURL: "https://test-firebase-d97ae.firebaseio.com",
    storageBucket: "test-firebase-d97ae.appspot.com",
    messagingSenderId: "239687845166"
};
  
firebase.initializeApp(config);


function init(){
  firebase.auth().onAuthStateChanged(function(user){
      if(user){
          console.log(user);
          userinfo = user;
      }
      else{
        window.location.href = "login.html";
      }
  });
}

function logout(){
	firebase.auth().signOut().then(function() {
  		// Sign-out successful.
  		window.location.href = "index.html";
	}).catch(function(error) {
  		// An error happened.
	});
}

function addNewPost(){
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var dbRefRent = firebase.database().ref();
  var files = [];
  var urlfile = [];
  // create a new id key for post
  var newKeyRent = dbRefRent.child('rent').push().key;
  // get data
  var file1 = document.getElementById('img1');
  var file2 = document.getElementById('img2');
  var file3 = document.getElementById('img3');
  var postalcode = document.getElementById('postalcode').value;
  var street = document.getElementById('street').value;
  var city = document.getElementById('city').value;
  var description = document.getElementById('description').value;
  var price = document.getElementById('price').value;
  var title = document.getElementById('title').value;
  files.push(file1);
  files.push(file2);
  files.push(file3);

  if (file1 != null && file2 != null && file3 != null && title != "" && street != "" && city != "" && postalcode != "" && description != "" && price != "") {
  // upload all picture and get url in urlfile[]
  files.forEach(function(myfile){
  var fileUploded = storageRef.child("images/" + myfile.files[0].name).put(myfile.files[0]);
  
  // Listen for state changes, errors, and completion of the upload.
  fileUploded.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
      }
    },function(error){
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;
        }
    },function() {
      // Upload completed successfully, now we can get the download URL
      var downloadURL = fileUploded.snapshot.downloadURL;
      urlfile.push(downloadURL);
      console.log(urlfile);
      dbRefRent.child('posts/' + newKeyRent + '/pictures').set({
        img1: urlfile[0],
        img2: urlfile[1],
        img3: urlfile[2] 
      });
    });
  });
  console.log(userinfo);
  dbRefRent.child('posts/' + newKeyRent).update({
    description: description,
    user: userinfo.displayName,
    iduser: userinfo.uid,
    title: title,
    price: price 
  });
  dbRefRent.child('posts/' + newKeyRent + '/location').update({
    city: city,
    street: street,
    postalcode: postalcode 
  });
  alert('Your advertisement is add now');
  }
  else{
    alert("Some field is empty, thank to fill all field! ");
  }
}

function loadData(){
  //get element
  var display = document.getElementById('containerRent');
  dbRefrent = firebase.database().ref().child('posts');
  var count = Object.keys(dbRefrent).length;
  var a = [];
  dbRefrent.once('value', function(snap){
    var count = Object.keys(snap).length;
    console.log(count);
    snap.forEach(function(childsnap){
      var childkey = childsnap.key;
      var childdata = childsnap.val();
      childdata.idrent = childkey;
      console.log(childdata);
      a.push(childdata);
    });
    a.forEach(function(element){
      display.innerHTML += 
      `<div class="row well">
        <div class="row-justify-content-start">
            <div class="col-sm-6" >
                <a href="ad1.html">
                <img src="`+element.pictures.img1+`" class="img-rounded"> 
                </a>
                <br>
            </div>

            <div class="col-sm-6" >
                <h1>`+ element.title + ` ` + element.price+`€/kk</h1>
                
                <h3>Address:`+element.location.street+`, `+element.location.postalcode+`-`+element.location.city+`, Finland</h3>
                <div class="btn-group btn-group-lg">
                <form method='GET' action="ad1.html">
                  <input type="hidden" name="userRent" value="`+element.idrent+`" id="iduserRent" />
                  <input class="btn btn-primary" type="submit" value="Read More" />
                </form>
                </div>
                <br>
            </div>
        </div>
    </div>`;
    });
  });
}

function loadDataRent(){
  //get element
  var id = window.location.search.split("=");
  var display = document.getElementById('containerInfoRent');
  var idRent = id[1];
  //
  var img1 = document.getElementById('img1');
  var img2 = document.getElementById('img2');
  var img3 = document.getElementById('img3');
  var rentInfo = document.getElementById('rentinfo');

  dbRefrent = firebase.database().ref().child('posts');
  var count = Object.keys(dbRefrent).length;
  var b = [];
  dbRefrent.once('value', function(snap){
    var count = Object.keys(snap).length;
    console.log(count);
    snap.forEach(function(childsnap){
      var childkey = childsnap.key;
      var childdata = childsnap.val();
      if (childkey == idRent) {
        b.push(childdata);
      }
    });
    b.forEach(function(element){
      img1.innerHTML += '<img src="'+element.pictures.img1+'" class="img-rounded" height="350" width="350">';
      img2.innerHTML += '<img src="'+element.pictures.img2+'" class="img-rounded" height="350" width="350">';
      img3.innerHTML += '<img src="'+element.pictures.img3+'" class="img-rounded" height="350" width="350">';
      rentInfo.innerHTML += `<h2>`+ element.title +` `+element.price+`€/kk.</h2>
                
                <p>  
                `+element.description+`
                </p>
                <h5>Address:`+element.location.street+`, `+element.location.postalcode+`-`+element.location.city+`, Finland</h5>
                <br>
                <p>Renter:`+element.user+`<br>
                <h3>Rent: `+element.price+`€/kk</h3>
                <form method="GET" action="contact.html" id="contactform">
                  <input type='submit' class='btn btn-primary' value='contact'>
                  <input type="hidden" name="idrent" value="`+idRent+`" id="idrentcontact" />
                </form>`;

    });
  });
}

function addmessage(){
  // Get variable
  var idrent = window.location.search.split("=")[1];
  var subject = document.getElementById('subject').value;
  var bodyM = document.getElementById('bodyMessage').value;
  
  //ref BDD
  var refRent = firebase.database().ref().child('posts');
  var refMessage = firebase.database().ref();
  var newKeyMessage = refMessage.child('messages').push().key;

  refRent.once('value', function(snap){
    snap.forEach(function(childsnap){
      if (childsnap.key == idrent) {
        idrenter = childsnap.val().iduser;
        //console.log(idrenter);
      }
    });

    refMessage.child('messages/' + newKeyMessage).set({
      subject: subject
    });

    refMessage.child('messages/' + newKeyMessage + '/users').set({
      user1: idrenter,
      user2: userinfo.uid
    });

    refMessage.child('messages/' + newKeyMessage + '/conversation/0').set({
      sender: userinfo.displayName,
      body: bodyM
    });
    alert("Message Send");
    window.location.href = 'message.html';
  });
  //console.log(idrent, subject, bodyM, userinfo.uid);
}


function loadMessage(){
  var display = document.getElementById('displayMessage');
  //get ref database 
  var dbrefMessage = firebase.database().ref().child('messages');
  var conv = [];

  dbrefMessage.once('value', function(snap){
    snap.forEach(function(childsnap){
      if (childsnap.val().users.user1 == userinfo.uid ) {
        console.log('user1')
        var childdata = childsnap.val();
        childdata.idmessage = childsnap.key;
        conv.push(childdata);
      }
      else if (childsnap.val().users.user2 == userinfo.uid) {
        console.log('user2');
        var childdata = childsnap.val();
        childdata.idmessage = childsnap.key;
        conv.push(childdata);
      }
      else{
        display.innerHTML = "<h1>Your are any conversation!</h1>";
      }
    });
    console.log(conv);
    if (typeof conv[0] != 'undefined') {
      display.innerHTML = `<table id="tableConv"><tr><td>Conversation</td></tr></table>`;
      for(i = 0; i < conv.length; i++){
        document.getElementById('tableConv').innerHTML +=
        `<tr><td>`+conv[i].subject+`</td><td>
        <form method="GET" action="conv.html">
          <input type="hidden" name="idmessage" value="`+ conv[i].idmessage +`"/>
          <input type="submit" value="Show Conversation" class="btn btn-primary" />
        </form>
        </td></tr>`;
      }
    }
  });
}

function loadConv(){
  //get element
  var display = document.getElementById('tableConv');
  //get idmessage
  var idmessage = window.location.search.split("=")[1];
  var messages = [];
  console.log(idmessage);
  //ref database
  var dbrefMessage = firebase.database().ref().child('messages');

  dbrefMessage.once('value', function(snap){
    snap.forEach(function(childsnap){
      if (childsnap.key == idmessage) {
        messages.push(childsnap.val().conversation);
      }
    });
    for(i = 0; i < messages[0].length; i++){
      display.innerHTML += `<tr><td>`+ messages[0][i].body +`</td><td>`+ messages[0][i].sender +`</td></tr>`;
    }
  });
}

function sendnewMessage(){
  //get id message
  var idMessage = window.location.search.split("=")[1];
  var body = document.getElementById('body').value;
  console.log(idMessage);
  //ref database
  var dbrefMessage = firebase.database().ref().child('messages/' + idMessage);

  if (body != "") {
  dbrefMessage.once('value', function(snap){
    dbrefMessage.child('conversation/' + snap.val().conversation.length).set({
      body: body,
      sender: userinfo.displayName
    });
    window.location.reload();
  });
  }
  else{
    alert("Your body message is empty!");
  }
}
