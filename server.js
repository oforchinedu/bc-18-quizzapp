const express = require('express');
const app = express();

const pathName = __dirname + '/public'

app.use(express.static('public'));

app.get('/quiz/english', function(req, res){
	return res.sendFile( pathName + '/english.html');
})

app.get('/quiz/general', function(req, res){
	return res.sendFile( pathName + '/general.html');
})

app.get('/quiz/htm', function(req, res){
	return res.sendFile( pathName + '/htm.html');
})

app.get('/quiz/maths', function(req, res){
	return res.sendFile( pathName + '/maths.html');
})

app.get('/quiz/physics', function(req, res){
	return res.sendFile( pathName + '/physics.html');
})

app.get('/public', function(req, res){
	return res.sendFile( pathName + '/dashboard.html');
})


app.listen(process.env.PORT || 5000, function() {
  console.log('listening on 5000')
})