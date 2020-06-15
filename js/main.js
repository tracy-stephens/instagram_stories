var width = 1000;
var height = 500;
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var margin = ({top: 30, right: 30, bottom: 10, left: 40}),
    iwidth = width - margin.left - margin.right,
    iheight = height - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%m/%d/%Y");
//console.log(parseTime("05/22/2020"));

// set the ranges
var x = d3.scaleTime().range([0, iwidth]);
var y = d3.scaleLinear().range([iheight, 0]);

svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.food); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.not_food); });

var url = "./data/data.csv"
d3.csv(url, function(error, data) {
  if (error) throw error;
  
  console.log(data[0]);
  
  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.food = +d.food;
      d.not_food = +d.not_food;
  });
  
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) {
	  return Math.max(d.food, d.not_food); })]);
  
  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("transform", "translate(20," + 0 + ")")
      .attr("fill", "none")
      .attr("stroke", "purple")
      .attr("stroke-width", 3)
      .attr("class", "line")
      .attr("d", valueline);
  
  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("transform", "translate(20," + 0 + ")")
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr("class", "line")
      .attr("stroke", "DarkCyan")
      .attr("d", valueline2);
  
  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(20," + iheight + ")")
    .attr("stroke-width", 2)
    .call(d3.axisBottom(x)
         .tickFormat(d3.timeFormat("%d %b")));
      
 ;
  
  // Add the Y Axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + 20 + ",0)")
      .attr("stroke-width", 2)
      .call(d3.axisLeft(y)
           .ticks(10, "s"));
  
  var legend_keys = ["Posts Containing Food", "Posts Not Containing Food"]

  svg.append("rect")
    .attr("x",75)
    .attr("y",30)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "purple")
  svg.append("rect")
    .attr("x",75)
    .attr("y",60)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "DarkCyan")
  svg.append("text")
      .attr("x", 90)
      .attr("y", 37)
      .text("Posts Containing Food")
      .style("font-size", "15px")
      .attr("alignment-baseline","middle")
  svg.append("text")
      .attr("x", 90)
      .attr("y", 67)
      .text("Posts Not Containing Food")
      .style("font-size", "15px")
      .attr("alignment-baseline","middle")

});