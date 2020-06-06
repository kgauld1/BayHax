const express = require('express');

const app = express();

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/update', (req, res) => {

});

app.listen(3000, () => {
  console.log('server started');
});