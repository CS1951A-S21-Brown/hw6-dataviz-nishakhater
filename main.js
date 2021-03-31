// Add your JavaScript code here
const MAX_WIDTH = Math.max(0, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 150, bottom: 40, left: 150};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH), graph_1_height = 650;

let graph_1_radius = Math.min(graph_1_width, graph_1_height) / 2.4;

let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    let graph1 = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", "translate(" + (graph_1_width/2) + "," + (graph_1_height/2) + ")");    // HINT: transform

let title = graph1.append("text")
    .attr("transform", `translate(0, ${-graph_1_radius-25})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .text("Number of Titles Per Genre");

    function createColorScheme(dataLength, colorSchema) {
    var fraction = 1.0/dataLength;
    var i, color;
    colorList = [];
    for (i=0; i < dataLength; i++) {
        color = i*fraction;
        colorList.push(colorSchema(color));
    }
    return colorList;
}


 function setData(inputColorSchema) {

    d3.csv('./data/title_genre.csv').then(function(data) {

        let slice = d3.arc().outerRadius(graph_1_radius).innerRadius(graph_1_radius - 150);
    
        let pie = d3.pie().value(function(d) { return parseFloat(d.percent);});

        let arcs = graph1.selectAll(".arc").data(pie(data));

        let colorSchemes = {"rainbow": ['#46f46e', '#b0ef59', '#773fad', '#74f65a', '#4ff669', '#e040a0', '#664cbe', '#aa3cb2', '#7cf658', '#8a3eb2', '#aaf159', '#cad239', '#cece36', '#3ef375', '#bee044', '#c43dad', '#803eb0', '#6b44b2', '#ff6857', '#6450c2', '#1ddea4', '#bae449', '#eea82f', '#be3caf', '#6a46b4', '#ff6060', '#c0dd42', '#9ef258', '#ff5d65', '#fe4b83', '#d1cb35', '#fe9136', '#ff843d', '#6e40aa', '#ff823e', '#5ff761', '#2cec88', '#63f75f', '#19d2b6', '#6153c6', '#1fb4d2', '#20e29d'],
                            "cool": ['#1fe29e', '#4d6ddb', '#6351c4', '#2e99df', '#4479df', '#5168d8', '#27e98f', '#3988e1', '#22aed6', '#19d0b8', '#a6f159', '#68f75d', '#1ad7af', '#a8f159', '#91f457', '#a0f258', '#1fb5d2', '#19ccbd', '#3e81e1', '#1ddea4', '#1bdaab', '#1bc0c9', '#32ef80', '#22add7', '#a2f258', '#3889e1', '#6bf65c', '#46f46e', '#5564d5', '#5ef661', '#2cec88', '#89f557', '#6d42ae', '#63f75f', '#4f6bda', '#31ef82', '#21b1d5', '#55f665', '#5af663', '#26a5db', '#24e793', '#7af659'],
                            "warm": ['#ff6a54', '#c23dae', '#a73cb3', '#ff724c', '#ff8d37', '#f2a32f', '#da3fa4', '#d13ea8', '#ff5c66', '#db3fa3', '#a23db3', '#8d3eb2', '#ba3cb0', '#8b3eb2', '#ff615f', '#ff5e63', '#8f3db2', '#e7419b', '#7140ab', '#d2ca34', '#ff655a', '#bee044', '#ff843d', '#8a3eb2', '#dc3fa2', '#e4b52e', '#ff7c43', '#df40a0', '#efa62f', '#e0ba2f', '#b1ed56', '#fe4b83', '#b9e54a', '#ff7549', '#873eb1', '#ff5570', '#d7c432', '#b2ec55', '#d1cb35', '#d3c934', '#cad239', '#eb4397']}
        let color = d3.scaleOrdinal().range(colorSchemes[inputColorSchema]);


        arcs.enter()
        .merge(arcs)
        .append("g")
        .attr("class", "arc")
        .append("path")
        .attr("d", slice)
        .attr("fill", function(d){
            return color(d.index);})
        .attr("stroke", "white")
        .style("stroke-width", "1px")
        .on("mouseover", function(d) { mouseover(d) })
        .on("mouseout", function(d) {mouseout(d)})


        arcs.exit().remove();
    });
}

let random_number = function() { 
    return Math.floor(Math.random() * 42);
}

let mouseover = function(d) {

    tooltip.html(d.data['genre'] + "<br/>" +  d.data['titles_per_genre'])
        .style("left", `${(d3.event.pageX) + 10}px`)
        .style("top", `${(d3.event.pageY)}px`)
        .style("box-shadow", `1px 1px 5px`)
        .transition()
        .duration(200)
        .style("opacity", 1)
};

let mouseout = function(d, attr) {
    tooltip.transition()
        .duration(200)
        .style("opacity", 0);
};
setData("rainbow");