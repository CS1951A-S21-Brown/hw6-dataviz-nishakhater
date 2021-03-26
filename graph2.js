
// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_2_width = (MAX_WIDTH), graph_2_height = 800; 

let svg = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`); 


let countRef2 = svg.append("g");

d3.csv('./../data/runtime_years.csv').then(function(data) {
    // TODO: Clean and strip desired amount of data for barplot
    data = cleanData(data, function(a, b) { 
        bval = parseInt(b.year)
        aval = parseInt(a.year)
        return aval - bval 
    });

    let dataLen = data.length;

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            val = parseFloat(d.avg_time);
            return val;
        })])
        .range([0, graph_2_width - margin.left - margin.right]);


    let y = d3.scaleBand()
        .domain(data.map(function(d) { return parseInt(d.year)}))
        .range([0, graph_2_height - margin.top - margin.bottom])
        .padding(0.1);

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0)
        .tickPadding(10));

    svg.append("g")
        .attr("transform", "translate(0," + (graph_2_height- margin.top - margin.bottom) + ")")
        .call(d3.axisBottom(x));


    let bars = svg.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["year"] }))
        .range(d3.quantize(d3.interpolateHcl("#DC9CC4", "#b3d9ff"), dataLen));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d["year"]) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x(0))
        .attr("y", function(d) { return y(d.year); })               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d) { return x(parseFloat(d.avg_time)); })
        .attr("height", y.bandwidth());

    let counts = countRef2.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x(parseFloat(d.avg_time)) + 8; })       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return y(d.year) + 8; })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("font-size", 10)
        .style("text-anchor", "start")
        .text(function(d) { return d.avg_time});           // HINT: Get the average runtime


    // TODO: Add x-axis label
    svg.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
        ${(graph_2_height - margin.top - margin.bottom) + 35})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Average Runtime (minutes)");

    // TODO: Add y-axis label
    svg.append("text")
        .attr("transform", `translate(-90, ${(graph_2_height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Year");

    // TODO: Add chart title
    svg.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-10})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 20)
        .text("Average Netflix Runtimes Per Year");

})

function cleanData(data, comparator) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    data = data.sort(comparator);
    return data;
    // return top numExamples
}
