var username;

var pointer = 0;

var choice

var provider = new firebase.auth.GoogleAuthProvider();

var user;

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  setPicture(user.photoURL)
  getUsername(user.displayName);
  username = user.displayName
  writeUserData(user.ea,user.displayName, user.email, user.photoURL);
  
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




//User name
function getUsername(name){
	document.getElementById("namex").innerHTML = "Welcome" + " " + name;
}

function setPicture(picture){
	document.getElementById("myImg").src = picture;
}




firebase.database().ref('/category/').once('value').then(function(snapshot) {
  var questionsBank = snapshot.val();


  // ...
  //console.log(questionsBank.Math)
  //console.log(questionsBank.general)

  //function validate selected
	function validateSelection(){
		choice = document.getElementById("subject").value
		if (choice === "English") {
			hideform();
			$(".question").removeClass("hidden");
			englishQuestions(questionsBank.english);
			subject = "English"
			clockInit()
		}
		else if(choice === "General") {
			hideform();
			$(".question").removeClass("hidden");
			generalQuestions(questionsBank.general);
			clockInit()
			subject = "General"
		}
		else if(choice === "HTML") {
			hideform()
			$(".question").removeClass("hidden")
			htmlQuestions(questionsBank.html);
			console.log(questionsBank.html);
			clockInit()
			subject = "HTML"
		}
		else if(choice === "Maths") {
			hideform()
			$(".question").removeClass("hidden")
			mathQuestions(questionsBank.maths);
			clockInit()
			subject = "Mathematics"
		}
		else if(choice === "Physics") {
			hideform();
			$(".question").removeClass("hidden")
			physicsQuestions(questionsBank.physics)
			clockInit()
			subject = "Physics"
		}
		else if(choice === "Dashboard"){
			retriveDashBoard();
		}

		else{
			alert("Invalide choice");
		}
	}

	//function to hide form
	function hideform(){
		$("#btn-submit").hide()
		$(".select").hide()
	}


	//get selected subject
	$("#btn-submit").click(function(){
		validateSelection();
	});
});


//function back to home
function backToHome(){
	$("#btn-submit").show()
	$(".select").show()
	$(".dash").hide()
	$("#clockdiv").show()
}

//function to retrive scores
function retriveDashBoard(){
	$("#btn-submit").hide()
	$(".select").hide()
	$("#clockdiv").hide()
	$(".dash").removeClass("hidden")
	var english, general, html, maths, physics;
	firebase.database().ref('/users/' + username).once('value').then(function(snapshot){
		var userDetails = snapshot.val();
		console.log(userDetails)
		document.getElementById("eng").innerHTML = userDetails.English.score;
		document.getElementById("gen").innerHTML = userDetails.General.score;
		document.getElementById("ht").innerHTML = userDetails.HTML.score;
		document.getElementById("maths").innerHTML = userDetails.Mathematics.score;
		document.getElementById("phy").innerHTML = userDetails.Physics.score;
	})
}



// Get a reference to the database service
var database = firebase.database();

var path = firebase.database().ref('/users/');

function updateDB(score, subject){
	let pathRef = firebase.database().ref('/users/' + username)

	console.log(path)
	pathRef.child(subject).set({
		"score": score

	});
}


//Clock pasing time
var deadline = new Date(Date.parse(new Date()) +   30 * 1000);
//var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);

//initialize clock
function clockInit(){
    initializeClock('clockdiv', deadline);
}


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
        getSelection();
        end.play();
        clearInterval(timeinterval);
        calcScore();
      }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
    
    // secondsSpan.innerHTML
     //On click of next Button
  	$("#next").on("click", function(){
		if(pointer !== 9){
			if(document.getElementById('radio1').checked || document.getElementById('radio2').checked || document.getElementById('radio3').checked || document.getElementById('radio4').checked){
				getSelected()
				pointer++
				populateQuestion(qBank,oBankA,oBankB,oBankC,oBankD,ansBank);
				popAnswer(qBank)
			}
			else{
				alert("choose an option")
			}
		}
		else{
			clearInterval(timeinterval);
			getSelected()
			storeAns();
			popAnswer(qBank)
			calcScore()
			clap.play()

		}
	})
    
}



function englishQuestions(question){
	extractQuestion(question);

}

function generalQuestions(question){
	extractQuestion(question);
}

function htmlQuestions(question){
	extractQuestion(question);
}

function mathQuestions(question){
	extractQuestion(question);
}

function physicsQuestions(question){
	extractQuestion(question);
}

var qBank = [];
var oBankA = [];
var oBankB = [];
var oBankC = [];
var oBankD = [];
var ansBank = [];
var ans;
var score = 0;
var subject = "english"

var playerAnsBank = [];




function extractQuestion(question){

	for(var key in question){
		for(var key2 in question[key]){
			//console.log(question[key][key2].question)
			qBank.push(question[key][key2].question)
			oBankA.push(question[key][key2].options.a)
			oBankB.push(question[key][key2].options.b)
			oBankC.push(question[key][key2].options.c)
			oBankD.push(question[key][key2].options.d)
			ansBank.push(question[key][key2].ans)
		}
	}
	populateQuestion(qBank, oBankA, oBankB,oBankC, oBankD, ansBank)
	popAnswer(qBank)

}

function populateQuestion(qBank,oBankA,oBankB,oBankC,oBankD,ansBank){
	//console.log(ansBank)
	document.getElementById("qp").innerHTML = qBank[pointer];
	document.getElementById("optionA").innerHTML = "A: " + " " + oBankA[pointer];
	document.getElementById("optionB").innerHTML = "B: " + " " + oBankB[pointer];
	document.getElementById("optionC").innerHTML = "C: " + " " + oBankC[pointer];
	document.getElementById("optionD").innerHTML = "D: " + " " + oBankD[pointer];
	
}

function popAnswer(qBank){
	storeAns(ansBank)
}



$("#prev").on("click", function(){
    if(pointer == 0){
      alert("this is first question: ")
    }
    else{
      pointer--
      populateQuestion(qBank,oBankA,oBankB,oBankC,oBankD,ansBank);
      playerAnsBank.pop();

    }
 })

function getSelected(ansBank){
	$(".modal-body input[type=radio]").each(function(){
	    if (this.checked){
	        playerAnsBank.push(this.value);
	        this.checked = false;
	    }
	});
}

function storeAns(ansBank){
	ans = ansBank
	console.log("answers:" + "" + ans)
}

function calcScore(){
	$(".question").hide();
	$("#clockdiv").hide()
	$(".score").removeClass("hidden");
	for(var i = 0; i < ans.length; i++){
		if (ans[i] == playerAnsBank[i]) {
			score++
		}
	}
	score = (score / 10) * 100;
	updateDB(score, subject);

	displayScore(score);
}

function displayScore(score){
	var par = "%"
    $(".mark").html("You scored: " + score + par);
}

/*



writeUserData()
// Get a reference to the database service
var database = firebase.database();

function writeUserData(userId, name, email, imageUrl) {
	userId = username
  firebase.database().ref('users/' + userId).set({
  	name: username,
    email: email,
    profile_picture : imageUrl,
    
  });

  console.log(userId)
}


*/



