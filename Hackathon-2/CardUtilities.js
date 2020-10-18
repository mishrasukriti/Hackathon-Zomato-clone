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
    if(restaurantData.restaurant.featured_image===undefined || restaurantData.restaurant.featured_image==='' || restaurantData.restaurant.featured_image===null)   cardImg.src = 'https://i.pinimg.com/originals/74/8d/24/748d244f165823224b2d467b01a532c2.jpg';
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
