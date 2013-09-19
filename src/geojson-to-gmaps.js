(function() {

    function geojson_coordinates_to_gmaps(geojson_coords) {
        var gmap_coords = new Array(geojson_coords.length);
        var i;

        for (i=0; i < geojson_coords.length; i++) {
            gmap_coords[i] = [ geojson_coords[i][1], geojson_coords[i][0] ];
        }

        return gmap_coords;
    }

    function clone(original) {
       return JSON.parse(JSON.stringify(original));
    }

    function GeojsonToGmaps(geojson, gmap, gmap_options) {
        var coordinates = geojson_coordinates_to_gmaps(geojson.coordinates);
        var options;

        if (gmap_options === undefined) {
            options = clone(GeojsonToGmaps.DEFAULT_GMAP_OPTIONS);
        } else {
            if (gmap_options.apply !== undefined) {
                options = gmap_options(geojson);
            } else {
                options = clone(gmap_options);
            }
        }

        options.path = coordinates;
        options.map = gmap;

        new google.maps.Polyline(options);
    }

    GeojsonToGmaps.VERSION = "0.0.0";
    GeojsonToGmaps.DEFAULT_GMAP_OPTIONS = {
        strokeColor: 'blue'
    };

    window.GeojsonToGmaps = GeojsonToGmaps;
}());
