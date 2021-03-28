let map;
let markers = [];
let lastinfowindow = null;
let infowindow;

function initMap() {
    var myLatLng = new google.maps.LatLng(53.34399288223422,  -6.2859672073982855);

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: myLatLng
    });

    var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var locations = [
        { lat:  53.34366496842979, lng: -6.2859672073982855 }, 
        { lat: 51.916340874118134, lng: -8.165104528530108},
        { lat: 52.141973635931556, lng: -10.289351045716252}
    ];
    
    markers = locations.map(function(location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });

    new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
}

function newLocation(newLat, newLng) {
    map.setCenter({
        lat: newLat,
        lng: newLng,
    });
    map.setZoom(14)
}

//Setting Location with jQuery
$(document).ready(function () {
    $("#dublin").click(function () {
        clearMarkers();
        window.location.href='#map';
        newLocation(53.34378213052557, -6.285236330749902);
    });

    $("#restaurant").click(function() {
        clearMarkers();
       displayLocationsOfType(["restaurant"]);
    })

      $("#cafes").click(function () {
        clearMarkers();
        displayLocationsOfType(["cafe"]);
    });
});

function displayLocationsOfType(locationTypes){
    var request = {
        location: map.getCenter(),
        radius: 8047,
        types: locationTypes,
        zoom: map.setZoom(13),
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        clearMarkers();
        console.log(results.length);
        for (var i = 0; i < results.length; i++) {
            // markers.push(results[i]);
            createMarker(results[i]);
        }
    }
}

// Function to create markers
function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
    });
    // Code to set infowindow was found at https://developers.google.com/maps/documentation/javascript/infowindows
    let infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, "click", function () {
        //Code to remove last info window was found at https://hashnode.com/post/google-maps-api-onclick-on-marker-close-infowindow-of-other-markers-ciou68dw708x33353les71nyi
        if (lastinfowindow) lastinfowindow.close();
        infowindow.setContent(place.name);

        infowindow.open(map, marker);
        lastinfowindow = infowindow;
    });
    console.log(marker.title);
    markers.push(marker);
}

//Code to remove markers from map was found at https://developers.google.com/maps/documentation/javascript/examples/marker-remove
function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        if (markers[i]) {
            // console.log(markers[i].title);
            markers[i].setMap(null);
        }
    }
    markers = [];
}


