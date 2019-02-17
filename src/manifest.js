/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
    name: 'steem-node-exchange-tool',
    description: 'steem dapp官方全节点切换工具（Chrome插件版）',
    author: 'liuzhixiang（lzx215）',
    version: '1.0.1',
    icons: {
        '16': 'icons/icon16.png',
        '128': 'icons/icon128.png'
    },
    /**
     * @see {@link https://developer.chrome.com/extensions/declare_permissions}
     */
    permissions: [
        'unlimitedStorage',
        'storage',
        'webRequest',
        'webRequestBlocking',
        'http://*/*',
        'https://*/*'
    ],
    browser_action: {
        default_icon: {
            '19': 'icons/icon19.png',
            '38': 'icons/icon38.png'
        },
        default_title: 'steem dapp官方全节点切换工具（Chrome插件版）',
        default_popup: 'pages/popup.html'
    },
    'background': {
        'scripts': [
            'js/background.js'
        ]
    },
    /**
     * @see {@link https://developer.chrome.com/extensions/content_scripts}
     */
    content_scripts: [{
        matches: ['<all_urls>'],
        js: [ "js/inject.js" ],
        run_at: "document_start",
        all_frames: true
    },{
        js: ['js/message.js'],
        run_at: 'document_end',
        matches: ['<all_urls>'],
        all_frames: true
    }],
    manifest_version: 2,
    content_security_policy: "script-src 'self'; object-src 'self'",
    web_accessible_resources: [
        'js/inject.js',
        'js/message.js',
        'js/override.js'
    ]
  }
  