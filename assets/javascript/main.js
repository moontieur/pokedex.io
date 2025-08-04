
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 12;
let offset = 0;

function convertPokemonToLi(pokemon) {
    const dataJson = encodeURIComponent(JSON.stringify(pokemon));

    return `
        <li class="pokemon ${pokemon.type}" data-pokemon='${dataJson}'>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function convertPokemonToModal(pokemon) {
    const typesHtml = pokemon.types.map(type =>
        `<li class="type ${type}">${type}</li>`
    ).join('');

    const statsHtml = pokemon.stats.map(stat =>
        `<li><span>${stat.name.toUpperCase()}</span><span>${stat.base}</span></li>`
    ).join('');

    const modalClass = pokemon.type;

    return `
        <div id="pokemonModal" class="modal">
            <div id="modalContent" class="modal-content ${modalClass}">
                <span class="close">&times;</span>
                <h2>${pokemon.name}</h2>
                <p><strong>Número:</strong> ${pokemon.number}</p>
                <p><strong>Tipo(s):</strong></p>
                <ol class="types">${typesHtml}</ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}" />
                <p><strong>Stats:</strong></p>
                <ul class="stats">${statsHtml}</ul>
            </div>
        </div>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function openModal(pokemonData) {
    const modal = document.getElementById('pokemonModal');
    const modalContent = document.getElementById('modalContent');

    // Limpa classes anteriores do modal
    modalContent.className = 'modal-content';

    const primaryType = pokemonData.types.split(', ')[0];
    modalContent.classList.add(primaryType);

    // Atualiza conteúdo
    document.getElementById('modalName').textContent = pokemonData.name;
    document.getElementById('modalNumber').textContent = pokemonData.number;
    document.getElementById('modalImage').src = pokemonData.photo;

    const typesContainer = document.getElementById('modalTypes');
    typesContainer.innerHTML = ''; // Limpa tipos anteriores

    pokemonData.types.split(', ').forEach(type => {
        const li = document.createElement('li');
        li.textContent = type;
        li.classList.add('type', type); // usa as mesmas classes CSS
        typesContainer.appendChild(li);
    });

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('pokemonModal').classList.add('hidden');
}

document.addEventListener('click', function (event) {
    const li = event.target.closest('.pokemon');
    if (li) {
        const pokemonJson = li.getAttribute('data-pokemon');
        const pokemonData = JSON.parse(decodeURIComponent(pokemonJson));

        // Remove modal anterior (se existir)
        const oldModal = document.getElementById('pokemonModal');
        if (oldModal) oldModal.remove();

        // Cria e adiciona o novo modal
        const modalHtml = convertPokemonToModal(pokemonData);
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Comportamento de fechar
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('pokemonModal').remove();
        });

        document.getElementById('pokemonModal').addEventListener('click', (e) => {
            if (e.target.id === 'pokemonModal') {
                document.getElementById('pokemonModal').remove();
            }
        });
    }
});
