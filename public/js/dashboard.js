$(document).ready(function(){

	// on click on image
	$("img").on("click", function(){
		window.location.href = "/dashboard.html"
	})

	// Get a reference to the database service
	var database = firebase.database();

	//reference to local storage
	var username = localStorage.getItem("username")
	var subject = localStorage.getItem("choice").toLowerCase();

	//Signout function
	$("#btn-signout").on("click", function(){
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  window.location.href = "/logout.html"
		}, function(error) {
		  // An error happened.
		});
	})

	//function to retrieve User details
	firebase.database().ref('/users/' + username).once('value').then(function(snapshot){
		var userDetails = snapshot.val();
		getUsername(userDetails.name);
		setPicture(userDetails.profile_picture)
	})

	//function to set username
	function getUsername(name){
		document.getElementById("namex").innerHTML = "Welcome" + " " + username;
	}

	//function to set picture
	function setPicture(picture){
		document.getElementById("myImg").src = picture;
	}

	
	retriveDashBoard()
	

	

	var database = firebase.database();

	var path = firebase.database().ref('/users/');

	function backToHome(){
		window.location.href = "/dashboard.html"
	}

	retriveDashBoard()
	//function to retrive scores
	function retriveDashBoard(){
		var english, general, html, maths, physics;
		firebase.database().ref('/users/' + username).once('value').then(function(snapshot){
			var userDetails = snapshot.val();
			if(userDetails.english !== undefined){
				document.getElementById("eng").innerHTML = userDetails.english.score;
			}
			if(userDetails.general !== undefined){
				document.getElementById("gen").innerHTML = userDetails.general.score;
			}
			if(userDetails.html !== undefined){
				document.getElementById("ht").innerHTML = userDetails.html.score;
			}
			if(userDetails.maths !== undefined){
				document.getElementById("maths").innerHTML = userDetails.maths.score;
			}
			if(userDetails.physics !== undefined){
				document.getElementById("phy").innerHTML = userDetails.physics.score;
			}
		})
	}

})



