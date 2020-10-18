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
