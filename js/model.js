function getChildren(id){
	var arr = dataList.filter(function(item){
		return item.pid == id;
	})
	return arr;
}

function getAllChildren(pid) {
    var allChildren = [];

    allChildren = getChildren(pid);

    allChildren.forEach(function (item) {
        var children = getAllChildren(item.id);
        allChildren = allChildren.concat(children);
    });

    return allChildren;
}

function getSelf(id){
	return dataList.find(function(item){
		return item.id == id;
	})
}

function getParent(id){
	var selfId = getSelf(id)?getSelf(id).pid:0;
	return getSelf(selfId);
}

function getParents(id){
	var parentArr = [];
	var parent = getParent(id);
	if(parent){
		console.log(parent);
		parentArr.push(parent);
		parentArr = getParents(parent.id).concat(parentArr);
	}
	return parentArr;
}


// 获取一组元素中的最后一个元素

function getLast(arr){
	return arr[arr.length-1];
}



// 所有组数据查询皆可用

function dataGetChildren(data,id){
	data = Array.prototype.slice.call(data);
	var arr = data.filter(function(item){
		return item.pid == id;
	})
	return arr;
}

function dataGetAllChildren(data,pid) {
	data = Array.prototype.slice.call(data);
    var allChildren = [];

    allChildren = dataGetChildren(data,pid);

    allChildren.forEach(function (item) {
        var children = dataGetAllChildren(data,item.id);
        allChildren = allChildren.concat(children);
    });

    return allChildren;
}

function dataGetSelf(data,id){
	return data.find(function(item){
		return item.id == id;
	})
}

function dataGetParent(data,id){
	var selfId = dataGetSelf(id)?dataGetSelf(id).pid:0;
	return dataGetSelf(selfId);
}

function dataGetParents(data,id){
	var parentArr = [];
	var parent = dataGetParent(id);
	if(parent){
		console.log(parent);
		parentArr.push(parent);
		parentArr = dataGetParents(parent.id).concat(parentArr);
	}
	return parentArr;
}