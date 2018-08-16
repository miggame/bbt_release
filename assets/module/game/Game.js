let GameCfg = require('GameCfg');
let GameData = require('GameData');
let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        addNode: {
            displayName: 'addNode',
            default: null,
            type: cc.Node
        },
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
        previewPre: { //预览界面
            displayName: 'previewPre',
            default: null,
            type: cc.Prefab
        },
        _ballPool: null,
        ballPre: {
            displayName: 'ballPre',
            default: null,
            type: cc.Prefab
        },
        _ballCount: null,
        ballLayer: {
            displayName: 'ballLayer',
            default: null,
            type: cc.Node
        },
        spBall: {
            displayName: 'spBall',
            default: null,
            type: cc.Sprite
        },
        //点击监听
        _ballPos: null,
        _touchP: null,
        _shootBallCount: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._initPhysics(); //初始化物理环境
        this._blockPool = new cc.NodePool('Block'); //创建block对象池
        for (let i = 0; i < 121; ++i) {
            let _tempBlockNode = cc.instantiate(this.blockPre);
            this._blockPool.put(_tempBlockNode);
        }
        this.blockLayer.destroyAllChildren();
        this._ballPool = new cc.NodePool('Ball'); //创建ball对象池
        for (let i = 0; i < 80; ++i) {
            let _tempBallNode = cc.instantiate(this.ballPre);
            this._ballPool.put(_tempBallNode);
        }

    },

    start() {

    },

    // update (dt) {},
    _initPhysics() {
        this.physicsManager = cc.director.getPhysicsManager();
        this.physicsManager.enabled = true;
        // this.physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit;
    },
    initView() {
        //展示ball
        this._ballCount = GameData.ballCount;
        this._showBall();
        //展示block
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
        this._showPreview(this._data1);
        this._initTouch();
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
    },

    _showPreview(data) {
        UIMgr.createPrefab(this.previewPre, function (root, ui) {
            this.addNode.addChild(root);
            ui.getComponent('Preview').initView(data, this._blockPool);
        }.bind(this));
    },

    //展示ball
    _showBall() {
        this._shootBallCount = 0; //发射出来人小球数
        this.spBall.node.x = 0;
        this.spBall.node.y = -this.ballLayer.height + this.spBall.node.height * 0.5;
        this._ballPos = this.spBall.node.position;
    },

    //初始化点击监听
    _initTouch() {
        this.ballLayer.on('touchstart', function (event) {
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
        }.bind(this));
        this.ballLayer.on('touchmove', function (event) {
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            let _touchV = this._touchP.sub(this._ballPos).normalizeSelf();

            cc.log(_touchV);
        }.bind(this));
        this.ballLayer.on('touchend', function (event) {
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            this.schedule(this._shootBall, 0.2, this._ballCount - 1, 0);
        }.bind(this));
        this.ballLayer.on('touchcancel', function (event) {

        }.bind(this));
    },
    _shootBall() {
        let _touchV = this._touchP.sub(this._ballPos).normalizeSelf().mul(GameCfg.ballSpeed);
        this._shootBallCount++;
        let _ballNode = this._ballPool.get();
        if (!_ballNode) {
            _ballNode = cc.instantiate(this.ballPre);
        }
        this.ballLayer.addChild(_ballNode);
        _ballNode.position = this.spBall.node.position;
        _ballNode.getComponent('Ball').initView(_touchV);
    }
});