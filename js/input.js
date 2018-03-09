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