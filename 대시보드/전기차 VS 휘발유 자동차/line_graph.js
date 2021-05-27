Ev = [];
Ice = [];
low_1kwh = 71.3;
fast_1kwh = 255.7;
ice_1L = 1534.8;
var ev_select = document.getElementById("ev_car");
var selectValue = ev_select.options[ev_select.selectedIndex].value;
var selectValue_ice = 1;

// window.onresize = function(event){
//   redraw();
// }

Cost = function (svg, ev_car_data,ice_car_data, select, color) {
  
  this.svg = svg;
  
  this.ev_car_data = ev_car_data;
  this.ice_car_data = ice_car_data;

  this.ev_cost_data = this.cost_of_maintenance(ev_car_data, select);
  this.ice_cost_data = this.cost_of_maintenance(ice_car_data, ice_1L);

  this.color = color;
  
  //xScale,xScale2,xAxis,xAxis2,yScale,yScale2,yAxis
  this.xScale = this.axis()[0];
  this.xScale2 = this.axis()[1];
  this.xAxis = this.axis()[2];
  this.xAxis2 = this.axis()[3];
  this.yScale = this.axis()[4];
  this.yScale2 = this.axis()[5];
  this.yAxis = this.axis()[6];

  this.line = this.returnLine();
  this.line2 = this.returnLine2();
  
  
  // this.focus = this.focusLine();
  // this.context = this.contextLine(); 
};

Cost.prototype = Object.create(Cost.prototype);

Cost.prototype.cost_of_maintenance = function (d, select) {
  let data = [];
  let x = 15000;
  for (let i = 0; i <= 150000 / x; i++) {
    fuel_cost = ((x * i) / d.fuel) * select;
    c = d.price + Math.round(fuel_cost);

    data.push({ mileage: x * i, cost: c });
  }

  return data;
};

Cost.prototype.axis = function (){
  if (this.ev_cost_data[0].cost > this.ice_cost_data[0].cost)
    domain_min = this.ice_cost_data[0].cost;
  else domain_min = this.ev_cost_data[0].cost;

  if (this.ev_cost_data[this.ev_cost_data.length - 1].cost >this.ice_cost_data[this.ice_cost_data.length - 1].cost)
    domain_max = this.ev_cost_data[this.ev_cost_data.length - 1].cost;
  else domain_max = this.ice_cost_data[this.ice_cost_data.length - 1].cost;

  
  // x축
  let xScale = d3
    .scaleLinear()
    .domain([
      this.ev_cost_data[0].mileage,
      this.ev_cost_data[this.ev_cost_data.length - 1].mileage,
    ])
    .range([0, width]);

  let xScale2 = d3
    .scaleLinear()
    .domain([
      this.ev_cost_data[0].mileage,
      this.ev_cost_data[this.ev_cost_data.length - 1].mileage,
    ])
    .range([0, width]);

  let xAxis = d3.axisBottom(this.xScale).ticks(10).tickSize(-height);
  let xAxis2 = d3.axisBottom(this.xScale2).ticks(10);

  // y축
  let yScale = d3.scaleLinear().domain([domain_min, domain_max]).range([height, 0]);
  let yScale2 = d3.scaleLinear().domain([domain_min, domain_max]).range([height2, 0]);
  let yAxis = d3.axisLeft(this.yScale).tickSize(-width);


  
 
  return[xScale,xScale2,xAxis,xAxis2,yScale,yScale2,yAxis]
}



Cost.prototype.returnLine = function(){
  
  let xScale = this.xScale;
  let yScale = this.yScale;

  line = d3
  .line()
  .x(function (d) {
    return xScale(d.mileage);
  }) // apply the x scale to the x data
  .y(function (d) {
    return yScale(d.cost);
  }); // apply the y scale to the y data

  return line;
}

Cost.prototype.returnLine2 = function(){
  let xScale2 = this.xScale2;
  let yScale2 = this.yScale2;

  line2 = d3
    .line()
    .x(function (d) {
      return xScale2(d.mileage);
    }) // apply the x scale to the x data
    .y(function (d) {
      return yScale2(d.cost);
    }); // apply the y scale to the y data

  return line2;
}

// Cost.prototype.focusLine = function () {
  
  
//   return focus;

// };


// Cost.prototype.contextLine = function (scale) {
//   // this.svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height)
  
  
  
 
  
//   return context;
// };

Cost.prototype.draw = function(){
  
  let svg = this.svg;

  svg.append("defs").append("svg:clipPath")
  .attr("id", "clip")
  .append("svg:rect")
  .attr("width", width)
  .attr("height", height)
  .attr("x", 20)
  .attr("y", 0); 


var Line_chart = svg.append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("clip-path", "url(#clip)");

  svg
    .append("text")
    .text("유지비")
    .attr("x", 0 - height / 2 - 20)
    .attr("y", 0)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)");
  
  svg
    .append("text")
    .text("주행거리")
    .attr("x", width / 2 + 90)
    .attr("y", height + margin.bottom-55)
    .style("text-anchor", "middle");

  let focus = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  let context = svg
    .append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


  let focus_x = x + margin.left + 20;
  let focus_y = y + margin.top;

  let context_x = x + margin2.left;
  let context_y = y + margin2.top;

  let line = this.line;
  let line2 = this.line2;
  

  focus
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(20," + height + ")")
    .call(this.xAxis);
  
  focus
    .append("g")
    .attr("class", "axis axis--y")
    .call(this.yAxis)
    .attr("transform", "translate(0 ,0 )");
  
  // Line_chart.append("path")
  //       .datum(data)
  //       .attr("class", "line")
  //       .attr("d", line);

  Line_chart.append("path")
      .datum(this.ev_cost_data)
      .attr("class", "ev_line")
      .attr("d", line)
      .style("stroke", this.color)
      .attr("transform", "translate(20,0)");


  Line_chart.append("path")
      .datum(this.ice_cost_data)
      .attr("class", "ice_line")
      .attr("d", line)
      .style("stroke", "black")
      .attr("transform", "translate(20,0)");
  
       
    // function transition(path) {
    //   path.transition()
    //       .duration(2000)
    //       .attrTween("stroke-dasharray", tweenDash);
    // }
    // function tweenDash() {
    //   var l = this.getTotalLength(),
    //       i = d3.interpolateString("0," + l, l + "," + l);
    //   return function (t) { return i(t); };
    // }
    
    // Line_chart.select("path.ev_line")
    //   .call(transition);
    
    // Line_chart.select("path.ice_line")
    //   .call(transition);
 

  context.append("path")
      .datum(this.ev_cost_data)
      .attr("class", "ev_line_2")
      .attr("d", line2)
      .style("stroke", this.color);
  
  context.append("path")
      .datum(this.ice_cost_data)
      .attr("class", "ice_line_2")
      .attr("d", line2)
      .style("stroke", "black");
     
  context
  .append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height2 + ")")
  .call(this.xAxis2);

  

  context.attr("transform", "translate(" + context_x + "," + context_y + ")");
  
 return [line,svg,focus,context,Line_chart]
}



/*----------------------------------------------------------------------------------------------------------------*/
// 올뉴 아반떼
// ice = { name: "올뉴 아반떼", price: 15700000, fuel: 14.5 };

line_width = document.getElementById("line").width.animVal.value;
line_height = document.getElementById("line").height.animVal.value;

// var margin	= {top: 20, right: 30, bottom: 100, left: 20},
//     width	= line_width - margin.left - margin.right,
//     height	= line_height - margin.top - margin.bottom;

// var margin_context = {top: 320, right: 30, bottom: 20, left: 20},
//     height_context = line_height - margin_context.top - margin_context.bottom;

fuelTextBox = document.querySelector("#fuel");
applyBtn = document.querySelector('input[type="button"]');

ice_text = document.getElementById("ice_text");

x = 0;
y = 0;
// margin = { top: 20, right: 20, bottom: 50, left: 90 };
// width = 700 - margin.left - margin.right;
// height = 400 - margin.top - margin.bottom;

var svg = d3.select("svg"),
  margin = { top: 20, right: 40, bottom: 110, left: 80 },
  margin2 = { top: 430, right: 40, bottom: 30, left: 80 },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  height2 = +svg.attr("height") - margin2.top - margin2.bottom;

// ev_lowBtn = document.getElementById('ev_low');
// ev_fastBtn = document.getElementById('ev_fast');
// iceBtn = document.getElementById('ice');

/*----------------------------------------------------------------------------------------------------------------*/

d3.json("/대시보드/json/ControlGroup_ice.json",  function (error,data) {iceData(error,data)});
d3.json("/대시보드/json/Compared_ev.json", function (error,data) {evData(error,data)});


function iceData(error,data) {
  if (error) throw error;
  
  data.forEach((element) => {
    Ice.push([
      {
        name: element.차종별,
        price: element.가격,
        fuel: element.연비,
        grade: element.차급,
      },
    ]);
  });
}

function evData(error,data){
  if (error) throw error;

  data.forEach((element) => {
    Ev.push([
      {
        name: element.차종별,
        price: element.가격,
        fuel: element.연비,
        grade: element.차급,
      },
    ]);
  });

  main()
 
}

function main(){
  
  if (document.getElementById("ev_low").checked) declaredLine("ev_low");
  else if (document.getElementById("ev_fast").checked) declaredLine("ev_fast");

  applyBtn.addEventListener("click", function () {
    ice.fuel = fuelTextBox.value;
    ice.fuel = fuelTextBox.value;

    d3.selectAll("svg > *").remove();
    ice_line = new Cost(svg, ice, ice_1L, "black");
    scale = ice_line.axis();
    ice_line.line(scale);
  });
}

function changeLine(event) {
  if (event.target.id == "ev_low") {
    declaredLine("ev_low");
  } else if (event.target.id == "ev_fast") {
    declaredLine("ev_fast");
  }
}

function evSelect() {
  selectValue = ev_select.options[ev_select.selectedIndex].value;

  // document.getElementById('ev_fast').setAttribute('checked', false);
  document.getElementById("ev_low").setAttribute("checked", false);

  
  Ice.forEach(function (element, index) {
    if (Ev[selectValue][0].grade == element[0].grade) {
      selectValue_ice = index;
      ice_text.innerText = element[0].name;
    }
  });

  if (document.getElementById("ev_low").checked) declaredLine("ev_low");
  else if (document.getElementById("ev_fast").checked) declaredLine("ev_fast");
}

function declaredLine(line) {
  //svg, ev_car_data,ice_car_data, select, color
  let ev_low_line = new Cost(svg, Ev[selectValue][0],Ice[selectValue_ice][0], low_1kwh, "blue");
  let ev_fast_line = new Cost(svg, Ev[selectValue][0],Ice[selectValue_ice][0], fast_1kwh, "red");
  
  

  if (line == "ev_low") {
    
    makeLine(ev_low_line)

  } else if (line == "ev_fast") {
    makeLine(ev_fast_line)
  }
}

function makeLine(Object){
  d3.selectAll("svg > *").remove();
    
    //line,svg,focus,context,Line_chart
    let graph = Object.draw();
    
    let line = graph[0];
    let svg = graph[1];
    let focus = graph[2];
    let context = graph[3];
    let Line_chart = graph[4];
  

    
    let xScale =  Object.xScale;
    let xScale2 = Object.xScale2
    let xAxis = Object.xAxis;
   
    const tooltip = d3.select('#tooltip');
    const tooltipLine = svg.append('line');

    console.log(svg)

 

    brushed = function () {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || xScale2.range();
        xScale.domain(s.map(xScale2.invert, xScale2));
        Line_chart.select(".ev_line").attr("d", line);
        Line_chart.select(".ice_line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
      
      svg.select(".zoom")
        .call(
          zoom.transform,
          d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0)
        );
    }
    let brush = d3.brushX().extent([[0, 0],[width, height2],]).on("brush end", brushed);
    zoomed = function () {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
      let t = d3.event.transform;
      xScale.domain(t.rescaleX(xScale2).domain());
      Line_chart.select(".ev_line").attr("d", line);
      Line_chart.select(".ice_line").attr("d", line);
      focus.select(".axis--x").call(xAxis);
      context.select(".brush") .call(brush.move, xScale.range().map(t.invertX, t));
    }
    let zoom = d3.zoom().scaleExtent([1, Infinity]).translateExtent([[0, 0],[width, height]]).extent([[0, 0],[width, height]]).on("zoom",zoomed);  
    
    
    context
    .append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, xScale.range());

    tipBox = svg
    .append("rect")
    .attr("class", "zoom")
    .attr("width", width-20)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom)
    .on('mousemove', drawTooltip)
    .on('mouseout', removeTooltip);


  //   tipBox = svg.append('rect')
  //   .attr('width', width)
  //   .attr('height', height)
  //   .attr('opacity', 0)
  //  ;

    function removeTooltip() {
      if (tooltip) tooltip.style('display', 'none');
      if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }
    
  function drawTooltip() {
    const kilometer = Math.floor((xScale.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;
    const cost =
    
    states.sort((a, b) => {
      return b.history.find(h => h.year == year).population - a.history.find(h => h.year == year).population;
    })  
      
    tooltipLine.attr('stroke', 'black')
      .attr('x1', xScale(kilometer))
      .attr('x2', xScale(kilometer))
      .attr('y1', 0)
      .attr('y2', height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    tooltip.html("주행거리: " + kilometer + "")
      .style('display', 'block')
      .style('left',(d3.event.pageX + 5) + "px")
      .style('top', (d3.event.pageY - 28) + "px")
      .data(states).enter()
      .append('div')
      .style('color', d => d.color)
      .html(d => d.name + ': ' + d.history.find(h => h.year == year).population)
      
  
  }

}
