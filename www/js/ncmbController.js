// This is a JavaScript file

var application_key = "YOUR_APPLICATION_KEY";
var client_key = "YOUR_CLIENT_KEY";

var ncmbController = {
    init: function() {
        var ncmb = new NCMB(application_key, client_key);
        var Places = ncmb.DataStore("Places");
        var token = 'MAPBOX_TOKEN';
        navigator.geolocation.getCurrentPosition(function(location) {
            var map = L.map('map').setView([location.coords.latitude, location.coords.longitude], 15);
            
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+token, {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'MAPBOX_PROJECT_ID',
                accessToken: token
            }).addTo(map);
            
            // var markerArray = [];        
            var current_position = new ncmb.GeoPoint(location.coords.latitude, location.coords.longitude);
            Places
            .withinKilometers("point", current_position, 1000)
            .limit(20)
            .fetchAll()
            .then(function(places) {
                for (var i = 0; i < places.length; i++) {
                    var place = places[i];
                    var marker = L.marker([place.point.latitude, place.point.longitude]).addTo(map)
                    .bindPopup("<h1>"+place.areaName+"</h1>")
                    .on('click', function(event) {
                        this.openPopup();
                    });
                    // markerArray.push(marker);
                }
                // var group = new L.featureGroup(markerArray);
                // map.fitBounds(group.getBounds());
            });
        });
        var button = document.getElementById("add_button");
        button.addEventListener("click", function(event) {
            var place = prompt("場所の名前を入力してください");
            navigator.geolocation.getCurrentPosition(function(location) {
                var geoPoint = new ncmb.GeoPoint(location.coords.latitude, location.coords.longitude);
                var point = new Places();
                point.set("areaName", place);
                point.set("point", geoPoint);
                point.save().then(function() {
                    
                })
                .catch(function(err) {
                    alert("エラーが発生しました。再度行ってください") 
                });
            });
        });
    }
};

document.addEventListener("DOMContentLoaded", function(event) { 
  ncmbController.init();
});

