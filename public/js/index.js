var username = "";

var pointer = 0;

var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;

  getUsername(user.displayName);
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

//function to hide form
function hideform(){
	$("#btn-submit").hide()
	$(".select").hide()
}


//get selected subject
$("#btn-submit").click(function(){
	validateSelection();
});


//function validate selected
function validateSelection(){
	var choice = document.getElementById("subject").value
	if (choice === "English") {
		hideform()
		$(".question").removeClass("hidden")
		EnglishQuestions()
	}
	else if(choice === "General") {
		hideform()
		alert(choice)
	}
	else if(choice === "HTML") {
		hideform()
		alert(choice)
	}
	else if(choice === "Maths") {
		hideform()
		alert(choice)
	}
	else if(choice === "Physics") {
		hideform()
		alert(choice)
	}
	else{
		alert("Invalide choice")
	}
}


// Get a reference to the database service
var database = firebase.database();

firebase.database().ref('/category/').once('value').then(function(snapshot) {
  var questionsBank = snapshot.val();
  // ...
  //console.log(questionsBank.Math)
  EnglishQuestions(questionsBank.english)

});



var qBank = [];
var oBankA = [];
var oBankB = [];
var oBankC = [];
var oBankD = [];
var ansBank = [];
var ans;
var score = 0;

var playerAnsBank = [];


function EnglishQuestions(question){
	//console.log(question.questions)
	extractQuestion(question)

}

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
		getSelected()
		storeAns();
		popAnswer(qBank)
		calcScore()
	}
})

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
	for(var i = 0; i < ans.length; i++){
		if (ans[i] == playerAnsBank[i]) {
			score++
		}
	}
	score = (score / 10) * 100;
	console.log(score + "%")
}




