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
  //console.log(time_mood_unsplit)
  for (time_index in time_mood_unsplit){
    time_mood_split = time_mood_unsplit[time_index].split(",");
    //console.log(time_mood_split);

    time = time_mood_split[0].split(":");
    hour = parseInt(time[0]);
   

    if (time_mood_split[1] == "angry"){
      current_frequency = angryData[hour] + 1;
      angryData[hour] = current_frequency;
      //console.log(angryData);
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

  let happyLineGraph = document.getElementById('happyLineGraph').getContext('2d');
  //happyLineGraph.canvas.width = 30;
  //happyLineGraph.canvas.height = 30;
  new Chart(happyLineGraph, {
    type: 'line',
    data: {
      labels: ["12:00 am", "1:00 am", "2:00 am", "3:00 am", "4:00 am", "5:00 am", "6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm", "7:00 pm", "8:00 pm", "9:00 pm", "10:00 pm", "11:00 pm"],
      datasets: [{
        label: 'Happiness',
        fill: "false",
        borderColor: "#f5f242",
        data: happyData
      }]
    },
    options: {
      title: {
        display: true,
        text: "Your Child's Happiness Throughout the Day"
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            suggestedMax: 10,
            stepSize: 1
          }
        }]
      }
    }
  });

  let sadLineGraph = document.getElementById('sadLineGraph').getContext('2d');
  new Chart(sadLineGraph, {
    type: 'line',
    data: {
      labels: ["12:00 am", "1:00 am", "2:00 am", "3:00 am", "4:00 am", "5:00 am", "6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm", "7:00 pm", "8:00 pm", "9:00 pm", "10:00 pm", "11:00 pm"],
      datasets: [{
        label: 'Sadness',
        fill: "false",
        borderColor: "#42b0f5",
        data: sadData
      }]
    },
    options: {
      title: {
        display: true,
        text: "Your Child's Sadness Throughout the Day"
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            suggestedMax: 10,
            stepSize: 1
          }
        }]
      }
    }
  });

  let angryLineGraph = document.getElementById('angryLineGraph').getContext('2d');
  new Chart(angryLineGraph, {
    type: 'line',
    data: {
      labels: ["12:00 am", "1:00 am", "2:00 am", "3:00 am", "4:00 am", "5:00 am", "6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm", "7:00 pm", "8:00 pm", "9:00 pm", "10:00 pm", "11:00 pm"],
      datasets: [{
        label: 'Anger',
        fill: "false",
        borderColor: "#f56642",
        data: angryData
      }]
    },
    options: {
      title: {
        display: true,
        text: "Your Child's Anger Throughout the Day"
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            suggestedMax: 10,
            stepSize: 1
          }
        }]
      }
    }
  });

  mostCommonEmotion = [];
  for (index=0; index<24; index++){
    happy_value = happyData[index];
    sad_value = happyData[index];
    anger_value = angryData[index];
    
    if (happy_value > sad_value & happy_value > anger_value){
      mostCommonEmotion.push("&#128512;");
    }

    else if (sad_value > happy_value & sad_value > anger_value){
      mostCommonEmotion.push("&#128532;");
    }

    else if (anger_value > sad_value & anger_value > happy_value){
      mostCommonEmotion.push("&#128545;");
    }

    else if (happy_value == sad_value & happy_value != anger_value){
      mostCommonEmotion.push("&#128512; &#128532;");
    }

    else if (happy_value == anger_value & happy_value != sad_value){
      mostCommonEmotion.push("&#128512; &#128545;");
    }

    else if (sad_value == anger_value & sad_value != happy_value){
      mostCommonEmotion.push("&#128532; &#128545;");
    }

    else if (happy_value == sad_value & happy_value == anger_value & happy_value ==0){
      mostCommonEmotion.push("&#128528;");
    }

    else if (happy_value == sad_value & happy_value == anger_value){
      mostCommonEmotion.push("&#128512; &#128532; &#128545;");
    }
  }

  console.log(mostCommonEmotion)
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