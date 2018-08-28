let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        spDayArr: [cc.Sprite],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    onBtnClickToClose() {
        UIMgr.destroyUI(this);
    }
});