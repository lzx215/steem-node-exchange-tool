<template>
    <div>
        <el-tabs type="border-card" :stretch='true'>
        <el-tab-pane label="节点管理">
            <el-alert
                title="切换后，部分应用第一次访问会有问题，刷新即可"
                type="success"
                :closable="false">
            </el-alert>
            <el-table
                ref="singleTable"
                :data="nodelist"
                highlight-current-row
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column label="" width="28" :show-overflow-tooltip="true">
                    <template scope="scope">
                        <el-radio :label="scope.row.node" v-model="currentNode" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column
                property="node"
                label="节点"
                min-width="220">
                </el-table-column>
                <el-table-column
                property="speed"
                label="速度"
                width="80">
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button @click="testSpeed()" type="primary" :disabled="testSpeedButtonDisabled">节点测速</el-button>
            </div>

        </el-tab-pane>
        <el-tab-pane class="notice-info" label="使用说明">
            <el-alert
                title="未经测试的结论："
                type="warning"
                description="理论上支持所有使用官方节点的Dapp。"
                show-icon 
                :closable="false">
            </el-alert><br />
            <el-alert
                title="第一版锁定了3个节点，没有其他多余功能。"
                type="info" 
                :closable="false"><br /><br />
                <div class="text item">
                如有好的建议，请去我的busy留言。<a @click="visitAuthor">点此前往>></a>
                </div>
            </el-alert><br />
            <el-alert
                title="下一版功能征集中，目前仅有如下功能在计划中:"
                type="info"
                :closable="false"><br /><br />
                <div class="text item">
                1> 更新节点列表。（自动获取和手动修改）
                </div>
                <div class="text item">
                2> 更好的测速功能。
                </div>
            </el-alert><br />

        </el-tab-pane>
        <el-tab-pane label="关于插件" :style="{textAlign:'center'}">
            <img src="https://steemitimages.com/u/liuzhixiang/avatar" width="96" height="96" class="head_pic"/>
            <div class="author-info">
                <el-button type="primary" @click="visitAuthor">作者：@liuzhixiang</el-button><br /><br />
                <el-button type="info" icon="el-icon-news" @click="visitGithub"> 插件Github源码</el-button><br /><br />
                <h3>当前版本:{{manifest.version}}</h3>
                <div class="tip">
                    <p>Steem Node Exchange Tool是一个简单的Steem全节点切换工具。</p>
                </div>
            </div>
        </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import _ from 'lodash'
    export default {
        data: () => ({
            testSpeedButtonDisabled: false,
            nodelist: [],
            currentNode: null,
            manifest: chrome.runtime.getManifest()
        }),
        watch: {
            nodelist: {
                handler (val) {
                    chrome.storage.local.set({
                        nodelist: val
                    })
                    if (_.findIndex(this.nodelist, function (o) { return o.speed === '...' }) === -1) {
                        this.testSpeedButtonDisabled = false
                    }
                },
                deep: true
            }
        },
        computed: { },
        created () {
            console.log('New tab')
            this.getNodeList()
        },
        mounted () {},
        methods: {
            getTemplateRow (index, row) {
                this.currentNode = row.node
            },
            getNodeList () {
                chrome.storage.local.get({nodelist: [{
                    node: 'rpc.steemviz.com'
                }, {
                    node: 'steemd.minnowsupportproject.org'
                }, {
                    node: 'anyx.io'
                }],
                currentNode: 'rpc.steemviz.com'
                }, data => {
                    this.nodelist = _.each(data.nodelist, item => {
                        if (!item.speed || item.speed === '...')item.speed = ''
                        return item
                    })
                    this.currentNode = data.currentNode
                    this.setCurrentLocalNode(data.currentNode)
                })
            },
            setCurrentLocalNode (node) {
                let oldNodes
                if (!localStorage.OLD_STEEM_CURRENT_NODE) {
                    oldNodes = []
                } else {
                    oldNodes = JSON.parse(localStorage.OLD_STEEM_CURRENT_NODE)
                }

                if (_.findIndex(oldNodes, function (o) { return o === node }) === -1) {
                    oldNodes = [...oldNodes, node]
                }

                localStorage.OLD_STEEM_CURRENT_NODE = JSON.stringify(oldNodes)
                localStorage.STEEM_CURRENT_NODE = node
            },
            handleCurrentChange (row) {
                this.currentNode = row.node
                chrome.storage.local.set({currentNode: row.node})
                this.setCurrentLocalNode(row.node)
            },
            visitAuthor () {
                chrome.tabs.create({ url: 'https://busy.org/@liuzhixiang' })
            },
            visitGithub () {
                chrome.tabs.create({ url: 'https://github.com/lzx215/steem-node-exchange-tool' })
            },
            testSpeed () {
                let nowTime = () => (new Date().getTime() / 1000).toFixed(1)

                this.testSpeedButtonDisabled = true

                _.each(this.nodelist, (item, index) => {
                    this.nodelist[index].speed = '...'
                    let apiurl = 'https://' + item.node
                    let startTime = nowTime()
                    this.$http.post(apiurl, JSON.stringify({
                        id: 1,
                        jsonrpc: '2.0',
                        method: 'condenser_api.get_account_count',
                        params: []
                    })).then(response => {
                        // success callback
                        let thatSpeed = (nowTime() - startTime).toFixed(1)
                        this.nodelist[index].speed = thatSpeed
                        if (thatSpeed > 100) this.nodelist[index].speed = '> 100'
                    }, response => {
                        this.nodelist[index].speed = 'Error!'
                    }).finally(() => {
                        if (this.nodelist[index].speed === '...') this.nodelist[index].speed = ''
                    })
                })
            }
        }
    }
</script>
<style>
    html { 
        font-size: 14px !important;
        color: #606266 !important;
        width: 400px; padding: 0;
        font-weight: 400;
    } 
    body { 
        margin: -4px 0; 
    }
    .item {
        margin-bottom: 18px;
        font-size: 14px;
    }
    .tip {
        padding: 8px 16px;
        background-color: #eee;
        border-radius: 4px;
        border-left: #ccc 5px solid;
        margin: 20px 0;
        font-size: 14px;
        color: #5e6d82;
        line-height: 1.5em;
        text-align: left;
    }
    .el-tabs { 
        border-bottom: 0;
    }
    .el-tabs__content { 
        height: 400px; 
    }
    .notice-info .el-alert__content {
        padding: 15px 8px;
    }
    .head_pic { 
        border: 1px solid #eee; padding: 2px; border-radius: 100%; margin: 16px 0 8px; box-shadow:3px 3px 1px #ccc; 
    }
</style>
