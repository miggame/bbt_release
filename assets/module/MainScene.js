let Observer = require('Observer');
let UIMgr = require('UIMgr');
let GameData = require('GameData');

cc.Class({
    extends: Observer,

    properties: {
        addNode: { //预制挂载节点
            displayName: 'addNode',
            default: null,
            type: cc.Node
        },
        loadingPre: { //loading界面
            displayName: 'loadingPre',
            default: null,
            type: cc.Prefab
        },
        menuPre: { //menu界面
            displayName: 'menuPre',
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.CloseLoading
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.CloseLoading) {
            this._initMenu();
        }
    },
    onLoad() {
        this._initMsg();
        GameData.init(); //初始化游戏数据
    },

    start() {
        this._initLoading();
    },

    // update (dt) {},
    _initLoading() { //展示loading界面
        UIMgr.createPrefab(this.loadingPre, function (root, ui) {
            this.addNode.addChild(root);
        }.bind(this));
    },

    _initMenu() {
        UIMgr.createPrefab(this.menuPre, function (root, ui) {
            this.addNode.addChild(root);
            ui.getComponent('Menu').initView();
        }.bind(this));
    }
});