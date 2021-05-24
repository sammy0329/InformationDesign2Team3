var selectValue=0 //자동차 인덱스 전역변수
var selectText="코나" //자동차 모델명 전역변수
var km=10000

function chageLangSelect(){ 
    var langSelect = document.getElementById("name"); 
    // select element에서 선택된 option의 value가 저장된다. 
    selectValue = langSelect.options[langSelect.selectedIndex].value; 
    // select element에서 선택된 option의 text가 저장된다. 
    selectText = langSelect.options[langSelect.selectedIndex].text; 
    console.log(selectText,selectValue);
}

d3.csv("EC.csv",function(error,data){
    var dataset=[];
    dataset.push((km/data[selectValue].Fueleconomy)*0.1);
    dataset.push((km/data[selectValue].Fueleconomy)*0.2);
    dataset.push((km/data[selectValue].Fueleconomy)*0.3);
    d3.select("#myGraph")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x",70)
        .attr("y",function(d,i){
            return i*25+20;
        })
        .attr("width","0px")
        .attr("height","20px")
        .transition()
        .duration(2500)
        .attr("width",function(d,i){
            return d+"px";
        })

        var xScale=d3.scale.linear()
            .domain([0,150000])
            .range([0,500])
        d3.select("#myGraph")
           .append("g")
           .attr("class","axis")
           .attr("transform","translate(70, "+((1+dataset.length)*20+20)+")")
           .call(d3.svg.axis().scale(xScale).orient("bottom"))
        
        d3.select("#myGraph").append("text").attr("y",35).attr("x",30).text("완속")
        d3.select("#myGraph").append("text").attr("y",60).attr("x",30).text("급속")
        d3.select("#myGraph").append("text").attr("y",85).attr("x",15).text("휘발유")

    //버튼 클릭 시
    d3.select("#name")
    .on("change",function(){
        dataset=[];
        dataset.push((km/data[selectValue].Fueleconomy)*0.2);
        dataset.push((km/data[selectValue].Fueleconomy)*0.3);
        dataset.push((km/data[selectValue].Fueleconomy)*0.4);
        d3.select("#myGraph")
        .selectAll("rect")
        .data(dataset)
        .transition().duration(1000)
        .attr("width",function(d,i){
            return d+"px";
        })
    })
})