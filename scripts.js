$(function(){

    let pokeApiUrl="https://pokeapi.co/api/v2/generation/1";
    let pokemonByNameUrl="https://pokeapi.co/api/v2/pokemon/";

    

    //first call to the API gets all Gen1 data. 
    $.getJSON(pokeApiUrl).done(function(data){

        //define empty array for pkmn info
        pkmnArray = [];
        $.each(pkmnArray, function(index){
            console.log(index);
        });
        console.log(pkmnArray[0]);

        // Using the Gen1 Data, we loop though each pkmn species
        $.each(data.pokemon_species, function(index, pokemon){
            
          //gives you the name with a capital first letter. 
          let name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
          // create an anchor tag with necessary attributes and styling. 
        //   let link = $("<a>").attr("id", pokemon.name).attr("href", "#").append("<strong>").text(name);
          
          // second call to API uses info from the first call to get more info on each pokemon. 
          $.getJSON(pokemonByNameUrl + pokemon.name).done(function(info) {

            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

            // create key value pairs
            pkmn = {
                name: pokemon.name,
                id: info.id,
                sprite_front: info.sprites.front_default,
                sprite_back: info.sprites.back_default
            };

            // push the pkmn to the pkmnArray
            pkmnArray.push(pkmn);
            // Sort the pkmn Array
            pkmnArray.sort((a, b) => {
                return a.id - b.id;
                });
           
            

            // specify what a paragraph will be
            let par = $("<p>").html(`#${pkmn.id} is ${pkmn.name}`);
            let sprite = `<img src = ${pkmn.sprite_front}>`;

            let pokemonDiv = $("<div>").addClass("pokemon-containers").attr("id", `${pkmn.id}`).append(sprite).append(par);

            // Attach the paragraph to the page at the pokedex div. 
            pokemonDiv.appendTo("#pokedex");

        
          });
          
         
         

            
        
        
        });
      }).fail(function(){
        console.log("Request to PokeAPI failed");
      }).always(function(){
        console.log("Pokemon is the best!")
      })

      
      
      

  });