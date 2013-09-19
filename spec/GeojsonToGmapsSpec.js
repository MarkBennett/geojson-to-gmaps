describe("GeojsonToGmaps()", function() {
    it("adds a GeoJSON LineString to the Google Map", function() {
        var line_string = {
            "type": "LineString",
            "coordinates": [
                [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
            ]
        };
        var gmap = {};
        var options = {
            strokeColor: 'red'
        };
        var expected_options = _.extend(options, {
            path: [
                [0.0, 102.0], [1.0, 103.0], [0.0, 104.0], [1.0, 105.0]
            ],
            map: gmap
        });

        window.google = {};
        window.google.maps = jasmine.createSpyObj("maps", ["Polyline"]);

        GeojsonToGmaps(line_string, gmap, options);

        expect(window.google.maps.Polyline).
            toHaveBeenCalledWith(expected_options);
    });

    it("adds a GeoJSON Feature to the Google Map");
    it("adds a GeoJSON FeatureCollection to the Google Map");
});
