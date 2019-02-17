let getCurrentNode = () => {
    return localStorage.STEEM_CURRENT_NODE || 'rpc.steemviz.com'
}
let getNodeHistoryString = () => {
    let oldNodes
    if (!localStorage.OLD_STEEM_CURRENT_NODE) {
        oldNodes = []
    } else {
        oldNodes = JSON.parse(localStorage.OLD_STEEM_CURRENT_NODE)
    }
    return [...oldNodes,getCurrentNode()].join(' ')
}

chrome.webRequest.onHeadersReceived.addListener(
    details=>({responseHeaders: details.responseHeaders.map(header=>{
            if(header.name.toLowerCase() == 'content-security-policy'){
                header.value = header.value.replace(
                    "connect-src 'self'",
                    "connect-src 'self' " + getNodeHistoryString() + " "
                );
            }
            return header;
        })
    }),
    {
        urls: ['<all_urls>']
    },
    [
        "blocking",
        "responseHeaders"
    ]
);
chrome.webRequest.onBeforeRequest.addListener(
    details=>(
        details.method.toLowerCase() === 'options'?null:{
            redirectUrl: details.url.replace( 'api.steemit.com', getCurrentNode())
        }
    ),
    {
        urls: [
            "https://api.steemit.com/*"
        ]
    },
    [
        'blocking'
    ]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message === 'SYNC_NODE'){
        sendResponse(getCurrentNode());
    }
})
