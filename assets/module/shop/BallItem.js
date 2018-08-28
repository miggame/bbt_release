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
        btnBuy: {
            displayName: 'btnBuy',
            default: null,
            type: cc.Sprite
        },
        btnUsed: {
            displayName: 'btnUsed',
            default: null,
            type: cc.Sprite
        },
        spUsedBg: {
            displayName: 'spUsedBg',
            default: null,
            type: cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    initView(data) {
        let path = '';
        if (data.type !== 'default') {
            path = 'shop/ball/ball_img_' + data.type + data.size + '_0_1';
        } else {
            path = 'shop/ball/ball_img_circle18_1_1';
        }
        UIMgr.changeSpImg(path, this.spBall);
        this.lblName.string = data.size + 'mm';
        this.node.setLocalZOrder(data.index);

        this.btnUsed.node.active = data.isUsed;
        this.btnBuy.node.active = !this.btnUsed.node.active;
        this.spUsedBg.node.active = data.isUsed;
    }
});