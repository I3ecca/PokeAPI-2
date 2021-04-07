$(function() {

    let pokeApiUrl = "https://pokeapi.co/api/v2/generation/1";
    let pokemonByNameUrl = "https://pokeapi.co/api/v2/pokemon/";

    const popup = document.getElementById("popup-container");



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

                    

                    let upperCaseName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

                    let flavorURL = (info.species.url);
                    // console.log(flavorURL);
                    // let (info);
                    let typeArray = [];

                    $.each(info.types, function(index, type){
                        typeArray.push(type.type.name);

                    })
                    
                    let typeII = typeArray.pop();
                    let typeFirst = typeArray.toString();
                    let typeSecond = typeII.toString();
                    
                    // create key value pairs
                    pkmn = {
                        name: upperCaseName,
                        id: info.id,
                        sprite_front: info.sprites.front_default,
                        sprite_back: info.sprites.back_default, 
                        sprite_frontS: info.sprites.front_shiny,
                        sprite_backS: info.sprites.back_shiny, 
                        typeOne: typeFirst, 
                        typeTwo: typeSecond, 
                        flavorUrl : flavorURL
                        
                    };

                    resolve(pkmn);
                })
            }));



        });

        Promise.all(pkmnArray).then((sortedArray) => {

            sortedArray.sort((a, b) => {
                return a.id - b.id;
            });

            // console.log(sortedArray);

            $.each(sortedArray, function(index, value) {

                

             if(value.typeOne === ""){
                let name = value.name.charAt(0).toUpperCase() + value.name.slice(1);

                let paraName = $(`<p class='paraName' id='${value.id}'>`).html(`${name}`);

                let paraNum =  $("<p class='paraNum'>").html(`#${(value.id)}`);

                let typeTwoDiv = $("<div>").html(`${value.typeTwo}`).addClass(`typeBlock ${value.typeTwo}`);

                let sprite = `<img class="pkmImg" src = ${value.sprite_front}>`;

                let pokemonDiv = $("<div>").addClass("pokemon-containers").attr("id", `${value.id}`).append(sprite).append(paraNum).append(paraName).append(typeTwoDiv);

                // Attach the paragraph to the page at the pokedex div. 
                pokemonDiv.appendTo("#pokedex");

             } else {
                let name = value.name.charAt(0).toUpperCase() + value.name.slice(1);

                let paraName = $(`<p class='paraName' id='${value.id}'>`).html(`${name}`);


                let paraNum =  $("<p class='paraNum'>").html(`#${(value.id)}`);

                let typeOneDiv = $("<div>").html(`${value.typeOne}`).addClass(`typeBlock ${value.typeOne}`);
                let typeTwoDiv = $("<div>").html(`${value.typeTwo}`).addClass(`typeBlock ${value.typeTwo}`);

                let sprite = `<img class="pkmImg" src = ${value.sprite_front}>`;

                let pokemonDiv = $("<div>").addClass("pokemon-containers").attr("id", `${value.id}`).append(sprite).append(paraNum).append(paraName).append(typeOneDiv).append(typeTwoDiv);

                // Attach the paragraph to the page at the pokedex div. 
                pokemonDiv.appendTo("#pokedex");

             } ; 

             
            })

            

            $(".paraName").click(function(event){
                
                popup.style.display = "flex";
                // gets the id number of the pkmn clicked. 
                idNum= (event.target.id);
                
                let pkmnInfo = (sortedArray[idNum - 1]);

                $.getJSON(pkmnInfo.flavorUrl).done(function(description){

                    let flavorText = JSON.stringify(description.flavor_text_entries[0].flavor_text);

                    let flavor_text = (flavorText.replaceAll("\\n"," ").replaceAll("\\f",""));

                  

                    $("#regularS").html("");
                    $("#shinyS").html("");
                    $("#pokemon-details").html("");
                    $("#flavorText").html(flavor_text);

                    console.log(pkmnInfo);

                    let spriteF = `<img class="pkmSprite" src = ${pkmnInfo.sprite_front}><p>Default Front</p>`;
                    let spriteB = `<img class="pkmSprite" src = ${pkmnInfo.sprite_back}><p>Default Back</p>`;
                    let spriteFS = `<img class="pkmSprite" src = ${pkmnInfo.sprite_frontS}><p>Shiny Front</p>`;
                    let spriteBS = `<img class="pkmSprite" src = ${pkmnInfo.sprite_backS}><p>Shiny Back</p>`;

                    $("#regularS").append(spriteF).append(spriteB);
                    $("#shinyS").append(spriteFS).append(spriteBS);
                    
                });

                console.log("I was clicked!");
                

                
                

           

                $(".popup-container").click(function(){
                    popup.style.display = "none";
                });

            })

        })

    }).fail(function() {
        console.log("Request to PokeAPI failed");
    }).always(function() {
        console.log("Pokemon is the best!")
    })
});




