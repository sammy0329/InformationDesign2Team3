var selectValue=0; //자동차 인덱스 전역변수
var selectText='코나'; //자동차 모델명 전역변수
var km=10000;
var value;

// 상하좌우 여백 수치. 하단에는 축이 그려져야 하니까 여백을 많이.
var LEFT = 80;
var RIGHT = 20;
var TOP = 00;
var BOTTOM = 30;

// 데이터가 그려질 영역의 크기
var width =1000 - LEFT - RIGHT;
var height = 200 - TOP - BOTTOM;

// body 요소 밑에 svg 요소를 추가하고 그 결과를 svg 변수에 저장
var body = d3.select("body");
var svg = body.append("svg");

// svg 요소의 너비와 높이가 화면을 꽉 채우도록 수정
svg.attr("width", window.innerWidth);
svg.attr("height", window.innerHeight);

// svg 요소에 g 요소를 추가하고 axisGroup 변수에 저장
var axisGroup = svg.append("g");
// axisGroup에 "axis" 클래스를 부여하고 하단으로 이동
axisGroup
  .attr("class", "axis")
  .style("transform", "translate(" + LEFT + "px, " + (TOP + height) + "px)");

// svg 요소에 g 요소를 추가하고 barGroup 변수에 저장
var barGroup = svg.append("g");
// barGroup에 "bar" 클래스를 부여하고 좌상단 여백만큼 이동
barGroup
  .attr("class", "bar")
  .style("transform", "translate(" + LEFT + "px, " + TOP + "px)");


//if(now - lastUpdate < 2000) return;

function chageLangSelect(){ 
    var langSelect = document.getElementById("name"); 
    // select element에서 선택된 option의 value가 저장된다. 
    selectValue = langSelect.options[langSelect.selectedIndex].value; 
    // select element에서 선택된 option의 text가 저장된다. 
    selectText = langSelect.options[langSelect.selectedIndex].text; 
    console.log(selectText,selectValue);
    bar();
}

var slider = d3.select('#km');
slider.on('change', function() {
  km=this.value;
  bar();
});

function bar(){
d3.csv("EC.csv",function(error,data){
    var dataset=[];
        dataset.push((km/data[selectValue].Fueleconomy)*71.3);
        dataset.push((km/data[selectValue].Fueleconomy)*255.7);
        dataset.push((km/14.5)*1500);
        dataset.push((km/14.5)*1500-(km/data[selectValue].Fueleconomy)*71.3)
        console.log(dataset)
    
    // X축 스케일 정의하기
    var xScale = d3.scaleLinear();
    xScale.domain([0, 2100000]).range([0, width]);
    
    // Y축 스케일 정의하기
    var yScale = d3.scaleBand();
    yScale.domain(d3.range(4)).padding(0.1).rangeRound([0, height]);
    
    // X축 그리기
    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);
    axisGroup
      // 애니메이션 효과를 주며 X축을 갱신
      .transition()
      .duration(0)
      .call(xAxis);
    
    // 막대 그리기
    var barUpdate = barGroup.selectAll("rect").data(dataset);
    // 1. 업데이트 셀렉션(데이터도 있고 대응되는 SVG 요소도 있는 경우).
    //    너비만 갱신
    barUpdate
      // 애니메이션을 통해 현재의 너비를 갱신
      .transition()
      .duration(150)
      .attr("width", function (d, i) {
        return xScale(d);
      })
      .attr("height", yScale.bandwidth())
      .attr("y", function (d, i) {
        return yScale(i);
      });
    
    // 2. 엔터 셀렉션(데이터는 있지만 대응되는 SVG 요소는 없는 경우).
    //    rect 요소를 생성하고 높이, y좌표, 너비를 모두 설정
    var barEnter = barUpdate.enter();
    barEnter
      .append("rect")
      .attr("height", yScale.bandwidth())
      .attr("y", function (d, i) {
        return yScale(i);
      })
      // 일단 너비 0에서 시작한 후...
      .attr("width", 0)
      // ...원래 크기로 늘어나는 애니메이션
      .transition()
      .duration(150)
      .attr("width", function (d, i) {
        return xScale(d);
      });
    });
}


bar();

