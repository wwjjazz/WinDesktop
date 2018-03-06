var resourcePanel = document.querySelector(".resourcePanel");
var reRightUl = document.querySelector(".cont .right ul");
var deskTopWrap = document.querySelector(".desktop .wrap");
var iconArr = {TrashBin:"img/Trash_Bin_Full_48px.png",setting:"img/Steam_48.png",firefox:"img/firefox_482.png",folder:"img/folder48.png",pdf:"img/pdf48.png"};
var _ID = 0;
deskTopWrap.dataset.id = 0;
var CopyIdArr = [];
var CutIdArr = [];
var winBtn = document.querySelector(".dock .win");
var musicBtn = document.querySelector(".musicBtn");
var winPanel = document.querySelector(".winPanel");
var MplayerEl = document.querySelector(".Mplayer");
var uploadPanel = document.querySelector(".uploadPanel");
var upload = document.querySelector("#upload");
var player = document.querySelector(".player");
var logOffBtn = document.querySelector(".logOff");
var welcome = document.querySelector(".welcome");


// Dock栏中多任务icon的容器
var iconDock = document.querySelector(".dock .icon-dock");
console.log(iconDock);

// 资源管理器的层级
var reZIndex = 1;

// 资源管理器的ID号
var resourceId = 0;

var MAXID = getMaxId();

render(getChildren(deskTopWrap.dataset.id) ,deskTopWrap);
iconSort();


document.addEventListener("mousedown",function(e){
	player.style.display = "none";
	player.innerHTML = "";
	if(e.target == deskTopWrap||e.target.className == "style-bicon"){
		console.log(109,e.target)
		var lis = e.target.querySelectorAll("li");
		for (var i = 0; i < lis.length; i++) {
			lis[i].className = lis[i].className.split(" selected").join("");
		}
	}
})

document.addEventListener("mouseup",function(e){
	closeCtmPl();
	if(winPanel.style.display == "block"){
		winPanel.style.display = "none";
	}
});

document.addEventListener("contextmenu",function(e){
	var menuData = "globel";
	if(e.target.parentNode.dataset.contextmenu){
		menuData = e.target.parentNode.dataset.contextmenu;
	}
	if(e.target.dataset.contextmenu){
		menuData = e.target.dataset.contextmenu;
	}
	console.log(menuData,menuList[menuData]);
	toCtmPl(e,menuList[menuData]);
})

fileSelect(deskTopWrap);


winBtn.addEventListener("click",function(e){
	if(winPanel.style.display == "none"){
		winPanel.style.display = "block";
	}else{
		winPanel.style.display = "none";
	}
	e.preventDefault();
})


upload.addEventListener("change",function(e){
	console.log(1,this.files[0]);
	winPanel.style.display = "none";
	uploadPanel.style.display = "block";
	readerFile(this.files[0]);
	e.stopPropagation();
})

musicBtn.addEventListener("click",function(){
	if(MplayerEl.style.display == "none"){
		MplayerEl.style.display = "block";
		Mpalyerr();
		drag(MplayerEl,MplayerEl);
	}else{
		MplayerEl.style.display = "none";
	}
})

calculator ();
logOffBtn.addEventListener("click",function(e){
	welcome.style.display = "block";
	e.stopPropagation();
})

document.onkeydown = function(e){
	console.log(e.keyCode)
	if(e.keyCode == 13){
		var input = document.querySelector(".welcome input");
		var audioarea = document.querySelector(".welcome .audioarea");
		if(input.value){
			if(input.value == user.password){
				welcome.style.display = "none";
				input.value = "";
			}else{
				input.value = "密码错误！"
				var audio = document.createElement("audio");
				audio.src = "audio/9410.wav";
				audioarea.innerHTML = "";
				audioarea.appendChild(audio);
				audio.onloadedmetadata = function(){
					audio.play();
				}
			}
		}
	}
}
