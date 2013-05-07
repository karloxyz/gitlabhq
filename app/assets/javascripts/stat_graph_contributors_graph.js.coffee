class ContributorsGraph
  MARGIN:
    top: 20
    right: 20 
    bottom: 30 
    left: 50
  x_domain: null
  y_domain: null
  @set_domain: (data) =>
     @prototype.x_domain = d3.extent(data, (d) ->
      d.date
     )
     @prototype.y_domain = [0, d3.max(data, (d) ->
        d.total = d.total ? d.additions ? d.deletions
     )]
  create_scale: (width, height) ->
    @x = d3.time.scale().range([0, width])  
    @y = d3.scale.linear().range([height, 0]).nice()
  create_axes: ->
    @x_axis = d3.svg.axis().scale(@x).orient("bottom")
    @y_axis = d3.svg.axis().scale(@y).orient("left")
  draw_path: (data) ->
    @svg.append("path").datum(data).attr("class", "area").attr("d", @area);
  draw_x_axis: ->
    @svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + @height + ")")
    .call(@x_axis);
  draw_y_axis: ->
    @svg.append("g").attr("class", "y axis").call(@y_axis)


class window.ContributorsMasterGraph extends ContributorsGraph
  constructor: ->
    @width = 1100
    @height = 125
    @x = null
    @y = null
    @x_axis = null
    @y_axis = null
    @area = null
    @svg = null
    @brush = null
  create_scale: ->
    super @width, @height
  create_area: (x, y) ->
    @area = d3.svg.area().x((d) ->
      x(d.date)
    ).y0(@height).y1((d) ->
        y(d.total = d.total ? d.additions ? d.deletions)
    ).interpolate("basis")
  create_svg: ->
    @svg = d3.select("#contributors-master").append("svg")
    .attr("width", @width + @MARGIN.left + @MARGIN.right)
    .attr("height", @height + @MARGIN.top + @MARGIN.bottom)
    .attr("class", "tint-box")
    .append("g")
    .attr("transform", "translate(" + @MARGIN.left + "," + @MARGIN.top + ")")
  set_domain: ->
    @x.domain(@x_domain)
    @y.domain(@y_domain)
  create_brush: ->
     @brush = d3.svg.brush().x(@x);
  add_brush: ->
    @svg.append("g").attr("class", "selection").call(@brush).selectAll("rect").attr("height", @height);
  parse_dates: (data) ->
    parseDate = d3.time.format("%Y-%m-%d").parse
    data.forEach((d) ->
      d.date = parseDate(d.date)
    )
  draw: (data) =>
    @parse_dates(data)
    @create_scale()
    @create_axes()
    ContributorsGraph.set_domain(data)
    @set_domain()
    @create_area(@x, @y)
    @create_svg()
    @create_brush()
    @draw_path(data)
    @draw_x_axis()
    @draw_y_axis()
    @add_brush()
  redraw: (data) =>
    @parse_dates(data)
    ContributorsGraph.set_domain(data)
    @set_domain()
    @svg.select("path").datum(data)
    @svg.select("path").attr("d", @area)
    @svg.select(".y.axis").call(@y_axis)