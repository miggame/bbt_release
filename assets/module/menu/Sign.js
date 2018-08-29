let UIMgr = require('UIMgr');
let SignModule = require('SignModule');

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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    initView() {
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
        this.btnGot.interactable = this.btnDoubleGot.interactable = !SignModule.signData.isSigned;
        if (SignModule.signData.isSigned) {
            this._showLeftTime();
            this.schedule(this._showLeftTime, 1);
        } else {
            this.lblTime.string = '领取';
        }
    },

    // update (dt) {},
    onBtnClickToClose() {
        this.unschedule(this._showLeftTime);
        UIMgr.destroyUI(this);
    },

    onBtnClickToGot() {
        let _now = new Date();
        let _curWeekday = _now.getDay();
        if (_curWeekday === 0) {
            _curWeekday = 7;
        }
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
    }

});