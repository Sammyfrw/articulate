//Module definitions
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const app = express();

//Handlebar engine setup
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Static resources
app.use(express.static(__dirname + '/public'));

//Bodyparser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Connecting the server to routes
var routes = require('./routes/index');
app.use('/', routes);

app.use((req, res) => {
  res.status(404)
  res.render('404');
});

//Localhost connection
app.listen(3000, () => {
  console.log('Listening at localhost:3000');
});
