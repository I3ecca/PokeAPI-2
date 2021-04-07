$(function() {

    let pokeApiUrl = "https://pokeapi.co/api/v2/generation/1";
    let pokemonByNameUrl = "https://pokeapi.co/api/v2/pokemon/";



    //first call to the API gets all Gen1 data. 
    $.getJSON(pokeApiUrl).done(function(data) {

        //define empty array for pkmn info
        pkmnArray = [];

        // Using the Gen1 Data, we loop though each pkmn species
        $.each(data.pokemon_species, function(index, pokemon) {

            pkmnArray.push(new Promise((resolve, reject) => {
                //gives you the name with a capital first letter. 
                let name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                // create an anchor tag with necessary attributes and styling. 
                //   let link = $("<a>").attr("id", pokemon.name).attr("href", "#").append("<strong>").text(name);

                // second call to API uses info from the first call to get more info on each pokemon. 
                $.getJSON(pokemonByNameUrl + pokemon.name).done(function(info) {

                    // console.log(info.types[0, 1]);
                    let typeArray = [];

                    $.each(info.types, function(index, type){
                        typeArray.push(type.type.name);

                    })
                    
                    let typeII = typeArray.pop();
                    let typeFirst = typeArray.toString();
                    let typeSecond = typeII.toString();
                    
                    // create key value pairs
                    pkmn = {
                        name: pokemon.name,
                        id: info.id,
                        sprite_front: info.sprites.front_default,
                        sprite_back: info.sprites.back_default, 
                        typeOne: typeFirst, 
                        typeTwo: typeSecond
                        
                    };

                    resolve(pkmn);
                })
            }));



        });

        Promise.all(pkmnArray).then((sortedArray) => {

            sortedArray.sort((a, b) => {
                return a.id - b.id;
            });

            console.log(sortedArray);

            $.each(sortedArray, function(index, value) {

                

             if(value.typeOne === ""){
                let name = value.name.charAt(0).toUpperCase() + value.name.slice(1);

                let paraName = $("<p class='paraName'>").html(`${name}`);

                let paraNum =  $("<p class='paraNum'>").html(`#${(value.id)}`);

                let typeTwoDiv = $("<div>").html(`${value.typeTwo}`).addClass(`typeBlock ${value.typeTwo}`);

                let sprite = `<img class="pkmImg" src = ${value.sprite_front}>`;

                let pokemonDiv = $("<div>").addClass("pokemon-containers").attr("id", `${value.id}`).append(sprite).append(paraNum).append(paraName).append(typeTwoDiv);

                // Attach the paragraph to the page at the pokedex div. 
                pokemonDiv.appendTo("#pokedex");

             } else {
                let name = value.name.charAt(0).toUpperCase() + value.name.slice(1);

                let paraName = $("<p class='paraName'>").html(`${name}`);

                let paraNum =  $("<p class='paraNum'>").html(`#${(value.id)}`);

                let typeOneDiv = $("<div>").html(`${value.typeOne}`).addClass(`typeBlock ${value.typeOne}`);
                let typeTwoDiv = $("<div>").html(`${value.typeTwo}`).addClass(`typeBlock ${value.typeTwo}`);

                let sprite = `<img class="pkmImg" src = ${value.sprite_front}>`;

                let pokemonDiv = $("<div>").addClass("pokemon-containers").attr("id", `${value.id}`).append(sprite).append(paraNum).append(paraName).append(typeOneDiv).append(typeTwoDiv);

                // Attach the paragraph to the page at the pokedex div. 
                pokemonDiv.appendTo("#pokedex");

             } ; 

                

            })

        })

    }).fail(function() {
        console.log("Request to PokeAPI failed");
    }).always(function() {
        console.log("Pokemon is the best!")
    })
});