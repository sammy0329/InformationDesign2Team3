CarValue=0 //자동차 인덱스 전역변수
CarText="코나" //자동차 모델명 전역변수
ConditionValue=1
ConditionText="가격"
CityText=""
EV = []

// set the dimensions and margins of the graph
margin = {top: 40, right: 20, bottom: 40, left: 140},
width = 460 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;

// selectValue = ev_select.options[ev_select.selectedIndex].value;


Chart = function(data){
    this.chart = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
        
    this.data = data
    this.xScale = this.axis()[0]
    this.yScale = this.axis()[1]
 
}
Chart.prototype = Object.create(Chart.prototype);
Chart.prototype.axis = function(){
    


    // //div 삭제 후 다시 만들어주면서 그래프 갱신
    // const Olddiv = document.getElementById("my_dataviz");
    // Olddiv.remove();
    // 

    // append the svg object to the body of the page
   
    //x axis 조절
    let xScale = d3.scaleLinear()
    .domain([0,this.data[0].value])
    .range([ 0, width]);
    
   

    // Y axis 조절
    let yScale = d3.scaleBand()
    .range([ 0, height ])
    .domain(this.data.map(function(d) { return d.key; }))
    .padding(.3);

    
    
    //  console.log(this.xScale)
    return[xScale,yScale]
}

Chart.prototype.line = function(){
    
    let xScale = this.xScale;
    let yScale = this.yScale;

    this.chart.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "grid")

    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height))

    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    

    this.chart.append("g")
    .call(d3.axisLeft(yScale))
    
    const barGroups = this.chart.selectAll()
    .data(this.data)
    .enter()
    .append('g')

    console.log(yScale)
    // chart.selectAll("myRect")
    barGroups
        .append("rect")
        .attr("class", "bar")
        .attr("x", xScale(0) )
        .attr("y", function(d) { return yScale(d.key); })     
        // .transition()
        // .duration(2000)
        .attr("width", function(d) { return xScale(d.value); })
        .attr("height", yScale.bandwidth() )
         
       
    update_color();  

    return barGroups
}

Chart.prototype.avg = function(){
    console.log(this.data.value)
}


function test(num){
    let d = []
    EV.forEach(function(value){
        d.push({key : value[0].name, value : value[0][Object.keys(value[0])[num]]})
    })
    d.sort(function(b, a) {
             return a.value - b.value;
           });
    return d
}  


// //처음화면에 가격 부터 띄워줌
// Make_Ev_Compared_Chart();

//차량 선택에 따른 value 값 및 text 저장 함수
function changeLangSelect(){ 
    let CarSelect = document.getElementById("name"); 
    // select element에서 선택된 option의 value가 저장된다. 
    CarValue = CarSelect.options[CarSelect.selectedIndex].value; 
    // select element에서 선택된 option의 text가 저장된다. 
    CarText = CarSelect.options[CarSelect.selectedIndex].text; 
     console.log(CarValue,CarText);
     update_color();
}

//내가 선택한 차종 색 변경
function update_color(){
    d3.selectAll(".bar")
    .style("fill",function(d,i){
        if(d.key===CarText){
            return "orange";
        }
       
    })  
}
//조건 선택에 따른 value 값 및 text 저장 함수
function changeConditionSelect(){ 
    let ConditionSelect = document.getElementById("condition"); 
    // // select element에서 선택된 option의 value가 저장된다. 
     ConditionValue = ConditionSelect.options[ConditionSelect.selectedIndex].value;
    // select element에서 선택된 option의 text가 저장된다. 
     ConditionText = ConditionSelect.options[ConditionSelect.selectedIndex].text;
     if(ConditionText==="보조금"){
        document.all.region.style.visibility="visible";
        document.all.city.style.visibility="visible";
     }else{
        document.all.region.style.visibility="hidden";
        document.all.city.style.visibility="hidden";
     }
   

    //div 삭제 후 다시 만들어주면서 그래프 갱신
    const Olddiv = document.getElementById("my_dataviz");
    Olddiv.remove();
    const NewDiv = document.createElement('div');
    NewDiv.setAttribute("id", "my_dataviz");
    document.body.appendChild(NewDiv);

    drawChart();
}

// //city 값을 저장하는 함수
// function changeCitySelect(){ 
//     let CitySelect = document.getElementById("city"); 
//     // select element에서 선택된 option의 text가 저장된다. 
//      CityText = CitySelect.options[CitySelect.selectedIndex].text;
//       if(ConditionText==="보조금") Make_Ev_Compared_Chart(); 
//     console.log(CityText)
// }



//Ev 차종별 조건에 맞는 비교 chart 만들기 함수
// function Make_Ev_Compared_Chart(){



  
d3.json("Compared_ev.json",function(error,data){readEV(error,data)});
   
   
function readEV(error,data){   

    //sorting
    if (error) throw error;
 
    data.cars.forEach((element) => {
        EV.push([
            {
            name: element.차종별,
            price: element.가격,
            speed : element.최고속도,
            mileage : element.주행거리,
            fuel: element.연비,
            passenger: element.승차인원
            
           
           
            },
        ]);
    });

    drawChart()
    
}

function drawChart(){


    let testV = new Chart(test(ConditionValue));
    bargraph = testV.line();

    let tooltip = d3.select("body").append("div")
        .attr("class", "toolTip")
        .style("display", "none"); 
    
        let Unit;
        //단위 만들어서 합쳐보고 싶었는데...
            if(ConditionText==="가격"){
                Unit =" 원"
            }else if(ConditionText==="최고속도" || ConditionText==="주행거리"){
                Unit=" Km"
            }else if(ConditionText==="연비"){
                Unit=" kWh/km"
            }else if(ConditionText==="승차인원"){
                Unit=" 명"
            }

        bargraph
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout",  function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
            tooltip.style("left", (d3.event.pageX + 10) + "px");
            tooltip.style("top", (d3.event.pageY - 10) + "px");
            tooltip.text(String(d.value)+Unit)
        })
        .on("click",function(point, event) {
            console.log(point);
            if(event.length <= 0) return;
            CarText =point.key
            
            $('#name').val(CarText).prop("selected",true);
            update_color();  
        });

this.avg();

}
