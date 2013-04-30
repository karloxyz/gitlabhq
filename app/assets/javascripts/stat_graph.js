var Graphs = {}

Graphs.dates = [];

Graphs.margin = {top: 20, right: 20, bottom: 30, left: 50};

Graphs.parseDate = d3.time.format("%Y-%m-%d").parse;

Graphs.total_commits = {};
Graphs.total_additions = {};
Graphs.total_deletions = {};
Graphs.author_commits = {};
Graphs.author_additions = {};
Graphs.author_deletions = {};

Graphs.author_graphs = [];

Graphs.set_log = function (data) {
  Graphs.log = data;
}

Graphs.parse_log = function () {

  Graphs.log.forEach( function (entry) {

    if(Graphs.total_commits[entry.date] == undefined)
      Graphs.total_commits[entry.date] = 0;
    Graphs.total_commits[entry.date] += 1;

    if(Graphs.total_additions[entry.date] == undefined)
      Graphs.total_additions[entry.date] = 0;
    if(entry.additions != undefined)
      Graphs.total_additions[entry.date] += entry.additions;

    if(Graphs.total_deletions[entry.date] == undefined)
      Graphs.total_deletions[entry.date] = 0;
    if(entry.deletions != undefined)
      Graphs.total_deletions[entry.date] += entry.deletions;

    if(Graphs.author_commits[entry.author] == undefined)
      Graphs.author_commits[entry.author] = {};
    
    if(Graphs.author_commits[entry.author].total == undefined)
      Graphs.author_commits[entry.author].total = 0;
    Graphs.author_commits[entry.author].total += 1;

    if(Graphs.author_commits[entry.author].author == undefined)
      Graphs.author_commits[entry.author].author = entry.author;

    if(Graphs.author_commits[entry.author][entry.date] == undefined)
      Graphs.author_commits[entry.author][entry.date] = 0;
    Graphs.author_commits[entry.author][entry.date] += 1;

  });

}

Graphs.init_bounds = function (x, y, brush) {

  Graphs.set_bounds(x, y);
  Graphs.set_x_max_bounds(x);
  Graphs.change_date_header(brush);
}

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

Graphs.get_x_max_bounds = function () {
  return Graphs.x_max_bounds;
}

Graphs.get_y_bounds = function () {
  return Graphs.y_bounds;
}

Graphs.change_date_header = function (brush) {

  var start_date, end_date;
  var print_date_format = d3.time.format("%B %e %Y");
  var bounds = brush.extent();

  if(!brush.empty())
  {
    start_date = print_date_format(bounds[0]);
    end_date = print_date_format(bounds[1]);
  }
  else
  {
    var x_max_bounds = Graphs.get_x_max_bounds();
    start_date = print_date_format(x_max_bounds[0]);
    end_date = print_date_format(x_max_bounds[1])
  }

  var print = start_date + " - " + end_date;
  $("#date_header").text(print);

}

Graphs.create_contributors_list = function () {
  $(".contributors-list").html("");

  var authors = _.sortBy(Graphs.author_commits, function(d) { return d.total }).reverse();
  $.each(authors, function (key, value) {
      $(".contributors-list").append("<li class='person' style='display: block;'><h4>" + this.author + "</h4></li>");
    Graphs.draw_contributors_commits(_.omit(value,['author','total']));
  }); 
}

Graphs.draw_total_commits = function () {

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
    .on("brushend", update_content);

  function update_content() {
    Graphs.change_date_header(brush);
    var dates;
    if(!brush.empty())
    {
      var human_format = d3.time.format("%Y-%m-%d");
      var bounds = brush.extent();
      var from = Graphs.dates.indexOf(human_format(bounds[0]));
      if(from == -1) //we need to get the closest time available
      {
        for(var count = 0; count < Graphs.dates.length; count++)
        {
          if((new Date(Graphs.dates[count])).getTime() > bounds[0])
            break;
        }
        from = count - 1;
      }
      var to = Graphs.dates.indexOf(human_format(bounds[1])) + 1;
      if(to == 0) //we need to get the closest time available
      {
        for(var count = 0; count < Graphs.dates.length; count++)
        {
          if((new Date(Graphs.dates[count])).getTime() > bounds[1])
            break;
        }
        to = count;      
      }
      dates = Graphs.dates.slice(from, to);
    }
    else
      dates = Graphs.dates;
    Graphs.author_graphs.forEach( function (d) {
      d.total = 0;
      $.each(d.data, function (key, value)
      {
        if(_.contains(dates, key))
          d.total += value;
      });
    });

    Graphs.author_graphs = _.sortBy(Graphs.author_graphs, function(d) { return d.total; });

    Graphs.author_graphs.forEach( function (d) {
      $(d.list_item).detach();
      if(d.total != 0)
      {
        d.x.domain(brush.empty() ? x.domain() : brush.extent());
        d.svg.select("path").datum(dates);
        d.svg.select("path").attr("d", d.area);
        d.svg.select(".x.axis").call(d.xAxis);
        $(".contributors-list").prepend($(d.list_item));
      }
    });
  }

  var svg = d3.select("#contributors-master").append("svg")
    .attr("width", width + Graphs.margin.left + Graphs.margin.right)
    .attr("height", height + Graphs.margin.top + Graphs.margin.bottom)
    .attr("class", "tint-box")
  .append("g")
    .attr("transform", "translate(" + Graphs.margin.left + "," + Graphs.margin.top + ")");

  data = d3.entries(Graphs.total_commits);

  data.forEach(function (d) {
    Graphs.dates.push(d.key);
    d.key = Graphs.parseDate(d.key);
  });

  data = _.sortBy(data, function(d) { return d.key; });
  Graphs.dates = _.sortBy(Graphs.dates, function(d) { return d; });

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

  var data = data;

  var x = d3.time.scale()
    .range([0, width])
    .clamp(true);

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
    .x(function(d) { return x(Graphs.parseDate(d)); })
    .y0(height)
    .y1(function(d) { return data[d] ? y(data[d]) : y(0) })
    .interpolate("basis");

  var list_item = d3.selectAll(".person")[0].pop()

  var svg = d3.select(list_item).append("svg")
    .attr("width", width + Graphs.margin.left + Graphs.margin.right)
    .attr("height", height + Graphs.margin.top + Graphs.margin.bottom)
    .attr("class", "spark")
  .append("g")
    .attr("transform", "translate(" + Graphs.margin.left + "," + Graphs.margin.top + ")");
 
  x.domain(Graphs.get_x_bounds());
  y.domain(Graphs.get_y_bounds());

  svg.append("path")
    .datum(Graphs.dates)
    .attr("class", "area-contributor")
    .attr("d", area);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  Graphs.author_graphs.push(
  {
    x: x,
    xAxis: xAxis,
    svg: svg,
    area: area,
    data: data,
    list_item: list_item
  });

}