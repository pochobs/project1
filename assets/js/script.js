var rentListArr = []; // this array hold all houses returned by Realtor API for user entered zip, city and state(also optional radius) 
var map; // used by google maps
var directionsService; // used by google maps
var directionsRenderer; // used by google maps
var ulEl = document.querySelector("#main ul");

// API to get list of houses by zip code, city, state and radius
// It searches only single_family houses
// It saves fetched results to local Storage 
var getHousesList = function(postal_code, city, state_code, radius){

    //errorEl.innerHTML="";

    var apiUrl = "https://realtor.p.rapidapi.com/properties/v2/list-for-rent?prop_type=single_family&sort=relevance";
    if (radius)
        apiUrl = apiUrl + "&radius=" + radius;
    apiUrl = apiUrl + "&postal_code=" + postal_code + "&city=" + city + "&state_code=" + state_code + "&limit=200&offset=0";
    console.log(apiUrl);

    fetch(apiUrl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "realtor.p.rapidapi.com",
            "x-rapidapi-key": "14ac62fbb2mshd58e729e7b4f36ep1704c5jsn9ba276807be6"
        }
    })
    .then(response => {
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                for (i=0; i< data.meta.returned_rows; i++){
                    var house = {
                        city : data.properties[i].address.city,
                        county: data.properties[i].address.county,
                        lat: data.properties[i].address.lat,
                        lon: data.properties[i].address.lon,
                        postal_code : data.properties[i].address.postal_code,
                        line : data.properties[i].address.line,
                        state: data.properties[i].address.state,
                        baths: data.properties[i].baths,
                        beds: data.properties[i].beds,
                        building_size : data.properties[i].building_size.size, 
                        building_size_units : data.properties[i].building_size.units, 
                        price : data.properties[i].price,
                        year_built: data.properties[i].year_built,
                        photos : data.properties[i].photos
                    }

                    rentListArr.push(house);
                }

                localStorage.setItem("FetchedHouses", JSON.stringify(rentListArr));
            })
        }
        else {
            //displayError(response.statusText);
            console.log(response.statusText);
        }
    })
    .catch(err => {
        console.log(err);
        //displayError("Unable to connect to the server.");
    });
}

//Read the Houses List from the Local Storage
var readHousesList = function(){
    var listItems = localStorage.getItem("FetchedHouses");
    if (listItems){
        rentListArr = JSON.parse(listItems);
    }
}

function infowindowclicked(event){
    console.log ("inside infowindowclicked");
    var latlng = markerLatLng;
    console.log (latlng);
}

//Add one marker on the map
var addOneMarker = function(markerLatLng, houseInfo){
    var imageIcon = {
        url: "http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png", 
        scaledSize: new google.maps.Size(30, 30)
    };

    var contentString = "<div><img src = '" + houseInfo.photos[0].href + "' alt= '" + houseInfo.line + "' />" +
        "<p>$" + houseInfo.price + "</p>" + 
        "<p>" + houseInfo.line + ", " + houseInfo.city + ", " + houseInfo.state + "</p>" + 
        "<p>" + houseInfo.beds + " bd/" + houseInfo.baths + " ba/" + houseInfo.building_size + " " + houseInfo.building_size_units + "</p>" + 
        "</div>";
    var infowindow = new google.maps.InfoWindow({
        content : contentString,
        enableEventPropagation: true
    });

    var marker = new google.maps.Marker({
        position: markerLatLng,
        map: map,
        title: "Address: " + houseInfo.line + "; Price: $" + houseInfo.price,
        icon: imageIcon
      });
    marker.addListener("click", function(){
        infowindow.open(map,marker);
    })
    
}

//Read Houses List from Local Storage and put them on the map
var addMarkers = function(){
    if (rentListArr.length==0)
        readHousesList();

    // coordinates to center the map on - calculated in the for loop
    var coords = {
        lat : 0,
        lng : 0
    }

    for (i=0; i<rentListArr.length; i++ ){
        var markerLatLng = { lat: rentListArr[i].lat, lng: rentListArr[i].lon };

        coords.lat += rentListArr[i].lat;
        coords.lng += rentListArr[i].lon;

        addOneMarker(markerLatLng, rentListArr[i]);
    }

    coords.lat = coords.lat / rentListArr.length;
    coords.lng = coords.lng / rentListArr.length;
    
    return coords;
}

// Calculate Route and put it on the map
var calcRoute = function(startCoord, destCoord){
    var request = {
        origin : startCoord,
        destination : destCoord,
        travelMode : 'DRIVING'
    };

    directionsService.route(request, function(result, status){
        if (status == 'OK'){
            directionsRenderer.setDirections(result);
        }
    });
}

// Initialize map
var initMap = function(coordinates, houseInfo) {

    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2bb0Fylaw4UA6pfhINwxIWBRN39ggjYc&callback=initMap";
    script.defer = true;
    script.async = true;

    window.initMap = function(){
        map = new google.maps.Map(document.getElementById("map"),{
            zoom : 15
        });

        if (!coordinates) // put all houses on the map
            map.setCenter(addMarkers());
        else{  // put just this one house on the map and give directions from the current location
            addOneMarker(coordinates, houseInfo);
            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer();
            map.setCenter(coordinates);
            directionsRenderer.setMap(map);

            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){
                    var currentLocation = {
                        lat : position.coords.latitude, lng : position.coords.longitude
                    };
                    calcRoute(currentLocation, coordinates);
                });
            }
            else
                console.log("Browser does not support Geolocation!");
        }
    }

    document.head.appendChild(script);
}

// Initilize map for one listing (with direction from current location)
var initMapOneListing = function(){

    var queryString = document.location.search;

    const urlParams = new URLSearchParams(location.search);

    var coordinates = {};
    var houseInfo = {};

    for (const entry of urlParams.entries()) {
        if (entry[0] == "lat")
            coordinates.lat = parseFloat(entry[1]);
        if (entry[0] == "lng")
            coordinates.lng = parseFloat(entry[1]);
        if (entry[0] == "line")
            houseInfo.line = entry[1];
        if (entry[0] == "price")
            houseInfo.price = parseInt(entry[1]);
    }

    initMap(coordinates, houseInfo);
}


// call to put multiple listings on the map; list of houses is taken from the local storage
initMap(); 

// To put one listing on the map open index.html with the parameters: 
// index.html?lat=30.427406&lng=-97.72106&line=4519%20Sidereal%20Dr&price=2100
//initMapOneListing();
 
// call to get rental houses list for zip code, city and state (and optional radius); the list is saved to local storage;
//getHousesList(78727,'Austin','TX'); 

