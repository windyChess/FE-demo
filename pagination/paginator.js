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
		}else if(data.length == 0 && this.params.pageno == '1'){
			this.parentElem.append('<div class="loadDIV">没有相关数据</div>');
		}else if(data.length == 0 && this.params.pageno != '1'){
			this.parentElem.append('<div class="loadDIV">数据加载完成</div>');
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
		console.log('====loading===='+this.loadElem);
		if(!this.loadElem){
			console.log('==添加loading==');
			var loadImg = $('<img src="../imgs/load.gif"/>');
			this.loadElem = $('<div class="loadDIV"></div>');
			this.loadElem.append(loadImg);
			this.parentElem.append(this.loadElem);
		}
		
	}
	//滚动条滚动到底部
　　if(scrollTop + windowHeight == scrollHeight){
		this.loadElem.remove();
		this.laodElem = null;

		this.params.pageno++;
		this.promise = this.getData(this.params);
		this.promise.then(function(data){
			console.log('==加载下一页数据=='+data);
			if(data.length > 0){
				this.render(data);
			}else if(data.length == 0){
				console.log('==数据加载完成==');
				this.loadElem.remove();
				this.loadElem = null;
				this.parentElem.append('<div class="loadDIV">数据加载完成</div>');
				$(window).unbind('scroll');
			}
		}.bind(this));
　　}
}
