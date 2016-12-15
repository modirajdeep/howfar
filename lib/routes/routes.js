Router.configure({
    layoutTemplate: 'main_layout'
});

Router.map(function(){
    // Home
    this.route('home', {
        path: '/',
        template: 'geocode'
    });

    this.route('distance', {
        path: '/distance',
        where: 'server',
        action: function() {

            // Data from a POST request
            var requestData = this.request.body;

            var lat1 = requestData.lat[0];
            var lat2 = requestData.lat[1];
            var lng1 = requestData.lng[0];
            var lng2 = requestData.lng[1];
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
            var result = JSON.stringify({
                distance: distance,
                duration: duration
            });

            this.response.writeHead(200, {'Content-Type': 'application/json'});
            this.response.end(result);
        }
    });

});


