let GameData = require('GameData');
let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let UIMgr = require('UIMgr');

cc.Class({
    extends: Observer,

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
    _getMsgList() {
        return [];
    },
    _onMsg(msg, data) {

    },
    // onLoad() {

    // },

    start() {
        cc.loader.loadResDir('map', cc.JsonAsset, function (err, asset) {
            if (err) {
                console.log('加载地图json出错: ', err);
                return;
            }
            GameData.gamedata_savelv = asset.shift().json;
            GameData.mapdata = asset;
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.CloseLoading, null);
            UIMgr.destroyUI(this);
        }.bind(this));
    },

    // update (dt) {},
});