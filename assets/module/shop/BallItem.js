let UIMgr = require('UIMgr');
let GameCfg = require('GameCfg');
let ObserverMgr = require('ObserverMgr');
let ShopModule = require('ShopModule');
let Observer = require('Observer');

cc.Class({
    extends: Observer,

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
        _data: null,
        _shopScript: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.BuyBall
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.BuyBall) {
            if (data.index === this._data.index) {
                this.initView(data);
            } else {
                this.initView(this._data);
            }
        }
    },
    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},

    initView(data) { //isUsed判定显示按钮是使用中还是购买按钮，hasOwned判定lblPrice显示是单价还是已购买
        this._data = data;
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

        if (!data.hasOwned) {
            this.lblPrice.string = data.price;
        } else {
            this.lblPrice.string = '已购买';
        }
    },

    onBtnClickToBuy() {
        if (parseInt(GameCfg.totalRuby) < parseInt(this._data.price)) {
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.InsufficientRuby, null);
            return;
        }

        //更新当前购买小球的数据
        this._data.isUsed = true;
        this._data.hasOwned = true;
        ShopModule.ball[GameCfg.ballIndex].isUsed = false;
        GameCfg.ballIndex = this._data.index;
        ShopModule.ball[this._data.index].isUsed = true;
        ShopModule.ball[this._data.index].hasOwned = true;
        GameCfg.totalRuby = parseInt(GameCfg.totalRuby) - parseInt(this._data.price);
        GameCfg.saveTotalRuby(GameCfg.totalRuby);
        GameCfg.saveShopData(); //保存ShopModule数据
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshRuby, null);
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BuyBall, this._data);
    }
});