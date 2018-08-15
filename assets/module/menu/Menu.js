let GameData = require('GameData');

cc.Class({
    extends: cc.Component,

    properties: {
        _stageNodePool: null,
        stagePre: {
            displayName: 'stagePre',
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            displayName: 'scrollView',
            default: null,
            type: cc.ScrollView
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //创建节点池
        let len = 30
        this._stageNodePool = new cc.NodePool('Stage');
        for (let i = 0; i < len; ++i) {
            let _tempNode = cc.instantiate(this.stagePre);
            this._stageNodePool.put(_tempNode);
        }
    },

    start() {

    },

    // update (dt) {},
    initView() {
        this.scrollView.content.destroyAllChildren();
        let len = GameData.mapdata.length;
        for (let i = 0; i < len; ++i) {
            let _stageNode = this._stageNodePool.get();
            if (!_stageNode) {
                _stageNode = cc.instantiate(this.stagePre);
            }
            this.scrollView.content.addChild(_stageNode);
            _stageNode.getComponent('Stage').initView(i + 1);
        }
    }
});