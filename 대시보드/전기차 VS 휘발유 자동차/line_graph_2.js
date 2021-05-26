Ev = [];
Ice = [];
low_1kwh = 71.3;
fast_1kwh = 255.7;
ice_1L = 1534.8;

var ev_select = document.getElementById("ev_car");
var selectValue = ev_select.options[ev_select.selectedIndex].value;
var selectValue_ice = 1
Cost = function (svg, car_data, select,color) {
  this.svg = svg;
  this.car_data = car_data;
  this.cost_data = this.cost_of_maintenance(car_data, select);
  this.color = color;
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
    .style("stroke-width", 2)
    .attr("transform","translate(20, 0)");
}

// 올뉴 아반떼
// ice = { name: "올뉴 아반떼", price: 15700000, fuel: 14.5 };

line_width = document.getElementById("line").width.animVal.value;
line_height = document.getElementById("line").height.animVal.value;


var margin	= {top: 20, right: 30, bottom: 100, left: 20},
    width	= line_width - margin.left - margin.right,
    height	= line_height - margin.top - margin.bottom;

var margin_context = {top: 320, right: 30, bottom: 20, left: 20},
    height_context = line_height - margin_context.top - margin_context.bottom;


console.log()
fuelTextBox = document.querySelector('#fuel');
applyBtn = document.querySelector('input[type="button"]');

ice_text = document.getElementById('ice_text');

// ev_lowBtn = document.getElementById('ev_low');
// ev_fastBtn = document.getElementById('ev_fast');
// iceBtn = document.getElementById('ice');

d3.json("/대시보드/json/Compared_ev.json", lineChart);
function lineChart(data) {
  data.forEach((element) => {
    Ev.push([
      { name: element.차종별, price: element.가격, fuel: element.연비, grade : element.차급},
    ]);
  });

  svg = d3.select("svg");
  
  applyBtn.addEventListener('click', function() {
    ice.fuel = fuelTextBox.value
    ice.fuel = fuelTextBox.value

    d3.selectAll("svg > *").remove();
    ice_line = new Cost(svg,ice, ice_1L,"black");
    scale = ice_line.axis();
    ice_line.line(scale);
  });

}

d3.json("/대시보드/json/ControlGroup_ice.json", icelineChart);
function icelineChart(data) {
  data.forEach((element) => {
    Ice.push([
      { name: element.차종별, price: element.가격, fuel: element.연비, grade : element.차급},
    ]);
  });

  if(document.getElementById('ev_low').checked)
    declaredLine("ev_low");
  else if(document.getElementById('ev_fast').checked)
    declaredLine("ev_fast");

  svg = d3.select("svg");
  // console.log(Ice[1][0]);

}


function changeLine(event){

  if( event.target.id == "ev_low"){
    declaredLine("ev_low");
  }
  else if( event.target.id == "ev_fast"){
    declaredLine("ev_fast");
  }
  
}

function evSelect(){
  
  selectValue = ev_select.options[ev_select.selectedIndex].value;
  
  // document.getElementById('ev_fast').setAttribute('checked', false);
  document.getElementById('ev_low').setAttribute('checked', false);

  console.log( )
  Ice.forEach(function(element,index){
    if(Ev[selectValue][0].grade == element[0].grade){
      selectValue_ice = index
      ice_text.innerText = element[0].name
    }
  });

  
  if(document.getElementById('ev_low').checked)
    declaredLine("ev_low");
  else if(document.getElementById('ev_fast').checked)
    declaredLine("ev_fast");
  
}


function declaredLine(line){
  let ev_low_line =  new Cost(svg, Ev[selectValue][0], low_1kwh,"blue");
  let ev_fast_line = new Cost(svg, Ev[selectValue][0], fast_1kwh,"red");
  let ice_line = new Cost(svg,Ice[selectValue_ice][0], ice_1L,"black");

  if( line == "ev_low"){
    d3.selectAll("svg > *").remove();

   
    let scale = axis(ev_fast_line,ice_line);
    ev_low_line.line(scale);
    ice_line.line(scale);
    console.log(ev_low_line);
    console.log(ice_line);

    // 
  }
  else if( line == "ev_fast"){
    d3.selectAll("svg > *").remove();
    
    let scale = axis(ev_fast_line,ice_line);
    ev_fast_line.line(scale);
    ice_line.line(scale);

  }
  // else if( line == "ice"){
  //   d3.selectAll("svg > *").remove();
  //   let ice_line = new Cost(svg,Ice[selectValue_ice][0], ice_1L,"black");
  //   let scale = ice_line.axis();
  //   ice_line.line(scale);
  // }
}

// 축 만드는 함수
function axis(ev,ice) {
 
  if(ev.cost_data[0].cost > ice.cost_data[0].cost)
    domain_min = ice.cost_data[0].cost;
  else
    domain_min = ev.cost_data[0].cost;
  
  if(ev.cost_data[ev.cost_data.length - 1].cost > ice.cost_data[ice.cost_data.length - 1].cost)
    domain_max = ev.cost_data[ev.cost_data.length - 1].cost;
  else
    domain_max = ice.cost_data[ice.cost_data.length - 1].cost;

  

  // x축
  let xScale = d3.scale
    .linear()
    .domain([
      ev.cost_data[0].mileage,
      ev.cost_data[ev.cost_data.length - 1].mileage,
    ])
    .range([0, line_width - 90])
    
  // y축
  let yScale = d3.scale
    .linear()
    .domain([
      domain_min,domain_max,
    ])
    .range([line_height - 100, 40]);

  let xAxis = d3.svg
    .axis() //축에 scale정보를 넣어줌
    .scale(xScale)
    .orient("bottom");

  // svg.append("g").attr("id", "xAxisG").attr("transform","translate(20, "+(line_height-100)+")").call(xAxis);
  svg.append("g").attr("id", "xAxisG").attr("transform","translate("+ margin_context.left + "," + margin_context.top +")").call(xAxis);

  let yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("right")
    .ticks(8)
    .tickSize(500)
    .tickSubdivide(true);

  d3.select("svg").append("g").attr("id", "yAxisG").attr("transform","translate(20,0)").call(yAxis);
 

  return [xScale,yScale]
}

