// 页面加载
var music = document.getElementById('music');
var musicAudio = document.getElementById('musicAudio');
musicAudio.load(); // 支持iOS
musicAudio.volume = 0.75; //表示的是播放音量为原来的75%
var musicFlag = false;

// 微信配置自动播放
// http://res.wx.qq.com/open/js/jweixin-1.0.0.js
// https://www.cnblogs.com/zhangkeyu/p/6657729.html
wx && wx.config({
  // 配置信息, 即使不正确也能使用 wx.ready
  debug: false,
  appId: '',
  timestamp: 1,
  nonceStr: '',
  signature: '',
  jsApiList: []
});
wx && wx.ready(function () {
  musicAudio.play();
  musicAudio.volume = 0.75; //表示的是播放音量为原来的75% 在ios中并不起作用
});

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