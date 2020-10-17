// let cityName = document.getElementById('city_input').value;
// document.getElementById('city_input').addEventListener('change', function(event) {
//     getLocationByCityName(document.getElementById('city_input').value);
// });
// console.log("enriching data for city:" + cityName);
getLocationByCityName();
// getRestaurantsFromCityName(8, 100);
// let foodCategories = callZomatoDeveloperAPI('https://developers.zomato.com/api/v2.1/categories');


let search_button = document.getElementById('searchBtn');
search_button.addEventListener('click',function(event){
    getLocationByCityName();
});

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
                createCuisineOptions(location.entity_id);
                let selectedCuisine = document.getElementById("cuisines").value;
                console.log('selected cuisine is:' + selectedCuisine);
                getRestaurantsFromCityName(location.entity_id, selectedCuisine);
                
            }
        }
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

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


//console.log("food catagories are: "+foodCategories);

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
        console.log('Lucknow data is:', data);
        document.getElementById('restaurantsDiv').remove();
        let restaurantsDiv = document.createElement('div');
        restaurantsDiv.id = 'restaurantsDiv';
        restaurantsDiv.classList.add('p-5');
        
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

function formCardImage(restaurantData) {
    let cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top','img-fluid', 'p-0', 'm-0');
    cardImg.height = '100%';
    cardImg.alt = 'No-image found';
    if(restaurantData.restaurant.featured_image==='')   cardImg.src = 'https://i.pinimg.com/originals/74/8d/24/748d244f165823224b2d467b01a532c2.jpg';
    else    cardImg.src = restaurantData.restaurant.featured_image;
    return cardImg;
}

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

function formCardFooter(restaurantData) {
    let cardFooterDiv = document.createElement('div');
    cardFooterDiv.classList.add('card-footer');
    
    cardFooterDiv.innerText = restaurantData.restaurant.location.address;
    return cardFooterDiv;
}

//console.log("lucknow resu: " +lucknowRestaurants);
// for(let restaurant of lucknowRestaurants) {
//     console.log(restaurant.name + " " + restaurant.location);
// }