function Paginator(props){
	this.params = props.param;
	this.parentElem = props.parentElem;
	this.getData = props.getData;
	this.render = props.render;

	this.loadElem = null;
	this.isLoad = false;
	this.promise = null;
}

var proto = Paginator.prototype;

proto.init = function(){
	this.promise = this.getData(this.params);
	this.promise.then(function(data){
		if(data.length > 0){
			this.render(data);
			$(window).scroll(this.handleScroll.bind(this));
		}else if(data.length == 0){
			this.parentElem.append('<div class="loadDIV">没有相关数据</div>');
		}
	}.bind(this));
}
proto.handleScroll = function(){
	console.log('==触发滚动事件==');
	var scrollTop = $(window).scrollTop();
　　	var scrollHeight = $(document).height();
　　	var windowHeight = $(window).height();
	

	if(scrollTop + windowHeight >= (scrollHeight - 100)){
		//滚动条滚动到距底部100时，添加load.gif
		if(!this.loadElem){
			var loadImg = $('<img src="../imgs/load.gif"/>');
			this.loadElem = $('<div class="loadDIV"></div>');
			this.loadElem.append(loadImg);
			this.parentElem.append(this.loadElem);
		}
		
	}
	//滚动条滚动到底部
　　if(scrollTop + windowHeight == scrollHeight){
		console.log('==========到底部了========');
		this.loadElem.remove();
		this.loadElem = null;

		this.params.pageno++;
		this.promise = this.getData(this.params);
		this.promise.then(function(data){
			if(data.length > 0){
				this.render(data);
			}else if(data.length == 0){
				this.loadElem.remove();
				this.loadElem = null;
				this.parentElem.append('<div class="loadDIV">数据加载完成</div>');
				$(window).unbind('scroll');
			}
		}.bind(this));
　　}
}
