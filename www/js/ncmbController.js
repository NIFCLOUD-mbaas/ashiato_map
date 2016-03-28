// This is a JavaScript file

var application_key = "YOUR_APPLICATION_KEY";
var client_key = "YOUR_CLIENT_KEY";

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

  }
};

var event = typeof cordova === 'undefined' ? 'DOMContentLoaded' : 'deviceready';

document.addEventListener(event, ncmbController.run, false);