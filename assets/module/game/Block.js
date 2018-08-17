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
        _data2: null,
        _hp: null,
        _pool: null //节点池
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let stageData = GameData.stageData;
        this._data1 = stageData.type.layer1.data;
        this._data2 = stageData.type.layer2.data;
        this._hp = 0;
    },

    start() {},

    // update (dt) {},
    initView(type, index, parentNode, pool, leftRow, isPreview = false) {
        this._pool = pool;
        this._type = type;
        this._index = index;
        let path = 'game/game_img_block' + type + '_1';
        UIMgr.changeSpImg(path, this.spBlock);
        let x = index.x;
        let y = index.y;
        let vWidth = parentNode.width;
        this.node.height = this.node.width = vWidth / GameCfg.defaultCol;
        this.node.y = -(this.node.height + this.node.height * 0.5 + this.node.height * x) + leftRow * this.node.height; //锚点（0.5， 1）
        this.node.x = (y - Math.floor(GameCfg.defaultCol * 0.5)) * this.node.width;
        if (isPreview !== false) {
            this.lblScore.node.active = false;
            return;
        }
        this._initHp(type, index);
        this._initPhysics(type, index);
    },

    _initHp(type, index) {
        let baseScore = this._data2[index.x][index.y];
        let _arr = [1, 2, 3, 4, 5, 6, 9, 11];
        if (_arr.indexOf(type) !== -1) {
            if (type === 9) {
                this._hp = parseInt(1 * baseScore);
            } else if (type === 11) {
                this._hp = parseInt(2 * baseScore);
            } else {
                this._hp = parseInt(type * baseScore);
            }
        }
        this._refreshHp();
    },
    _refreshHp() {
        if (this._hp === 0) {
            this.lblScore.node.active = false;
            return;
        }
        if (this._hp > 0) {
            this.lblScore.node.active = true;
            this.lblScore.string = this._hp;
            return;
        }
    },
    _initPhysics(type) {
        let _points = [];
        let _p0 = cc.v2(-w, -w);
        let _p1 = cc.v2(w, -w);
        let _p2 = cc.v2(w, w);
        let _p3 = cc.v2(-w, w);
        let w = this.node.width * 0.5;
        if (type === 1 || type === 2) {
            _points = [_p0, _p1, _p2, _p3];
        } else if (type === 3) {
            _points = [p0, p1, p3];
        } else if (type === 4) {
            _points = [p0, p1, p2];
        } else if (type === 5) {
            _points = [p1, p2, p3];
        } else if (type === 6) {
            _points = [p0, p2, p3];
        }
        let _phyCollider = this.node.addComponent(cc.PhysicsBoxCollider);
        _phyCollider.points = _points;
        _phyCollider.apply();
    },

    hit() {
        let _tempArr = [1, 2, 3, 4, 5, 6, 9]; //有数值砖块类型
        if (_tempArr.indexOf(this._type) !== -1) {
            this._hp--;
            this._refreshHp();
        }
    },
    _refreshHp() {
        if (this._hp <= 0) {
            this._pool.put(this.node);
            return;
        }
        this.lblScore.string = this._hp;
    }
});