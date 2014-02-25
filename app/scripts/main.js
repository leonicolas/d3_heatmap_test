(function($, d3, topojson, tabletop) {
    'use strict';

    var width = 960;
    var height = 600;

    var svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height);

    var temperatures = [];

    tabletop.init({
        key: '0An8rOECTRZUidER3RlhkcUc4QWdkT3BFb19ac29Cb1E',
        callback: function(data) {
            for(var index in data) {
                var value = data[index];
                temperatures[value.estado] = (temperatures[value.estado] ? temperatures[value.estado] : 0) + parseInt(value.indice);
            }
            render();
        },
        simpleSheet: true
    });

    function render() {
        d3.json('brasil.json', function(error, mapData) {
            console.log(mapData);

            var states = topojson.feature(mapData, mapData.objects.brasil);

            var projection = d3.geo.mercator()
                .center([-60, -15])
                .scale(700)
                .translate([width / 2, height / 2]);

            var path = d3.geo.path()
                .projection(projection);

            svg.selectAll('.brasil')
                .data(states.features)
                .enter().append('path')
                .attr('id', function(d) { return d.id; })
                .attr('class', function(d) {
                    var rate = temperatures[d.id];
                    return rate ? 'temperature_' + rate : '';
                })
                .attr('d', path);
            $('.loading').fadeOut();
        });
    }
})(jQuery, window.d3, window.topojson, window.Tabletop);