const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const configs = {
  user: 'jodich',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', (req, res) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  const queryString = 'SELECT * from pokemon'

  pool.query(queryString, (err, result) => {

    if (err) {
      console.error('query error:', err.stack);

    } else {

      let pokeAll = { pokemons : result.rows } 
      // result.rows is an array of pokemons

      res.render('Home', pokeAll);
    }
  })
});

app.get('/pokemon/new', (req, res) => {

  res.render('New');

  // when it renders the page new, it will show a form that allows the user to input all the items
  // it is a post request
  // in the post request at the bottom, it INSERT INTO the values of the inputed data, req.body

})

app.get('/pokemon/:id/edit', (req, res) => {

  let id = parseInt(req.params.id);

  let queryString = 'SELECT * FROM pokemon WHERE id = $1';
  const value = [id];

  pool.query(queryString, value, (err, result) => {

    if (result.rows[0] === undefined) {

      res.status(404).send('pokemon does not exist')

    } else {

      let poke = { pokemon: result.rows[0]}

      res.render('Edit', poke)

    }
  })
});


app.get('/pokemon/:id', (req, res) => {

  let id = parseInt(req.params.id);

  let queryString = 'SELECT * FROM pokemon WHERE id = $1';
  const value = [id];

  pool.query(queryString, value, (err, result) => {

    if (result.rows[0] === undefined) {

      res.status(404).send('pokemon does not exist')

    } else {

      let poke = { pokemon: result.rows[0]}

      res.render('Pokemon', poke)

    }
  })
});


app.get('/new', (req, res) => {
  // respond with HTML page with form to create new pokemon
  res.render('New');
});


app.post('/pokemon', (req, res) => {
  let params = req.body;

  const queryString = 'INSERT INTO pokemon(num, name, img, weight, height) VALUES($1, $2, $3, $4, $5)'
  const values = [params.num, params.name, params.img, params.weight, params.height];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      // then can check that if the created pokemon is inside
      res.redirect('/');
    }
  });
});

app.put('/pokemon/:id', (req, res) => {

  let id = parseInt(req.params.id); 

  let data = req.body

  let queryString = "UPDATE pokemon SET num = $1, name = $2, img = $3, weight = $4, height = $5 WHERE id = $6";
  const values = [data.num, data.name, data.img, data.weight, data.height, id];

  pool.query(queryString, values, (err, result) => {

    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);
      res.redirect('/pokemon/' + id);
    }

  })

});

app.delete('/pokemon/:id', (req, res) => {

  let id = parseInt(req.params.id);

  let queryString = "DELETE FROM pokemon WHERE id = $1";
  let values = [id];

  pool.query(queryString, values, (err, result) => {

    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);
      res.redirect('/');
    }

  })

});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
