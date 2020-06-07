/*const img1 = document.createElement('img');
img1.src = "pages/pic/BayHax.png";
// console.log(img1.src)
document.body.appendChild(img1);
*/

var images = [];
var index = 0;

var emotions = {
	happy: '😀',
	sad: '😔',
	angry: '😡',
	neutral: '😐'
};


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
			let imageId = parts[2];
			let description = "June" + " " + [days[days.length-1]] + ", " + '2020' + " at " + parts[0] + ": " + emotions[parts[1]];
			images.unshift([imageId, description]);
		}
	}

	changeImage(0);
}

async function changeImage(dir){
	if (index + dir >= images.length || index + dir < 0){
		console.log('invalid');
		return;
	}
	index += dir;
	let response2 = await fetch('/image', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({id: images[index][0]})
	})
  let json2 = await response2.json();
	document.getElementById('image').src = json2.image;
	document.getElementById('decription').innerHTML = images[index][1];
}

getData();

function titleCase(str){
	return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1));
}

