var dataList = [
	{
		id: 1,
		pid: 0,
		type: "setting",
		name: "博客设置"
	},
	{
		id: 2,
		pid: 0,
		type: "firefox",
		name: "内容管理"
	},
	{
		id: 3,
		pid: 2,
		type: "folder",
		name: "前端"
	},
	{
		id: 4,
		pid: 2,
		type: "folder",
		name: "后端"
	},
	{
		id: 5,
		pid: 3,
		type: "folder",
		name: "javascript"
	},
	{
		id: 6,
		pid: 5,
		type: "pdf",
		name: "javascript权威指南"
	},
    {
        id: 7,
        pid: 0,
        type: "TrashBin",
        name: "回收站"
    }
];

var menuList = {
	common:[],
	globel:[
		{
			name: "新建",
			children: [
				{
					name: "新建文件夹",
					exe: function(e,pe){
						neew({
							pid:pe.dataset.id,
							name:"",
							type: "folder"
						})
						console.log(pe,pe.dataset.id)
						render( getChildren(pe.dataset.id), pe );
						iconSort();
					}
				},
				{
					name: "新建PDF文件",
					exe: function(e,pe){
						neew({
							pid:pe.dataset.id,
							name:"",
							type: "pdf"
						})
						render( getChildren(pe.dataset.id), pe );
						iconSort();
					}
				}
			]
		},
		{
			name: "粘贴",
			exe: function(e,pe){
				console.log(pe.dataset.id)
				paste(Number(pe.dataset.id));
				render(getChildren(pe.dataset.id),pe)
				iconSort();
			}
		},
		{
			type: "line"
		},
		{
            name: '刷新'
        },
        {
            name: '排序'
        },
        {
            name: '设置'
        }
	],
	folder: [
        {
            name: '打开',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	if(pe.parentNode == deskTopWrap){
            		toResPl(getSelf(pe.dataset.index));
            	}else{
					var select = getLast(document.querySelectorAll(".resourcePanel select"));
            		openFolder(getSelf(pe.dataset.index),select);
            	}			
				
			}
        },
        {
            name: '复制',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	copy([Number(pe.dataset.index)]);
            }
        },
        {
            name: '剪切',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	console.log(typeof Number(pe.dataset.index));
            	cutt([Number(pe.dataset.index)]);
            }
        },
        {
            name: '重命名',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	renamee(pe);
            }
        },
        {
            name: '删除',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	var arr = [];
            	var pid = getSelf(pe.dataset.index).pid;
            	arr.push(Number(pe.dataset.index));
            	console.log(pe,arr);
            	removeData(arr);
            	// render(getChildren(pid),pe.parentNode)
            }
        },
        {
            name: '属性'
        }
    ],
    pdf: [
        {
            name: '打开',
            exe: function(e,pe){
            	var deskTopWrap = document.querySelector(".desktop .wrap");
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	if(pe.parentNode == deskTopWrap){
            		toResPl(getSelf(pe.dataset.index));
            		var reRightUl = getLast(document.querySelectorAll(".cont .right ul"));
            		console.log(1,reRightUl);
            		render(getChildren(pe.dataset.index),reRightUl);
            		iconSort();
            	}else{
            		// render( getChildren(pe.dataset.index), pe.parentNode );
					var select = getLast(document.querySelectorAll(".resourcePanel select"));
            		openFolder(getSelf(pe.dataset.index),select);
            	}			
				
			}
        },
        {
            name: '复制',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	copy([Number(pe.dataset.index)]);
            }
        },
        {
            name: '剪切',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	console.log(typeof Number(pe.dataset.index));
            	cutt([Number(pe.dataset.index)]);
            }
        },
        {
            name: '重命名',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	renamee(pe);
            }
        },
        {
            name: '删除',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	var arr = [];
            	var pid = getSelf(pe.dataset.index).pid;
            	arr.push(Number(pe.dataset.index));
            	console.log(pe,arr);
            	removeData(arr);
            	// render(getChildren(pid),pe.parentNode)
            }
        },
        {
            name: '属性'
        }
    ],
    firefox: [
        {
            name: '打开',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
        		toResPl(getSelf(pe.dataset.index));				
			}
        },
        {
            name: '复制'
        },
        {
            name: '剪切'
        },
        {
            name: '重命名',
            disabled: true,
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	renamee(pe);
            }
        },
        {
            name: '删除',
            disabled: true,
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	var arr = [];
            	var pid = getSelf(pe.dataset.index).pid;
            	arr.push(Number(pe.dataset.index));
            	console.log(pe,arr);
            	removeData(arr);
            	// render(getChildren(pid),pe.parentNode)
            }
        },
        {
            name: '属性'
        }
    ],
    TrashBin: [
        {
            name: '打开',
            exe: function(e,pe){
                var pe = pe.tagName == "LI"?pe:pe.parentNode;
                toResPl(getSelf(pe.dataset.index));              
            }
        },
        {
            name: '复制'
        },
        {
            name: '剪切'
        },
        {
            name: '重命名',
            disabled: true,
            exe: function(e,pe){
                var pe = pe.tagName == "LI"?pe:pe.parentNode;
                renamee(pe);
            }
        },
        {
            name: '删除',
            disabled: true,
            exe: function(e,pe){
                var pe = pe.tagName == "LI"?pe:pe.parentNode;
                var arr = [];
                var pid = getSelf(pe.dataset.index).pid;
                arr.push(Number(pe.dataset.index));
                console.log(pe,arr);
                removeData(arr);
                // render(getChildren(pid),pe.parentNode)
            }
        },
        {
            name: '属性'
        }
    ],
    setting: [
        {
            name: '打开',
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
        		toResPl(getSelf(pe.dataset.index));	
			}
        },
        {
            name: '复制'
        },
        {
            name: '剪切'
        },
        {
            name: '重命名',
            disabled: true,
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	renamee(pe);
            }
        },
        {
            name: '删除',
            disabled: true,
            exe: function(e,pe){
            	var pe = pe.tagName == "LI"?pe:pe.parentNode;
            	var arr = [];
            	var pid = getSelf(pe.dataset.index).pid;
            	arr.push(Number(pe.dataset.index));
            	console.log(pe,arr);
            	removeData(arr);
            	// render(getChildren(pid),pe.parentNode)
            }
        },
        {
            name: '属性'
        }
    ],
    resource: [
        {
            name: '最小化'
        },
        {
            name: '最大化'
        },
        {
            name: '关闭',
            exe: function(e1, e2) {
                console.log(this);

                e2.target.parentNode.style.display = 'none';

            }
        }
    ],
    TrashBinP: [
        {
            name: '删除',
            exe: function(e,pe){
                var pe = pe.tagName == "LI"?pe:pe.parentNode;
                var arr = [];
                var pid = getSelf(pe.dataset.index).pid;
                arr.push(Number(pe.dataset.index));
                console.log(pe,arr);
                removeData(arr);
                // render(getChildren(pid),pe.parentNode)
            }
        },
        {
            name: '属性'
        }
    ],
    delFile: [
        {
            name: '还原',
            exe: function(e,pe){
                var pe = pe.tagName == "LI"?pe:pe.parentNode;
                fileRestore(Number(pe.dataset.index));
            }
        },
        {
            name: '删除',
            exe: function(e,pe){
                var pe = pe.tagName == "LI"?pe:pe.parentNode;
                var arr = [];
                var pid = getSelf(pe.dataset.index).pid;
                arr.push(Number(pe.dataset.index));
                console.log(pe,arr);
                removeData(arr);
                // render(getChildren(pid),pe.parentNode)
            }
        },
        {
            name: '属性'
        }
    ]

};

var delList=[];
var user = {
    password:"admin"
}