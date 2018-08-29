let UIMgr = require('UIMgr');
let ObserverMgr = require('ObserverMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    onBtnClickToMenu() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.PauseGoMenu, null);
        UIMgr.destroyUI(this);
    },

    onBtnClickToRetry() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.PauseRetry, null);
        UIMgr.destroyUI(this);
    },

    onBtnClickToContinue() {
        // ObserverMgr.dispatchMsg(GameLocalMsg.Msg.Continue, null);
        UIMgr.destroyUI(this);
    }
});