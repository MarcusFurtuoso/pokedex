
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    return pokemon;
}


// Converte a response para um json
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        // Pedindo pra converter para Json e tendo uma promisse como resposta
        .then((response) => response.json())
        // Recebe o body convertido
        .then((jsonBody) => jsonBody.results)
        // Mapeia a lista de pokemons em uma lista de requisições dos detalhes dos pokemons
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        // Esperar todas as requisições terminarem
        .then((detailRequests) => Promise.all(detailRequests))
        // Lista de detalhes dos pokemons
        .then((pokemonDetails) => pokemonDetails);
}