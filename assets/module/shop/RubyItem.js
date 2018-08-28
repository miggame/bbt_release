let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        lblType: {
            displayName: 'lblType',
            default: null,
            type: cc.Label
        },
        spHot: {
            displayName: 'spHot',
            default: null,
            type: cc.Sprite
        },
        spType: {
            displayName: 'spType',
            default: null,
            type: cc.Sprite
        },
        lblName: {
            displayName: 'lblName',
            default: null,
            type: cc.Label
        },
        btnBuy: {
            displayName: 'btnBuy',
            default: null,
            type: cc.Button
        },
        btnVideo: {
            displayName: 'btnVideo',
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    initView(data) {
        //左上角标志
        this.lblType.string = data.type;
        if (data.typePath !== null) {
            UIMgr.changeSpImg(data.typePath, this.spHot);
        } else {
            this.spHot.node.active = false;
        }
        //名字与类型图片
        let _path = 'shop/ruby/game_img_' + data.path;
        UIMgr.changeSpImg(_path, this.spType);
        this.lblName.string = data.name;

        //购买与视频按钮
        this.btnVideo.node.active = data.type === '免费' ? true : false;
        this.btnBuy.node.active = data.type === '免费' ? false : true
    }
});