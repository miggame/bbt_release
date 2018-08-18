let ObserverMgr = require('ObserverMgr');
let UIMgr = require('UIMgr');

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
        this._data = data;
        this.lblStage.string = '关卡 ' + data.stage;
        this.lblStatus.string = data.status ? '通过' : '失败';
        this.btnNext.node.active = data.status;
        this.btnRetry.node.active = !this.btnNext.node.active;
    },

    onBtnClickToRetry() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
        UIMgr.destroyUI(this);
    }
});