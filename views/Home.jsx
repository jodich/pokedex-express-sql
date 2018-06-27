var React = require("react");

class Home extends React.Component {
  render() {

    const pokemonsList = this.props.pokemons.map ( (pokemon) => {
     
     return (
        <li key={pokemon.id}>
          {pokemon.name}
        </li>
        );

    })

    return (
      <html>
        <head />
        <body>
          <h1>Welcome to Pokedex</h1>
          <ul>
            {pokemonsList}
          </ul>
        </body>
      </html>
    );
  }
}

module.exports = Home;
