async function fetchPokemonsData(pokemons) {
    
    const allPokemonData = []
    for (const pokemon of pokemons) {
        const pokemonData = await fetchPokemon(pokemon.url)
        allPokemonData.push(pokemonData)
    }

    return allPokemonData
}


// to take all pokemons
async function fetchPokemons() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=80&offset=0");

    const responseJson = await response.json();

    return responseJson.results;
    
}


// to take one pokemon 
async function fetchPokemon(url) {
    const response = await fetch(url);

    const responseJson = await response.json();

    return responseJson;
    
}


// insert in html
function insertPokemonHtml(pokemon) {
    const hpStat = pokemon.stats.find(item => item.stat.name === "hp")
     const attackStat = pokemon.stats.find(item => item.stat.name === "attack")
     const defenseStat = pokemon.stats.find(item => item.stat.name === "defense")
     const specialStat = pokemon.stats.find(item => item.stat.name === "special-attack")

     const pokemonHtml = `
         <li class="pokemon-item" id="pokemon-item">
             <div class="pokemon-card" data-pokemon-card-type-name="eletric" >
                 <div class="pokemon-card-image">
                     <img class="pokemon-card-img" src="${pokemon.sprites.front_default}">
                 </div>
                 <div class="pokemon-card-info">
                     <h3 class="pokemon-card-name">
                         ${pokemon.name}
                     </h3>
                     <span class="pokemon-card-type">
                         ${pokemon.types[0].type.name.toUpperCase()}
                     </span>
                 </div>
                 <ul class="pokemon-card-attributes">
                     <li class="pokemon-card-attributes-item">
                         <span class="pokemon-card-attributes-text">
                             HP
                         </span>
                         <div class="pokemon-card-attributes-progress">
                             <div class="pokemon-card-attributes-progress-bar" style="width:${hpStat.base_stat}%"</div> </div> 
                         </div>
                     </li>
                     <li class="pokemon-card-attributes-item">
                         <span class="pokemon-card-attributes-text">
                             Attack
                         </span>
                         <div class="pokemon-card-attributes-progress">
                             <div class="pokemon-card-attributes-progress-bar"style="width:${attackStat.base_stat}%" ></div>
                         </div>
                     </li>
                     <li class="pokemon-card-attributes-item">
                         <span class="pokemon-card-attributes-text">
                             Defense
                         </span>
                         <div class="pokemon-card-attributes-progress">
                             <div class="pokemon-card-attributes-progress-bar" style="width:${defenseStat.base_stat}%"></div>
                         </div>
                     </li>
                     <li class="pokemon-card-attributes-item">
                         <span class="pokemon-card-attributes-text">
                             Special Attack
                         </span>
                         <div class="pokemon-card-attributes-progress">
                             <div class="pokemon-card-attributes-progress-bar" style="width: ${specialStat.base_stat}%"></div>
                         </div>
                     </li>
                 </ul>
             </div>
         </li>    
    `

    const pokemonlistUl = document.querySelector(".pokemon-list");

    pokemonlistUl.insertAdjacentHTML("beforeend", pokemonHtml);
    
}
async function populatePokemons(pokemons) {

    const allPokemonsData = await fetchPokemonsData(pokemons)

    for (const allPokemonData of allPokemonsData) {
        insertPokemonHtml(allPokemonData)
    }


    
}

// filter search
const search = () =>{
    const searchbox = document.getElementById("search-input").value.toUpperCase();
    const searchresults = document.getElementById("pokemon-list")
    const results = document.querySelectorAll(".pokemon-item")
    const resultsName = document.getElementsByTagName("h3")

    for(var i=0; i < resultsName.length; i++){
        let match = results[i].getElementsByTagName('h3')[0]

        if(match){
            let textvalue = match.textContent || match.innerHTML

            if(textvalue.toUpperCase().indexOf(searchbox) > -1){
                results[i].style.display = "";
            }else{
                results[i].style.display = "none";
            }
        }
    }


}

// filter to clear search
 function removeAllPokemons(){
    const pokemonListUl = document.querySelector(".pokemon-list")

    pokemonListUl.innerHTML = ""
}


// button search filter
async function handleSearchInput(event, pokemons) {

    if(!value) {
        removeAllPokemons() 
       
       await populatePokemons(pokemons)
      
    } else {
            const currentPokemon = pokemons.find(pokemon => pokemon.name === value.toLowerCase())
        
            if (currentPokemon) {

                const currentPokemonData = await fetchPokemon(currentPokemon.url)

                if (currentPokemonData) {

                    removeAllPokemons()
                   
                    insertPokemonHtml(currentPokemonData)
                }
            }
        }
}
function initSearchFunction(pokemons) {
    const searchInput = document.querySelector(".search-input");

    searchInput.addEventListener("change", async (event) => await handleSearchInput(event, pokemons))
}
async function filterClicked(filter, pokemonsData) {
    const pokemonType = filter.dataset.pokemonTypeName

    const pokemonsDataFilteredByType = pokemonsData.filter(pokemonData => {
        return pokemonData.types[0].type.name === pokemonType
    })

    if (pokemonType === "all") {
        removeAllPokemons();
        for (const pokemon of pokemonsData) {
            insertPokemonHtml(pokemon)
        }
    }else {
        removeAllPokemons();

        for (const pokemon of pokemonsDataFilteredByType) {
            insertPokemonHtml(pokemon)
            
        }
    }

   
}
function initFiltersFunction(pokemonsData) {
    const filters = document.querySelectorAll(".pokemon-filter-button")
    filters.forEach(filter => {
        filter.addEventListener("click", async () => await filterClicked(filter, pokemonsData))
    })
}



async function main(){

    const pokemons  = await fetchPokemons();

    const pokemonsData = await fetchPokemonsData(pokemons)

    initSearchFunction(pokemons)
    initFiltersFunction(pokemonsData)

    populatePokemons(pokemons)

}
main();