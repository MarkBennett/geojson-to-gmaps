(function() {

    // Handy utitlity functions
    var push = Array.prototype.push;
    var splice = Array.prototype.splice;
    var concat = Array.prototype.concat;

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

    function addLineString(geojson, geojson_coordinates, gmap, options, event_handlers) {
        var coordinates = geojson_coordinates_to_gmaps(geojson_coordinates);
        var handler_function;
        var polyline;

        options.path = coordinates;
        options.map = gmap;

        polyline = new google.maps.Polyline(options);

        if (event_handlers !== undefined) {
            for (var event_name in event_handlers) {
                handler_function = bind(event_handlers[event_name], geojson);
                google.maps.addListener(
                        polyline, event_name, handler_function);
            }
        }

        return polyline;
    }

    // Given a function, return a new function that's binds an extra argument
    // to it's argument list when invoked
    function bind(func, extra_arg) {
        return (function() {
            var args = splice.call(arguments, 0); 
            args.push(extra_arg);
            return func.apply(this, args);
        });
    }

    function GeojsonToGmaps(geojson, gmap, gmap_options, event_handlers) {
        var options;
        var i;
        var feature;
        var overlays = [];

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
                overlays.push(addLineString(geojson, geojson.coordinates,
                        gmap, options, event_handlers));
                break;
            case "MultiLineString":
                for (i = 0; i < geojson.coordinates.length; i++) {
                    overlays.push(addLineString(geojson,
                            geojson.coordinates[i], gmap, options,
                            event_handlers));
                }
                break;
            case "Feature":
                overlays = overlays.concat(
                        GeojsonToGmaps(geojson.geometry, gmap, gmap_options,
                            event_handlers));
                break;
            case "FeatureCollection":
                for (i = 0; i < geojson.features.length; i++) {
                    feature = geojson.features[i];
                    overlays = overlays.concat(
                            GeojsonToGmaps(feature, gmap, gmap_options,
                                event_handlers));
                }
                break;
        }

        return overlays;
    }

    GeojsonToGmaps.VERSION = "0.1.0";
    GeojsonToGmaps.DEFAULT_GMAP_OPTIONS = {
        strokeColor: 'blue'
    };

    GeojsonToGmaps.bind = bind;

    window.GeojsonToGmaps = GeojsonToGmaps;
}());
