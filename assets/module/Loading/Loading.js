let GameData = require('GameData');
let GameCfg = require('GameCfg');

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
            let _savelv = asset.shift();
            let _stageCfg = GameCfg.getStageCfg();
            if (_stageCfg === undefined || _stageCfg === null) {
                GameData.gamedata_savelv = _savelv.json;
            } else {
                GameData.gamedata_savelv = _stageCfg;
            }
            GameData.mapdata = asset;
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoMenu, null);
            this.scheduleOnce(this._close, 1);

        }.bind(this));
    },

    _close() {
        UIMgr.destroyUI(this);
    }

    // update (dt) {},
});