getLocationByCityName();

/**
 * Event listener for search button
 */
let search_button = document.getElementById('searchBtn');
search_button.addEventListener('click',function(event){
    document.getElementById('collectionsDiv').setAttribute('style', 'display:hidden');
    getLocationByCityName();
});

/**
 * Search for restaurants using cityName and Cuisine name in input
 * @param {*} cityId 
 * @param {*} selectedCuisine 
 */
async function getRestaurantsFromCityName(cityId,selectedCuisine ) {
    let url = 'https://developers.zomato.com/api/v2.1/search?entity_id=' + cityId + '&entity_type=city';
    if(selectedCuisine!== 'Search for restaurants on Zomato') {
        url += '&cuisines=' + selectedCuisine;
    }
    console.log("calling url:" + url);
    return await fetch(url, {
        method: 'GET',
        headers: {
            "Content-type" : "application/json; charset = UTF-8",
            "user-key": "5eedee7882b6189e011a324db07137ca"
        },
    })
    .then(response => response.json())
    .then(data => {
        let cityName = document.getElementById('city_input').value;
        console.log('Lucknow data is:', data);
        document.getElementById('restaurantsDiv').remove();
        let restaurantsDiv = document.createElement('div');
        restaurantsDiv.id = 'restaurantsDiv';
        restaurantsDiv.classList.add('p-5');

        let restaurantsDivHeading = document.createElement('h2');
        restaurantsDivHeading.innerText = "Restaurants in " + cityName;

        let restaurantsDivDescription = document.createElement('p');
        restaurantsDivDescription.classList.add('card-text');
        restaurantsDivDescription.setAttribute('style', 'font-size:1.1rem');
        restaurantsDivDescription.innerText = 'Discover the best food & drinks in ' + cityName + ' based on trends';

        restaurantsDiv.append(restaurantsDivHeading, restaurantsDivDescription);
        
        document.body.append(restaurantsDiv);

        let restaurantsArray = data.restaurants;

        let cardCount = 0;
        let restaurantCardDiv;
        for(let res of restaurantsArray) {
            if(cardCount%4===0) {
                restaurantCardDiv  = document.createElement('div');
                restaurantCardDiv.classList.add('card-deck', 'pt-3');
                restaurantsDiv.appendChild(restaurantCardDiv);
            }
            let restaurantCard = createRestaurantCard(res);
            restaurantCardDiv.append(restaurantCard);
            cardCount++;
        }

    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
