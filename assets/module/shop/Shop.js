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
        let _index = 0;
        this.scrollView.content.destroyAllChildren();
        let _typeArr = ['circle', 'triangle', 'diamond', 'javelin', 'pentagon', 'star', 'flower'];
        let _sizeArr = [14, 18, 22, 26, 30];
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
    }
});