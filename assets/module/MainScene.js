let Observer = require('Observer');
let UIMgr = require('UIMgr');
let GameData = require('GameData');
let GameCfg = require('GameCfg');
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
        gamePre: { //game界面
            displayName: 'gamePre',
            default: null,
            type: cc.Prefab
        },
        endPre: { //end界面
            displayName: 'endPre',
            default: null,
            type: cc.Prefab
        },
        pausePre: { //pause界面
            displayName: 'pausePre',
            default: null,
            type: cc.Prefab
        },

        //开放数据域
        display: {
            displayName: 'display',
            default: null,
            type: cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GoMenu,
            GameLocalMsg.Msg.GoGame,
            GameLocalMsg.Msg.End,
            GameLocalMsg.Msg.Pause
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GoMenu) {
            this._initMenu();
        } else if (msg === GameLocalMsg.Msg.GoGame) {
            this._initGame();
        } else if (msg === GameLocalMsg.Msg.End) {
            this._initEnd(data);
        } else if (msg === GameLocalMsg.Msg.Pause) {
            this._initPause();
        }
    },
    onLoad() {
        this._initMsg();
        GameData.init(); //初始化游戏数据
        GameCfg.init(); //初始化游戏配置数据
    },

    start() {
        this._initLoading();
        this.tex = new cc.Texture2D();
        this.scheduleOnce(this.sendMsg, 2);
    },

    // 刷新开放数据域的纹理
    _updateSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        let openDataContext = wx.getOpenDataContext();
        let sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    update(dt) {
        this._updateSubDomainCanvas();
    },

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
    },

    _initGame() {
        UIMgr.createPrefab(this.gamePre, function (root, ui) {
            this.addNode.addChild(root);
            ui.getComponent('Game').initView();
        }.bind(this));
    },
    _initEnd(data) {
        UIMgr.createPrefab(this.endPre, function (root, ui) {
            this.addNode.addChild(root);
            ui.getComponent('End').initView(data);
        }.bind(this));
    },
    _initPause() {
        UIMgr.createPrefab(this.pausePre, function (root, ui) {
            this.addNode.addChild(root);
        }.bind(this));
    },
    sendMsg() {
        wx.postMessage({
            message: 'wxMsg'
        });
    }
});