
window.addEventListener('hashchange', function() {
	changeHash();
}, false);

function changeHash(){
	document.getElementById('main').src = '/' + location.hash.substring(1);

	let elements = document.getElementById('sidebar').getElementsByTagName('a');

	for (let i = 0; i < elements.length; i++){
		elements[i].classList.remove("selected");
	}

	document.getElementById(location.hash.substring(1)).classList.toggle('selected');
}

if (!location.hash) location.hash = "#dashboard";

changeHash();