getLocationByCityName();

/**
 * Event listener for search button
 */
let search_button = document.getElementById('searchBtn');
search_button.addEventListener('click',function(event){
    getLocationByCityName();
});


/**
 * Function to query location details from City name
 */
async function getLocationByCityName() {
    let cityName = document.getElementById('city_input').value;
    console.log("calling functon getLOCATION for city:" + cityName );

    return await fetch('https://developers.zomato.com/api/v2.1/locations?query=' + cityName, {
        method: 'GET',
        headers: {
            "Content-type" : "application/json; charset = UTF-8",
            "user-key": "5eedee7882b6189e011a324db07137ca"
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("calling functon getRestaurantsFromCityName for cityId:" + data.entity_id);
        for(let location of data.location_suggestions) {
            if(location.entity_id !==undefined) {
                document.getElementById('city_input').value = location.city_name;

                createCuisineOptions(location.entity_id);
                let selectedCuisine = document.getElementById("cuisines").value;
                console.log('selected cuisine is:' + selectedCuisine);
                getCollectionByCityName(location.entity_id);

                getRestaurantsFromCityName(location.entity_id, selectedCuisine);
                
            }
        }
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/**
 * Get a list of all cuisines of restaurants listed in a city. 
 * @param {*} cityId 
 */
async function createCuisineOptions(cityId) {
    return await fetch('https://developers.zomato.com/api/v2.1/cuisines?city_id=' + cityId, {
        method: 'GET',
        headers: {
            "Content-type" : "application/json; charset = UTF-8",
            "user-key": "5eedee7882b6189e011a324db07137ca"
        },
    })
    .then(response => response.json())
    .then(data => {
        let cuisinesSelect = document.getElementById('cuisines');
        cuisinesSelect.remove();
        
        cuisinesSelect = document.createElement('select');
        cuisinesSelect.id = 'cuisines';
        cuisinesSelect.setAttribute('class', 'form-control custom-select mr-sm-2');

        document.getElementById('cuisineSelectDiv').appendChild(cuisinesSelect);

        for(let cuisine_item of data.cuisines) {
            let option = document.createElement('option');
            option.value = cuisine_item.cuisine.cuisine_id;
            option.innerText = cuisine_item.cuisine.cuisine_name;

            cuisinesSelect.appendChild(option);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


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
        // console.log("printing size:" + restaurantsResponse[0].restaurant.name);

    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/**
 * Creates restaurant card using restaurant data from response
 * @param {} restaurantData 
 */
function createRestaurantCard(restaurantData) {
    let resCard = document.createElement('div');
    resCard.classList.add('card', 'restaurantCard');

    resCard.append(formCardImage(restaurantData));
    resCard.append(formCardBodyDiv(restaurantData));
    // resCard.append(formCardFooter(restaurantData));

    resCard.addEventListener('click', function(event) {
        location.href = restaurantData.restaurant.photos_url;
    });

    return resCard;
}

/**
 * Function to form card image using restaurant data
 * @param {} restaurantData 
 */
function formCardImage(restaurantData) {
    let cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top','img-fluid', 'p-0', 'm-0');
    cardImg.height = '100%';
    cardImg.alt = 'No-image found';
    if(restaurantData.restaurant.featured_image==='')   cardImg.src = 'https://i.pinimg.com/originals/74/8d/24/748d244f165823224b2d467b01a532c2.jpg';
    else    cardImg.src = restaurantData.restaurant.featured_image;
    return cardImg;
}


/**
 * Function to form card body div for restaurant card
 * @param {} restaurantData 
 */
function formCardBodyDiv(restaurantData) {
    let cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'm-0', 'p-2');
    
    let heading = document.createElement('span');
    heading.classList.add('card-title');
    heading.setAttribute('style', 'font-weight:bold;font-size:1.2rem')
    heading.innerText = restaurantData.restaurant.name;

    let div = document.createElement('span');
    div.innerText = restaurantData.restaurant.user_rating.aggregate_rating;
    div.setAttribute('style', 'float:right;background-color:' + restaurantData.restaurant.user_rating.rating_color + ';color:white;padding:4px;border-radius:15%');

    let para1 = document.createElement('p');
    para1.classList.add('card-text');

    //para1.innerHTML+= restaurantData.restaurant.cuisines+ "<br>"+restaurantData.restaurant.location.address;
    para1.setAttribute('style','font-weight:bold');
    para1.innerHTML= restaurantData.restaurant.cuisines;
    
    let para2 = document.createElement('p');
    para2.classList.add('card-text');
    para2.innerText += restaurantData.restaurant.location.address;
   

    cardBodyDiv.append(heading, div, para1,para2 );
    return cardBodyDiv;
}

/**
 * Function to form card footer for restaurant card
 * @param {} restaurantData 
 */
function formCardFooter(restaurantData) {
    let cardFooterDiv = document.createElement('div');
    cardFooterDiv.classList.add('card-footer');
    
    cardFooterDiv.innerText = restaurantData.restaurant.location.address;
    return cardFooterDiv;
}

/**
 * Function to fetch restaurant collections for a given cityId
 * @param {*} cityId 
 */
function getCollectionByCityName(cityId) {
    let cityName = document.getElementById('city_input').value;

    let collectionDiv = document.getElementById('collectionsDiv');
    collectionDiv.remove();

    collectionDiv = document.createElement('div');
    collectionDiv.classList.add('p-5');
    collectionDiv.id = 'collectionsDiv';
    document.body.append(collectionDiv);

    let collectionHeading = document.createElement('h2');
    collectionHeading.innerText = "Collections in " + cityName;

    let collectionDescription = document.createElement('p');
    collectionDescription.classList.add('card-text');
    collectionDescription.setAttribute('style', 'font-size:1.1rem');
    collectionDescription.innerText = 'Explore curated lists of top restaurants, cafes, pubs, and bars in ' + cityName + ' based on trends';

    let allCollectiosLinkSpan = document.createElement('span');
    allCollectiosLinkSpan.id = 'allCollectiosLinkSpan';
    allCollectiosLinkSpan.classList.add('restaurantCard');
    allCollectiosLinkSpan.setAttribute('style', 'float:right;font-size:1.1rem');

    let allCollectiosLink = document.createElement('a');
    allCollectiosLink.innerText = 'All Collections in ' + cityName;
    allCollectiosLink.setAttribute('style', 'color:#cb202d');

    allCollectiosLinkSpan.append(allCollectiosLink);

    enrichCollectionsForCityId(cityId);

    
    collectionDiv.append(collectionHeading, allCollectiosLinkSpan,collectionDescription);

}

/**
 * Async function  to enrich restaurant colletions for a given city
 * @param {} cityId 
 */
async function enrichCollectionsForCityId(cityId) {
    return await fetch('https://developers.zomato.com/api/v2.1/collections?city_id=' + cityId, {
        method: 'GET',
        headers: {
            "Content-type" : "application/json; charset = UTF-8",
            "user-key": "5eedee7882b6189e011a324db07137ca"
        },
    })
    .then(response => response.json())
    .then(data => {
        let collectionsDiv = document.getElementById('collectionsDiv');

        let responseRestaurantCollections = data.collections;

        // console.log("collections data is: " + responseRestaurantCollections);
        
        let collectionCardDeckDiv  = document.createElement('div');
        collectionCardDeckDiv.classList.add('card-deck', 'pt-3');
        collectionsDiv.appendChild(collectionCardDeckDiv);

        for(let i=0;i<4;i++) {
            let collectionCard = formCollectionCardFromData(responseRestaurantCollections[i]);
            collectionCardDeckDiv.append(collectionCard); 
        }

        document.getElementById('allCollectiosLinkSpan').addEventListener('click', function(event) {
            let collectionsURL = data.collections[0].collection.share_url.split('/');
            let allCollectionsURL = collectionsURL.slice(0, collectionsURL.length-1).join('/');
            location.href = allCollectionsURL;
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/**
 * Function to form collection card using collectionData
 * @param {} collectionData 
 */
function formCollectionCardFromData(collectionData) {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'restaurantCard');

    cardDiv.append(formCollectionImage(collectionData));
    cardDiv.append(formCardImageOverlayText(collectionData));

    cardDiv.addEventListener('click', function(event) {
        location.href = collectionData.collection.share_url;
    });

    return cardDiv;
}

/**
 * Function to form collection card image using collectionData
 * @param {} collectionData 
 */
function formCollectionImage(collectionData) {
    let image = document.createElement('img');
    image.classList.add('card-img-top','img-fluid', 'p-0', 'm-0');
    image.height = '100%';
    image.src = collectionData.collection.image_url;
    image.alt = "No Image";

    return image;
}

/**
 * Function to form collection card image overlay text using collectionData
 * @param {} collectionData 
 */
function formCardImageOverlayText(collectionData) {
    let cardTextOverlayDiv = document.createElement('div');
    cardTextOverlayDiv.classList.add('card-img-overlay', 'text-white', 'd-flex', 'flex-column', 'justify-content-center');

    let cardTitle = document.createElement('h4');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = collectionData.collection.title;

    let cardSubTitle = document.createElement('h6');
    cardSubTitle.classList.add('card-subtitle');
    cardSubTitle.innerText = collectionData.collection.res_count + " Places";

    cardTextOverlayDiv.append(cardTitle, cardSubTitle);
    return cardTextOverlayDiv;
}