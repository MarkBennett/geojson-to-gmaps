(function () {
    // utitlity functions
    var push = Array.prototype.push;
    var splice = Array.prototype.splice;
    var concat = Array.prototype.concat;

    // Given a value, produce a deep copy
    function clone(original) {
       return JSON.parse(JSON.stringify(original));
    }

    // Given a function, return a new function that's binds a extra arguments
    // to it's argument list when invoked
    function bind(func, extra_arg1, extra_arg2, extra_arg3, extra_argX) {
        var extra_args = splice.call(arguments, 1);

        return (function() {
            var args = splice.call(arguments, 0);
            args = args.concat(extra_args);
            return func.apply(this, args);
        });
    }

    function geojson_coordinates_to_gmaps(geojson_coords) {
        var gmap_coords = new Array(geojson_coords.length);
        var i;

        for (i=0; i < geojson_coords.length; i++) {
            gmap_coords[i] =
                new google.maps.LatLng(geojson_coords[i][1], geojson_coords[i][0]);
        }

        return gmap_coords;
    }

    function addLineString(geojson, geojson_coordinates, gmap, options, event_handlers, feature) {
        var coordinates = geojson_coordinates_to_gmaps(geojson_coordinates);
        var handler_function;
        var polyline;

        options.path = coordinates;
        options.map = gmap;

        polyline = new google.maps.Polyline(options);

        if (event_handlers !== undefined) {
            for (var event_name in event_handlers) {
                handler_function = bind(event_handlers[event_name], feature, polyline);
                google.maps.event.addListener(
                        polyline, event_name, handler_function);
            }
        }

        return polyline;
    }

    function determine_options(gmap_options, current_feature) {
        var options;

        if (gmap_options === undefined) {
            options = clone(geojson_to_gmaps.DEFAULT_GMAP_OPTIONS);
        } else {
            if (gmap_options.apply !== undefined) {
                options = gmap_options(current_feature);
            } else {
                options = clone(gmap_options);
            }
        }

        return options;
    }

    function geojson_to_gmaps(geojson, gmap, gmap_options, event_handlers, current_feature) {
        var options;
        var i;
        var feature;
        var overlays = [];

        switch (geojson.type) {
            case "LineString":
                options = determine_options(gmap_options, current_feature);
                overlays.push(addLineString(geojson, geojson.coordinates,
                        gmap, options, event_handlers,current_feature));
                break;
            case "MultiLineString":
                options = determine_options(gmap_options, current_feature);
                for (i = 0; i < geojson.coordinates.length; i++) {
                    overlays.push(addLineString(geojson,
                            geojson.coordinates[i], gmap, options,
                            event_handlers, current_feature));
                }
                break;
            case "Feature":
                overlays = overlays.concat(
                        geojson_to_gmaps(geojson.geometry, gmap, gmap_options,
                            event_handlers, geojson));
                break;
            case "FeatureCollection":
                for (i = 0; i < geojson.features.length; i++) {
                    feature = geojson.features[i];
                    overlays = overlays.concat(
                            geojson_to_gmaps(feature, gmap, gmap_options,
                                event_handlers));
                }
                break;
        }

        return overlays;
    }

    geojson_to_gmaps.VERSION = "0.4.0";
    geojson_to_gmaps.DEFAULT_GMAP_OPTIONS = {
        strokeColor: 'blue'
    };

    geojson_to_gmaps.bind = bind;

    window.geojson_to_gmaps = geojson_to_gmaps;
}());
