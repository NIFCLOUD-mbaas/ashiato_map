// This is a JavaScript file

var application_key = "01cd93385934a7aaef6e3b6f385051d4fb4714ca26bc062d55689df1a7dcda89";
var client_key = "87ffe8898bfe990c2fe291636feafe3fb5b1eac1422be2b5b22c9d7e2bca0767";

var ncmb = new NCMB(application_key, client_key);
var Places = ncmb.DataStore("Places");
var map = new OpenLayers.Map("map");
var mapnik = new OpenLayers.Layer.OSM();
map.addLayer(mapnik);

var projection3857 = new OpenLayers.Projection("EPSG:3857");
var projection4326 = new OpenLayers.Projection("EPSG:4326");
var popup = null;

var ncmbController = {
  run: function() {
    var self = this;
    // 現在位置を取得します
    navigator.geolocation.getCurrentPosition(function(location) {
      // 現在位置を取得すると、locationという変数の位置情報オブジェクトが入ります
      // 位置情報を使って、OpenLayersの位置情報オブジェクトに変換します
      // その際、EPSG:4326からEPSG:3857に変換する指定を行います
      var lonLat = new OpenLayers.LonLat(location.coords.longitude, location.coords.latitude)
       .transform(
         projection4326,
         projection3857
      );
      // 作成した位置情報を地図の中央に設定します
      map.setCenter(lonLat, 15);
      
      // マーカーを検索する処理です
      ncmbController.findMarkers(location.coords.latitude, location.coords.longitude);
      
      // ボタンを追加する処理です
      ncmbController.addButton();
    });
  },

  findMarkers: function(latitude, longitude) {
    // mBaaSの位置情報オブジェクトを作成
    var current_position = new ncmb.GeoPoint(latitude, longitude);
    Places
      .withinKilometers("point", current_position, 1000)
      .limit(20)
      .fetchAll()
      .then(function(places) {
        for (var i = 0; i < places.length; i++) {
          var place = places[i];
          ncmbController.addMarker(place.areaName, place.point.latitude, place.point.longitude);
        }
      })
      .catch(function(err) {
        alert("エラーが発生しました");
      });
  },
  addMarker: function(areaName, latitude, longitude) {
    // マーカーを表示するためのレイヤーを準備
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    
    // マーカーを作成
    var marker = new OpenLayers.Marker(
      new OpenLayers.LonLat(longitude, latitude)
      .transform(
        projection4326,
        projection3857
      )
    );
    // マーカーのタグとしてエリア名を指定
    marker.tag = areaName;
    
    // マーカーをタップした際にポップアップを表示します
    marker.events.register("touchstart", marker, function(event) {
      // すでに別なポップアップが開いていたら消します
      if (popup) map.removePopup(popup);
      // ポップアップを作成
      popup = new OpenLayers.Popup("chicken",
           event.object.lonlat,
           new OpenLayers.Size(100,50),
           event.object.tag,
           true);
      // 作成したポップアップを地図に追加します
      map.addPopup(popup);
    });
    
    // 作成したマーカーを地図（マーカーレイヤー）に追加します
    markers.addMarker(marker);
  },

  addButton: function() {
    var custom_button = new OpenLayers.Control.Button({
      displayClass : 'olControlCustomButton',
      trigger : ncmbController.createPlace
    })
    var control_panel = new OpenLayers.Control.Panel({});
    control_panel.addControls([custom_button])
    map.addControl(control_panel);
  },

  createPlace: function() {
    // エリア名の入力を促す
    var areaName = prompt("場所の名前を入力してください");
    navigator.geolocation.getCurrentPosition(function(location) {
      var geoPoint = new ncmb.GeoPoint(location.coords.latitude, location.coords.longitude);
      var place = new Places();
      place.set("areaName", areaName);
      place.set("point", geoPoint);
      place.save()
        .then(function(point) {
          ncmbController.addMarker(point);
        })
        .catch(function(err) {
          alert("エラーが発生しました。再度行ってください") 
        });
    });
  }
};

var event = typeof cordova === 'undefined' ? 'DOMContentLoaded' : 'deviceready';

document.addEventListener(event, ncmbController.run, false);
