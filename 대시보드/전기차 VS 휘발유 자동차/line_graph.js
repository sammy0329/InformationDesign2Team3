Ev = [];
low_1kwh = 71.3;
fast_1kwh = 255.7;
ice_1L = 1534.8;
Cost = function (svg, car_data, select,color) {
  this.svg = svg;
  this.cost_data = this.cost_of_maintenance(car_data, select);
  this.color = color;

  console.log(this.cost_data)
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

Cost.prototype.axis = function () {
  // x축
  let xScale = d3.scale
    .linear()
    .domain([
      this.cost_data[0].mileage,
      this.cost_data[this.cost_data.length - 1].mileage,
    ])
    .range([0, line_width - 90]);
  // y축
  let yScale = d3.scale
    .linear()
    .domain([
      this.cost_data[0].cost,
      this.cost_data[this.cost_data.length - 1].cost,
    ])
    .range([line_height - 10, 40]);

  let xAxis = d3.svg
    .axis() //축에 scale정보를 넣어줌
    .scale(xScale)
    .orient("bottom");

  svg.append("g").attr("id", "xAxisG").call(xAxis);

  let yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("right")
    .ticks(8)
    .tickSize(510)
    .tickSubdivide(true);

  d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
 
  return [xScale,yScale]
}

Cost.prototype.line = function (scale) {
 
  let xScale = scale[0]
  let yScale = scale[1]
  var myline = d3.svg
    .line()
    .x(function (d) {
      return xScale(d.mileage);
    }) // apply the x scale to the x data
    .y(function (d) {
      return yScale(d.cost);
    }); // apply the y scale to the y data

  // console.log(myline(this.cost_data))
  this.svg
    .append("path")
    .attr("class", "line") // attributes given one at a time
    .attr("d", myline(this.cost_data)) // use the value of myline(xy) as the data, 'd'
    .style("fill", "none")
    .style("stroke", this.color)
    .style("stroke-width", 2);


}

// 올뉴 아반떼
ice = { name: "올뉴 아반떼", price: 15700000, fuel: 14.5 };

line_width = document.getElementById("line").width.animVal.value;
line_height = document.getElementById("line").height.animVal.value;

fuelTextBox = document.querySelector('#fuel');
applyBtn = document.querySelector('input[type="button"]');
ev_lowBtn = document.querySelectorAll('#ev_low');

d3.json("/대시보드/json/Compared_ev.json", lineChart);
function lineChart(data) {
  data.forEach((element) => {
    Ev.push([
      { name: element.차종별, price: element.가격, fuel: element.연비 },
    ]);
  });

  svg = d3.select("svg");

  ev_low_line = new Cost(svg, Ev[0][0], low_1kwh,"blue");
  let ev_fast_line = new Cost(svg, Ev[0][0], fast_1kwh,"red");
  let ice_line = new Cost(svg,ice, ice_1L,"black");


  scale = ev_low_line.axis();
  ev_low_line.line(scale);

  // scale = ev_fast_line.axis();
  // ev_fast_line.line(scale);

  applyBtn.addEventListener('click', function() {
    ice.fuel = fuelTextBox.value

    d3.selectAll("svg > *").remove();
    ice_line = new Cost(svg,ice, ice_1L,"black");
    scale = ice_line.axis();
    ice_line.line(scale);
  });

}

function changeLine(event){

  if( event.target.id == "ev_low"){
    d3.selectAll("svg > *").remove();
    ice_line =  new Cost(svg, Ev[0][0], low_1kwh,"blue");
    scale = ev_low_line.axis();
    ev_low_line.line(scale);
  }
  else if( event.target.id == "ev_fast"){
    d3.selectAll("svg > *").remove();
    ev_fast_line = new Cost(svg, Ev[0][0], fast_1kwh,"red");
    scale = ev_fast_line.axis();
    ev_fast_line.line(scale);
  }
  else if( event.target.id == "ice"){
    d3.selectAll("svg > *").remove();
    ice_line = new Cost(svg,ice, ice_1L,"black");
    scale = ice_line.axis();
    ice_line.line(scale);
  }
  
}


