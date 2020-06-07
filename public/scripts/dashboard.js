var coll = document.getElementsByClassName("collapsible");
var moodData = {};

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
	document.getElementById('lastfelt').innerHTML = `${emotions[parts[1]]} at ${parts[0]}`;
}

function fillFelt(times){
  //console.log(times)
	let felt = new Set();
	for (let t of times) {
		let parts = t.split(',');
		felt.add(parts[1]);
	};

	let emojis = '';

	felt.forEach(e => {
		emojis += emotions[e];
	});
	
	document.getElementById('allfelt').innerHTML = emojis;
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

	var json = (await response.json()).moods;
	var moodData = json;
	let year = Object.keys(json)[Object.keys(json).length - 1];
	let month = Object.keys(json[year])[Object.keys(json[year]).length - 1];
	let day = Object.keys(json[year][month])[Object.keys(json[year][month]).length - 1];
	let times = json[year][month][day];

	let parts = times[times.length - 1].split(',');

	fillLastRecorded(parts);
	fillFelt(times);

  //Get current date
  currentDate = new Date();
  year = currentDate.getFullYear();
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  month = monthNames[currentDate.getMonth()];
  numeric_day = currentDate.getDate();

  //Create empty arrays for happy, sad, and angry frequencies per hour
	let numHappy = 0, numSad = 0, numAngry = 0, total = 0;

  //Sum frequencies for each mood per hour
  time_mood_unsplit = moodData[year][month.toLowerCase()][numeric_day];
  //console.log(time_mood_unsplit)
  for (time_index in time_mood_unsplit){
    time_mood_split = time_mood_unsplit[time_index].split(",");

		if (time_mood_split[1] == "angry") numAngry++;
    else if (time_mood_split[1] == "happy") numHappy++;
    else if (time_mood_split[1] == "sad") numSad++;
		total++;
  }

  bar_chart_data = [numHappy, numSad, numAngry];

	let maxVal = Math.max(...bar_chart_data);
  
  max_emotion_value = bar_chart_data.indexOf(maxVal);
  if (max_emotion_value == -1){
    document.getElementById('mostfelt').innerHTML = emotions["neutral"];
  }
  else{
    list_of_emotions = ["happy", "sad", "angry"];
    document.getElementById('mostfelt').innerHTML = emotions[list_of_emotions[max_emotion_value]] + "(" + Math.round(100*maxVal/total) + "%)";
	}

  let pieChart1 = document.getElementById('pieChart1').getContext('2d');
  pieChart1.canvas.height = 150;
  new Chart(pieChart1, {
    type: 'pie',
    data: {
      labels: ['Happy','Sad', 'Angry'],
      datasets: [{
        data: bar_chart_data,
        backgroundColor: ["#f5f242", "#42b0f5", "#f56642"]
      }]
    },
    options: {
			// responsive: true,
    	// maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Mood'
      },
			legend: {
				labels: {
					defaultFontFamily: "Comfortaa",
					defaultFontSize: 24
				}
      }
			
    }
  });
}

getData();