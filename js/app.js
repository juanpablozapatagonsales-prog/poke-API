const formulario = document.getElementById('formulario');
const inputBuscar = document.getElementById('buscar');
const resultado = document.getElementById('resultado');

const nombresStats = {
    'hp': 'Vida',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'Ataque esp.',
    'special-defense': 'Defensa esp.',
    'speed': 'Velocidad'
};

formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    const busqueda = inputBuscar.value.trim().toLowerCase();
    buscarPokemon(busqueda);
});

function buscarPokemon(busqueda) {
    resultado.innerHTML = '<p class="mensaje">Buscando...</p>';

    fetch('https://pokeapi.co/api/v2/pokemon/' + busqueda)
        .then(function (res) {
            if (!res.ok) {
                throw new Error('No encontrado');
            }
            return res.json();
        })
        .then(function (pokemon) {
            mostrarCard(pokemon);
        })
        .catch(function (error) {
            console.log(error);
            resultado.innerHTML = '<p class="mensaje error">⚠️ No se encontró ese Pokémon. Revisa el nombre o el número.</p>';
        });
}

function mostrarCard(pokemon) {
    const imagen = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

    let tipos = '';
    pokemon.types.forEach(function (t) {
        tipos += `<span class="tipo tipo-${t.type.name}">${t.type.name}</span>`;
    });

    let habilidades = '';
    pokemon.abilities.forEach(function (h) {
        habilidades += `<li>${h.ability.name}</li>`;
    });

    let stats = '';
    pokemon.stats.forEach(function (s) {
        const nombre = nombresStats[s.stat.name] || s.stat.name;
        const ancho = Math.min(s.base_stat, 150) / 150 * 100;
        stats += `
            <div class="stat">
                <span class="stat-nombre">${nombre}</span>
                <div class="barra"><div class="relleno" style="width:${ancho}%"></div></div>
                <span class="stat-valor">${s.base_stat}</span>
            </div>
        `;
    });

    resultado.innerHTML = `
        <div class="card">
            <span class="numero">#${pokemon.id}</span>
            <img src="${imagen}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <div class="tipos">${tipos}</div>

            <div class="medidas">
                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
            </div>

            <h3>Habilidades</h3>
            <ul class="habilidades">${habilidades}</ul>

            <h3>Estadísticas</h3>
            ${stats}
        </div>
    `;
}