var getAngle = function (d) {
    var angle = (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
    if (angle > 90) angle += 180;
    return angle;
};

function createPieChart() {
  var w = window.innerHeight;
  var h = w;
  var r = h/2;
  var color = d3.scale.category20c();

  var vis = d3.select('#pieChart').append("svg:svg").data([BY_CONTACT]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
  var pie = d3.layout.pie().value(function(d){return d.total;});

  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(r);

  // select paths, use arc generator to draw
  var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
  arcs.append("svg:path")
      .attr("fill", function(d, i){
          return color(i);
      })
      .attr("d", function (d) {
          return arc(d);
      });

  // add the text
  arcs.append("svg:text")
      .attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ") " + "rotate(" + getAngle(d) + ")";
      })
      .attr("dy", 5)
      .attr("text-anchor", function(d){
        if (getAngle(d) > 90) return "end";
        else return "start";
      })
      .text( function(d, i) {
        var percent = Math.abs(d.startAngle - d.endAngle) / (2 * Math.PI) * 100;
        var name = "";
        if (BY_CONTACT[i].firstName != "")
          name = BY_CONTACT[i].firstName + " " + BY_CONTACT[i].lastName;
        else name = BY_CONTACT[i].phoneNumber;
        if (Math.abs(d.startAngle - d.endAngle) / (2 * Math.PI) * 360 > 2)
          return name + ", " + Math.round(percent).toString() + "%";
        else return "";}
      );
}

function createLineChart(data, title) {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var area = d3.svg.area()
      .x(function(d) { return x(d.date.getTime()); })
      .y0(height)
      .y1(function(d) { return y(d.total); });

  var line = d3.svg.line()
      .x(function(d) { return x(d.date.getTime()); })
      .y(function(d) { return y(d.total); });


  var svg = d3.select("#lineChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  x.domain(d3.extent(data, function(d) { return d.date.getTime(); }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "y axis")
     .call(yAxis);

  svg.append("path")
     .datum(data)
     .attr("class", "area")
     .attr("d", area);

  svg.append("path")
     .datum(data)
     .attr("class", "line")
     .attr("d", line);

  svg.append("text")
     .attr("x", (width / 2))             
     .attr("y", margin.top / 4)
     .attr("text-anchor", "middle")  
     .text(title);
}
