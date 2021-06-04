var canvas = document.getElementById("Canvas");

var ctx = canvas.getContext("2d"); // 캔버스 객체 생성

// Set faux rounded corners
ctx.lineJoin = "round";
ctx.lineWidth = cornerRadius;

ctx.beginPath();
// 색 설정
ctx.strokeStyle = '#A9C9F7'; // 선 색
ctx.fillStyle = '#333333'; // 채운 사각형 색

// 그리기
ctx.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
ctx.fillRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
ctx.font = '30px Arial';
ctx.fillText('전기차 vs 휘발유 자동차', rectX+15, rectY+30);
ctx.font = '15px Arial';
// ctx.fillText('연료값', rectX+15, rectY+75);
// ctx.fillText('완속 : 1kWh', rectX+15, rectY+110);
// ctx.fillText('급속 : 1kWh', rectX+15, rectY+140);

