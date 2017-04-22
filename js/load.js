(function (){

//get element
var displayuser = document.getElementById("username");
var menubar = document.getElementById("barmenu");
var logInbtn = document.getElementById("logInBtn");

// Get a reference to the database service
var dbRefObject = firebase.database().ref().child('users');


firebase.auth().onAuthStateChanged(function(user){
  if(user){
    displayuser.innerHTML = user.displayName;
    menubar.innerHTML += "<li><a href='addrent.html'>ADD RENT</a></li>";
    menubar.innerHTML += "<li><a href='#' onclick='logout()'>LOGOUT</a></li>"

    dbRefObject.on('value', snap => {
		  res = snap.val();
    });

    dbRefObject.child(user.uid).set({
    	name: user.displayName,
    	email: user.email
    });
  }
  else{
    menubar.innerHTML += "<li><a href='login.html'>LOGIN</a></li>";
  }
});

}());