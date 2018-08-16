let GameCfg = require('GameCfg');
let UIMgr = require('UIMgr');
let ObserverMgr = require('ObserverMgr');
let GameData = require('GameData');

cc.Class({
    extends: cc.Component,

    properties: {
        spStage: { //预制挂载节点
            displayName: 'spStage',
            default: null,
            type: cc.Sprite
        },
        lblStage: { //预制挂载节点
            displayName: 'lblStage',
            default: null,
            type: cc.Label
        },
        _index: null,
        _canChoose: false,
        starArr: [cc.Sprite]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._canChoose = false;
        this.lblStage.node.active = false;
        this.starArr.forEach(spStar => {
            spStar.node.active = false;
        });
    },

    start() {

    },

    // update (dt) {},
    initView(index) {
        this._index = index;
        if (GameCfg.getCurStage() >= index) {
            this._canChoose = true;
            this.lblStage.node.active = true;
            this.lblStage.string = index;
            let path = 'menu/mainmenu_img_stageunlockbg';
            UIMgr.changeSpImg(path, this.spStage);
            let starNum = GameCfg.getStageCfgOfStar(index);
            this._showStageStar(starNum);
        }
    },

    _showStageStar(starNum) {
        for (let i = 0; i < starNum; ++i) {
            this.starArr[i].node.active = false;
        }
    },

    onBtnClickToStage() {
        if (!this._canChoose) {
            return;
        }
        GameData.initStageData(this._index);
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
    }
});