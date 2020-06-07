/*const img1 = document.createElement('img');
img1.src = "pages/pic/BayHax.png";
// console.log(img1.src)
document.body.appendChild(img1);
*/

var images = [];
var index = 0;

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
	
	let month = json.moods[2020].june;
	let days = Object.keys(month);
	let day = month[days[days.length-1]];

	for (let time in day){
		let parts = day[time].split(',');
		if (parts.length > 2){
			let image = 'data:image/jpeg;base64, ' + parts[2];
			images.unshift(image);
			// document.getElementById('image').src = image;
		}
	}

	document.getElementById('image').src = images[0];
}

getData();