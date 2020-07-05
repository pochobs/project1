var rentListArr = [];
var map;

//API to get list of houses by zip code, city, state and radius
// It searches only single_family houses
// Save fetched results to local Storage 
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
                        bath: data.properties[i].address.baths,
                        beds: data.properties[i].address.beds,
                        building_size : data.properties[i].building_size.size, 
                        building_size_units : data.properties[i].building_size.units, 
                        price : data.properties[i].price,
                        year_built: data.properties[i].year_built,
                        //first_photo : data.properties[i].photos[0].href
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

//Read Houses List from Local Storage and put them to the map
function AddMarkers(){
    if (rentListArr.length==0)
        readHousesList();

    // corrdinates to center the map on - calculated in the for loop
    var coords = {
        lat : 0,
        lng : 0
    }

    for (i=0; i<rentListArr.length; i++ ){
        var markerLatLng = { lat: rentListArr[i].lat, lng: rentListArr[i].lon };

        coords.lat += rentListArr[i].lat;
        coords.lng += rentListArr[i].lon;

        var imageIcon = {
            url: "http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png", 
            scaledSize: new google.maps.Size(30, 30)
        }

        var marker = new google.maps.Marker({
            position: markerLatLng,
            map: map,
            title: "Address: " + rentListArr[i].line + "; Price: $" + rentListArr[i].price,
            icon: imageIcon
          });
    }

    coords.lat = coords.lat / rentListArr.length;
    coords.lng = coords.lng / rentListArr.length;
    
    return coords;
}

// Initialize map
function initMap() {

    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2bb0Fylaw4UA6pfhINwxIWBRN39ggjYc&callback=initMap";
    script.defer = true;
    script.async = true;

    window.initMap = function(){
        map = new google.maps.Map(document.getElementById("map"),{
            center: {lat: 30.436436, lng : -97.747306},
            zoom : 15
        });

        var coords = AddMarkers();

        map.setCenter(coords);
    }

    
    document.head.appendChild(script);
}

initMap();
//getHousesList(78727,'Austin','TX');
