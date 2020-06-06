var coll = document.getElementsByClassName("collapsible");

var emotions = {
	happy: '😀',
	sad: '😔',
	angry: '😡',
	neutral: '😐'
};

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

function fillLastRecorded(parts){
	document.getElementById('lastfelt').innerHTML = `${parts[0]}: ${emotions[parts[1]]}`

}

function fillFelt(times){

}


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
	// allData = json.moods;
	let year = Object.keys(json)[Object.keys(json).length - 1];
	let month = Object.keys(json[year])[Object.keys(json[year]).length - 1];
	let day = Object.keys(json[year][month])[Object.keys(json[year][month]).length - 1];
	let times = json[year][month][day];

	let parts = times[times.length - 1].split(',');

	fillLastRecorded(parts);
	fillFelt(times);	
}

getData();