var guiTab = function(params){
    this.parent = params.parent;
    this.title = params.title;
    this.id = params.id;
    //console.log(this.title);
    this.showTitleText = params.showTitleText;
    this.titleElement = params.titleElement;
    this.icon = params.icon;
    this.parent.tabs.push(this);
    this.tabs = [];
    this.el = document.createElement('DIV');
    this.el.className = 'tab-content';
    this.el.id = 'tab-' + this.title;
    this.titleEl = document.createElement(this.titleElement);
    this.titleEl.className = 'tab-title ';
    this.titleEl.id = this.el.id + '--toggle';
    var _this = this;
    if(this.showTitleText){this.titleEl.innerHTML = this.title;}
    if(this.icon){
        this.iconEl = document.createElement('I');
        this.iconEl.className = 'fas ' + this.icon;
        this.titleEl.appendChild(this.iconEl);
    }/*
    if(params.fromLayout){
        this.parent.el = document.getElementById(this.parent);
        console.log(this.parent.el);
    }*/
    //console.log(this.parent.el);
    this.parent.el.appendChild(this.el);
    var el = this.el;
    if(this.parent.el.getElementsByClassName('tab-content')[0]){
        el = this.parent.el.getElementsByClassName('tab-content')[0];
    }
    //else{el = this.el}
    var w = window.getComputedStyle(this.parent.el, null).getPropertyValue("width");
    var wNum = w.substring(0, w.length-2);
    //console.log(wNum);
    //this.el.style.width = w;
    //this.titleEl.style.width = (wNum / this.parent.tabs.length) + 'px';
    this.parent.el.insertBefore(this.titleEl,el);
    this.titleEl.addEventListener('click',function(){_this.show(_this)},false);
    if(this.parent.el.getElementsByClassName('tab-title')){
        var titles = this.parent.el.getElementsByClassName('tab-title');
        /*if(this.parent.el.className === 'tab-content'){
            titles = this.parent.el.getElementsByClassName('tab-title');
        }
        else{titles = this.parent.el.getElementsByClassName('tab-title');}*/
        //console.log(this.parent.el,titles,this.parent.tabs.length);
        //console.log(titles,this.parent.id,this.parent.tabs);
        for(var i = 0;i < titles.length;i++){
            //if(titles[i].style.cssText){return;};
            if(i===0){titles[i].classList.add('tab-title--active');}
            //if(titles[i].className === 'tab-content'){
                titles[i].style.width = (wNum / this.parent.tabs.length) + 'px';
            //}
            //else{titles[i].style.width = (wNum / this.tabs.length) + 'px';}
            //title.addEventListener('click',function(){_this.show(_this)},false);
        }
    }
    if(this.parent.el.getElementsByClassName('tab-content')){
        var contents = this.parent.el.getElementsByClassName('tab-content');
        for(var i = 0;i < contents.length;i++){
            if(i===0){contents[i].classList.add('tab-content--visible');}
        }
    }
    
}
guiTab.prototype.show = function(o){
    //console.log(o,o.parent.el);
    var titles = o.parent.el.getElementsByClassName('tab-title');
    for(var title of titles){
        title.classList.remove('tab-title--active')
    }
    o.titleEl.classList.add('tab-title--active');
    var contents = o.parent.el.getElementsByClassName('tab-content');
    for(var content of contents){
        content.classList.remove('tab-content--visible');
    }
    o.el.classList.add('tab-content--visible');
}
guiTab.prototype.getFocus = function(){
    this.show(this);
}