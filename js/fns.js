function render(data,container){
	console.log(12)
	container.innerHTML = "";

	data.forEach(function(item){

		if(container == deskTopWrap){
			var li = document.createElement("li");
			li.className = "icon ";
			// var checkbox = document.createElement("input");
			// checkbox.type = "checkbox";
			var span = document.createElement("span");
			span.style.backgroundImage = "url("+iconArr[item.type]+")";
			span.innerHTML = item.name;
			// li.appendChild(checkbox);
			li.appendChild(span);
			container.appendChild(li);
		}else{
			var li = document.createElement("li");
			li.innerHTML = '<span class="'+item.type.split("-")[0]+'">'+item.name+'</span>';  //<input type="checkbox">
			container.appendChild(li);
		}
		var cl = li;
		cl.dataset.index = item.id;
		cl.dataset.contextmenu = item.type.split("-")[1]?item.type.split("-")[1]:item.type;

		if(cl.dataset.contextmenu !== "delFile"){
			cl.addEventListener("dblclick",function(e){
				var el = e.target.tagName == "LI"?e.target:e.target.parentNode;
				var select = item.pid == 0?0:el.parentNode.parentNode.previousElementSibling.querySelector("select");
				openFolder(item,select,el.parentNode);
			})
		}
		
		drag(cl,cl);
	})
	if(container == deskTopWrap){
		iconSort();
	}else{
		fileSort(container);
	}
}



// 打开文件夹 
// data: 当前点击的元素对应的数据 select.value: 打开方式, 1: 新窗口 2: 当前窗口
// container: 渲染数据的容器
function openFolder(data,select,container) {
	console.log(data);
	if(data.pid == 0){
		if(data.id == 7){
			toResPl(data,false)
		}else{
			toResPl(data,true);			
		}
	}else{
		console.log(select,select.value);
		if(select.value == 1){
			toResPl(data,true);
		}else if(select.value == 2){
			var reRightUl = container;
			reRightUl.dataset.id = data.id;
			render(getChildren(reRightUl.dataset.id),reRightUl);
			var path = reRightUl.parentNode.previousElementSibling.querySelector(".path");
			showNav(reRightUl,path);
		}
	}	
}



// 创建资源管理器面板
// data为点击元素对应的数据，booleann为面板类型：包括资源管理器(true)、回收站(false)两种

function toResPl(data,booleann){
	var resource = document.createElement("div");
	resource.className = "resourcePanel";
	resource.dataset.windowId = resourceId++;

		var topDiv = document.createElement("div");
		topDiv.className = "top";
		var h3 = document.createElement("h3");
		if(booleann){
			h3.innerHTML = "资源管理器";
		}else{
			h3.innerHTML = "回收站";
		}
		
		h3.className = "left";
		var control = document.createElement("div");
		control.className = "control right";
		control.innerHTML = `
			<span class="min">-</span>
			<span class="max">□</span>
			<span class="close">×</span>
		`;
		topDiv.appendChild(h3);
		topDiv.appendChild(control);

		var sort = document.createElement("div");
		sort.className = "sort";
		sort.innerHTML = `
			<span>展示形式:<a href="javascript:;">&nbsp;&nbsp;列表&nbsp;&nbsp;</a><a href="javascript:;">小图标&nbsp;&nbsp;</a><a href="javascript:;">大图标&nbsp;&nbsp;</a></span>
			<span>排序方式:<a href="javascript:;">&nbsp;&nbsp;名称&nbsp;&nbsp;</a><a href="javascript:;">修改时间&nbsp;&nbsp;</a><a href="javascript:;">类型&nbsp;&nbsp;</a><a href="javascript:;">大小&nbsp;&nbsp;</a></span>
		`;
		// var checkbox = document.createElement("span");
		// checkbox.className = "right";
		// checkbox.innerHTML = `全选<input type="checkbox" name="" class="checkAll">`;
		var hr = document.createElement("hr");
		hr.style.cssText = "width:calc(100% - 20px);margin:10px auto";
		var backP = document.createElement("a");
		backP.href= "javascript:;";
		backP.className = "backParent";
		backP.innerHTML = "返回上级";
		var path = document.createElement("span");
		path.className = "path";
		var openType = document.createElement("span");
		openType.innerHTML = `
			<select id="explorerOpenType">
	            <option value="1">新窗口打开</option>
	            <option value="2">当前窗口打开</option>
	        </select>
		`;
		openType.className = "right";
		// sort.appendChild(checkbox);
		sort.appendChild(hr);
		sort.appendChild(backP);
		sort.appendChild(path);
		sort.appendChild(openType);

		var cont = document.createElement("div");
		cont.className = "cont";
		var reRightUl = document.createElement("ul");
		reRightUl.className = "style-bicon";
		fileSelect(reRightUl);
		if(!booleann){
			reRightUl.dataset.contextmenu = "TrashBinP";
		}
		cont.appendChild(reRightUl);

	resource.appendChild(topDiv);
	resource.appendChild(sort);
	resource.appendChild(cont);

	document.body.appendChild(resource);
	resource.style.top = (window.innerHeight-resource.offsetHeight)/2 + "px";
	resource.style.left = (window.innerWidth-resource.offsetWidth)/2 + "px";  // Math.random()*50 

	resource.style.zIndex = reZIndex++;
	resource.style.display = "block";

	// var reRightUl = reRightUl;
	// var reTop = topDiv;

	topDiv.dataset.contextmenu = "resource";
	reRightUl.dataset.id = data.id;
	resource.dataset.max = false;

	topDiv.addEventListener("mousedown",function(e){
		this.parentNode.style.zIndex = reZIndex++;
		var THIS = this.parentNode;
		console.log(this.dataset.windowId)
		// render(getChildren(reRightUl.dataset.id),reRightUl);
		var dockIcons = document.querySelectorAll(".dock .icon-dock .task");
		dockIcons = Array.prototype.slice.call(dockIcons);
		for (var i = 0; i < dockIcons.length; i++) {
			dockIcons[i].className = dockIcons[i].className.split("now").join("");
		}
		dockIcons.find(function(n){
			return n.dataset.windowId == THIS.dataset.windowId;
		}).className += "now";
		e.stopPropagation();
	})
	reRightUl.addEventListener("mousedown",function(){
		var lis = this.querySelectorAll("li");
		for (var i = 0; i < lis.length; i++) {
			lis[i].className = lis[i].className.split(" selected").join("");
		}
	})
	resource.addEventListener("mousedown",function(e){
		this.style.zIndex = reZIndex++;
		var THIS = this;
		console.log(this.dataset.windowId)
		// render(getChildren(reRightUl.dataset.id),reRightUl);
		var dockIcons = document.querySelectorAll(".dock .icon-dock .task");
		dockIcons = Array.prototype.slice.call(dockIcons);
		for (var i = 0; i < dockIcons.length; i++) {
			dockIcons[i].className = dockIcons[i].className.split("now").join("");
		}
		dockIcons.find(function(n){
			return n.dataset.windowId == THIS.dataset.windowId;
		}).className += "now";
		e.stopPropagation();
	})
	backP.addEventListener("click",function(){
		console.log(reRightUl.dataset.id,getSelf(reRightUl.dataset.id));
		if(getSelf(reRightUl.dataset.id).pid == 0){
			return;
		}
		var parent = getParent(reRightUl.dataset.id);
		console.log(parent);
		reRightUl.dataset.id = parent?parent.id:0;
		render(getChildren(reRightUl.dataset.id),reRightUl);
		showNav(reRightUl,path);
	})

	control.addEventListener("click",function(e){
		if (e.target.className == "close") {
			closee(resource);
			var dockIcons = document.querySelectorAll(".dock .icon-dock .task");
			dockIcons = Array.prototype.slice.call(dockIcons);
			var tt = dockIcons.find(function(el){
				return el.dataset.windowId == resource.dataset.windowId;
			})
			closee(tt)
		}else if(e.target.className == "max"){
			if(resource.dataset.max == "false"){
				var resRect = resource.getBoundingClientRect();
				resource.dataset.oldInfo = '{"w":'+ resRect.width + 
					',"h":' + resRect.height + ',"l":' + resRect.left + ',"t":' + resRect.top + '}';
				resource.style.width = "100%";
				resource.style.height = "100%";
				resource.style.left = "0px";
				resource.style.top = "0px";
				resource.children[2].style.height = "calc( 100% - 86px - 60px )";
				resource.dataset.max = true;
			}else{
				resource.dataset.max = false;
				var obj = JSON.parse(resource.dataset.oldInfo);
				console.log(obj);
				resource.style.width = obj.w + "px";
				resource.style.height = obj.h + "px";
				resource.style.left = obj.l + "px";
				resource.style.top = obj.t + "px";
			}
			
			
			
		}else if(e.target.className == "min"){
			var dockIcons = document.querySelectorAll(".dock .icon-dock .task");
			dockIcons = Array.prototype.slice.call(dockIcons);
			var tt = dockIcons.find(function(el){
				return el.dataset.windowId == resource.dataset.windowId;
			})
			console.log(tt);
			if(tt.className.indexOf("now") !== -1){
				console.log(1209)
				tt.className = tt.className.split("now").join("");
			}
			resource.style.display = "none";
		}
	})
	drag(topDiv,resource);
	console.log(reRightUl,Number(reRightUl.dataset.id),getChildren(Number(reRightUl.dataset.id)))
	if(data.id==7){
		render(delList.filter(function(item){return item.delid==7}),reRightUl);
	}else{
		render(getChildren(Number(reRightUl.dataset.id)),reRightUl);
	}
	showNav(reRightUl,path);
	dockShow(data.type,resourceId - 1);
}

// 创建导航路径
function showNav(reRightUl,path){
	var ulId = reRightUl.dataset.id;
	var pathList = getParents(ulId);
	path.innerHTML = "";
	pathList.forEach(function(item){
		var a = document.createElement("a");
		a.innerHTML = item.name + " > ";
		a.addEventListener("click",function(e){
			reRightUl.dataset.id = item.id;
			render(getChildren(reRightUl.dataset.id),reRightUl);
			showNav(reRightUl,path);
			e.preventDefault();
		})
		path.appendChild(a);
	})
	var span = document.createElement("span");
	name = getSelf(ulId)?getSelf(ulId).name:"";
	span.innerHTML = name;
	path.append(span);
}


// 创建右键菜单
// e: 触发右键菜单的事件对象 data: 右键类型相关数据
function toCtmPl(e,data){
	console.log(data)
	var parentEvent = e;
	var contextmenu = document.querySelector(".contextmenu");
	contextmenu.innerHTML = "";
	contextmenu.style.display = "block";
	contextmenu.style.zIndex = 999;

	data.forEach(function(item){
		if (item.type && item.type == "line") {
			var hr = document.createElement("hr");
			hr.style.cssText = "height:0px;border:none;border-bottom:1px solid #ff9800;margin:0";
			contextmenu.appendChild(hr);
		}else{
			var li = document.createElement("li");
			var h3 = document.createElement("h3");
			h3.innerHTML = item.name;
			li.appendChild(h3);
			if (item.children) {
				var list = document.createElement("ul");
				item.children.forEach(function(el){
					var lii = document.createElement("li");
					lii.innerHTML = el.name;
					lii.addEventListener("click",function(e){
						if(typeof el.exe == "function" && item.disabled !== true){
							el.exe(e,parentEvent.target);
						}
						e.stopPropagation();
					})
					list.appendChild(lii);
				})
				li.appendChild(list);
			}
			if (item.disabled) {
	            li.className = 'disabled';
	            li.style.cursor = 'not-allowed';
	        }
			li.addEventListener("click",function(){
				if(typeof item.exe == "function" && item.disabled !== true){
					item.exe(e,parentEvent.target);
				}
				e.stopPropagation();
			})
			li.addEventListener("mouseover",function(){
				if(this.children[1]){
					this.children[1].style.display = "block";
					var rect = this.children[1].getBoundingClientRect();
					if(rect.right>window.innerWidth){
						this.children[1].style.right = "170px"; 
						this.children[1].style.left = "auto"; 
					}
					if(rect.bottom>window.innerHeight -40){
						this.children[1].style.bottom = "10px"; 
						this.children[1].style.top = "auto";
					}
				}

			})
			li.addEventListener("mouseout",function(){
				if(this.children[1]){
					this.children[1].style.display = "none";
				}
			})
			contextmenu.appendChild(li);
		}
		
	})
	var rect = contextmenu.getBoundingClientRect();
	console.log(window.innerWidth,e.clientX,rect.width)
	if(window.innerWidth - e.clientX < rect.width){
		contextmenu.style.left = window.innerWidth - rect.width + "px";
	}else{
		contextmenu.style.left = e.clientX + "px";
	}
	if(window.innerHeight-40 - e.clientY < rect.height){
		contextmenu.style.top = window.innerHeight-40 - rect.height + "px";
	}else{
		contextmenu.style.top = e.clientY + "px";
	}
	e.preventDefault();
    e.stopPropagation();
}

// 关闭右键菜单

function closeCtmPl(){
	var contextmenu = document.querySelector(".contextmenu");
	contextmenu.style.display = "none";
}
function closee(el){
	el.parentNode.removeChild(el);
}





// 获取最大id值

function getMaxId(){
	dataList.sort(function(a,b){
		return a.id - b.id;
	})
	return dataList[dataList.length-1].id;
}



// 检查是否重名

function isSameName(data){
	
	var children = getChildren(data.pid);
	console.log(data,children);
	
	children = children.filter(function(item){
		return data.id !== item.id;
	})
	console.log(data,children);
	var isSameName = false;
	children.forEach(function(item){
		if(data.name == item.name && data.type == item.type){
			isSameName = true;
		}
	})
	return isSameName;
}



// 桌面图标排序

function iconSort () {
	var deskTopWrap = document.querySelector(".desktop .wrap");
	var dWRect = deskTopWrap.getBoundingClientRect();
	var iconH = 104;
	var iconW = 76;
	var max = Math.floor(dWRect.height/iconH);
	// console.log(max,dWRect.height)
	var icon = document.querySelectorAll(".icon");
	console.log(icon)
	icon.forEach(function(item,index){
		item.style.position = "absolute";
		item.style.top = index % max * iconH + "px";
		item.style.left = Math.floor(index / max) *iconW + "px";
	})
	console.log("icons is fine")
}

// 文件排序(仅界面上的排序，非数据排序)
// container: 要排序文件的容器
function fileSort (container) {
	var conRect = container.getBoundingClientRect();
	var lis = container.querySelectorAll("li");
	if(!lis.length){
		return;
	}
	var liRect = lis[0].getBoundingClientRect();
	var liH = liRect.height;
	var liW = liRect.width;
	console.log(liW,liH)
	var max = Math.floor(conRect.width/liW);
	for (var i = 0; i < lis.length; i++) {
		lis[i].style.top = Math.floor(i / max) * (liH+4) + 10+"px";
		lis[i].style.left = i % max * (liW+4) + 10+"px";
	}
}


// 拖拽功能
// el1: 触发该函数的元素 el2: 移动的元素 
// fns是一个对象，包括按下(start)、移动(move)、抬起(end)时触发的函数

function drag(el1,el2,fns) {
	el1.onmousedown = function(e){
		var startPoint = {
			x: e.clientX,
			y: e.clientY
		}

		// 判断拖拽的元素是否为selected(被框选)的数据
		if(el2.className.indexOf("selected") !== -1){
			var rect = el2.parentNode.getBoundingClientRect();
			var block = document.createElement("div");

			// 将所有的被框选元素的id存入数组
			var idArr = Array.prototype.slice.call(el2.parentNode.querySelectorAll("li"))
			.filter(function(item){return item.className.indexOf("selected") !== -1})
			.map(function(item){return Number(item.dataset.index)});

			// 过滤掉博客设置、内容管理、回收站，不允许他们拖拽
			idArr = idArr.filter(function(item){
				if(item == 1||item == 2||item== 7){
					return false;
				}
				return true;
			});

			// 被框选元素的个数
			var n = idArr.length;
			
			block.style.cssText = "z-index: 9;position: absolute;padding: 4px 8px;background:black;color:white;display:inline-block";
			block.innerHTML = "选中" + n + "项文件";
			block.style.left = startPoint.x - rect.left + 2 + "px";
			block.style.top = startPoint.y - rect.top + 2 + "px";
			if(fns){
				fns.start&&fns.start();
			}
			var onOff = false;
			document.onmousemove = function(e){
				var nowPoint = {
					x: e.clientX - rect.left + 2,
					y: e.clientY - rect.top + 2 
				}
				var dis = {
					x: nowPoint.x - startPoint.x,
					y: nowPoint.y - startPoint.y
				}
				if(Math.abs(dis.x) > 10||Math.abs(dis.y) >10){
					el2.parentNode.appendChild(block);
					block.style.top = nowPoint.y + "px";
					block.style.left = nowPoint.x + "px";
					onOff = true;
				}
				if(fns){
					fns.move&&fns.move();
				}
			}
			document.onmouseup = function(e){
				console.log(e.target);
				if(onOff){
					el2.parentNode.removeChild(block);
				
					// 判断是否可以被剪切(目标为桌面、资源管理器、files)
					if(	e.target == deskTopWrap || 
						e.target.tagName == "UL" || 
						e.target.tagName == "LI" || 
						e.target.parentNode.tagName == "LI"
					){
						if(e.target.tagName == "UL"){
							console.log(idArr,e.target.dataset.id)
							// 目标不能在数组中，即不能将文件拖拽到自己及子级中
							if(idArr.indexOf(Number(e.target.dataset.id)) == -1){
							
								// 判断是否为回收站面板
								if(e.target.dataset.id == "7"){
									removeData(idArr)
								}else{
									CutIdArr = Array.prototype.slice.call(idArr);
									paste(e.target.dataset.id);
									CutIdArr = [];
								}
								allPanelRefresh();
							}else{
								alert("不能将文件拖拽到自己及子级文件夹中！");
							}
						}else{
							var el = e.target.tagName == "LI"?e.target:e.target.parentNode;
							if(idArr.indexOf(Number(el.dataset.index)) == -1){
								if(el.dataset.index == "7"){
									removeData(idArr)
								}else{
									CutIdArr = Array.prototype.slice.call(idArr);
									paste(el.dataset.index)
									CutIdArr = [];
								}
								allPanelRefresh();
							}else{
								alert("不能将文件拖拽到自己及子级文件夹中！");
							}
						}
					}
				}
				document.onmousemove = null;
				document.onmouseup = null;
				
				if(fns){
					fns.end&&fns.end();
				}
			}
		}else{
			if(el2.tagName !== "LI"){
				var oldZindex = el2.style.zIndex;
				if(!oldZindex){
					el2.style.zIndex = reZIndex++;
				}
				var startEl = {
					x: el2.offsetLeft,
					y: el2.offsetTop
				};
				if(fns){
					fns.start&&fns.start();
				}
				document.onmousemove = function(e){
					var nowPoint = {
						x: e.clientX,
						y: e.clientY
					}
					var dis = {
						x: nowPoint.x - startPoint.x,
						y: nowPoint.y - startPoint.y
					}
					if(Math.abs(dis.x) > 10||Math.abs(dis.y) >10){
						el2.style.top = startEl.y + dis.y + "px";
						el2.style.left = startEl.x + dis.x + "px";
					}
					if(fns){
						fns.move&&fns.move();
					}
				}
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;
					if(!oldZindex){
						el2.style.zIndex = oldZindex;
					}
					if(fns){
						fns.end&&fns.end();
					}
				}
			}
		}
		e.preventDefault();
		e.stopPropagation();
	}
}


// 创建dock栏中的打开项目 

function dockShow (type,id) {
	var imgSrc = {"TrashBin":"img/Trash_Bin_Full_48px.png","firefox":"img/firefox2.png","folder":"img/folder48.png","setting":"img/Steam.png"};
	var div = document.createElement("div");
	div.className = "task open " + type;
	div.dataset.windowId = id;
	var img = new Image();
	img.src = imgSrc[type];
	div.appendChild(img);
	iconDock.appendChild(div);
	var dockIcons = document.querySelectorAll(".dock .icon-dock .task");
	for (var i = 0; i < dockIcons.length; i++) {
		dockIcons[i].className = dockIcons[i].className.split("now").join("");
	}
	dockIcons[dockIcons.length-1].className += " now";
	div.addEventListener("click",function(){
		var resPanel = document.querySelectorAll(".resourcePanel");
		resPanel = Array.prototype.slice.call(resPanel);

		dockIcons = document.querySelectorAll(".dock .icon-dock .task");
		dockIcons = Array.prototype.slice.call(dockIcons);

		var nowresource = resPanel.find(function(item){
			return item.dataset.windowId == id;
		})
		resPanel = resPanel.filter(function(el){
			return el.style.display == "block";
		})
		resPanel = resPanel.sort(function(a,b){
			return a.style.zIndex - b.style.zIndex;
		})
		if(nowresource.style.display == "block"){
			if(nowresource == resPanel[resPanel.length-1]){
				nowresource.style.display = "none";
				resPanel = resPanel.filter(function(el){
					return el.style.display == "block";
				})
				if(resPanel.length){
					var maxIcon = dockIcons.find(function(n){
						return n.dataset.windowId == resPanel[resPanel.length-1].dataset.windowId;
					});
					
					maxIcon.className += "now"; 
				}
				this.className = this.className.split("now").join("");
					
			}else{
				nowresource.style.zIndex = reZIndex++;
				for (var i = 0; i < dockIcons.length; i++) {
					dockIcons[i].className = dockIcons[i].className.split("now").join("");
				}
				this.className += " now";
			}

		}else{		
			nowresource.style.display = "block";
			nowresource.style.zIndex = reZIndex++;
			for (var i = 0; i < dockIcons.length; i++) {
				dockIcons[i].className = dockIcons[i].className.split("now").join("");
			}
			this.className += " now";
		}
			
		
		
		
	})
}



// 所有窗口刷新数据

function allPanelRefresh(){
	var resPanelUl = document.querySelectorAll(".resourcePanel .cont ul");
	resPanelUl.forEach(function(item){
		if (item.dataset.id == 7) {
			render(delList.filter(function(item){return item.delid==7}),item);
		}else{
			render(getChildren(Number(item.dataset.id)),item);
		}
	})
	render(getChildren(deskTopWrap.dataset.id) ,deskTopWrap);
}


// 矩形碰撞检测
// el1: 元素1 el2: 元素2
function rectBoom(el1,el2) {
	var rect = el1.getBoundingClientRect();
	var rect2 = el2.getBoundingClientRect();
	if(rect.bottom < rect2.top
	|| rect.top > rect2.bottom
	|| rect.right < rect2.left
	|| rect.left > rect2.right){
		return false;
	}
	return true;
}


function calculator () {
	var calculatorPanel = document.querySelector(".calculatorPanel");
	var screen = calculatorPanel.querySelector(".screen span");
	var btns = calculatorPanel.querySelector(".btns");
	btns.addEventListener("click",function(e){
		// if(e.target.className == "zero"){

		// }
		var t = "";
		switch(e.target.className){
			case "zero":
				t = 0;
				break;
			case "one":
				t = 1;
				break;
			case "two":
				t = 2;
				break;
			case "three":
				t = 3;
				break;
			case "four":
				t = 4;
				break;
			case "five":
				t = 5;
				break;
			case "six":
				t = 6;
				break;
			case "seven":
				t = 7;
				break;
			case "eight":
				t = 8;
				break;
			case "nine":
				t = 9;
				break;
			case "add":
				t = "+";
				break;
			case "jian":
				t = "-";
				break;
			case "cheng":
				t = "*";
				break;
			case "chu":
				t = "/";
				break;
			case "mo":
				t = "%";
				break;
			case "deng":
				t = "=";
				break;
			case "clear":
				t = "clear";
				break;
			case "backspace":
				t = "backspace";
				break;
			default:
				t = ".";
		}
		screen.innerHTML += t;
		e.stopPropagation();
	})
}