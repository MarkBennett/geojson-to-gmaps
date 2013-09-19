describe("GeojsonToGmaps()", function() {
    var line_string = {
        "type": "LineString",
        "coordinates": [
            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
        ]
    };
    var gmap = {};
    var polyline = {};

    beforeEach(function() {
        window.google = {};
        window.google.maps = {};
        window.google.maps.Polyline = jasmine.createSpy("Polyline").andReturn(polyline);
    });

    it("adds a GeoJSON LineString to the Google Map", function() {
        var options = {
            strokeColor: 'red'
        };
        var expected_options = _.extend(options, {
            path: [
                [0.0, 102.0], [1.0, 103.0], [0.0, 104.0], [1.0, 105.0]
            ],
            map: gmap
        });

        GeojsonToGmaps(line_string, gmap, options);

        expect(window.google.maps.Polyline).
            toHaveBeenCalledWith(expected_options);
    });

    it("adds a GeoJSON LineString with default gmap options when none are specified", function() {
        var expected_options = _.extend(GeojsonToGmaps.DEFAULT_GMAP_OPTIONS, {
            path: [
                [0.0, 102.0], [1.0, 103.0], [0.0, 104.0], [1.0, 105.0]
            ],
            map: gmap
        });

        GeojsonToGmaps(line_string, gmap);

        expect(window.google.maps.Polyline).
            toHaveBeenCalledWith(expected_options);
    });

    it("adds a GeoJSON LineString with options returned from a function", function() {
        var func_ret_options = {
            strokeColor: 'yellow'
        };
        var options_func =
            jasmine.createSpy('options_func').andReturn(func_ret_options);

        GeojsonToGmaps(line_string, gmap, options_func);

        expect(options_func).toHaveBeenCalled();
        expect(window.google.maps.Polyline).
            toHaveBeenCalledWith(func_ret_options);
    });

    it("adds a GeoJSON LineString with a click handler", function() {
        var click_handler = jasmine.createSpy('click_handler');

        var event_handlers = {
            click: click_handler
        }

        google.maps.addListener = jasmine.createSpy('addListener');

        GeojsonToGmaps(line_string, gmap, {}, event_handlers);

        expect(google.maps.addListener).toHaveBeenCalledWith(polyline, 'click', click_handler);
    });

    it("adds a GeoJSON Feature to the Google Map");
    it("adds a GeoJSON FeatureCollection to the Google Map");
});
