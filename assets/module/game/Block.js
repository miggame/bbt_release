let UIMgr = require('UIMgr');
let GameData = require('GameData');
let GameCfg = require('GameCfg');
let ObserverMgr = require('ObserverMgr');
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
        this.node.y = -(this.node.height + this.node.height * 0.5 + this.node.height * x) + leftRow * this.node.height; //父节点锚点（0.5， 1）
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
            if (type === 9 || type === 3 || type === 4 || type === 5 || type === 6) {
                this._hp = parseInt(1 * baseScore);
            } else if (type === 11) {
                this._hp = parseInt(2 * baseScore);
            } else {
                this._hp = parseInt(type * baseScore);
            }
            this._refreshHp();
        } else { //道具等blocks
            this.lblScore.node.active = false;
        }
        this._resetLabelPos(this._type);
    },
    _initPhysics(type) {
        let _points = [];
        let w = this.node.width * 0.5;
        let _p0 = cc.v2(-w, -w);
        let _p1 = cc.v2(w, -w);
        let _p2 = cc.v2(w, w);
        let _p3 = cc.v2(-w, w);
        if (type === 3) {
            _points = [_p0, _p1, _p3];
        } else if (type === 4) {
            _points = [_p0, _p1, _p2];
        } else if (type === 5) {
            _points = [_p1, _p2, _p3];
        } else if (type === 6) {
            _points = [_p0, _p2, _p3];
        } else {
            _points = [_p0, _p1, _p2, _p3];
        }
        let _phyCollider = this.node.getComponent(cc.PhysicsPolygonCollider);
        if (type === 21 || type === 22 || type === 23 || type === 24 || type === 7 || type === 8) { //圆形 
            _phyCollider.sensor = true;
        }
        _phyCollider.tag = 1;
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
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.UpdateScore, null);
            return;
        }
        this.lblScore.string = this._hp;
    },
    _resetLabelPos(type) {
        let _w = this.node.width * 0.5;
        let _h = this.node.height * 0.5;
        let pos = null;
        if (type === 3) {
            pos = cc.v2(_w, _h).scaleSelf(cc.v2(-0.3, -0.3));
        } else if (type === 4) {
            pos = cc.v2(_w, _h).scaleSelf(cc.v2(0.3, -0.3));
        } else if (type === 5) {
            pos = cc.v2(_w, _h).scaleSelf(cc.v2(0.3, 0.3));
        } else if (type === 6) {
            pos = cc.v2(_w, _h).scaleSelf(cc.v2(-0.3, 0.3));
        } else {
            pos = cc.v2(_w, _h).scaleSelf(cc.v2(0, 0));
        }
        this.lblScore.node.position = pos;
    }
});