var coll = document.getElementsByClassName("collapsible");
var i;

var moodData

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
	moodData = json.moods;
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

let data ={
  2020: {
    june: {
      5: ["1:03,happy"],
      6: ["1:54,angry"],
      6: ["13:54,angry"],
    }
  }
}

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
for (entry in data[year][month]){
  time_mood_unsplit = data[year][month][numeric_day][0];
  time_mood_split = time_mood_unsplit.split(",");

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
    labels: [],
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