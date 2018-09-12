let ObserverMgr = require('ObserverMgr');
let UIMgr = require('UIMgr');
let GameCfg = require('GameCfg');
let GameData = require('GameData');
let AudioMgr = require('AudioMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        lblStage: {
            displayName: 'lblStage',
            default: null,
            type: cc.Label
        },
        lblStatus: {
            displayName: 'lblStatus',
            default: null,
            type: cc.Label
        },
        spStarArr: [cc.Sprite],
        btnRetry: {
            displayName: 'btnRetry',
            default: null,
            type: cc.Button
        },
        btnNext: {
            displayName: 'btnNext',
            default: null,
            type: cc.Button
        },
        _data: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    initView(data) {
        this.spStarArr.forEach(_spStar => {
            _spStar.node.active = false;
        });
        this._data = data;
        this.lblStage.string = '关卡 ' + data.stage;
        this.lblStatus.string = data.status ? '通过' : '失败';
        this.btnNext.node.active = data.status;
        this.btnRetry.node.active = !this.btnNext.node.active;
        for (let i = 0; i < data.starNum; ++i) {
            this.spStarArr[i].node.active = true;
        }
        if (data.status) {
            AudioMgr.playWinSound();
        } else {
            AudioMgr.playFailSound();
        }

    },

    onBtnClickToRetry() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
        UIMgr.destroyUI(this);
    },

    onBtnClickToNext() {
        let _stage = this._data.stage;
        let _nextStage = parseInt(_stage) + 1;
        GameCfg.saveCurStage(_nextStage); //保存当前关卡
        let _curStar = GameData.getStarNum(_stage);
        if (_curStar < this._data.starNum) {
            GameData.setStarNum(_stage, this._data.starNum);
            GameCfg.saveStageCfg(GameData.gamedata_savelv);
        }
        GameData.initStageData(_nextStage); //初始化下一关数据
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
        UIMgr.destroyUI(this);
    },

    onBtnClickToHome() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoMenu, null);
        UIMgr.destroyUI(this);
    },


});