//(function (){
var GUIchilds = [];
var GUI = function(params){
    //console.log(this);
    this.theme = params.theme;
    var _this = this;
    return this;
}
function getObjectById(id){
    for(var i = 0;i < GUIchilds.length;i++){
        if(id === GUIchilds[i].id){
            return GUIchilds[i];
        }
    }
}
var guiPanel = function(params){
    this.position = params.position;
    this.title = params.title;
    this.titleElement = params.titleElement;
    this.tabs = [];
    this.el = document.createElement("DIV");
    this.el.className = 'panel';
    this.id = params.id;
    this.el.id = params.id;
    this.parent = params.parent || document.getElementsByTagName('body')[0];
    this.parent.appendChild(this.el);
    this.titleEl = document.createElement(this.titleElement);
    this.titleEl.className = 'panel-title';
    this.el.appendChild(this.titleEl);
    this.titleEl.innerHTML = this.title;
    GUIchilds.push(this);
    return this;
}
guiPanel.prototype.updateValue = function(){
    //console.log('yeah');
}
var guiInput = function(params){
    this.parent = params.parent;
    this.type = params.type;
    this.step = params.step;
    this.min = params.min;
    this.max = params.max;
    this.value = params.value;
    this.el = document.createElement("DIV");
    this.el.className = 'input-wrapper';
    if(params.label){
        this.label = params.label;
        this.labelEl = document.createElement('label');
        this.el.appendChild(this.labelEl);
        this.labelEl.innerHTML = this.label;
    }
    var w = window.getComputedStyle(this.parent.el, null).getPropertyValue("width");
    var wNum = w.substring(0, w.length-2);
    //console.log(w);
    this.parent.el.appendChild(this.el);
    var _this = this;
    switch(this.type){
        case 'color':
            this.textEl = document.createElement('input');
            this.textEl.className = 'color-text';
            this.el.appendChild(this.textEl);
            this.textEl.style.width = wNum - (wNum / 4) + 'px';
            this.textEl.setAttribute('type','text');
            this.textEl.value = this.value;
            break
        case 'number':
            this.numberEl = document.createElement('input');
            this.numberEl.className = 'number';
            this.el.appendChild(this.numberEl);
            //console.log(wNum,this.parent.el);
            this.numberEl.style.width = wNum - 20 + 'px';
            this.numberEl.setAttribute('type','text');
            this.numberEl.value = this.value;
            break;
        case 'button':
            this.buttonEl = document.createElement('DIV');
            this.buttonEl.className = 'button';
            this.textEl = document.createElement('SPAN');
            this.buttonEl.appendChild(this.textEl);
            this.el.appendChild(this.buttonEl);
            this.buttonEl.style.width = wNum - 20 + 'px';
            this.textEl.innerHTML = this.value;
            break;
        default:
            this.inputOut = document.createElement('DIV');
            this.inputOut.className = 'range-outer';
            this.el.appendChild(this.inputOut);
            this.inputOut.style.width = wNum - (wNum / 4) + 'px';

            this.numberEl = document.createElement('input');
            this.numberEl.className = 'range-number';
            this.el.appendChild(this.numberEl);
            this.numberEl.style.width = (wNum / 4) - 20 + 'px';
            this.numberEl.setAttribute('type','text');
            this.numberEl.value = this.value;
            this.numberEl.addEventListener('keypress',function(event){NumberPressChange(event,this,_this);},false);
            this.numberEl.addEventListener('keyup',function(event){NumberUpChange(event,this,_this);},false);
            this.inputIn = document.createElement('DIV');
            this.inputIn.className = 'range-inner';
            this.inputOut.appendChild(this.inputIn);
            var outer_width = window.getComputedStyle(this.inputOut, null).getPropertyValue("width");
            var outer_widthNum = outer_width.substring(0, outer_width.length-2);
            this.inputIn.style.width = (this.value * outer_widthNum) / this.max + 'px';
            this.inputOut.addEventListener('mousedown',function(){rangeMouseDown(this,_this);},false);
    }
    return this;
}
guiInput.prototype.updateValue = function(){
    switch(this.type){
        case 'color':
            break;
        case 'number':
            this.value = this.numberEl.value;
            break;
        default:// range
            this.value = this.numberEl.value;
            //console.log(this.value);
    }
}
guiInput.prototype.bind = function(fn,v){
    this.bindedTo = fn;
}
guiInput.prototype.updateParam = function(){
    this.bindedTo(this.value);
}
var guiInputSet = function(params){
    this.inputs = [];
    this.inputsVal = [];
    this.args = [];
}
guiInputSet.prototype.add = function(input,argNum){
    this.inputsVal.push(input.value);
    this.inputs.push(input);
    this.args.push(argNum);
    //input.parentArgNum = argNum;
}
guiInputSet.prototype.updateInputsValues = function(){
    this.inputsVal = [];
    for(var i = 0;i < this.inputs.length;i++){
        var input = this.inputs[i];
        input.updateValue();
        this.inputsVal.push(input.value);
    }
}
guiInputSet.prototype.bind = function(fn){
    var _this = this;
    for(var i of this.inputs){i.parentSet = _this;}
    this.bindedTo = fn;
}
guiInputSet.prototype.updateParam = function(){
    //console.log(this.inputsVal,this.bindedTo);
    this.bindedTo(this.inputsVal);
}
function _args(func) {  
    return (func + '')
      .replace(/[/][/].*$/mg,'') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
      .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
      .replace(/=[^,]+/g, '') // strip any ES6 defaults  
      .split(',').filter(Boolean); // split & filter [""]
}
function NumberPressChange(event,el,o){
    var x = event.which || event.keyCode;
    var elNum = Number(el.value);
    var inp = String.fromCharCode(x);
    //console.log(x);
    var newVal = Number(el.value);
    if(x === 8 || x === 37 || x === 39 || x === 46){return;}
    if(x === 38){newVal = elNum + o.step;el.value = newVal.toString();}
    if(x === 40){newVal = elNum - o.step;el.value = newVal.toString();}
    if (/[a-zA-Z-_ ]/.test(inp)){
        // doesn't work when altkey pressed !!!!!!!!!!!
        event.preventDefault();
    }
    if (/[0-9.]/.test(inp)){
        var newValStr = el.value;
    }
        var outer_width = window.getComputedStyle(o.inputOut, null).getPropertyValue("width");
        var outer_widthNum = outer_width.substring(0, outer_width.length-2);
        o.inputIn.style.width = (Number(newValStr + inp) * outer_widthNum) / o.max + 'px';
}
function NumberUpChange(event,el,o){
    var x = event.which || event.keyCode;
    //console.log(x);
    //if(x === 8 || x === 37 || x === 39 || x === 46){return;}
    o.value = el.value;
    if(o.bindedTo || o.parentSet.bindedTo){
        if(!o.parentSet){
            o.updateValue();
            o.updateParam();
        }
        else{
            o.parentSet.updateInputsValues();
            o.parentSet.updateParam();
        }
    }
};
function rangeMouseDown(a,o) {
    //console.log(o);
    var min = o.min;
    var max = o.max;
    stateMouseDown = true;
    document.addEventListener ("mousemove" , rangeMouseMove , false);
    function rangeMouseMove (event) {
        var mouseX = event.pageX;
        var mouseY = event.pageY;
        var range_width = a.clientWidth;
        var range_left = a.offsetLeft;
        
        if(mouseX - range_left > range_width){
            o.inputIn.style.width = range_width + "px";
            o.numberEl.value = o.max;
        }
        else if(mouseX - range_left < 0){
            o.inputIn.style.width = "0px";
            o.numberEl.value = o.min;
        }
        else{
            o.inputIn.style.width = Math.round(mouseX - range_left) + "px";
            o.numberEl.value = Math.round(((mouseX - range_left) * o.max) / range_width);
        }
        o.updateValue();
        
        if(o.bindedTo || o.parentSet.bindedTo){
            if(!o.parentSet){
                o.updateParam();
                //console.log(o.bindedTo);
            }
            else{
                o.parentSet.updateInputsValues();
                o.parentSet.updateParam();
                //console.log(o.parentSet.bindedTo);
            }
        }
        //if(o.parentSet){console.log(o.parentSet.inputsVal)}
        document.addEventListener ("mouseup" , rangeMouseUp , false);
    }
    function rangeMouseUp() {
        document.removeEventListener ("mousemove" , rangeMouseMove , false);
        document.removeEventListener ("mouseup" , rangeMouseUp , false);
    }
}
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
var guiSeparator = function(params){
    this.parent = params.parent;
    this.type = params.type;
    this.height = params.height;
    switch(this.type){
        case 'space':
            this.el = document.createElement('HR');
            this.el.className = 'separator';
            this.el.style.borderTopWidth = this.height + 'px';
            break;
        default:
            this.el = document.createElement('HR');
            this.el.className = 'separator';
            this.el.style.borderTopWidth = this.height + 'px';
    }
    
    this.parent.el.appendChild(this.el);
}
var guiOutput = function(params){
    this.parent = params.parent;
    this.type = params.type;
    //this.step = params.step;
    this.min = params.min;
    this.max = params.max;
    this.value = params.value;
    this.el = document.createElement("DIV");
    this.el.className = 'output-wrapper';
    if(params.label){
        this.label = params.label;
        this.labelEl = document.createElement('label');
        this.el.appendChild(this.labelEl);
        this.labelEl.innerHTML = this.label;
    }
    var w = window.getComputedStyle(this.parent.el, null).getPropertyValue("width");
    var wNum = w.substring(0, w.length-2);
    this.parent.el.appendChild(this.el);
    var _this = this;
    switch(this.type){
        case 'text':
            this.textEl = document.createElement('input');
            this.textEl.className = 'output-text';
            this.el.appendChild(this.textEl);
            //console.log(wNum,this.parent.el);
            this.textEl.style.width = wNum - 20 + 'px';
            this.textEl.setAttribute('type','text');
            if(this.value){this.textEl.value = this.value;}
            this.textEl.addEventListener('keyup',function(){_this.updateParam();},false);
            break;
        case 'color':
            this.textEl = document.createElement('input');
            this.textEl.className = 'color-text';
            this.el.appendChild(this.textEl);
            this.textEl.style.width = wNum - (wNum / 4) + 'px';
            this.textEl.setAttribute('type','text');
            this.textEl.value = this.value;
            break
        case 'number':
            this.numberEl = document.createElement('input');
            this.numberEl.className = 'number';
            this.el.appendChild(this.numberEl);
            //console.log(wNum,this.parent.el);
            this.numberEl.style.width = wNum - 20 + 'px';
            this.numberEl.setAttribute('type','text');
            this.numberEl.value = this.value;
            break;
        case 'button':
            this.buttonEl = document.createElement('DIV');
            this.buttonEl.className = 'button';
            this.el.appendChild(this.buttonEl);
            this.buttonEl.style.width = wNum - 20 + 'px';
            this.buttonEl.innerHTML = this.value;
            break;
        /*default:
            this.inputOut = document.createElement('DIV');
            this.inputOut.className = 'range-outer';
            this.el.appendChild(this.inputOut);
            this.inputOut.style.width = wNum - (wNum / 4) + 'px';

            this.numberEl = document.createElement('input');
            this.numberEl.className = 'range-number';
            this.el.appendChild(this.numberEl);
            this.numberEl.style.width = (wNum / 4) - 20 + 'px';
            this.numberEl.setAttribute('type','text');
            this.numberEl.value = this.value;
            this.numberEl.addEventListener('keypress',function(event){NumberPressChange(event,this,_this);},false);
            this.numberEl.addEventListener('keyup',function(event){NumberUpChange(event,this,_this);},false);
            this.inputIn = document.createElement('DIV');
            this.inputIn.className = 'range-inner';
            this.inputOut.appendChild(this.inputIn);
            var outer_width = window.getComputedStyle(this.inputOut, null).getPropertyValue("width");
            var outer_widthNum = outer_width.substring(0, outer_width.length-2);
            this.inputIn.style.width = (this.value * outer_widthNum) / this.max + 'px';
            this.inputOut.addEventListener('mousedown',function(){rangeMouseDown(this,_this);},false);
        */
    }
    return this;
}
guiOutput.prototype.bind = function(fn,v){
    this.bindedTo = fn;
}
guiOutput.prototype.bindInput = function(fn,v){
    this.bindedInput = fn;
}
guiOutput.prototype.updateParam = function(){
    this.value = this.textEl.value;
    this.bindedInput(this.textEl.value);
}
guiOutput.prototype.getData = function(event){
    this.textEl.value = this.bindedTo(event);
}
var guiLayout = function(layout){
    var myJSON = JSON.stringify(layout);
    var obj = JSON.parse(myJSON);
    //console.log(layout,myJSON,obj);
    if(layout.tabs){
        var p;
        for(var i = 0;i < layout.tabs.length;i++){
            p = getObjectById(layout.tabs[i].params.parent)
            //console.log(i,p);
            new guiTab({
                parent: p,
                title: layout.tabs[i].params.title,
                titleElement: layout.tabs[i].params.titleElement,
                showTitleText: layout.tabs[i].params.showTitleText,
                icon: layout.tabs[i].params.icon,
                fromLayout: true
            });
        }
    }
    return this;
}
var guiText = function(params){}
//})();