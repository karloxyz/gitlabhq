window.graph = class ContributorsGraph
  MARGIN:
    top: 20
    right: 20 
    bottom: 30 
    left: 50
  x_domain: 0
  y_domain: 0
  create_scale: (width, height) ->
    @x = d3.time.scale().range([0, width])
    @y = d3.scale.linear().range([height, 0]).nice()
  create_axes: ->
    @x_axis = d3.svg.axis().scale(@x).orient("bottom")
    @y_axis = d3.svg.axis().scale(@y).orient("left")
  @set_domain: (data) =>
     @prototype.x_domain = d3.extent(data, (d) ->
      parseDate = d3.time.format("%Y-%m-%d").parse
      parseDate(d.key))
     @prototype.y_domain = [0, d3.max(data, (d) ->
      d.value)]
  draw_path: (data) ->
    parseDate = d3.time.format("%Y-%m-%d").parse
    data.forEach (d) ->
      d.key = parseDate(d.key)
    @svg.append("path").datum(data).attr("class", "area").attr("d", @area);
  draw_x_axis: ->
    @svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + @height + ")")
    .call(@x_axis);
  draw_y_axis: ->
    @svg.append("g").attr("class", "y axis").call(@y_axis)


class ContributorsMasterGraph extends ContributorsGraph
  constructor: ->
    @width = 1100
    @height = 125
    @x = null
    @y = null
    @x_axis = null
    @y_axis = null
    @area = null
    @svg = null
  create_scale: ->
    super @width, @height
  create_area: (x, y) ->
    @area = d3.svg.area().x((d) ->
      x(d.key)
    ).y0(@height).y1((d) ->
      y(d.value)
    ).interpolate("basis")
  create_svg: ->
    @svg = d3.select("body").append("svg")
    .attr("width", @width + @MARGIN.left + @MARGIN.right)
    .attr("height", @height + @MARGIN.top + @MARGIN.bottom)
    .attr("class", "tint-box")
    .append("g")
    .attr("transform", "translate(" + @MARGIN.left + "," + @MARGIN.top + ")")
  set_domain: ->
    @x.domain(@x_domain)
    @y.domain(@y_domain)
  draw: =>
    @create_scale()
    @create_axes()
    ContributorsGraph.set_domain([{key: "2013-12-01", value: 2}, {key: "2013-12-02", value: 2}, {key: "2013-12-04", value: 2 }])
    @set_domain()
    @create_area(@x, @y)
    @create_svg()
    @draw_path([{key: "2013-12-01", value: 2}, {key: "2013-12-02", value: 1}, {key: "2013-12-04", value: 2 }])
    @draw_x_axis()
    @draw_y_axis()

window.graph_test = new ContributorsMasterGraph
