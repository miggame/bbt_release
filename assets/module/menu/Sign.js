let UIMgr = require('UIMgr');
let SignModule = require('SignModule');
let GameCfg = require('GameCfg');
let ObserverMgr = require('ObserverMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        spDayArr: [cc.Sprite],
        _rewardArr: [],
        btnGot: {
            displayName: 'btnGot',
            default: null,
            type: cc.Button
        },
        btnDoubleGot: {
            displayName: 'btnDoubleGot',
            default: null,
            type: cc.Button
        },
        lblTime: {
            displayName: 'lblTime',
            default: null,
            type: cc.Label
        },
        lblVideo: {
            displayName: 'lblVideo',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    initView() {
        this.unschedule(this._showLeftTime);
        this._rewardArr = [];
        for (const _key in SignModule.signData.reward) {
            if (SignModule.signData.reward.hasOwnProperty(_key)) {
                const _elem = SignModule.signData.reward[_key];
                this._rewardArr.push(_elem);
            }
        }
        for (const _key in this._rewardArr) {
            if (this._rewardArr.hasOwnProperty(_key)) {
                const _elem = this._rewardArr[_key];
                this.spDayArr[_key].node.getChildByName('check').active = this.spDayArr[_key].node.getChildByName('spCheckBg').active = _elem.isChecked;
            }
        }
        this.btnGot.interactable = !SignModule.signData.isSigned;
        this.btnDoubleGot.interactable = !SignModule.signData.videoSigined;

        this.lblVideo.string = SignModule.signData.videoSigined ? '已领取' : '加倍';
        if (SignModule.signData.isSigned) {
            this._showLeftTime();
            this.schedule(this._showLeftTime, 1);
        } else {
            this.lblTime.string = '领取';
        }
    },

    // update (dt) {},
    onBtnClickToClose() {
        console.log('closeSign');
        this.unschedule(this._showLeftTime);
        UIMgr.destroyUI(this);
    },

    onBtnClickToGot() {
        console.log('got');
        let _plusRuby = 0;
        let _now = new Date();
        let _curWeekday = _now.getDay();
        if (_curWeekday === 0) {
            _curWeekday = 7;
        }
        if (_curWeekday === 3) {
            _plusRuby = 50;
        } else if (_curWeekday === 5) {
            _plusRuby = 100;
        } else if (_curWeekday === 7) {
            _plusRuby = 150;
        }
        GameCfg.totalRuby += _plusRuby;
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshRuby, null);
        let _key = parseInt(_curWeekday - 1);
        SignModule.signData.reward['day' + _key].isChecked = true;
        SignModule.signData.isSigned = true;
        SignModule.saveSignData(SignModule.signData);
        SignModule.reward = SignModule.signData.reward;
        this.initView();
    },
    _showLeftTime() {
        let _curTime = new Date();
        let _now = _curTime.getTime();
        _curTime.setHours(23, 59, 59);
        let _end = _curTime.getTime();
        let _leftSeconds = (_end - _now) / 1000;
        let _h = Math.floor(_leftSeconds / 3600 % 24);
        let _m = Math.floor(_leftSeconds / 60 % 60);
        let _s = Math.floor(_leftSeconds % 60);
        this.lblTime.string = _h + ':' + _m + ':' + _s;
    },

    onBtnClickToVideo() {
        let _plusRuby = 0;
        let _now = new Date();
        let _curWeekday = _now.getDay();
        if (_curWeekday === 0) {
            _curWeekday = 7;
        }
        if (_curWeekday === 3) {
            _plusRuby = 100;
        } else if (_curWeekday === 5) {
            _plusRuby = 200;
        } else if (_curWeekday === 7) {
            _plusRuby = 300;
        } else {
            _plusRuby = 50;
        }
        GameCfg.totalRuby += _plusRuby;
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshRuby, null);
        SignModule.signData.videoSigined = true;
        SignModule.saveSignData(SignModule.signData);
        this.initView();
    }

});