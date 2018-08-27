let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: {
            displayName: 'scrollView',
            default: null,
            type: cc.ScrollView
        },
        shopItemPre: {
            displayName: 'shopItemPre',
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


    },

    start() {

    },

    // update (dt) {},

    onBtnClickToClose() {
        UIMgr.destroyUI(this);
    },

    initView(i) {

        this._showShop();
    },

    _showShop() {
        this.scrollView.content.destroyAllChildren();
        let _typeArr = ['circle', 'triangle', 'diamond', 'javelin', 'pentagon', 'star', 'flower'];
        let _sizeArr = [14, 18, 22, 26, 30];
        let _index = 0;
        for (let i = 0; i < _sizeArr.length; ++i) {
            for (let j = 0; j < _typeArr.length; ++j) {
                _index++;
                let _path = 'shop/ball/ball_img_' + _typeArr[j] + _sizeArr[i] + '_0_1';
                let _shopItem = cc.instantiate(this.shopItemPre);
                this.scrollView.content.addChild(_shopItem);
                _shopItem.getComponent('ShopItem').initView(_path, _typeArr[j], _sizeArr[i], _index);
            }
        }
        let _defaultPath = 'shop/ball/ball_img_circle18_1_1';
        let _defaultShopItem = cc.instantiate(this.shopItemPre);
        let _defaultIndex = 8;
        this.scrollView.content.addChild(_defaultShopItem);
        _defaultShopItem.getComponent('ShopItem').initView(_defaultPath, 'circle', 18, _defaultIndex);
    },

    _showRuby() {
        this.scrollView.content.destroyAllChildren();
        let _typeArr = [
            'mzq',
            'ads_1',
            'ruby1',
            'ruby2',
            'ruby3',
            'ruby4',
            'ruby5',
            'ruby6',
            'ruby7',
            'ruby8',
            'ruby9'
        ];
        let _nameArr = [
            '黄金瞄准',
            '移除广告',
            '20',
            '100',
            '200',
            '300',
            '550',
            '1150',
            '3600',
            '6250',
            '15000'
        ];
    }
});