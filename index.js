 const express = require('express'),
			bodyParser = require('body-parser'),
			fs = require('fs'),
			path = require('path'),
			client = require('./db.js'),
			cookieParser = require("cookie-parser");

const app = express();

let users = false;

app.set('views', path.join(__dirname, '/public'));

 app.use(bodyParser.json({limit: '10mb', extended: true}))
	 .use(cookieParser());

app.get('/', (req, res) => {
	if (req.cookies.id) res.redirect('/viewer');
  else res.sendFile('index.html', {root : __dirname + '/public/pages'});
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
app.get('/analytics', (req, res) => {
  res.sendFile('analytics.html', {root : __dirname + '/public/pages'});
});
app.get('/settings', (req, res) => {
  res.sendFile('settings.html', {root : __dirname + '/public/pages'});
});
app.get('/about', (req, res) => {
  res.sendFile('about.html', {root : __dirname + '/public/pages'});
});
app.get('/monitor', (req, res) => {
  res.sendFile('monitor.html', {root : __dirname + '/public/pages'});
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
		console.log('success', id);
		res.cookie('id', id, {httpOnly: true});
		res.send({success: '/viewer'});
	}
	else{
		console.log('error', id);
		res.send({error: "doc not found"})
	};
});

app.post('/image', async (req, res) => {
	let id = req.cookies.id;
	let imageId = req.body.id;

	if (!users) users = await client.db('BayHax').collection('Users');

	if (await docExists(id)){

		let query = {};
		query['images.' + imageId] = 1;
		
		let doc = db.test.findOne({_id: id}, query);
		console.log(Object.keys(doc));
		res.send({image: doc[imageId]});
	}
	else{
		console.log('error', id);
		res.send({error: "doc not found"})
	};
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
	let id = req.cookies.id;

	res.send(JSON.stringify({message: "received"}));

	if (!id) return;

	let update = {$set: {}};
	update['$set']['settings.' + setting] = change;

	users.updateOne({_id: id}, update);

	
});

app.post('/rpi', async (req, res) => {
	try{
		let {mood, picture, id, date, time} = req.body;

		if (!docExists(id)) return res.send({error: "user does not exist"});

		console.log(id, mood);
		
		var options = {projection: {}};
		options.projection[req.body.part] = 1;
		var doc = await users.findOne({_id: id});

		console.log(typeof doc.settings)
		
		res.send(doc.settings);

		// alter db
		if (mood){
			let months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

			let dateparts = date.split('/');
			let year = parseInt(dateparts[0]);
			let month = months[parseInt(dateparts[1])-1];
			let day = parseInt(dateparts[2]);

			let path = 'moods.' + year + '.' + month + '.' + day;

			let entry = time + ',' + mood;

			console.log(path, entry);
			if (picture){
				let newId = Math.floor(Math.random()*Math.pow(10, 15));
				entry += ',' + id;

				let image = 'data:image/jpeg;base64, ' + picture;

				let up = {$set: {}};
				up['$set']['images.' + newId] = image;
				users.updateOne({_id: id}, up);
			}

			let update = {$push: {}};
			update['$push'][path] = {};
			update['$push'][path]['$each'] = [entry];

			users.updateOne({_id: id}, update);

		}
	}
	catch(e){
		console.log(e);
		res.send({error: "server crashed"});
	}
});

app.listen(3000, () => {
  console.log('server started');
});


async function docExists(id){
	let exists = await users.find({_id: id}).limit(1).count();
	return exists > 0;
}