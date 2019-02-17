
chrome.runtime.sendMessage('SYNC_NODE', function(response){
    localStorage.STEEM_CURRENT_NODE = response;
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message && message.STEEM_NEED_SYNC_NODE){
        localStorage.STEEM_CURRENT_NODE = message.STEEM_NEED_SYNC_NODE;
        console.log(localStorage.STEEM_CURRENT_NODE);
    }
})