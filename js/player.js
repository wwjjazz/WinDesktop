function readerFile (file) {
	var type = file.type.split("/")[0];
	var name = file.name;
	var reader = new FileReader();
	reader.onload = function(){
		createLi(reader.result,type,name)
	}
	if (type == "text") {
		reader.readAsText(file);
	}else{
		reader.readAsDataURL(file);
	}
}
function createLi (data,type,name) {
	var typeObj = {
		text: "文本",
		audio: "音频",
		video: "视频",
		image: "图片"
	}
	var li = document.createElement("li");
	var div = document.createElement("div");
	var span = document.createElement("span");
	div.innerHTML = (typeObj[type])||("未知类型");
	span.innerHTML = name;
	li.appendChild(div);
	li.appendChild(span);
	li.addEventListener("mousedown",function(e){
		e.stopPropagation();
	})
	li.addEventListener("dblclick",function(){
		player.style.display = "block";
		player.innerHTML = "";
		if(!(type in typeObj)){
			var p = document.createElement("p");
			p.innerHTML = "未知类型，无法打开！";
			player.appendChild(p);
		}else if(type == "text"){
			var p = document.createElement("p");
			p.innerHTML = data;
			player.appendChild(p);
		}else if(type == "image"){
			var img = new Image();
			img.src = data;
			player.appendChild(img);
		}else if(type == "audio"){
			var audio = document.createElement("audio");
			audio.src = data;
			audio.controls = true;
			player.appendChild(audio);
		}else if(type == "video"){
			var vWrap = document.createElement("div");
			vWrap.id = "vWrap";
			vWrap.innerHTML = `<video src="`+data+`" id="v"></video>
				<div id="controls">
					<button id="playBtn" type="button">播放</button>
					<time>00:00</time>
					<input type="range" id="range" style="width: 400px" step="1" value="0" min="0">
					<time>00:00</time>
					<input type="number" value="1" step=".1" max="4" min=".2" id="playbackRate">
					<br/>
					<input type="range" min="0" max="1" value=".5" step=".1" id="volume">
					<button type="button" id="muted">静音</button>
					<button type="button" id="fullScreen">全屏</button>
				</div>`;
			player.appendChild(vWrap);
			(function(){
				var v = document.querySelector('#v');
				var playBtn = document.querySelector('#playBtn');
				var times = document.querySelectorAll('time');
				var range = document.querySelector('[type = "range"]');
				var playbackRate = document.querySelector('#playbackRate');
				var duration = 0
				var vWrap = document.querySelector('#vWrap');
				v.onloadedmetadata = function(){
					setLoad();
				};
				function setLoad(){
					controls.style.display = "block";
					duration = Math.ceil(v.duration);
					range.max = duration;
					times[1].innerHTML = setTime(duration);
					playBtn.onclick = function(e){
						e.stopPropagation();
						if(v.paused){
							v.play();
							this.innerHTML = "暂停";
						} else {
							v.pause();
							this.innerHTML = "播放";
						}
					};
				}
				v.ontimeupdate = function(){
					var nowTime = Math.ceil(v.currentTime);
					range.value = nowTime;
					times[0].innerHTML = setTime(nowTime);
				};
				range.oninput = function(e){
					v.currentTime = this.value;	
					e.stopPropagation();
				};
				// playbackRate 播放速度 1
				playbackRate.onmousedown = function(e){
					e.stopPropagation();
				}
				playbackRate.oninput = function(e){
					v.playbackRate = this.value;
				};
				//volume
				var volume = document.querySelector('#volume');
				volume.oninput = function(e){
					v.volume = this.value;
					e.stopPropagation();
				};
				// 静音设置
				var muted = document.querySelector('#muted');
				muted.onclick = function(e){
					e.stopPropagation();
					v.muted = !v.muted; 
				};
				// 全屏
				var fullScreen = document.querySelector('.player');
				fullScreen.onclick = function(e){
					vWrap.webkitRequestFullscreen();
					e.stopPropagation();
				};
			})();
			function setTime(nub){
				return parseInt(nub/60)+":"+((nub%60));
			}
		}
	})
	uploadPanel.querySelector("ul").appendChild(li);
}

function Mpalyerr () {
	var Mplayer = document.querySelector(".Mplayer");
	var audioArr = ["audio/陈鸿宇 - 理想三旬.mp3","audio/久石譲 - 一去不返的时光.mp3","audio/Vicetone - Nevada.mp3"];
	var imgArr = ["img/music1.jpg","img/music2.jpg","img/music3.jpg"];
	var controls = document.querySelector(".Mplayer .controls");
	var audio = document.querySelector(".Mplayer audio");
	var lis = document.querySelectorAll(".Mplayer .list li");
	var n = 0;
	audio.src = audioArr[n];
	lis[0].children[0].src = imgArr[n];
	audio.onloadedmetadata = function(){
		setTimeout(function(){
			audio.play();
		},600);
		
		controls.children[2].innerHTML = "■";
		controls.addEventListener("click",function(e){
			console.log(e.target)
			if(e.target.className == "prevBtn"){
				n--;
				if(n<0){
					n = audioArr.length-1;
				}
				audio.src = audioArr[n%audioArr.length];
				lis[0].children[0].src = imgArr[n%audioArr.length];
				audio.onloadedmetadata = function(){
					audio.play();
					e.target.nextElementSibling.innerHTML = "■";
				}
			}else if(e.target.className == "nextBtn"){
				n++;
				audio.src = audioArr[n%audioArr.length];
				lis[0].children[0].src = imgArr[n%audioArr.length];
				audio.onloadedmetadata = function(){
					audio.play();
					e.target.previousElementSibling.innerHTML = "■";
				}
			}else if(e.target.className == "playBtn"){
				e.stopPropagation();
				if(audio.paused){
					audio.play();
					e.target.innerHTML = "■";
				} else {
					audio.pause();
					e.target.innerHTML = "▶";
				}
			}else if(e.target.className == "muted"){
				audio.muted = !audio.muted;
			}else if(e.target.className == "close"){
				audio.pause();
				audio.src = "";
				Mplayer.style.display = "none";
			}
			e.stopPropagation();
		})
		Mplayer.addEventListener("mouseenter",function(e){
			controls.style.bottom = "0";
		})
		Mplayer.addEventListener("mouseleave",function(e){
			controls.style.bottom = "-52px";
		})
	}
}