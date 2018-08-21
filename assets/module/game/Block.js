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
        _pool: null, //节点池
        isUsed: false, //道具block是否使用过

        //特殊类型
        xmarkLayout: { //type:11
            displayName: 'xmarkLayout',
            default: null,
            type: cc.Node
        },
        //type:12关闭，13打开
        spLeft: {
            displayName: 'spLeft',
            default: null,
            type: cc.Sprite
        },
        spRight: {
            displayName: 'spRight',
            default: null,
            type: cc.Sprite
        },
        _isOpen: true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let stageData = GameData.stageData;
        this._data1 = stageData.type.layer1.data;
        this._data2 = stageData.type.layer2.data;
        this._hp = 0;
        this.isUsed = false;
        this._isOpen = true;
    },

    start() {},

    // update (dt) {},
    initView(type, index, parentNode, pool, leftRow, isPreview = false) {
        this._pool = pool;
        this._type = type;
        this._index = index;
        let path = 'game/game_img_block' + type + '_1';
        if ([11, 12, 13].indexOf(type) !== -1) {
            path = 'game/game_img_block1_1';
        }
        //特殊类型
        if (type === 11 || type === 12 || type === 13 || type === 20) { //type:20为纯阻碍block
            // path = 'game/game_img_block1_1';
            this.xmarkLayout.active = true;

            let _parent = this.spLeft.node.parent;
            let _w = _parent.width * 0.5;
            this.spLeft.node.width = this.spRight.node.width = _w;
            this.spLeft.node.active = this.spRight.node.active = false; //特指type=11
            if (type === 12) { //关闭
                this.spLeft.node.x = 0.1 * _w;
                this.spRight.node.x = -0.1 * _w;
                this.spLeft.node.active = this.spRight.node.active = true;
                this._isOpen = false;
            } else if (type === 13) { //打开
                this.spLeft.node.x = -_w * 0.8;
                this.spRight.node.x = _w * 0.8;
                this.spLeft.node.active = this.spRight.node.active = true;
            }
        } else {
            this.xmarkLayout.active = false;
            this.spLeft.node.active = this.spRight.node.active = false;
        }

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
        let _arr = [1, 2, 3, 4, 5, 6, 9, 11, 12, 13]; //有生命值的blocks
        if (_arr.indexOf(type) !== -1) {
            if (type === 9 || type === 3 || type === 4 || type === 5 || type === 6 || type === 12 || type === 13) {
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

        let _phyCollider = null;
        if (type === 21 || type === 22 || type === 23 || type === 24 || type === 7 || type === 8) { //圆形 
            _phyCollider = this.node.addComponent(cc.PhysicsCircleCollider);
            _phyCollider.sensor = true;
            this.node.width = this.node.height = w; //圆形缩小一半 
            _phyCollider.radius = w * 0.5;
        } else { //多边形
            _phyCollider = this.node.addComponent(cc.PhysicsPolygonCollider);
            _phyCollider.points = _points;
        }
        _phyCollider.tag = 1;
        _phyCollider.apply();
    },

    hit() {
        let _tempArr = [1, 2, 3, 4, 5, 6, 9, 11, 12, 13]; //有数值砖块类型
        if (_tempArr.indexOf(this._type) !== -1) {
            if (this._isOpen === false) {
                return;
            }
            this._hp--;
            if (this._hp <= 0 && this._type === 9) {
                this.node.parent.children.forEach(_block => {
                    let _script = _block.getComponent('Block');
                    if (_script._index.x === this._index.x && _script._index.y !== this._index.y) {
                        // this._pool.put(_block);//TODO???用节点池回收不全，达不到预期效果
                        _block.destroy();
                    }
                });
            }
            this._refreshHp();
            return;
        }
        if ([21, 22, 23].indexOf(this._type) !== -1) {
            this.node.removeComponent(cc.PhysicsCircleCollider);
            let _tarPos = cc.v2(this.node.x, -this.node.parent.height + this.node.height * 0.5);
            let _moveAct = cc.moveTo(0.5, _tarPos);
            let _scaleAct = cc.scaleTo(0.5, 0);
            this.node.runAction(cc.sequence(_moveAct, _scaleAct, cc.removeSelf()));
            GameData.ballCount += parseInt(this._type) - 20;
            return;
        }
        if (this._type === 7) {
            this.isUsed = true;
            let _tempArr = this.node.parent.children;
            _tempArr.forEach(_block => {
                let _script = _block.getComponent('Block')
                if (_script._index.x === this._index.x) {
                    if ([1, 2, 3, 4, 5, 6, 9, 11, 12, 13].indexOf(_script._type) !== -1) {
                        _script._hp--;
                        _script._refreshHp();
                    }
                }
            });
            return;
        }
        if (this._type === 8) {
            this.isUsed = true;
            let _tempArr = this.node.parent.children;
            _tempArr.forEach(_block => {
                let _script = _block.getComponent('Block')
                if (_script._index.y === this._index.y) {
                    if ([1, 2, 3, 4, 5, 6, 9, 11, 12, 13].indexOf(_script._type) !== -1) {
                        _script._hp--;
                        _script._refreshHp();
                    }
                }
            });
            return;
        }
        if (this._type === 24) {
            this.isUsed = true;
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
    },

    playAct() {
        let _parent = this.spLeft.node.parent;
        let _w = _parent.width * 0.5;

        if (this._isOpen) {
            let _leftOpenAct = cc.moveBy(0.2, cc.v2(-0.9 * _w, 0));
            let _rightOpenAct = cc.moveBy(0.2, cc.v2(0.9 * _w, 0));
            this.spLeft.node.runAction(_leftOpenAct);
            this.spRight.node.runAction(_rightOpenAct);
        } else {
            let _leftCloseAct = cc.moveBy(0.2, cc.v2(0.9 * _w, 0));
            let _rightCloseAct = cc.moveBy(0.2, cc.v2(-0.9 * _w, 0));
            this.spLeft.node.runAction(_leftCloseAct);
            this.spRight.node.runAction(_rightCloseAct);
        }
    }
});