import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

  // Load the Google Maps API on startup
  Meteor.startup(() => {
    GoogleMaps.load({
      key: 'AIzaSyAK_vkvxDH5vsqGkd0Qn-dDmq-rShTA7UA',
      libraries: 'places'
    });
  });
Meteor.subscribe("coordinates");

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Template.geocode.onRendered(function () {

    this.autorun(() => {
      // Wait for API to be loaded
      if (GoogleMaps.loaded()) {

        // Example 1 - Autocomplete only
        $('#place1').geocomplete({
            details: "#form1"
        });

        $('#place2').geocomplete({
            details: "#form2"
        });

        }
    });
    $(document).ready(function() {

      $("#result").hide();
      $("#map").hide();

      $("#geocode").click(function() {
        var lat1 = $('#form1').find('input[name="lat"]').val();
        var lng1 = $('#form1').find('input[name="lng"]').val();
        var lat2 = $('#form2').find('input[name="lat"]').val();
        var lng2 = $('#form2').find('input[name="lng"]').val();
        if((lat1 == "")||(lng1 == "")||(lat2 == "")||(lng2 == "")) {
          Bert.alert('Location can\'t be Empty', 'danger', 'fixed-bottom');
          return false;
        }
        else {
          Bert.alert('Searching', 'success', 'fixed-bottom');

          var url = "https://www.google.com/maps/embed/v1/directions?"+
          "units=metric&origin="+lat1+","+lng1+"&destination="+lat2+","+
          lng2+"&key=AIzaSyBKe48LvMYJPleqFNvbE1OF_Wt-k7rHLzY";

          var coordinates = $('#form1, #form2').serialize();

          $.post("/distance", coordinates,
                function(data, status) {
                  if(data.distance=="undefined"){
                    Bert.alert('Invalid locations for driving directions.', 'danger', 'fixed-bottom');
                  }
                  else {
                    $("#distance").text(data.distance);
                    $("#duration").text(data.duration);
                    $("#result").show();
                    $("#map").attr('src',url).show();
                  }
                });
        }
      });
    });

});

Template.geoLocate.onRendered(function () {
  var id = Meteor.userId();
  if(id!=undefined){
    Meteor.call('getCoordinates',id, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        try {
          lat = result[0].lat;
          lng = result[0].lng;
          var key = "AIzaSyBKe48LvMYJPleqFNvbE1OF_Wt-k7rHLzY";
          var url = "https://www.google.com/maps/embed/v1/place?key="+key+"&q="+lat+","+lng;
          $("#locateMap").attr('src',url);
          createdAt = result[0].createdAt;
        } catch(err) {
          Bert.alert('Update location to view saved location.', 'danger', 'fixed-bottom');
          Router.go('/geolocate/liveupdate');
        }
      }
    });
  }
})

Template.geoUpdate.onCreated(function() {
  if(!Meteor.userId()){
    Router.go('/geolocate');
  }

  var setLat,setLng;
  var setLat = Session.get("lat");
  var setLng = Session.get("lng");

  if(setLng&&setLat) {
    delete Session.keys['lat'];
    delete Session.keys['lng'];
  }

  var self = this;
  self.autorun(function() {
    var latLng = Geolocation.latLng();

    var setLat = Session.get("lat");
    var setLng = Session.get("lng");

    if(latLng) {
      var lat = latLng.lat;
      var lng = latLng.lng;
      if((lat!=setLat)||(lng!=setLng)) {

        var key = "AIzaSyBKe48LvMYJPleqFNvbE1OF_Wt-k7rHLzY";
        var url = "https://www.google.com/maps/embed/v1/place?key="+key+"&q="+lat+","+lng;
        Session.set("lat", lat);
        Session.set("lng", lng);
        $("#map").attr('src',url);
        if($("#map").attr("src")==undefined){
          // Reload page because map doesn't render
          location.reload();
        }
        var now = new Date();
        var time = now.toString().substr(16,8);
        $("#updatedAt").text(time);

        Meteor.call('upsert', Meteor.userId(), lat, lng);
      }
    }
  });
});

Template.geoUpdate.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  }
});
