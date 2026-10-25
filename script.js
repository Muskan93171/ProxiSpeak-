
/* ==========================================
   ProxiSpeak
   Geospatial Proximity Audio Ecosystem
========================================== */

// Demo audio posts
const audioPosts = [
    {
        id: 1,
        title: "Welcome to ProxiSpeak",
        description: "Discover audio stories around you.",
        location: "Your local area",
        category: "Community",
        audioUrl: ""
    },
    {
        id: 2,
        title: "Explore Local Stories",
        description: "Share stories connected to a place.",
        location: "Nearby",
        category: "Stories",
        audioUrl: ""
    },
    {
        id: 3,
        title: "Campus Audio Guide",
        description: "Listen to useful information about places.",
        location: "Campus",
        category: "Education",
        audioUrl: ""
    }
];

let userLocation = null;
let currentAudio = null;

// Safely find an HTML element
function getElement(id) {
    return document.getElementById(id);
}

// Show a message on the page
function showStatus(message) {
    const status = getElement("location-status");

    if (status) {
        status.textContent = message;
    } else {
        console.log(message);
    }
}

// Get the user's location
function findMyLocation() {
    if (!navigator.geolocation) {
        showStatus("Geolocation is not supported by this browser.");
        return;
    }

    showStatus("Requesting your location permission...");

    navigator.geolocation.getCurrentPosition(
        function (position) {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            showStatus(
                "Location found! Latitude: " +
                userLocation.latitude.toFixed(4) +
                ", Longitude: " +
                userLocation.longitude.toFixed(4)
            );

            console.log("User location:", userLocation);
        },

        function (error) {
            const messages = {
                1: "Location permission was denied.",
                2: "Your location is currently unavailable.",
                3: "Location request timed out."
            };

            showStatus(
                messages[error.code] ||
                "Unable to get your location."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// Calculate distance between two coordinates in kilometres
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = degrees => degrees * Math.PI / 180;

    const earthRadius = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const safeA = Math.min(1, Math.max(0, a));

    return earthRadius * 2 *
        Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA));
}

// Display demo audio posts
function displayAudioPosts(posts) {
    const container = getElement("audio-list");

    if (!container) {
        console.warn(
            'Add an HTML element with id="audio-list" to display posts.'
        );
        return;
    }

    container.replaceChildren();

    if (posts.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No audio posts found.";
        container.appendChild(message);
        return;
    }

    posts.forEach(post => {
        const card = document.createElement("article");
        card.className = "audio-card";

        const title = document.createElement("h3");
        title.textContent = post.title;

        const description = document.createElement("p");
        description.textContent = post.description;

        const location = document.createElement("p");
        location.textContent = "📍 " + post.location;

        const category = document.createElement("p");
        category.textContent = "Category: " + post.category;

        card.append(title, description, location, category);

        if (post.audioUrl) {
            const audio = document.createElement("audio");
            audio.controls = true;
            audio.preload = "none";
            audio.src = post.audioUrl;

            card.appendChild(audio);
        }

        container.appendChild(card);
    });
}

// Search audio posts by title, description or category
function searchAudioPosts() {
    const searchInput = getElement("audio-search");

    if (!searchInput) {
        console.warn('Add an input with id="audio-search".');
        return;
    }

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    const filteredPosts = audioPosts.filter(post =>
        (
            post.title + " " +
            post.description + " " +
            post.category + " " +
            post.location
        ).toLowerCase().includes(searchTerm)
    );

    displayAudioPosts(filteredPosts);
}

// Play or pause an audio file
function toggleAudio(audioElement) {
    if (!audioElement) return;

    if (currentAudio && currentAudio !== audioElement) {
        currentAudio.pause();
    }

    if (audioElement.paused) {
        currentAudio = audioElement;

        audioElement.play().catch(() => {
            showStatus("Audio could not play. Please try again.");
        });
    } else {
        audioElement.pause();
    }
}

// Connect buttons and initialize the page
document.addEventListener("DOMContentLoaded", function () {
    const locationButton = getElement("find-location");
    const searchButton = getElement("search-button");
    const searchInput = getElement("audio-search");

    if (locationButton) {
        locationButton.addEventListener(
            "click",
            findMyLocation
        );
    }

    if (searchButton) {
        searchButton.addEventListener(
            "click",
            searchAudioPosts
        );
    }

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            searchAudioPosts
        );
    }

    displayAudioPosts(audioPosts);

    console.log("ProxiSpeak JavaScript loaded successfully!");
});
