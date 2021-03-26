let graph_3_width = (MAX_WIDTH-200), graph_3_height = 500; 
let numExamples3 = 20;
const margin3 = {top: 100, right: 150, bottom: 40, left: 300};

let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin3.left},${margin3.top})`); 

let countRef3 = svg3.append("g");

d3.csv('./../data/actor_director.csv').then(function(data) {
    data = cleanData(data, function(a, b) { 
        bval = parseInt(b.movie_count)
        aval = parseInt(a.movie_count)
        return bval - aval 
    }, numExamples3);

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            val = parseInt(d.movie_count);
            return val;
        })])
        .range([0, (graph_3_width) - margin3.left - margin3.right]);
    
    let y = d3.scaleBand()
        .domain(data.map(function(d) { return d.director_actor}))
        .range([0, graph_3_height - margin3.top - margin3.bottom])
        .padding(0.1);

    svg3.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg3.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d['director_actor'] }))
        .range(d3.quantize(d3.interpolateHcl("#DC9CC4", "#B6CBF9"), numExamples3));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['director_actor']) })
        .transition()
        .duration(1000)
        .attr("x", x(0))
        .attr("y", function(d) { return y(d.director_actor); })
        .attr("width", function(d) { return x(parseInt(d.movie_count)); })
        .attr("height", y.bandwidth()); 
    

    let counts = countRef3.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x(parseInt(d.movie_count)) + 12; })
        .attr("y", function(d) { return y(d.director_actor) + 12; })
        .style("text-anchor", "start")
        .text(function(d) { return parseInt(d.movie_count)});

    svg3.append("text")
        .attr("transform", `translate(${((graph_3_width/2) - margin3.left - margin3.right) / 2},
        ${(graph_3_height - margin3.top - margin3.bottom) + 15})`)
        .style("text-anchor", "middle")
        .text("Movies Made");

    svg3.append("text")
        .attr("transform", `translate(-230, ${(graph_3_height - margin3.top - margin3.bottom) / 2})`)
        .style("text-anchor", "middle")
        .text("Director/Actor Pair");

    svg3.append("text")
        .attr("transform", `translate(${((graph_3_width/1.5) - margin3.left - margin3.right) / 2}, ${-10})`)
        .style("text-anchor", "middle")
        .style("font-size", 20)
        .text("Top 20 Director/Actor Pairs On Netflix");

});

function cleanData(data, comparator, numExamples) {
    data = data.sort(comparator).slice(0, numExamples);
    return data;
}