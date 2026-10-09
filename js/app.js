const formulario = document.getElementById('formulario');
const inputBuscar = document.getElementById('buscar');
const resultado = document.getElementById('resultado');
const botonBuscar = formulario.querySelector('button[type="submit"]');

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
    resultado.setAttribute('aria-busy', 'true');
    botonBuscar.disabled = true;
    botonBuscar.textContent = 'Buscando...';
    resultado.innerHTML = `
        <div class="alert alert-info search-message" role="status">
            Buscando tu Pokémon...
        </div>
    `;

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
            resultado.innerHTML = `
                <div class="alert alert-warning search-message" role="alert">
                    No se encontró ese Pokémon. Revisa el nombre o el número e inténtalo de nuevo.
                </div>
            `;
        })
        .then(function () {
            resultado.setAttribute('aria-busy', 'false');
            botonBuscar.disabled = false;
            botonBuscar.innerHTML = '<span aria-hidden="true">⌕</span> Buscar';
        });
}

function mostrarCard(pokemon) {
    const artwork = pokemon.sprites.other && pokemon.sprites.other['official-artwork'];
    const imagen = (artwork && artwork.front_default) || pokemon.sprites.front_default;

    let tipos = '';
    pokemon.types.forEach(function (t) {
        tipos += `<span class="badge type-badge">${t.type.name}</span>`;
    });

    let habilidades = '';
    pokemon.abilities.forEach(function (h) {
        habilidades += `<span class="ability-badge">${h.ability.name}</span>`;
    });

    let stats = '';
    pokemon.stats.forEach(function (s) {
        const nombre = nombresStats[s.stat.name] || s.stat.name;
        const ancho = Math.min(s.base_stat, 150) / 150 * 100;

        stats += `
            <div class="stat-row">
                <span class="stat-name">${nombre}</span>
                <div class="progress stat-progress" role="progressbar" aria-label="${nombre}" aria-valuenow="${s.base_stat}" aria-valuemin="0" aria-valuemax="150">
                    <div class="progress-bar" style="width: ${ancho}%"></div>
                </div>
                <span class="stat-value">${s.base_stat}</span>
            </div>
        `;
    });

    resultado.innerHTML = `
        <article class="card pokemon-card">
            <div class="row g-0">
                <div class="col-md-5">
                    <div class="pokemon-visual">
                        <span class="pokemon-number">N.º ${pokemon.id}</span>
                        ${imagen
                            ? `<img src="${imagen}" alt="${pokemon.name}" decoding="async">`
                            : '<span class="text-secondary">Imagen no disponible</span>'}
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="pokemon-details">
                        <h2 class="pokemon-name">${pokemon.name}</h2>
                        <div class="d-flex flex-wrap gap-2 mb-4">${tipos}</div>

                        <div class="row g-2 mb-4">
                            <div class="col-6">
                                <div class="detail-tile">
                                    <span class="detail-label">Altura</span>
                                    <p class="detail-value">${pokemon.height / 10} m</p>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="detail-tile">
                                    <span class="detail-label">Peso</span>
                                    <p class="detail-value">${pokemon.weight / 10} kg</p>
                                </div>
                            </div>
                        </div>

                        <section class="mb-4" aria-labelledby="abilities-title">
                            <h3 class="section-title" id="abilities-title">Habilidades</h3>
                            <div class="d-flex flex-wrap gap-2">${habilidades}</div>
                        </section>

                        <section aria-labelledby="stats-title">
                            <h3 class="section-title" id="stats-title">Estadísticas base</h3>
                            ${stats}
                        </section>
                    </div>
                </div>
            </div>
        </article>
    `;
}
