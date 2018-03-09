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