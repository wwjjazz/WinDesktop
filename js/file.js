// 新建

function neew(newData){
	console.log(newData.type,newData.name);
	var arr = {"folder":"文件夹","pdf":"PDF文件"}
	console.log(arr[newData.type])
	if(newData.name !== ''){
		console.log(1)
		if(isSameName(newData)){
			// alert("该名字已存在，请重新输入");
			return false;
		}
	}else{
		console.log(2)
		newData.name = "新建" + arr[newData.type];
		var n = 0;
		console.log(newData);
		while(true){
			if(isSameName(newData)){
				n++;
				newData.name = "新建" + arr[newData.type]+"("+ n +")";
			}else{
				break;
			}
		}
	}
	newData.id = ++MAXID;
    dataList.push(newData);
    return true;
}


// 重命名 
// el: 事件源元素

function renamee(el) {
	var input = document.createElement("input");
	input.style.cssText = "position:absolute;bottom:0px;top:auto;height:33px;width:100%;box-sizing:border-box;left:0;"
	var old = input.value = el.children[0].innerHTML;
	el.appendChild(input);
	input.select();
	input.onblur = function(){
		if(input.value == ""){
			alert("不能为空");
			return;
		}
		if(input.value == old){
			el.removeChild(input);
			return;
		}
		var data = getSelf(el.dataset.index);
		console.log(data);
		console.log(data);
		if(isSameName({pid:data.pid,type:data.type,name:input.value})){
			alert("重名了")
			return;
		}else{
			data.name = input.value;
		}
		el.removeChild(input);
		render(getChildren(data.pid),el.parentNode);
		iconSort();
	}
}


// 删除文件/文件夹 
// ids: 数组,要删除数据的id

function removeData(ids) {

    var allids = [];

    ids.forEach(function (id) {
        allids.push(id);
        allids = allids.concat( getAllChildren(id).map( function (item) {
            return item.id;
        } ) );
    });
    var delArr = dataList.filter(function(item){
    	return allids.indexOf(item.id) !== -1; 
    })
    delArr.forEach(function(item){
    	console.log(ids,item.id)
    	if(ids.indexOf(item.id) == -1){
    		delList.push({
	    		id: item.id,
	    		pid: item.pid,
	    		delid: "c",
	    		name: item.name,
	    		type: item.type + "-delFile",
	    		oldType: item.type
		    })
    	}else{
    		delList.push({
	    		id: item.id,
	    		pid: item.pid,
	    		delid: 7,
	    		name: item.name,
	    		type: item.type + "-delFile",
	    		oldType: item.type
		    })
    	}
    	
    })
	    
    dataList = dataList.filter(function (item) {
        return allids.indexOf(item.id) == -1;
    });
    allPanelRefresh();
}

// 剪切
function cutt(ids) {
	console.log(ids);
	CopyIdArr = [];
	CutIdArr = [];
	ids.forEach(function (id) {
        CutIdArr.push(id);
    });
    console.log(CutIdArr);
}



// 复制
function copy(ids) {
	CopyIdArr = [];
	CutIdArr = [];
	ids.forEach(function (id) {
        CopyIdArr.push(id);
    });
    console.log(CopyIdArr);
}


// 粘贴
// pid 为触发粘贴所在右键菜单的面板的dataset.id值
function paste(pid){
	if(CopyIdArr.length == 0 && CutIdArr.length !== 0){
		// 获取所有剪切数组中id对应的数据（一层数据）
		var pasteArr = dataList.filter(function (item) {
	        return CutIdArr.indexOf(item.id) !== -1;
	    });

	    // 存放所有数据的id值
	    var allArr = [];
	    CutIdArr.forEach(function (id) {
	        allArr.push(id);
	        allArr = allArr.concat( getAllChildren(id).map( function (item) {
	            return item.id;
	        } ) );
	    });
		console.log(pasteArr,CutIdArr,pid);

		// 不能将文件剪切到它自己及子文件夹中
		if(allArr.indexOf(pid)!== -1){
			alert("不能将文件夹移动到其子文件夹中！")
			return;
		} 

		// 将文件剪切到面板中
		pasteArr.forEach(function(item){
			if(isSameName({name:item.name,type:item.type,pid:pid})){
				alert("该文件夹已有重名文件！");
			}else{
				item.pid = pid;
			}
		})
		CutIdArr = [];
	}else if(CopyIdArr.length !== 0 && CutIdArr.length == 0){
		// 获取所有复制数组中id对应的数据（一层数据）
		var pasteArr = dataList.filter(function (item) {
	        return CopyIdArr.indexOf(item.id) !== -1;
	    });

	    // 存放所有（一层及子级）数据的id值
	    var allArr = [];
	    CopyIdArr.forEach(function (id) {
	        allArr.push(id);
	        allArr = allArr.concat( getAllChildren(id).map( function (item) {
	            return item.id;
	        } ) );
	    });
		getLink(allArr);
		function getLink(ids){
			var newKey = [];
			var t = 0;
			var ob = {};
			var k = 0;
			ids.forEach(function(n){
				var item = getSelf(n);
				if(pasteArr.indexOf(item) !== -1){
					t++;
					ob["pid" + t] = pid;
					if(isSameName({name:item.name,type:item.type,pid:pid})){
						neew({
							name:item.name+" - 副本",
							pid:ob["pid" + t],
							type:item.type
						})
					}else{
						neew({
							name:item.name,
							pid:ob["pid" + t],
							type:item.type
						})
					}
				}else{
					neew({
						name:item.name,
						pid:ob["pid" + t],
						type:item.type
					})
				}
				
				// ids = ids.filter(function(m){
				// 	return m !== n;
				// });
				k = dataList[dataList.length-1].id;
				ob["arr"+ t] = ids.filter(function(m){
					return getSelf(m).pid == n;
				})
				if(ob["arr"+ t].length !== 0 ){
					t++;
					ob["pid" + t] = k;
					ob["arr" + (t-1)].forEach(function(n){
						var item = getSelf(n);
						neew({
							name: item.name,
							type: item.type,
							pid: ob["pid" + t]
						})
					})
					k = dataList[dataList.length-1].id;
				}
				
			})
		}
	}

}

// 文件框选
// el: 触发该事件的容器面板
function fileSelect(el) {
	var startPoint = {};
	el.addEventListener("mousedown",function(e){
		var div = document.createElement("div");
		var lis = el.querySelectorAll("li");
		var rect = el.getBoundingClientRect();
		var onOff = false;
		console.log(lis);
		startPoint = {
			x: e.clientX,
			y: e.clientY
		}
		div.style.cssText = "border:1px solid gray;background:rgba(5,155,135,.2);position:absolute;";
		el.addEventListener("mousemove",fileSelectMove);
		document.addEventListener("mouseup",fileSelectUp);
		function fileSelectMove(e){
			var dis = {
				x: e.clientX - startPoint.x,
				y: e.clientY - startPoint.y
			}
			if(Math.abs(dis.x)>10||Math.abs(dis.y)>10){
				el.appendChild(div);
				div.style.width = Math.abs(dis.x) + "px";
				div.style.height = Math.abs(dis.y) + "px";
				if(dis.x>0){
					div.style.left = startPoint.x - rect.left + "px";
				}else{
					div.style.left = e.clientX - rect.left + "px";
				}
				if(dis.y>0){
					div.style.top = startPoint.y - rect.top + "px";
				}else{
					div.style.top = e.clientY - rect.top + "px";
				}
				onOff = true;
			}
			
			lis.forEach(function(item){
				if(rectBoom(item,div)){
					if(rectBoom(item,div)){
						if(item.className.indexOf("selected") == -1){
							item.className += " selected";
						}
					}
				}else{
					item.className = item.className.split(" selected").join("");
				}
			})
		}
		function fileSelectUp(e){
			el.removeEventListener("mousemove",fileSelectMove);
			document.removeEventListener("mouseup",fileSelectUp);
			if(onOff){
				el.removeChild(div);
			}
		}
	})
	
	
}


// 删除文件还原
// id: 要还原元素的id
function fileRestore(id) {
	// 父级的id
	var pidd = Number(dataGetSelf(delList,id).pid);

	// 在回收站中找到pidd的所有层子级
	var all = dataGetAllChildren(delList,pidd);

	// 所有子级中过滤掉回收站中一级子级
	all = all.filter(function(item){
		return !(item.delid == 7 && item.id != id) ;
	})

	// 转换成只包含id的数组
	var allId = all.map(function(item){
		return item.id;
	})

	var key = true;
	var pa = null;
	var value = pidd;

	// 如果父级在数据中找不到(在回收站中)，需要自动添加上父级
	if(!(dataList.find(function(item){return item.id==pidd}))&&pidd !== 0){
		while(key){
			pa = dataGetSelf(delList,value);
			dataList.push({
				id: pa.id,
				type: pa.oldType,
				pid: pa.pid,
				name: pa.name
			})
			if(dataList.find(function(item){return item.id==pa.pid})){
				key = false;
			}
			value = pa.pid;
		}		
	}
	all.forEach(function(item){
		if(!(dataList.find(function(itemee){return itemee.id==item.id}))){
			dataList.push({
				id: item.id,
				type: item.oldType,
				pid: item.pid,
				name: item.name
			})
		}
		
	})
	delList = delList.filter(function(item){
		return allId.indexOf(item.id) == -1;
	})
	allPanelRefresh();
}