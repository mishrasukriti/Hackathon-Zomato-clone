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
                document.getElementById('collectionsDiv').setAttribute('style', 'display:inline');
                getCollectionByCityName(location.entity_id);

                getRestaurantsFromCityName(location.entity_id, selectedCuisine);
                
            }
        }
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
