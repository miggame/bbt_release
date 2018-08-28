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
    },

    // update (dt) {},
    onBtnClickToClose() {
        UIMgr.destroyUI(this);
    },

    onBtnClickToGot() {
        let _curWeekday = dayjs().day();
        let _key = parseInt(_curWeekday - 1);
        SignModule.signData.reward['day' + _key].isChecked = true;
        SignModule.signData.isSigned = true;
        SignModule.saveSignData(SignModule.signData);
        SignModule.reward = SignModule.signData.reward;
        this.initView();
    }

});