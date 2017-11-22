// 页面加载
var music = document.getElementById('music');
var musicAudio = document.getElementById('musicAudio');
musicAudio.play(); // 自动播放
var musicFlag = false;

music.addEventListener('click', function (e) {
  e.preventDefault();
  var t = setTimeout(function () {
    t = null;
    musicFlag ? musicAudio.pause() : musicAudio.play();
    music.setAttribute("class", musicFlag ? "bgm-btn" : "bgm-btn rotate");
  });
}, false);

musicAudio.addEventListener('playing', function (e) {
  e.preventDefault();
  music.setAttribute("class", "bgm-btn rotate");
  musicFlag = true;

}, false);

musicAudio.addEventListener('pause', function (e) {
  e.preventDefault();
  musicFlag = false;
}, false);

musicAudio.addEventListener('play', function (e) {
  e.preventDefault();
  musicFlag = true;
}, false);