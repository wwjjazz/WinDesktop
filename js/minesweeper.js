var minesweeper = document.querySelector(".minesweeper");
var minesweeperTop = document.querySelector(".minesweeper .top");
var select = document.querySelector(".minesweeper select");
var btn = document.querySelector(".minesweeper input[type=button]");

var div = document.createElement("div");
div.className = "box";
var objNum = {
	简单:{row:9,col:9,lei:10},
	中等:{row:16,col:16,lei:40},
	困难:{row:16,col:30,lei:99}
};
getBox();
select.onchange = getBox;
btn.onclick = function(){
	getBox();
	bulei(objNum[select.value].lei);
	clickBack();
}

//生成雷区
function getBox(){
	// this.vaule = this.vaule == undefined ? "简单" : this.value;
	if (!select.value) {
		select.value = "简单";
	}
	// console.log(this.vaule);
	// console.log(objNum[this.value]);

	var str = "";
	div.innerHTML = "";
	var nub = objNum[select.value].row*objNum[select.value].col;
	for (var i = 0; i < nub; i++) {
		var topp = 10 + Math.floor(i/objNum[select.value].col)*30+"px";
		var leftt = 10 + i%objNum[select.value].col*30+"px";
		str += '<div style = "top:'+topp+';left:'+leftt+'"></div>'
	}
	div.innerHTML += str;
	div.style.height = 30*objNum[select.value].row + "px";
	div.style.width = 30*objNum[select.value].col + "px";
	div.margin = "0 auto"
	minesweeper.appendChild(div);
}

//随机布雷
bulei(10);
function bulei(nub){
	var divs = document.querySelectorAll(".box div");
	console.log(divs.length);
	for (var i = 0; i < divs.length; i++) {
		divs[i].className = "";
		divs[i].innerHTML = "";
	}
	for (var i = 0; i < nub; i++) {
		var k = Math.floor(Math.random()*objNum[select.value].row*objNum[select.value].col);
		if(divs[k].dataset.lei == "true"){
			i--;
		}else{
			divs[k].dataset.lei = "true";
			// divs[k].innerHTML = "雷";
		}
	}
	divs.forEach(function(e,index){
		if (e.className != "lei") {
			checkBoom(index);
		}
		
	})
}

//点击翻开
clickBack();
function clickBack(){
	var divs = document.querySelectorAll(".box div");
	
	for (var i = 0; i < divs.length; i++) {
		divs[i].dataset.index = i;
		divs[i].onclick = function(){
			if (this.dataset.lei == "true") {
				divs.forEach(function(el,index){
					if(el.dataset.lei == "true"){
						el.style.background = "orange";
						el.innerHTML = "雷";
					}
				})
				alert("游戏结束");
			}else{
				var sn = divs.length-1;
				divs.forEach(function(el){
					if(el.className == "open"){
						sn--;
					}
				})
				console.log(sn);
				autOpen(this.dataset.index);
				if (sn==10) {
					alert("恭喜排雷成功！")
					divs.forEach(function(el,index){
						if(el.dataset.lei == "true"){
							el.style.background = "orange";
							el.innerHTML = "雷";
						}
					})
				}
			}

			
		}
	}
} 
function autOpen(i){
	var divs = document.querySelectorAll(".box div");
	i = parseFloat(i);
	divs[i].className = "open";
	var nub = divs[i].dataset.nub == undefined?"":divs[i].dataset.nub;
	divs[i].innerHTML = nub;
	if (divs[i].innerHTML == "") {
		var leftt = parseFloat(divs[i].style.left);
		if(leftt>0&&leftt<8*30){
			var arr = [i-10,i-9,i-8,i-1,i,i+1,i+8,i+9,i+10];
		}else if(leftt == "0"){
			var arr = [i-9,i-8,i,i+1,i+9,i+10];
		}else{
			var arr = [i-10,i-9,i-1,i,i+8,i+9];
		}
		var arr2 = arr.filter(function(el){
			if (el<0||el>=81) {  
				return false;
			}
			return true;
		});
		var arr3 = arr2.filter(function(e){
			if (divs[e].className == "open") {
				return false;
			}
			return true;
		});
		arr3.forEach(function(e){
			console.log(e);
			autOpen(e);
		})
	}
		

}

// 判断周围有几个雷
function checkBoom(i){
	var divs = document.querySelectorAll(".box div");
	i = parseFloat(i);
	var leftt = parseFloat(divs[i].style.left);
	if(leftt>0&&leftt<8*30){
		var arr = [i-10,i-9,i-8,i-1,i,i+1,i+8,i+9,i+10];
	}else if(leftt == "0"){
		var arr = [i-9,i-8,i,i+1,i+9,i+10];
	}else{
		var arr = [i-10,i-9,i-1,i,i+8,i+9];
	}
	
	var arr2 = arr.filter(function(el){
		if (el<0||el>=81) {  //||divs[el].className == "lei"||divs[el].style.backgroundColor == "red"
			return false;
		}
		return true;
	});
	// console.log(arr2);
	var nub = 0;
	// console.log(arr2);
	arr2.forEach(function(el,index){

		if(divs[el].dataset.lei == "true"){
			nub++;
		}
		// else{
			// divs[el].style.background = "red";
			// checkBoom(el);
		// }
	})
	if (nub>0) {

		divs[i].dataset.nub = nub;
		// return;
	}
	arr3 = arr2.filter(function(e){
		if (e==i||divs[e].className == "lei"||divs[e].innerHTML != "") {
			return false;
		}
		return true;
	})
	// console.log(arr3)
	
	// checkBoom(51);
	// arr3.forEach(function(el){
	// 	checkBoom(el);
	// })
}
drag(minesweeperTop,minesweeper);
var minesweeperExe = document.querySelector(".minesweeperExe");
var minesweeperClose = document.querySelector(".minesweeper .close");
minesweeperExe.onclick = function(e){
	if(minesweeper.style.display == "none"){
		minesweeper.style.display = "block";
		minesweeper.style.zIndex = reZIndex++;
		minesweeper.style.top = (window.innerHeight-minesweeper.offsetHeight)/2 + "px";
		minesweeper.style.left = (window.innerWidth-minesweeper.offsetWidth)/2 + "px";
		getBox();
		bulei(10);
		clickBack();
	}else{
		minesweeper.style.display = "none";
	}
	e.preventDefault();
}

minesweeperClose.onclick = function(){
	minesweeper.style.display = "none";
}