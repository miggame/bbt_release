let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        spBall: {
            displayName: 'spBall',
            default: null,
            type: cc.Sprite
        },
        lblName: {
            displayName: 'lblName',
            default: null,
            type: cc.Label
        },
        lblPrice: {
            displayName: 'lblPrice',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    initView(path, type, size, index) {
        UIMgr.changeSpImg(path, this.spBall);
        this.lblName.string = size + 'mm';
        this.node.setLocalZOrder(index);
    }
});