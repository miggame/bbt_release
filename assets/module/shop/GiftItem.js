let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        spType: {
            displayName: 'spType',
            default: null,
            type: cc.Sprite
        },
        lblRuby: {
            displayName: 'lblRuby',
            default: null,
            type: cc.Label
        },
        lblItem0: {
            displayName: 'lblItem0',
            default: null,
            type: cc.Label
        },
        lblItem1: {
            displayName: 'lblItem1',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    initView(data) {
        let _path = 'shop/ruby/game_img_' + data.type;
        UIMgr.changeSpImg(_path, this.spType);
        this.lblRuby.string = 'x ' + data.num;
        this.lblItem0.string = 'x ' + data.item0;
        this.lblItem1.string = 'x ' + data.item1;
    }
});