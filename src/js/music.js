// 页面加载
var music = document.getElementById('music');
var musicAudio = document.getElementById('musicAudio');
musicAudio.load(); // 支持iOS
musicAudio.play(); // 默认浏览器的自动播放
var musicFlag = false;

// 微信配置自动播放
wx && wx.config({
  // 配置信息, 即使不正确也能使用 wx.ready
  debug: false,
  appId: '',
  timestamp: 1,
  nonceStr: '',
  signature: '',
  jsApiList: []
});
wx && wx.ready(musicAudio.play);

music.addEventListener('click', function (e) {
  e.preventDefault();
  var t = setTimeout(function () {
    t = null;
    musicFlag
      ? musicAudio.pause()
      : musicAudio.play();
    music.setAttribute("class", musicFlag
      ? "bgm-btn"
      : "bgm-btn rotate");
  });
}, false);

musicAudio.addEventListener('loadedmetadata', function (e) {
  e.preventDefault();
  music.setAttribute("class", "bgm-btn rotate");
  musicFlag = true;
}, false);

musicAudio.addEventListener('playing', function (e) {
  music.setAttribute("class", "bgm-btn rotate");
  musicFlag = true;
}, false);

musicAudio.addEventListener('waiting', function (e) {
  music.setAttribute("class", "bgm-btn");
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