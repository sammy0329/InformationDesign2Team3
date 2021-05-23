//JSON 데이터 불러오기
d3.json("C:\Users\sammy\Documents\InformationDesign2Team3\대시보드\json\Compared_ev.json",function(error,data){
    var dataSet = [];
    for(var i=0; i<data.length;i++){
        dataSet.push(data[i],sales[0]);
    }

    d3.select("#myGraph")
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("class","bar")
    .attr("width",function(d,i){
        return d;
    })
    .attr("height",20)
    .attr("x",0)
    .attr("y",function(d,i){
        return i*25
    })
})