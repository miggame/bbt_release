let UIMgr = require('UIMgr');
let ShopModule = require('ShopModule');
let Observer = require('Observer');
let GameCfg = require('GameCfg');

cc.Class({
    extends: Observer,

    properties: {
        scrollView: {
            displayName: 'scrollView',
            default: null,
            type: cc.ScrollView
        },
        ballItemPre: {
            displayName: 'ballItemPre',
            default: null,
            type: cc.Prefab
        },
        rubyItemPre: {
            displayName: 'rubyItemPre',
            default: null,
            type: cc.Prefab
        },
        giftItemPre: {
            displayName: 'giftItemPre',
            default: null,
            type: cc.Prefab
        },
        btnRuby: {
            displayName: 'btnRuby',
            default: null,
            type: cc.Button
        },
        btnBall: {
            displayName: 'btnBall',
            default: null,
            type: cc.Button
        },
        btnGift: {
            displayName: 'btnGift',
            default: null,
            type: cc.Button
        },
        lblTotalRuby: { // 总ruby数
            displayName: 'lblTotalRuby',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.InsufficientRuby,
            GameLocalMsg.Msg.RefreshRuby
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.InsufficientRuby) {
            this.initView(0); //去ruby商店 
        } else if (msg === GameLocalMsg.Msg.RefreshRuby) {
            this._refreshTotalRuby();
        }
    },
    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},

    onBtnClickToClose() {
        UIMgr.destroyUI(this);
    },

    initView(i) { //0:ruby,1:shop,2:gift
        this._showShadow(i);
        if (i === 0) {
            this._showRuby();
        } else if (i === 1) {
            this._showBall();
        } else if (i === 2) {
            this._showGift();
        }
        this._refreshTotalRuby();
    },

    _showBall() {
        this.scrollView.content.destroyAllChildren();
        let _ballData = ShopModule.ball;
        for (const _key in _ballData) {
            if (_ballData.hasOwnProperty(_key)) {
                const _elem = _ballData[_key];
                let _ballItem = cc.instantiate(this.ballItemPre);
                this.scrollView.content.addChild(_ballItem);
                _ballItem.getComponent('BallItem').initView(_elem);
            }
        }
    },

    _showRuby() {
        this.scrollView.content.destroyAllChildren();
        let _rubyData = ShopModule.ruby;
        for (const _key in _rubyData) {
            if (_rubyData.hasOwnProperty(_key)) {
                const _elem = _rubyData[_key];
                let _rubyItem = cc.instantiate(this.rubyItemPre);
                this.scrollView.content.addChild(_rubyItem);
                _rubyItem.getComponent('RubyItem').initView(_elem);
            }
        }
    },
    _showShadow(i) {
        this.btnRuby.node.getChildByName('spShadow').active = i === 0 ? false : true;
        this.btnBall.node.getChildByName('spShadow').active = i === 1 ? false : true;
        this.btnGift.node.getChildByName('spShadow').active = i === 2 ? false : true;
    },

    _showGift() {
        this.scrollView.content.destroyAllChildren();
        let _giftData = ShopModule.gift;
        for (const _key in _giftData) {
            if (_giftData.hasOwnProperty(_key)) {
                const _elem = _giftData[_key];
                let _giftItem = cc.instantiate(this.giftItemPre);
                this.scrollView.content.addChild(_giftItem);
                _giftItem.getComponent('GiftItem').initView(_elem);
            }
        }
    },

    onBtnClickToSubItem(e) {
        if (!e.target.getChildByName('spShadow').active) {
            return;
        }
        let i = 0;
        if (e.target.name === 'btnRuby') {
            i = 0;
        } else if (e.target.name === 'btnBall') {
            i = 1;
        } else if (e.target.name === 'btnGift') {
            i = 2;
        }
        this.initView(i);
    },
    _refreshTotalRuby() {
        this.lblTotalRuby.string = GameCfg.totalRuby;
    }
});