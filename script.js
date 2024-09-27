document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('searchButton')) {
        setupSearchPage();
    } else if (document.getElementById('resultsContainer')) {
        setupResultsPage();
    }
});

const API_KEY = 'fsq3a3ryesJMI+SuVHjliCO8aUsTNJXLFT6IxhhwYyocypY=';

// Main Search page
function setupSearchPage() {
    const searchButton = document.getElementById('searchButton');
    const locationInput = document.getElementById('locationInput');

    searchButton.addEventListener('click', function() {
        const location = locationInput.value;

        if (!location) {
            alert("Please enter a location.");
            return;
        }

        // Store location in localStorage
        localStorage.setItem('location', location);

        // Redirect to results.html
        window.location.href = 'results.html';
    });
}

// Results page 
async function setupResultsPage() {
    const location = localStorage.getItem('location');
    const locationName = document.getElementById('locationName');
    const resultsContainer = document.getElementById('resultsContainer');

    if (location) {
        locationName.innerText = location;
        try {
            await searchHiddenGems(location);  // Await the results of searchHiddenGems
        } catch (error) {
            console.error('Error fetching hidden gems:', error);
            alert('Something went wrong with the search.');
        }
    } else {
        alert('No location provided. Please go back and enter a location.');
    }
}

// Function to search for bars, restaurants, and museums 
async function searchHiddenGems(location) {
    console.log(`Searching for hidden gems near: ${location}`);

    const url = `https://api.foursquare.com/v3/places/search?query=hidden+gem&near=${location}&categories=13003,13065,10000&limit=5`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Authorization': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data && data.results) {
            displayPlaces(data.results);
        } else {
            console.log('No hidden gem places found', data);
            alert('No hidden gem places found for this location.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert(`Search for hidden gem places was not successful: ${error.message}`);
    }
}

// Factory function to create place cards
function createPlaceCard(place) {
    const placeCard = document.createElement('div');
    placeCard.classList.add('place-card', 'mt-3', 'p-3', 'border', 'rounded');

    const placeLink = document.createElement('a');
    placeLink.href = place.venueUrl || place.website || '#'; 
    placeLink.target = '_blank'; 
    placeLink.classList.add('place-link');

    const placeName = document.createElement('h3');
    placeName.innerText = place.name;

    placeLink.appendChild(placeName);
    placeCard.appendChild(placeLink);

    return placeCard; 
}

// Function to display the places on the webpage
function displayPlaces(places) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';  // Clear previous results

    for (let i = 0; i < places.length; i++) {
        const place = places[i];

        const placeCard = createPlaceCard(place);

        resultsContainer.appendChild(placeCard);
    }
}
