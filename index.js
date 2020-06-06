 const express = require('express'),
			bodyParser = require('body-parser'),
			fs = require('fs'),
			path = require('path'),
			client = require('./db.js'),
			cookieParser = require("cookie-parser");

const app = express();

let users = false;

app.set('views', path.join(__dirname, '/public'));

 app.use(express.json())
	 .use(cookieParser());

app.get('/', (req, res) => {
	if (req.cookies.id) res.redirect('/viewer');
  res.sendFile('index.html', {root : __dirname + '/public/pages'});
});

app.use(express.static(path.join(__dirname , '/public')));

app.get('/viewer', (req, res) => {
	if (req.cookies.id){
  	return res.sendFile('viewer.html', {root : __dirname + '/public/pages'});
	}
	else res.redirect('/');
});

app.get('/dashboard', (req, res) => {
  res.sendFile('dashboard.html', {root : __dirname + '/public/pages'});
});
app.get('/calendar', (req, res) => {
  res.sendFile('calendar.html', {root : __dirname + '/public/pages'});
});
app.get('/information', (req, res) => {
  res.sendFile('information.html', {root : __dirname + '/public/pages'});
});
app.get('/settings', (req, res) => {
  res.sendFile('settings.html', {root : __dirname + '/public/pages'});
});
app.get('/about', (req, res) => {
  res.sendFile('about.html', {root : __dirname + '/public/pages'});
});



app.get('/logout', (req, res) => {
	if (req.cookies.id) res.clearCookie('id');
	res.redirect('/');
});


///////////////////////// POST ROUTES /////////////////////////

app.post('/login', async (req, res) => {
	let id = req.body.id;

	if (!users) users = await client.db('BayHax').collection('Users');

	if (await docExists(id)){
		res.cookie('id', id, {httpOnly: true});
		res.send({success: '/viewer'});
	}
	else res.send({error: "doc not found"});
});

app.post('/get-data', async (req, res) => {
	var id = req.cookies['id'];
	if (!id) return res.send({error: 'no id'});
	if (!users) users = await client.db('BayHax').collection('Users');

	var options = {projection: {}};
	options.projection[req.body.part] = 1;

	var doc = await users.findOne({_id: id}, options);
	if (!doc) return res.send({error: 'invalid id'});

	res.send(doc);
	

});

app.post('/update', (req, res) => {
	let {setting, change} = req.body;
	let date = Date.now();

	res.send(JSON.stringify({message: "Setting Changed"}));
});

app.post('/rpi', (req, res) => {
	let {mood, id} = req.body;
	let date = Date.now();

	res.send({response: "done"});
});

app.listen(3000, () => {
  console.log('server started');
});


async function docExists(id){
	let exists = await users.find({_id: id}).limit(1).count();
	return exists > 0;
}