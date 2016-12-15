Meteor.methods({
  getDistance: function (lat1, lng1, lat2, lng2) {
    var key = "AIzaSyAK_vkvxDH5vsqGkd0Qn-dDmq-rShTA7UA"
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json";
    console.log(lat1);
    console.log(lng1);
    console.log(lat2);
    console.log(lng2);
    var response = HTTP.get(url, {params: {units: "metric",
                                    origins: lat1+","+lng1,
                                    destinations: lat2+","+lng2,
                                    key: key }});
    console.log(response);
    try {
        distance = response.data.rows[0].elements[0].distance.text;
        duration = response.data.rows[0].elements[0].duration.text;
        } catch(err) {
            distance = "undefined";
            duration = "undefined";
        }

    var result = { distance: distance,
                   duration: duration };
    console.log(result);
    return result;
}
});