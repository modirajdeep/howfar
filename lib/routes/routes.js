import '../methods/methods.js'

Router.configure({
    layoutTemplate: 'main_layout'
});

Router.map(function(){
    // Home
    this.route('home', {
        path: '/',
        template: 'geocode'
    });

    // Home
    this.route('geolocate', {
        path: '/geolocate',
        template: 'map'
    });

    this.route('distance', {
        path: '/distance',
        where: 'server',
        action: function() {
            var result;
            try {
                var requestData = this.request.body;
                var lat1 = requestData.lat[0];
                var lat2 = requestData.lat[1];
                var lng1 = requestData.lng[0];
                var lng2 = requestData.lng[1];

                var data = Meteor.call('getDistance',lat1, lng1, lat2, lng2);
                result = JSON.stringify({
                    distance: data.distance,
                    duration: data.duration
                });
            } catch(err) {
                result = "Send POST request with parameters as lat=&lng=&lat=&lng=";
            }
            this.response.writeHead(200, {'Content-Type': 'application/json'});
            this.response.end(result);
        }
    });

});


