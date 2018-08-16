let UIMgr = require('UIMgr');
let GameCfg = require('GameCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        blockLayer: {
            displayName: 'blockLayer',
            default: null,
            type: cc.Node
        },
        blockPre: {
            displayName: 'blockPre',
            default: null,
            type: cc.Prefab
        },
        spBg: {
            displayName: 'spBg',
            default: null,
            type: cc.Sprite
        },
        _blockPool: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    initView(data, pool) {
        this._blockPool = pool;
        let row = data.length;
        let col = GameCfg.defaultCol;
        let w = this.spBg.node.width / GameCfg.defaultCol;
        this.spBg.node.height = w * row * 1.5;
        for (let i = 0; i < row; ++i) {
            for (let j = 0; j < col; ++j) {
                let _type = data[i][j];
                let _index = cc.v2(i, j);
                this._showBlock(_type, _index, this.blockLayer);
            }
        }
        this.scheduleOnce(this._close, 3);
    },

    _close() {

        UIMgr.destroyUI(this);
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
        _blockNode.getComponent('Block').initView(type, index, parentNode, true);
    },
});