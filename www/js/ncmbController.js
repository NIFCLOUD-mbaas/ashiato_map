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
    // ���݈ʒu���擾���܂�
    navigator.geolocation.getCurrentPosition(function(location) {
      // ���݈ʒu���擾����ƁAlocation�Ƃ����ϐ��̈ʒu���I�u�W�F�N�g������܂�
      // �ʒu�����g���āAOpenLayers�̈ʒu���I�u�W�F�N�g�ɕϊ����܂�
      // ���̍ہAEPSG:4326����EPSG:3857�ɕϊ�����w����s���܂�
      var lonLat = new OpenLayers.LonLat(location.coords.longitude, location.coords.latitude)
       .transform(
         projection4326,
         projection3857
      );
      // �쐬�����ʒu����n�}�̒����ɐݒ肵�܂�
      map.setCenter(lonLat, 15);
      
      // �}�[�J�[���������鏈���ł�
      ncmbController.findMarkers(location.coords.latitude, location.coords.longitude);
      
      // �{�^����ǉ����鏈���ł�
      ncmbController.addButton();
    });
  },

  findMarkers: function(latitude, longitude) {
    // mBaaS�̈ʒu���I�u�W�F�N�g���쐬
    
  },
  addMarker: function(areaName, latitude, longitude) {
    // �}�[�J�[��\�����邽�߂̃��C���[������
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    
    // �}�[�J�[���쐬
    var marker = new OpenLayers.Marker(
      new OpenLayers.LonLat(longitude, latitude)
      .transform(
        projection4326,
        projection3857
      )
    );
    // �}�[�J�[�̃^�O�Ƃ��ăG���A�����w��
    marker.tag = areaName;
    
    // �}�[�J�[���^�b�v�����ۂɃ|�b�v�A�b�v��\�����܂�
    marker.events.register("touchstart", marker, function(event) {
      // ���łɕʂȃ|�b�v�A�b�v���J���Ă���������܂�
      if (popup) map.removePopup(popup);
      // �|�b�v�A�b�v���쐬
      popup = new OpenLayers.Popup("chicken",
           event.object.lonlat,
           new OpenLayers.Size(100,50),
           event.object.tag,
           true);
      // �쐬�����|�b�v�A�b�v��n�}�ɒǉ����܂�
      map.addPopup(popup);
    });
    
    // �쐬�����}�[�J�[��n�}�i�}�[�J�[���C���[�j�ɒǉ����܂�
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
    // �G���A���̓��͂𑣂�

  }
};

var event = typeof cordova === 'undefined' ? 'DOMContentLoaded' : 'deviceready';

document.addEventListener(event, ncmbController.run, false);