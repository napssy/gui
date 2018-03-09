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