
function makeSetting(name, value){
	let div = document.createElement('div');
	div.classList.add('setting');

	let title = document.createElement('p');
	title.innerHTML = titleCase(name);

	div.appendChild(title);

	if (typeof value == "number"){
		let el = document.createElement('input');
		el.type = 'range';
		el.classList.add('slider');
		if (name == 'frequency'){
			el.setAttribute('min', 5);
			el.setAttribute('max', 120);
			el.setAttribute('step', 1);
		}
		else if (name == 'volume'){
			el.setAttribute('min', 0);
			el.setAttribute('max', 100);
			el.setAttribute('step', 1);
		}
		el.value = value;

		title.innerHTML = titleCase(name) + ` (${value})`;

		el.oninput = function() {
			console.log(typeof(this.value));
			title.innerHTML = titleCase(name) + ` (${parseInt(this.value)})`;
		}

		el.onchange = function() {
			fetch('/update', { method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					setting: name,
					change: parseInt(this.value)
				})
			});
		}


		div.appendChild(el);
	}
	else if (typeof value == "boolean"){
		let el = document.createElement('input');
		el.classList.add('check');
		el.type = 'checkbox';
		el.checked = value;
		el.onchange = function() {
			fetch('/update', { method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					setting: name,
					change: this.checked
				})
			});
		}

		div.appendChild(el);
		
		
	}
	else if (typeof value == "string"){
		el.classList.add('str');
		let el = document.createElement('input');
			el.type = 'text';
			el.value = value;
			el.onchange = function() {
			fetch('/update', { method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					setting: name,
					change: this.value
				})
			});
		}
			div.appendChild(el);
	}

	return div;

}

function addSettings(settings){
	for (let key of Object.keys(settings)){
		document.getElementById('settings-items').appendChild(makeSetting(key, settings[key]));
	}
}

async function getData(){
	console.log('getting data');
	var response = await fetch('/get-data', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			part: 'settings'
		})
	});
	var json = await response.json();
	console.log(json);
	return json;
}
getData().then(json => {
	addSettings(json.settings);
});

function titleCase(str){
	return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1));
}