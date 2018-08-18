// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
    }
});