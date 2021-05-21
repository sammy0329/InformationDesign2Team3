Ev = [];
low_1kwh = 71.3;
fast_1kwh = 255.7;
ice_1L = 1534.8;
d3.json("/대시보드/json/Compared_ev.json", lineChart);
function lineChart(data) {
  data.forEach((element) => {
    Ev.push([
      { name: element.차종별 },
      { price: element.가격 },
      { fuel: element.연비 },
    ]);
  });
  cost_data = cost_of_maintenance(Ev[0], low_1kwh);
  //   console.log(cost_data);

  xScale = d3.scale.linear().domain([1, 10.5]).range([20, 480]);
  yScale = d3.scale.linear().domain([0, 35]).range([480, 20]);
}

function cost_of_maintenance(d, select) {
  let data = [];
  let x = 15000;
  for (let i = 1; i <= 150000 / x; i++) {
    fuel_cost = ((x * i) / d[2].fuel) * select;
    c = d[1].price + Math.round(fuel_cost);

    data.push({ mileage: x * i }, { cost: c });
  }

  return data;
}
