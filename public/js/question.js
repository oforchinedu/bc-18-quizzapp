$(document).ready(function(){

	//back Home function
	function backToHome(){
		alert()
	}

	// on click on image
	$("img").on("click", function(){
		window.location.href = "/dashboard.html"
	})

	var qBank = [];
	var oBankA = [];
	var oBankB = [];
	var oBankC = [];
	var oBankD = [];
	var ansBank = [];
	var ans;
	var score = 0;

	var pointer = 0;

	var playerAnsBank = [];
	// Get a reference to the database service

	// Get a reference to the database service
	var database = firebase.database();
	var username = localStorage.getItem("username")
	var subject = localStorage.getItem("choice").toLowerCase();

	//Signout function
	$("#btn-signout").on("click", function(){
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
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

	//function to retrieve question by type from firebase DB
	firebase.database().ref('/category/').once('value').then(function(snapshot) {
  		var questionsBank = snapshot.val();
  		//console.log(questionsBank[subject].questions);
  		extractQuestion(questionsBank[subject].questions)
	});

	//function to extract questions 
	function extractQuestion(question){
		for(var key in question){
			qBank.push(question[key].question)
			oBankA.push(question[key].options.a)
			oBankB.push(question[key].options.b)
			oBankC.push(question[key].options.c)
			oBankD.push(question[key].options.d)
			ansBank.push(question[key].ans)	
		}
		populateQuestion(qBank, oBankA, oBankB,oBankC, oBankD, ansBank)
		//popAnswer(qBank)
	}

	//function to populate html
	function populateQuestion(qBank,oBankA,oBankB,oBankC,oBankD,ansBank){
	document.getElementById("qp").innerHTML = qBank[pointer];
	document.getElementById("optionA").innerHTML = "A: " + " " + oBankA[pointer];
	document.getElementById("optionB").innerHTML = "B: " + " " + oBankB[pointer];
	document.getElementById("optionC").innerHTML = "C: " + " " + oBankC[pointer];
	document.getElementById("optionD").innerHTML = "D: " + " " + oBankD[pointer];	
	}

	//on clik of next button 
	$("#next").on("click", function(){
		if(pointer !== 9){
			if(document.getElementById('radio1').checked || document.getElementById('radio2').checked || document.getElementById('radio3').checked || document.getElementById('radio4').checked){
				getSelected()
				pointer++
				populateQuestion(qBank,oBankA,oBankB,oBankC,oBankD,ansBank);
			}
			else{
				alert("choose an option");
			}
		}
		else{
			getSelected()
			calcScore();
			clap.play()
		}
	})

	//function to get getSelected
	function getSelected(){
		$(".modal-body input[type=radio]").each(function(){
		    if (this.checked){
		        playerAnsBank.push(this.value);
		        this.checked = false;
		    }
		});

	}


	//function for previous button
	$("#prev").on("click", function(){
	    if(pointer == 0){
	      alert("this is first question: ");
	    }
	    else{
	      pointer--;
	      populateQuestion(qBank,oBankA,oBankB,oBankC,oBankD,ansBank);
	      playerAnsBank.pop();
	    }
	})

	
	/*
	$("#btn-quiz").on("click", function(){
		window.location.href = "/?topic=" + subject;
	})
	*/

	//function to calculate Score
	function calcScore(){
		for(var i = 0; i < ansBank.length; i++){
			if(ansBank[i] == playerAnsBank[i]){
				score++
			}
		}
		score = (score / 10) * 100
		updateDB(score, subject);
		displayScore(score);
	}


	var database = firebase.database();

	var path = firebase.database().ref('/users/');

	function updateDB(){
		let pathRef = firebase.database().ref('/users/' + username)
		pathRef.child(subject).set({
			"score": score
		});
		
	}

	//function to display score
	function displayScore(score){
		hideThings();
		var par = "%"
	    $(".mark").html("You scored: " + score + par);
	}


	function hideThings(){
		$(".question").hide();
		$("#clockdiv").hide()
		$(".score").removeClass("hidden");
	}

})



