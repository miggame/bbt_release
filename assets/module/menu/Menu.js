let GameData = require('GameData');
let Observer = require('Observer');
let UIMgr = require('UIMgr');
let GameCfg = require('GameCfg');

cc.Class({
    extends: Observer,

    properties: {
        _stageNodePool: null,
        stagePre: {
            displayName: 'stagePre',
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            displayName: 'scrollView',
            default: null,
            type: cc.ScrollView
        },
        lblRuby: {
            displayName: 'lblRuby',
            default: null,
            type: cc.Label
        },
        lblTime: {
            displayName: 'lblTime',
            default: null,
            type: cc.Label
        },
        lblStar: {
            displayName: 'lblStar',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GoGame
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GoGame) {
            this._close();
        }
    },
    onLoad() {
        this._initMsg();
        //创建节点池
        let len = 30
        this._stageNodePool = new cc.NodePool('Stage');
        for (let i = 0; i < len; ++i) {
            let _tempNode = cc.instantiate(this.stagePre);
            this._stageNodePool.put(_tempNode);
        }
    },

    start() {

    },

    // update (dt) {},
    initView() {
        this.scrollView.content.destroyAllChildren();
        let len = GameData.mapdata.length;
        for (let i = 0; i < len; ++i) {
            let _stageNode = this._stageNodePool.get();
            if (!_stageNode) {
                _stageNode = cc.instantiate(this.stagePre);
            }
            this.scrollView.content.addChild(_stageNode);
            _stageNode.getComponent('Stage').initView(i + 1);
        }
        this.lblStar.string = GameCfg.totalStar;
        this.lblRuby.string = GameCfg.totalRuby;
    },
    _close() {
        UIMgr.destroyUI(this);
    }
});