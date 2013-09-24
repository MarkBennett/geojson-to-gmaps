describe("GeojsonToGmaps()", function() {
    var gmap;
    var polyline;

    beforeEach(function() {
        gmap = {};
        polyline = {};

        window.google = {};
        window.google.maps = {};
        window.google.maps.Polyline = jasmine.createSpy("Polyline").andReturn(polyline);
    });

    describe("LineString", function() {
        var line_string;
        var gmap;

        beforeEach(function() {

            line_string = {
                "type": "LineString",
                "coordinates": [
                    [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                ]
            };
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
            var overlays;

            overlays = GeojsonToGmaps(line_string, gmap, options);

            expect(window.google.maps.Polyline).
                toHaveBeenCalledWith(expected_options);
        });

        it("returns added LineString overlays", function() {
            var overlays = GeojsonToGmaps(line_string, gmap);

            expect(overlays.length).toEqual(1);
            expect(overlays[0]).toEqual(polyline);
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
            };

            google.maps.addListener = jasmine.createSpy('addListener');

            GeojsonToGmaps(line_string, gmap, {}, event_handlers);

            expect(google.maps.addListener).toHaveBeenCalledWith(polyline, 'click', jasmine.any(Function));
        });
    });

    describe("MultiLineString", function() {
        var multilinestring;

        beforeEach(function() {
            multilinestring = {
                "type": "MultiLineString",
                "coordinates": [
                    [ [100.0, 0.0], [101.0, 1.0] ],
                    [ [102.0, 2.0], [103.0, 3.0] ]
                ]
            };
        });

        it("adds a GeoJSON MultiLineString to the Google Map", function() {
            var options = {
                strokeColor: 'pink'
            };
            var expected_options_1 =
                _.extend(options, {
                    path: [
                        [0.0, 100.0], [1.0, 101.0]
                    ],
                    map: gmap
                });
            var expected_options_2 =
                _.extend(options, {
                    path: [
                        [2.0, 102.0], [3.0, 103.0]
                    ],
                    map: gmap
                });

            GeojsonToGmaps(multilinestring, gmap, options);

            expect(google.maps.Polyline).toHaveBeenCalledWith(expected_options_1);
            expect(google.maps.Polyline).toHaveBeenCalledWith(expected_options_2);
        });

        it("return added LineString overlays", function() {
            var overlays;

            overlays = GeojsonToGmaps(multilinestring, gmap);

            expect(overlays.length).toEqual(2);
            expect(overlays[0]).toEqual(polyline);
            expect(overlays[1]).toEqual(polyline);
        });
    });

    describe("Feature", function() {
        var feature;

        beforeEach(function() {
            feature = { "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                    ]
                },
                "properties": {
                    "prop0": "value0",
                    "prop1": 0.0
                }
            };
        });

        it("adds a GeoJSON Feature to the Google Map", function() {
            var options = {
                strokeColor: 'purple'
            };
            var expected_options =
                _.extend(options, {
                    path: [
                        [0.0, 102.0], [1.0, 103.0], [0.0, 104.0], [1.0, 105.0]
                    ],
                    map: gmap
                });

            GeojsonToGmaps(feature, gmap, options);

            expect(google.maps.Polyline).toHaveBeenCalledWith(expected_options);
        });

        it("adds a GeoJSON Feature with a click handler", function() {
            var click_handler = jasmine.createSpy('click_handler');

            var event_handlers = {
                click: click_handler
            };

            google.maps.addListener = jasmine.createSpy('addListener');

            GeojsonToGmaps(feature, gmap, {}, event_handlers);

            expect(google.maps.addListener).toHaveBeenCalledWith(polyline, 'click', jasmine.any(Function));
        });

        it("returns added overlays", function() {
            var overlays;

            overlays = GeojsonToGmaps(feature, gmap);

            expect(overlays.length).toEqual(1);
            expect(overlays[0]).toEqual(polyline);
        });
    });

    describe("FeatureCollection", function() {
        var feature_collection;

        beforeEach(function() {
            feature_collection = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                        "properties": {"prop0": "value0"}
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                            ]
                        },
                        "properties": {
                            "prop0": "value0",
                            "prop1": 0.0
                        }
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                                [100.0, 1.0], [100.0, 0.0] ]
                            ]
                        },
                        "properties": {
                            "prop0": "value0",
                            "prop1": {"this": "that"}
                        }
                    }
                ]
            };
        });

        it("adds a GeoJSON FeatureCollection to the Google Map", function() {
            var options = {
                strokeColor: 'green'
            };
            var expected_options =
                _.extend(options, {
                    path: [
                        [0.0, 102.0], [1.0, 103.0], [0.0, 104.0], [1.0, 105.0]
                    ],
                    map: gmap
                });

            GeojsonToGmaps(feature_collection, gmap, options);

            expect(google.maps.Polyline).toHaveBeenCalledWith(expected_options);
        });

        it ("return the added overlays", function() {
            var overlays;

            overlays = GeojsonToGmaps(feature_collection, gmap);

            expect(overlays.length).toEqual(1);
            expect(overlays[0]).toEqual(polyline);
        });
    });

    it("raises an error if the type is unknown");
    it("raises an error if the type is missing");
    it("raises an error if the geometry is missing");

    describe("bind()", function() {
        it('binds an extra argument when given a function', function() {
            var test_func = jasmine.createSpy('test_func');
            var extra_arg = 123;

            var bound_func = GeojsonToGmaps.bind(test_func, extra_arg);

            bound_func('abc');

            expect(test_func).toHaveBeenCalledWith('abc', 123);
        });
    });
});
