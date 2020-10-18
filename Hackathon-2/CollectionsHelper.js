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

