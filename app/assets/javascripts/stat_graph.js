var Graphs = {}

Graphs.dates = [];

Graphs.margin = {top: 20, right: 20, bottom: 30, left: 50};

Graphs.parseDate = d3.time.format("%Y-%m-%d").parse;

Graphs.set_x_max_bounds = function (x) {
  Graphs.x_max_bounds = x;
}

Graphs.set_bounds = function (x, y) {
  Graphs.x_bounds = x;
  Graphs.y_bounds = y;
}

Graphs.get_x_bounds = function () {
  return Graphs.x_bounds;
}

Graphs.get_y_bounds = function () {
  return Graphs.y_bounds;
}

Graphs.change_date_header = function (brush) {

  var start_date, end_date;
  var print_date_format = d3.time.format("%B %e %Y");

  if(!brush.empty())
  {
    start_date = print_date_format(brush.extent()[0]);
    end_date = print_date_format(brush.extent()[1]);
  }
  else
  {
    start_date = print_date_format(Graphs.x_max_bounds[0]);
    end_date = print_date_format(Graphs.x_max_bounds[1])
  }
  var print = start_date + " - " + end_date;
  $("#date_header").text(print);

}

Graphs.init_bounds = function (x, y, brush) {

  Graphs.set_bounds(x, y);
  Graphs.set_x_max_bounds(x);
  Graphs.change_date_header(brush);

}

Graphs.draw_total_commits = function (data) {

  var width = 1100,
  height = 125;

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

  var brush = d3.svg.brush()
    .x(x)
    .on("brushend", function () {
      Graphs.change_date_header(brush);
    });

  var svg = d3.select("#contributors-master").append("svg")
    .attr("width", width + Graphs.margin.left + Graphs.margin.right)
    .attr("height", height + Graphs.margin.top + Graphs.margin.bottom)
    .attr("class", "tint-box")
  .append("g")
    .attr("transform", "translate(" + Graphs.margin.left + "," + Graphs.margin.top + ")");

  data = d3.entries(data);

  data.forEach(function(d) {
    Graphs.dates.push(d.key);
    d.key = Graphs.parseDate(d.key);
  });

  data = _.sortBy(data, function(d) { return d.key; });

  var x_bounds = d3.extent(data, function(d) { return d.key });
  var y_bounds = [0, d3.max(data, function(d) { return d.value })];

  Graphs.init_bounds(x_bounds, y_bounds, brush);

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

  svg.append("g")
    .attr("class", "selection")
    .call(brush)
  .selectAll("rect")
    .attr("height", height);
}

Graphs.draw_contributors_commits = function (data) {

  var width = 490, 
  height = 130;

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
    .attr("width", width + Graphs.margin.left + Graphs.margin.right)
    .attr("height", height + Graphs.margin.top + Graphs.margin.bottom)
    .attr("class", "spark")
  .append("g")
    .attr("transform", "translate(" + Graphs.margin.left + "," + Graphs.margin.top + ")");

  Graphs.dates.forEach(function(d) {
    if(!data[d])
    {
      data[d] = 0;
    }
  });

  data = d3.entries(data);

  data.forEach(function(d) {
    d.key = Graphs.parseDate(d.key);
  });

  data = _.sortBy(data, function(d) { return d.key; });
 
  x.domain(Graphs.get_x_bounds());
  y.domain(Graphs.get_y_bounds());

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