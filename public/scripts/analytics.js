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

let barChart1 = document.getElementById('barChart1').getContext('2d');
new Chart(barChart1, {
  type: 'bar',
  data: {
    labels: ['Happiness', 'Sadness', 'Anger'],
    datasets: [{
      label: 'Mood',
      data: [1, 2, 10],
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
      data: [0, 1, 2]
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
      data: [0, 1, 2]
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
      data: [{
        x: new Date("13:00"),
        y: 2
      }]
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
      data: [3, 1, 2],
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