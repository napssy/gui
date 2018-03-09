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