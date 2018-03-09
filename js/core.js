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