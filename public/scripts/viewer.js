
window.addEventListener('hashchange', function() {
	changeHash();
}, false);

function changeHash(){
	document.getElementById('main').src = '/' + location.hash.substring(1);

	let elements = document.getElementById('sidebar').getElementsByTagName('a');

	for (let i = 0; i < elements.length; i++){
		elements[i].style = "";
	}

	document.getElementById(location.hash.substring(1)).style = "border-left: 8px solid rgb(156, 116, 250);	background: rgb(240, 240, 240);"
}

if (!location.hash) location.hash = "#dashboard";

changeHash();