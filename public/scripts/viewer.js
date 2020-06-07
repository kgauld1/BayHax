
window.addEventListener('hashchange', function() {
	changeHash();
}, false);

function changeHash(){
	document.getElementById('main').src = '/' + location.hash.substring(1);

	let elements = document.getElementById('sidebar').getElementsByTagName('a');

	for (let i = 0; i < elements.length; i++){
		// elements[i].style = "";
		elements[i].classList.remove("selected");
	}

	document.getElementById(location.hash.substring(1)).classList.toggle('selected');
}

if (!location.hash) location.hash = "#dashboard";

changeHash();


fetch('/get-data', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		part: `name`
	})
})
.then(response => response.json())
.then(json => {
	document.getElementById('username').innerHTML = json.name;
})

	
