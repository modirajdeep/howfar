import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Coordinates = new Mongo.Collection('coordinates');

  Meteor.publish("coordinates", function() {
    return Coordinates.find();
  })

});

Meteor.methods({
  getDistance: function (lat1, lng1, lat2, lng2) {
    var key = "AIzaSyAK_vkvxDH5vsqGkd0Qn-dDmq-rShTA7UA"
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json";
    var response = HTTP.get(url, {params: {units: "metric",
                                    origins: lat1+","+lng1,
                                    destinations: lat2+","+lng2,
                                    key: key }});
    try {
        distance = response.data.rows[0].elements[0].distance.text;
        duration = response.data.rows[0].elements[0].duration.text;
        } catch(err) {
            distance = "undefined";
            duration = "undefined";
        }

    var result = { distance: distance,
                   duration: duration };
    return result;
  },
    upsert: function(belongsTo, lat, lng) {
      Coordinates.upsert({belongsTo: belongsTo}, {
            $set: {
                belongsTo: belongsTo,
                lat: lat,
                lng: lng,
                createdAt: new Date()
            }
        });

    },

    getCoordinates: function(belongsTo) {
      var val = Coordinates.find({belongsTo: belongsTo}).fetch();
      return val;
    },

    cronUpdateLocation: function() {

    }
});

SyncedCron.add({
  name: 'update location',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 hour');
  },
  job: function() {
    // Random data
    var latArray = ["28.614816", "28.680911", "28.567695", "28.600278"];
    var lngArray = ["77.229561", "77.204587", "77.243272", "77.226806"];
    var randArrayKey = Math.floor(Math.random() * 4)
    var lat = latArray[randArrayKey];
    var lng = lngArray[randArrayKey];
    var belongsTo = 'cron';

    Meteor.call('upsert', belongsTo, lat, lng);
    console.log("location updated with key: " + randArrayKey);
    var next = SyncedCron.nextScheduledAtDate('update location')
    console.log("next scheduled at "+next.toString().substr(16,8));
  }
});

SyncedCron.start();
