$(document).ready(function(){
	var provider = new firebase.auth.GoogleAuthProvider();

	var user;

	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  var profile_picture = user.photoURL;
	  var email = user.email;

	  console.log(user)
	  setPicture(user.photoURL)
	  getUsername(user.displayName);
	  username = user.displayName
	  localStorage.setItem("username", username);
	  updateDB();
	  
	  var path = firebase.database().ref('/users/');

	function updateDB(){
		let pathRef = firebase.database().ref('/users/' + username)
		pathRef.update({
			"username": username,
			"profile_picture": profile_picture,
			"email": email

		});
		
	}
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});
	

	$("#btn-signout").on("click", function(){
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  window.location.href = "/index.html"
		}, function(error) {
		  // An error happened.
		});
	})
		
	
	//User name
	function getUsername(name){
		document.getElementById("namex").innerHTML = "Welcome" + " " + username;
	}

	function setPicture(picture){
		document.getElementById("myImg").src = picture;
	}
	//On click of the submit button
	$("#btn-submit").on("click", function(){
		validateSelection()
	})
	//function to validate USer Choice
	function validateSelection(){
		choice = document.getElementById("subject").value
		var subjects = ["English","General","HTML","Maths","Physics"]
		if (subjects.indexOf(choice) !== -1){
			window.location.href = "/quiz?topic=" + choice
			localStorage.setItem("choice", choice);
		}
		else{
			alert("Invalide choice");
		}
	}
	//set username
	//User name
	function getUsername(name){
		document.getElementById("namex").innerHTML = "Welcome" + " " + name;
	}

	// on click on image
	$("img").on("click", function(){
		window.location.href = "/dashboard.html"
	})

})


