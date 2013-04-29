var Graphs = {}

var x_bounds;
var y_bounds;
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var dates = [];

Graphs.draw_total_commits = function (data) {

  var margin = {top: 20, right: 20, bottom: 30, left: 50};

  var width = 1100,
  height = 125;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0])
    .nice();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var area = d3.svg.area()
    .x(function(d) { return x(d.key); })
    .y0(height)
    .y1(function(d) { return y(d.value); })
    .interpolate("basis");

  var svg = d3.select("#contributors-master").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "tint-box")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data = d3.entries(data);

  data.forEach(function(d) {
    dates.push(d.key);
    d.key = parseDate(d.key);
  });

  data = _.sortBy(data, function(d) { return d.key; });

  x_bounds = d3.extent(data, function(d) { return d.key });
  y_bounds = [0, d3.max(data, function(d) { return d.value })];
  x.domain(x_bounds);
  y.domain(y_bounds);

  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
}

Graphs.draw_contributors_commits = function (data) {

  var margin = {top: 20, right: 20, bottom: 30, left: 50};

  var width = 490, 
  height = 130;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0])
    .nice();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%m/%d"));

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var area = d3.svg.area()
    .x(function(d) { return x(d.key); })
    .y0(height)
    .y1(function(d) { return y(d.value); })
    .interpolate("basis");

  var svg = d3.select( d3.selectAll(".person")[0].pop() ).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "spark")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  dates.forEach(function(d) {
    if(!data[d])
    {
      data[d] = 0;
    }
  });

  data = d3.entries(data);

  data.forEach(function(d) {
    d.key = parseDate(d.key);
  });

  data = _.sortBy(data, function(d) { return d.key; });
 
  x.domain(x_bounds);
  y.domain(y_bounds);

  svg.append("path")
    .datum(data)
    .attr("class", "area-contributor")
    .attr("d", area);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
}