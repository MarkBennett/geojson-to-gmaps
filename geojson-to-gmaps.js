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

    function GeojsonToGmaps(geojson, gmap, gmap_options, event_handlers) {
        var coordinates;
        var options;
        var polyline;
        var handler_function;
        var i;
        var feature;

        if (gmap_options === undefined) {
            options = clone(GeojsonToGmaps.DEFAULT_GMAP_OPTIONS);
        } else {
            if (gmap_options.apply !== undefined) {
                options = gmap_options(geojson);
            } else {
                options = clone(gmap_options);
            }
        }

        switch (geojson.type) {
            case "LineString":
                coordinates = geojson_coordinates_to_gmaps(geojson.coordinates);
                options.path = coordinates;
                options.map = gmap;

                polyline = new google.maps.Polyline(options);

                if (event_handlers !== undefined) {
                    for (var event_name in event_handlers) {
                        handler_function = function() {
                            var event_handler = event_handlers[event_name];
                            var args = Array.prototype.splice(0, 0, polyline);
                            return event_handler.apply(this, args);
                        };
                        google.maps.addListener(
                                polyline, event_name, handler_function);
                    }
                }
                break;
            case "Feature":
                GeojsonToGmaps(geojson.geometry, gmap, gmap_options, event_handlers);
                break;
            case "FeatureCollection":
                for (i = 0; i < geojson.features.length; i++) {
                    feature = geojson.features[i];
                    GeojsonToGmaps(feature, gmap, gmap_options, event_handlers);
                }
                break;
        }
    }

    GeojsonToGmaps.VERSION = "0.1.0";
    GeojsonToGmaps.DEFAULT_GMAP_OPTIONS = {
        strokeColor: 'blue'
    };

    window.GeojsonToGmaps = GeojsonToGmaps;
}());
