var buttons = document.getElementById('top-bar').getElementsByTagName('span');
var year = 2020;
var month = "june";

var allData;

var emotions = {
	happy: '😀',
	sad: '😔',
	angry: '😡',
	neutral: '😐'
}

function changeType(part){
	for (let i = 0; i < buttons.length; i++){
		if (buttons[i].id == part + '-toggle'){
			buttons[i].style = "color: white; background: rgb(156, 116, 250)";
		}
		else buttons[i].style = "";
	}
	document.getElementById('cards').innerHTML = "";
	if (part == 'day') dayCalendar();
	else if (part == 'week') weekCalendar();
	else if (part == 'month') monthCalendar();
	else if (part == 'year') yearCalendar();
}
getData();

async function getData(){
	var response = await fetch('/get-data', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			part: `moods`
		})
	});

	var json = await response.json();
	console.log(json);
	allData = json.moods;

	dayCalendar();
}

function makeDayCard(title, moods){
	let card = document.createElement('div');
	card.classList.toggle('card');

	let h2 = document.createElement('h2');
	h2.innerHTML = title;
	card.appendChild(h2);

	for (let mood of moods){
		let div = document.createElement('div');
		let parts = mood.split(',');
		div.innerHTML = `${parts[0]}: ${emotions[parts[1]]}`;
		card.appendChild(div);
	}

	return card;
}

function makeMonthCard(title, moods){
	let card = document.createElement('div');
	card.classList.toggle('card');

	let h2 = document.createElement('h2');
	h2.innerHTML = title;
	card.appendChild(h2);

	let icons = document.createElement('p');
	let felt = {};

	for (let mood of moods){
		let parts = mood.split(',');
		if (!(parts[1] in felt)){
			felt[parts[1]] = 1;
		}
		else felt[parts[1]] += 1;
	}
	for (let key of Object.keys(felt)){
		icons.innerHTML += `${emotions[key]}: ${felt[key]}<br>`;
	}
	icons.innerHTML = icons.innerHTML.substring(0, icons.innerHTML.length-4);
	card.appendChild(icons);

	return card;
}

function dayCalendar(){
	let monthRecords = allData[year][month];
	let keys = Object.keys(monthRecords);
	let dayRecord = monthRecords[keys[keys.length-1]];

	let card = makeDayCard(titleCase(month) + " " + keys[keys.length-1] + ", " + year, Object.values(dayRecord));

	card.style.width = '30%';

	document.getElementById('cards').appendChild(card);
}

async function weekCalendar(){
	let monthRecords = allData[year][month];
	let keys = Object.keys(monthRecords);
	if (keys.length > 7){
		keys.splice(keys.length-7);
	}

	let weekTitle =`Week of ${titleCase(month)} ${keys[0]} to ${titleCase(month)} ${keys[keys.length - 1]}`;
	document.getElementById('cards').innerHTML += `<h2>Last Seven Days</h2>`;

	for (let day of Object.keys(monthRecords)){
		let card = makeDayCard(month + ' ' + day, Object.values(monthRecords[day]));
		document.getElementById('cards').appendChild(card);
	}

}

async function monthCalendar(){
	let monthRecords = allData[year][month];
	let keys = Object.keys(monthRecords);
	let monthTitle =`Month of ${titleCase(month)}`;
	document.getElementById('cards').innerHTML += `<h2>${monthTitle}</h2>`;

	for (let day of Object.keys(monthRecords)){
		let card = makeMonthCard(month + ' ' + day, Object.values(monthRecords[day]));
		document.getElementById('cards').appendChild(card);
	}
}

async function yearCalendar(){
	let years = Object.keys(allData);
	let html = "";
	for (year of years) {

	}
}

function titleCase(str){
	return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1));
}