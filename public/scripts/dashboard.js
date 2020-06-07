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
  happyData = (new Array(24)).fill(0);
  sadData = (new Array(24)).fill(0);
  angryData = (new Array(24)).fill(0);

  //Sum frequencies for each mood per hour
  time_mood_unsplit = moodData[year][month.toLowerCase()][numeric_day];
  //console.log(time_mood_unsplit)
  for (time_index in time_mood_unsplit){
    time_mood_split = time_mood_unsplit[time_index].split(",");
    //console.log(time_mood_split);

    time = time_mood_split[0].split(":");
    hour = parseInt(time[0]);
   

    if (time_mood_split[1] == "angry"){
      current_frequency = angryData[hour] + 1;
      angryData[hour] = current_frequency;
    }
    
    else if (time_mood_split[1] == "happy"){
      current_frequency = happyData[hour] + 1;
      happyData[hour] = current_frequency;
    }

    else if (time_mood_split[1] == "sad"){
      current_frequency = sadData[hour] + 1;
      sadData[hour] = current_frequency;
    }
  }

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  bar_chart_data = new Array(3);
  bar_chart_data[0] = happyData.reduce(reducer);
  bar_chart_data[1] = sadData.reduce(reducer);
  bar_chart_data[2] = angryData.reduce(reducer);
  //console.log(bar_chart_data)

  let barChart1 = document.getElementById('barChart1').getContext('2d');
  new Chart(barChart1, {
    type: 'bar',
    data: {
      labels: ['Happiness', 'Sadness', 'Anger'],
      datasets: [{
        label: 'Mood',
        data: bar_chart_data,
      backgroundColor: ["#f5f242", "#42b0f5", "#f56642"]
      }]
    },
    options:{
      title:{
        display:true,
        text:'Frequency of Emotions Throughout the Day'
      },
      legend: {
        display: false
      },
      scales:{
        yAxes:[{
          ticks:{
            suggestedMin: 0,
            suggestedMax: 24,
            stepSize: 2
          }
        }]
      }
    }
  });

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
      title: {
        display: true,
        text: 'Mood'
      }
    }
  });
}

getData();