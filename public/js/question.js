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
	var subject = localStorage.getItem("choice");
	subject.toLowerCase()


	//Clock pasing time
	var deadline = new Date(Date.parse(new Date()) +  60 * 1000);
	  //var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);

	//initialize clock
  	function clockInit(){
	    initializeClock('clockdiv', deadline);
	}



	//Start Timer function
	function getTimeRemaining(endtime) {
	    var t = Date.parse(endtime) - Date.parse(new Date());
	    var seconds = Math.floor((t / 1000) % 60);
	    var minutes = Math.floor((t / 1000 / 60) % 60);
	    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	    var days = Math.floor(t / (1000 * 60 * 60 * 24));
	    return {
	      'total': t,
	      'days': days,
	      'hours': hours,
	      'minutes': minutes,
	      'seconds': seconds
	    };
	}



	//function to initialize Clock
	function initializeClock(id, endtime) {
	  	var clock = document.getElementById(id);
	  	var daysSpan = clock.querySelector('.days');
	  	var hoursSpan = clock.querySelector('.hours');
	  	var minutesSpan = clock.querySelector('.minutes');
	  	secondsSpan = clock.querySelector('.seconds');

	  	function updateClock() {
	      var t = getTimeRemaining(endtime);

	      daysSpan.innerHTML = t.days;
	      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
	      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
	      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

	      if (t.total <= 0) {
	        getSelected()
	        end.play();
	        clearInterval(timeinterval);
	        
	        calcScore();
	        }
	    }	
	    updateClock();
	    var timeinterval = setInterval(updateClock, 1000);

	    //on clik of next button 
		$("#next").on("click", function(){
			if(pointer !== 9){
				$("#prev").removeClass("hidden");
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
				clearInterval(timeinterval);
				getSelected()
				calcScore();
				clap.play()
			}
		})
	}

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

	//function to retrieve question by type from firebase DB
	firebase.database().ref('/category/').once('value').then(function(snapshot) {
  		var questionsBank = snapshot.val();
  		subject = subject.toLowerCase()
  		console.log(questionsBank[subject].questions);
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
		clockInit()
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
		pathRef.child(subject).update({
			"score": score
		});
		
	}

	//function to display score
	function displayScore(score){
		hideQCS();
		var par = "%"
	    $(".mark").html("You scored: " + score + par);
	}


	function hideQCS(){
		$(".question").hide();
		$("#clockdiv").hide()
		$(".score").removeClass("hidden");
	}



})



