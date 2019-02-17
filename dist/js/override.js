//直接注入页面，最好不要用新语法
var replaceNode = function(args,index){
    if(args[index].replace){
        args[index] = args[index].replace(
            'api.steemit.com',
            (localStorage.STEEM_CURRENT_NODE || 'rpc.steemviz.com')
        )
    }
    return args;
}

var overrideConnect = function(f,index,p=false){
    return function(){
        if(p)
            return Promise.resolve(f.apply(window, replaceNode(arguments,index)));
        else
            return f.apply(this, replaceNode(arguments,index));
    }
}
 
fetch = overrideConnect(fetch,0,true);
XMLHttpRequest.prototype.open = overrideConnect(XMLHttpRequest.prototype.open,1);