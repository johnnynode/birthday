var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

// set width height animation
var cake = document.getElementById('cake-wrap');
cake.setAttribute("width", SCREEN_WIDTH);
cake.setAttribute("height", SCREEN_HEIGHT);
cake.setAttribute('class', 'cur');

// 变色处理
var colorChangeCount = 0;
cake.addEventListener('click',function() {
  colorChangeCount++;
  var arr = ['#3791f9','#fc183f','#343b44'];
  document.body.style.backgroundColor = arr[colorChangeCount%3];
},false)