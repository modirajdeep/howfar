import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

  // Load the Google Maps API on startup
  Meteor.startup(() => {
    GoogleMaps.load({
      key: 'AIzaSyAK_vkvxDH5vsqGkd0Qn-dDmq-rShTA7UA',
      libraries: 'places'
    });
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


