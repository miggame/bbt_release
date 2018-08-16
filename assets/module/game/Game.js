let GameCfg = require('GameCfg');
let GameData = require('GameData');

cc.Class({
    extends: cc.Component,

    properties: {
        _blockPool: null,
        blockPre: {
            displayName: 'blockPre',
            default: null,
            type: cc.Prefab
        },
        blockLayer: {
            displayName: 'blockLayer',
            default: null,
            type: cc.Node
        },
        _data1: null, //类型数据
        _data2: null, //基础分数数据
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._blockPool = new cc.NodePool('Block');
        for (let i = 0; i < 121; ++i) {
            let _tempNode = cc.instantiate(this.blockPre);
            this._blockPool.put(_tempNode);
        }
        this.blockLayer.destroyAllChildren();
    },

    start() {

    },

    // update (dt) {},

    initView() {
        let stageData = GameData.stageData;
        this._data1 = stageData.type.layer1.data;
        this._data2 = stageData.type.layer2.data;
        let len = this._data1.length;
        for (let i = len - parseInt(GameCfg.defaultCol); i < len; ++i) {
            for (let j = 0; j < GameCfg.defaultCol; ++j) {
                let _type = this._data1[i][j];
                let _index = cc.v2(i, j);
                this._showBlock(_type, _index, this.blockLayer);
            }
        }
    },

    _showBlock(type, index, parentNode) { //展示block
        if (type === 0) {
            return;
        }
        let _blockNode = this._blockPool.get();
        if (!_blockNode) {
            _blockNode = cc.instantiate(this.blockPre);
        }
        parentNode.addChild(_blockNode);
        _blockNode.getComponent('Block').initView(type, index, parentNode);
    }
});