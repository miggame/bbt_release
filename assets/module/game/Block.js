let UIMgr = require('UIMgr');
let GameData = require('GameData');
let GameCfg = require('GameCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        spBlock: {
            displayName: 'spBlock',
            default: null,
            type: cc.Sprite
        },
        lblScore: {
            displayName: 'lblScore',
            default: null,
            type: cc.Label
        },
        _type: null,
        _index: null,
        _data1: null,
        _data2: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let stageData = GameData.stageData;
        this._data1 = stageData.type.layer1.data;
        this._data2 = stageData.type.layer2.data;
    },

    start() {

    },

    // update (dt) {},
    initView(type, index, parentNode) {

        this._type = type;
        this._index = index;
        let path = 'game/game_img_block' + type + '_1';
        UIMgr.changeSpImg(path, this.spBlock);
        let x = index.x;
        let y = index.y;
        let vWidth = parentNode.width;
        this.node.height = this.node.width = vWidth / GameCfg.defaultCol;
        this.node.y = -(this.node.height + this.node.height * 0.5 + this.node.height * x); //锚点（0.5， 1）
        this.node.x = (y - Math.floor(GameCfg.defaultCol * 0.5)) * this.node.width;
    }
});