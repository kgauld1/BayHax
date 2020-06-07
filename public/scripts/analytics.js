var coll = document.getElementsByClassName("collapsible");
var i;

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
	var moodData = json.moods;

  //console.log(moodData);

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
	
  for (time_index in time_mood_unsplit){
    time_mood_split = time_mood_unsplit[time_index].split(",");

    time = time_mood_split[0].split(":");
    hour = parseInt(time[0]);
   
    if (time_mood_split[1] == "angry") angryData[hour]++;
    else if (time_mood_split[1] == "happy") happyData[hour]++;
    else if (time_mood_split[1] == "sad") sadData[hour]++;
  }

	makeLineGraph('happyLineGraph', "Your Child's Happiness Throughout the Day", ['Happiness'], [happyData], ['#f5f242']);

	makeLineGraph('sadLineGraph', "Your Child's Sadness Throughout the Day", ['Sadness'], [sadData], ['#42b0f5']);

	makeLineGraph('angryLineGraph', "Your Child's Anger Throughout the Day", ['Anger'], [angryData], ['#f56642']);

	makeLineGraph('allLineGraph', "Your Child's Emotions Throughout the Day", ['Sadness', 'Happiness', 'Anger'], [sadData, happyData, angryData], ['#42b0f5', '#f5f242', '#f56642'], true);

  mostCommonEmotion = [];

  for (index=0; index<24; index++){
    happy_value = happyData[index];
    sad_value = sadData[index];
    anger_value = angryData[index];
    
    if (happy_value > sad_value && happy_value > anger_value){
      mostCommonEmotion.push([index+":00", '😀']);
    }

    else if (sad_value > happy_value && sad_value > anger_value){
      mostCommonEmotion.push([index+":00", '😔']);
    }

    else if (anger_value > sad_value && anger_value > happy_value){
      mostCommonEmotion.push([index+":00", '😡']);
    }

    else if (happy_value == sad_value && happy_value != anger_value){
      mostCommonEmotion.push([index+":00", '😀 😔']);
    }

    else if (happy_value == anger_value && happy_value != sad_value){
      mostCommonEmotion.push([index+":00", '😀 😡']);
    }

    else if (sad_value == anger_value && sad_value != happy_value){
      mostCommonEmotion.push([index+":00", '😔 😡']);
    }

    else if (happy_value == 0 && happy_value == 0 && happy_value == 0){
      mostCommonEmotion.push([index+":00", '😐']);
    }

    else if (happy_value == sad_value && happy_value == anger_value){
      mostCommonEmotion.push([index+":00", '😀 😔 😡']);
    }
  }
  
  //console.log(mostCommonEmotion);
 fillTable(mostCommonEmotion);
}

function fillTable(data){
	let table = document.getElementById('table');
	table.innerHTML = ""
	for (let pair of data){
		table.innerHTML +=  `<tr>
			<td>${pair[0]}</td> <br>
			<td>${pair[1]}</td>
		</tr>`;
	}
}

function makeLineGraph(id, title, labels, datas, colors, showLegend){
	if (!showLegend) showLegend = false;

	let graph = document.getElementById(id).getContext('2d');

	let chart = {
		type: 'line',
		data: {
			labels: ["12:00 am", "1:00 am", "2:00 am", "3:00 am", "4:00 am", "5:00 am", "6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm", "7:00 pm", "8:00 pm", "9:00 pm", "10:00 pm", "11:00 pm"],
			datasets: []
		},
		options: {
			title: {
				display: true,
				text: title
			},
			legend: {
        display: showLegend
      },
			scales: {
        yAxes: [{
          ticks: {
						suggestedMin: 0,
						suggestedMax: 2,
						stepSize: 1
					}
        }]
      }
		}
	}

	for (let i = 0; i < datas.length; i++){
		dataset = {
			label: labels[i],
			fill: false,
			borderColor: colors[i],
			data: datas[i]		
		};
		chart.data.datasets.push(dataset);
	}

	new Chart(graph, chart);

	


}

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

getData();