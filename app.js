function createPokemonCard(pokemon) {
    let elementTypes = pokemon.types.map(element => element.type.name)
    const template = `<li class="card ${pokemon.types[0].type.name}">
        <img class="card-image" alt="${pokemon.name}" src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png">
        <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
        <p class="card-subtitle">${elementTypes.join(' | ')}</p>
    </li>`

    let item = document.createElement('div');
    item.innerHTML = template.trim();

    return item.firstChild;
}

const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;

const generatePokemonPromises = () => Array(150).fill().map((element, index) => 
    fetch(getPokemonUrl(index + 1))
        .then(response => response.json()))

function nextHandler(pageIndex) {
    "use strict";

    return Promise.all(generatePokemonPromises())
        .then(data => {
            let frag = document.createDocumentFragment()

            let itemsPerPage = 6;
            let totalPages = Math.ceil(data.length / itemsPerPage);
            let offset = pageIndex * itemsPerPage;

            for (let i = offset, len = offset + itemsPerPage; i < len; i++) {
                let pokemon = data[i];
        
                let item = createPokemonCard(pokemon);
        
                frag.appendChild(item);
              }
        
              let hasNextPage = pageIndex < totalPages - 1;
        
              return this.append(Array.from(frag.childNodes))
                .then(() => hasNextPage);
        })
}

window.ias = new InfiniteAjaxScroll('.pokedex', {
    item: '.item',
    next: nextHandler,
    pagination: false,
});
