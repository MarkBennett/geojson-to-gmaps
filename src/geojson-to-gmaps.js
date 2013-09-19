(function() {

    function geojson_coordinates_to_gmaps(geojson_coords) {
        var gmap_coords = new Array(geojson_coords.length);
        var i;

        for (i=0; i < geojson_coords.length; i++) {
            gmap_coords[i] = [ geojson_coords[i][1], geojson_coords[i][0] ];
        }

        return gmap_coords;
    }

    function GeojsonToGmaps(geojson, gmap, options) {
        var coordinates = geojson_coordinates_to_gmaps(geojson.coordinates);

        options.path = coordinates;
        options.map = gmap;

        new google.maps.Polyline(options);
    }

    GeojsonToGmaps.VERSION = "0.0.0";

    window.GeojsonToGmaps = GeojsonToGmaps;
}());
