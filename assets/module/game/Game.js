let GameCfg = require('GameCfg');
let GameData = require('GameData');
let UIMgr = require('UIMgr');
let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let ShopModule = require('ShopModule');
let GameModule = require('GameModule');
cc.Class({
    extends: Observer,

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
        _leftRow: null, //未展示行数
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
        lblBallCount: {
            displayName: 'lblBallCount',
            default: null,
            type: cc.Label
        },
        spBallTemp: {
            displayName: 'spBallTemp',
            default: null,
            type: cc.Sprite
        },
        lblBallCountTemp: {
            displayName: 'lblBallCountTemp',
            default: null,
            type: cc.Label
        },
        ballUILayer: {
            displayName: 'ballUILayer',
            default: null,
            type: cc.Node
        },
        _ballData: null,
        //点击监听
        _canTouch: false,
        _ballPos: null,
        _touchP: null,
        _shootBallCount: null,
        //与地面碰撞
        _ballEndPos: null,
        backBallLayer: {
            displayName: 'backBallLayer',
            default: null,
            type: cc.Node
        },
        _backBallCount: null,

        //底部相关按钮
        bottomLayout: {
            displayName: 'bottomLayout',
            default: null,
            type: cc.Node
        },
        btnBack: {
            displayName: 'btnBack',
            default: null,
            type: cc.Button
        },
        //展示warning
        spWarning: {
            displayName: 'spWarning',
            default: null,
            type: cc.Sprite
        },
        //分数计算
        _killCount: null,
        _sumScore: null,
        _maxScore: null,
        lblTotalScore: {
            displayName: 'lblTotalScore',
            default: null,
            type: cc.Label
        },
        progressBar: {
            displayName: 'progressBar',
            default: null,
            type: cc.ProgressBar
        },
        _starNum: 0,
        spStarArr: [cc.Sprite],
        //射线层
        hintLayer: {
            displayName: 'hintLayer',
            default: null,
            type: cc.Node
        },
        spHintDot: {
            displayName: 'spHintDot',
            default: null,
            type: cc.Sprite
        },
        spDot: {
            displayName: 'spDot',
            default: null,
            type: cc.Sprite
        },
        dotLayout: {
            displayName: 'dotLayout',
            default: null,
            type: cc.Node
        },
        //道具使用
        ballPlusFlag: false,
        blockPlusFlag: false,
        propertyLayout: {
            displayName: 'propertyLayout',
            default: null,
            type: cc.Node
        },
        //uiLayer
        shopPre: {
            displayName: 'shopPre',
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.BallEndPos,
            GameLocalMsg.Msg.CanTouch,
            GameLocalMsg.Msg.End,
            GameLocalMsg.Msg.UpdateScore,
            GameLocalMsg.Msg.PauseRetry,
            GameLocalMsg.Msg.PauseGoMenu,
            GameLocalMsg.Msg.BuyBall
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.BallEndPos) {
            if (this._ballEndPos === null) {
                this._ballEndPos = cc.v2(data.x, this.spBall.node.y);
                //展示返回的节点
                this.spBallTemp.node.active = true;
                this.spBallTemp.node.position = this._ballEndPos;
            }
            this._showBackBall(data);
        } else if (msg === GameLocalMsg.Msg.CanTouch) {
            this._canTouch = true; //TODO可有可无？？
            this._starNum = 1;
            this._updateStar();
        } else if (msg === GameLocalMsg.Msg.End) {
            this._close();
        } else if (msg === GameLocalMsg.Msg.UpdateScore) {
            this._killCount++;
            this._refreshScore();
        } else if (msg === GameLocalMsg.Msg.PauseRetry) { //关闭暂停界面且关闭游戏界面
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
            this._close();
        } else if (msg === GameLocalMsg.Msg.PauseGoMenu) {
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoMenu, null);
            this._close();
        } else if (msg === GameLocalMsg.Msg.BuyBall) { //游戏中收到购买小球消息
            this._showUIBall();
        }
    },
    onLoad() {
        this._initMsg();
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
        //关卡基础数值
        let stageData = GameData.stageData;
        this._data1 = stageData.type.layer1.data;
        this._data2 = stageData.type.layer2.data;
        let len = this._data1.length;
        this._leftRow = len - parseInt(GameCfg.defaultCol);

        //隐藏射线及初始化提示画线
        this.hintLayer.children.forEach(_elem => {
            _elem.active = false;
        });
        for (let i = 0; i < GameCfg.dotCount; ++i) {
            let _dotNode = cc.instantiate(this.spDot.node);
            this.dotLayout.addChild(_dotNode);
        }

        //首次初始化得分
        this._sumScore = 0;
        this.lblTotalScore.string = this._sumScore;
        this._calMaxScore(); //计算最高得分
        this.spStarArr.forEach(_spStar => {
            _spStar.node.active = false;
        });
        //初始化UILayer及基本计数
        this._reset();
        //展示block
        this.blockLayer.destroyAllChildren();
        for (let i = len - parseInt(GameCfg.defaultCol); i < len; ++i) {
            for (let j = 0; j < GameCfg.defaultCol; ++j) {
                let _type = this._data1[i][j];
                let _index = cc.v2(i, j);
                this._showBlock(_type, _index, this.blockLayer, this._leftRow);
            }
        }
        this._showPreview(this._data1);
        this._initTouch();
    },
    _synBallCount() {
        this._ballCount = GameData.ballCount;
    },

    _showBlock(type, index, parentNode, leftRow) { //展示block
        if (type === 0) {
            return;
        }
        let _blockNode = this._blockPool.get();
        if (!_blockNode) {
            _blockNode = cc.instantiate(this.blockPre);
        }
        parentNode.addChild(_blockNode);
        _blockNode.getComponent('Block').initView(type, index, parentNode, this._blockPool, leftRow);
    },

    _showPreview(data) {
        UIMgr.createPrefab(this.previewPre, function (root, ui) {
            this.addNode.addChild(root);
            ui.getComponent('Preview').initView(data, this._blockPool);
        }.bind(this));
    },

    _refreshBallCount() {
        this.lblBallCount.node.active = true;
        this.lblBallCount.string = 'x' + this._ballCount;
    },

    //初始化点击监听
    _initTouch() {
        this._canTouch = false;
        this.ballLayer.on('touchstart', function (event) {
            if (this._canTouch) {
                this._hidePhysics(false); //隐藏block物理
                this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
                this._drawLine(this.spBall.node.position, this._touchP);
            }
        }.bind(this));
        this.ballLayer.on('touchmove', function (event) {
            if (this._canTouch) {
                this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
                this._hidePhysics(false); //隐藏block物理
                this._drawLine(this.spBall.node.position, this._touchP);
            }
        }.bind(this));
        this.ballLayer.on('touchend', function (event) {
            if (this._canTouch) {
                this.hintLayer.children.forEach(_elem => { //隐藏射线提示线
                    _elem.active = false;
                });

                this._hidePhysics(true); //显示block物理
                this.spHintDot.node.active = false;
                this._canTouch = false;
                this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
                this.schedule(this._shootBall, 0.2, this._ballCount - 1, 0);
                this._showBtnBack();
            }
        }.bind(this));
        this.ballLayer.on('touchcancel', function (event) {

        }.bind(this));
    },
    _hidePhysics(flag) {
        this.blockLayer.children.forEach(_elem => {
            if (_elem.getComponent(cc.PhysicsCircleCollider) !== null) {
                _elem.getComponent(cc.PhysicsCircleCollider).enabled = flag;
                return;
            }
            if (_elem.getComponent(cc.PhysicsPolygonCollider) !== null) {
                _elem.getComponent(cc.PhysicsPolygonCollider).enabled = flag;
                return;
            }
        });
    },
    _shootBall() {
        this._hideWaring();
        // let _touchV = this._touchP.sub(this._ballPos).normalizeSelf().mul(GameCfg.ballSpeed);
        let _touchV = cc.pMult(cc.pNormalize(cc.pSub(this._touchP, this._ballPos)), GameCfg.ballSpeed);
        let _ballNode = this._ballPool.get();
        if (!_ballNode) {
            _ballNode = cc.instantiate(this.ballPre);
        }
        this.ballLayer.addChild(_ballNode);
        _ballNode.position = this.spBall.node.position;
        _ballNode.getComponent('Ball').initView(_touchV, this._ballPool);
        this._refreshCurBallCount(); //刷新当前小球数
    },
    _drawLine(p0, p1) {
        // let _touchV = p1.sub(p0).normalize();
        let _touchV = cc.pNormalize(cc.pSub(p1, p0));
        let _radian = _touchV.angle(cc.v2(1, 0));
        if (_radian < 0.14 || _radian > 3) { //限制角度
            return;
        }
        let _V = _touchV.mul(GameCfg.lineLength);
        let _p0 = p0;
        let _p1 = p0.add(_V);
        let _result = this.physicsManager.rayCast(this.ballLayer.convertToWorldSpaceAR(_p0), this.ballLayer.convertToWorldSpaceAR(_p1))[0];
        let _point = _result.point;
        let _normal = _result.normal;
        let _localPoint = this.ballLayer.convertToNodeSpaceAR(_point);
        this._showHint(_localPoint, _normal, p0);
    },
    _showHint(point, normal, basePos) {
        this.dotLayout.active = true;
        this.spHintDot.node.active = true;
        this.spHintDot.node.position = point;
        // let _dirV = point.sub(basePos);
        let _dirV = cc.pSub(point, basePos);
        let _perV = _dirV.div(GameCfg.dotCount * 0.7);
        let _midKey = GameCfg.dotCount * 0.7;
        for (const key in this.dotLayout.children) {
            if (this.dotLayout.children.hasOwnProperty(key)) {
                let _dotNode = this.dotLayout.children[key];
                _dotNode.position = basePos.add(_perV.mul(key));
                if (key > _midKey) {
                    if (normal.y === 0) {
                        _dotNode.x = this.dotLayout.children[_midKey - (key - _midKey)].x;
                    } else if (normal.x === 0) {
                        _dotNode.y = this.dotLayout.children[_midKey - (key - _midKey)].y;
                    }
                }
            }
        }
    },
    _showBackBall(pos) {
        let _backBall = cc.instantiate(this.spBall.node); //cc.instantiate参数必须是node 
        this.backBallLayer.addChild(_backBall);
        _backBall.getChildByName('lblBallCount').active = false;
        _backBall.y = this.spBall.node.y;
        _backBall.x = pos.x;
        if (pos.x === this._ballEndPos.x && pos.y === this._ballEndPos.y) {
            this._refreshBackBallCount();
            return;
        }
        _backBall.runAction(cc.sequence(cc.moveTo(0.1, this._ballEndPos), cc.removeSelf(), cc.callFunc(this._refreshBackBallCount, this)));
    },
    _refreshCurBallCount() {
        this._shootBallCount++;
        this.lblBallCount.string = 'x' + parseInt(this._ballCount - this._shootBallCount);
        if (this._shootBallCount === this._ballCount) {
            this.spBall.node.position = this._ballEndPos;
            this.lblBallCount.node.active = false;
        }
    },
    _refreshBackBallCount() {
        this._backBallCount++;
        this.lblBallCountTemp.string = 'x' + this._backBallCount;
        if (this._backBallCount === this._ballCount) {
            this._reset();
            this._moveBlocks();
        }
    },
    _reset() {
        this._refreshProperty();
        //道具使用后的重置
        if (this.ballPlusFlag) {
            this.ballPlusFlag = false;
            GameData.ballCount = GameData.ballCount - GameCfg.ballPlusCount;
        } else {
            this.ballPlusCount = false;
        }
        if (this.blockPlusFlag) {
            this.blockPlusFlag = false;
            this.blockLayer.children.forEach(_block => {
                if (_block.name === 'plusBlock') {
                    _block.destroy();
                }
            });
        }

        this._killCount = 0; //重置消失数量
        this._hideWaring();
        this._synBallCount();
        this._canTouch = true;
        this._showUIBall();
        this._showBtnBack();
        this._ballEndPos = null;
        this._shootBallCount = 0; //发射出来人小球数
        this._backBallCount = 0; //返回小球数

        // this.hintLayer.children.forEach(_elem => {
        //     _elem.active = false;
        // });
    },
    //展示ball
    _showBall() {
        // this.spBall.node.x = 0;
        if (this._ballEndPos !== null) {
            this.spBall.node.position = this._ballEndPos;
        } else {
            this.spBall.node.y = -this.ballLayer.height + this.spBall.node.height * 0.5;
            this.spBall.node.x = 0;
        }
        this._ballPos = this.spBall.node.position;
        this._refreshBallCount();
    },
    _showUIBall() {
        this._ballData = ShopModule.ball[GameCfg.ballIndex];
        let _path = 'shop/ball/ball_img_' + this._ballData.type + this._ballData.size + '_0_1';
        if (this._ballData.type === 'default') {
            _path = 'shop/ball/ball_img_circle18_1_1';
        }

        UIMgr.changeSpImg(_path, this.spBall);
        UIMgr.changeSpImg(_path, this.spBallTemp);
        this.spBall.node.width = this.spBall.node.height = this._ballData.size;
        this.spBallTemp.node.width = this.spBallTemp.node.height = this._ballData.size;
        this.spBall.node.active = this._canTouch ? true : false;
        this.spBallTemp.node.active = !this.spBall.node.active;
        this._showBall();
    },
    _moveBlocks() { //type:11,12,13,16,17,20的block不移动
        let _h = this.blockLayer.width / GameCfg.defaultCol;
        let _moveAct = cc.moveBy(0.2, cc.p(0, -_h));
        let _blockArr = this.blockLayer.children;
        let _indexMap = [];
        _blockArr.forEach(_elem => {
            if (_elem.getComponent('Block').isUsed === true) {
                _elem.getComponent('Block').isUsed = false;
                // this._blockPool.put(_elem);
                _elem.destroy(); //必须用这个。因为nodepool要求提取和放回的node不能有任何后期的处理
            } else {
                let _tempIndex = _elem.getComponent('Block')._index;
                _indexMap.push(_tempIndex);
            }
        });
        let _len = this.blockLayer.childrenCount;
        for (let i = _len - 1; i >= 0; --i) {
            let _lastBlock = this.blockLayer.children[i];
            let _script = _lastBlock.getComponent('Block');
            let _type = _script._type;
            let _index = _script._index;
            let _newIndex = _index.add(cc.v2(1, 0));
            if ([11, 12, 13, 16, 17, 20].indexOf(_type) === -1) {
                if (!this._canInclude(_newIndex, _indexMap)) {
                    _script._index.x++; //TODO ???
                    _lastBlock.runAction(_moveAct.clone());
                }
            } else if (_type === 12 || _type === 13 || _type === 16 || _type === 17) {
                let _isOpen = _script._isOpen
                _script._isOpen = !_isOpen;
                _script.playAct();
            }
        }
        //显示一行剩余的blocks
        if (this._leftRow > 0) {
            this._leftRow--;
            let _data1 = this._data1[this._leftRow];
            // let _data2 = this._data2[this._leftRow];
            for (let j = 0; j < GameCfg.defaultCol; ++j) {
                let _type = _data1[j];
                let _index = cc.v2(this._leftRow, j);
                this._showBlock(_type, _index, this.blockLayer, this._leftRow);
            }
        }
        // this._refreshEnd();
        this.scheduleOnce(this._refreshEnd, 0.5);
    },
    _canInclude(item, arr) {
        return arr.some((value) => {
            return value.x === item.x && value.y === item.y;
        });
    },
    _showBtnBack() { //刷新小球快速返回按钮
        this.bottomLayout.active = this._canTouch ? true : false;
        this.btnBack.node.active = !this.bottomLayout.active;
    },
    onBtnClickToBallBack() {
        this._canTouch = true;
        this._showBtnBack();
        this.unschedule(this._shootBall, this);
        if (this._ballEndPos === null) {
            this._ballEndPos = this.spBall.node.position;
        }
        this.ballLayer.children.forEach(_elem => {
            _elem.removeComponent(cc.PhysicsCircleCollider);
            _elem.removeComponent(cc.RigidBody);
            _elem.runAction(cc.sequence(cc.moveTo(0.1, this._ballEndPos), cc.callFunc(() => {
                _elem.destroy();
            })));
        });
        this.scheduleOnce(() => {
            this._reset();
            this._moveBlocks();
        }, 0.5);
    },

    _refreshEnd() {
        let _count = this.blockLayer.childrenCount;
        let _leftCount = 0;
        let _arr = [1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17];

        for (let i = _count - 1; i >= 0; --i) {
            let _block = this.blockLayer.children[i];
            let _script = _block.getComponent('Block');
            let _type = _script._type;
            if (_arr.indexOf(_type) !== -1) {
                _leftCount++;
                if (this._checkWaring(_block)) {
                    break;
                }
            }
        }
        if (_count === 0 || _leftCount <= 0) {
            //展示结束界面
            this._showEnd(true);
        }
    },
    _checkWaring(block) {
        let _blockH = this.blockLayer.width / GameCfg.defaultCol;
        let _layerH = this.blockLayer.height;
        let _distance = Math.abs(_layerH + block.y);
        if (_distance <= _blockH * 0.5) {
            this._showEnd(false);
            return true;
        }
        if (_distance > _blockH * 0.5 && _distance < _blockH * 1.5) {
            this._showWarning();
            return true;
        }
    },
    _showWarning() {
        let fadeInAct = cc.fadeIn(1);
        let fadeOutAct = cc.fadeOut(1);
        this.spWarning.node.active = true;
        this.spWarning.node.runAction(cc.repeatForever(cc.sequence(fadeInAct, fadeOutAct)));
    },
    _hideWaring() {
        this.spWarning.node.stopAllActions();
        this.spWarning.node.active = false;
    },
    _showEnd(flag) { //flag:true胜利，false失败
        let _data = {
            status: flag,
            stage: GameCfg.getCurStage(),
            starNum: this._starNum
        };
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.End, _data);
    },
    _close() {
        this._ballPool.clear();
        this._blockPool.clear();
        UIMgr.destroyUI(this);
    },
    //计算关卡最高分
    _calMaxScore() {
        let _arr = [1, 2, 3, 4, 5, 6, 9];
        let _len = 0;
        let _len1 = this._data1.length;
        let _len2 = this._data2.length;
        for (let i = 0; i < _len1; ++i) {
            for (let j = 0; j < _len2; ++j) {
                if (_arr.indexOf(this._data1[i][j]) !== -1) {
                    _len++;
                }
            }
        }
        for (let k = 0; k < _len; ++k) {
            this._maxScore += (k + 1) * GameCfg.baseScore;
        }
    },
    //刷新得分
    _refreshScore() {
        this._sumScore += this._killCount * GameCfg.baseScore;
        this.lblTotalScore.string = this._sumScore;
        this._updateProgressBar();
    },
    _updateProgressBar() {
        this.progressBar.progress = parseFloat(this._sumScore / this._maxScore).toFixed(1);
        if (this.progressBar.progress >= 0.7 && this.progressBar.progress < 1.0) {
            this._starNum = 2;
        } else if (this.progressBar.progress >= 1.0) {
            this._starNum = 3;
        }
        this._updateStar();
    },
    _updateStar() {
        let len = this.spStarArr.length;
        for (let i = 0; i < len; ++i) {
            if (i === this._starNum - 1) {
                this.spStarArr[i].node.active = true;
            }
        }
    },

    //暂停界面
    onBtnClickToPause() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.Pause, null);
    },

    onBtnClickToItem(e) {
        this._useProperty(parseInt(e.target.name.split('btnItem')[1]));
        switch (e.target.name) {
            case 'btnItem0':
                this.blockLayer.children.forEach(_elem => {
                    let _type = _elem.getComponent('Block')._type;
                    let _hp = _elem.getComponent('Block')._hp;
                    if ([1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17].indexOf(_type) !== -1) {
                        _elem.getComponent('Block')._hp = Math.floor(_hp * 0.5);
                        _elem.getComponent('Block').refreshHp();
                    }
                });
                this.scheduleOnce(this._refreshEnd, 0.5);
                break;
            case 'btnItem1':
                this.ballPlusFlag = true;
                GameData.ballCount = GameData.ballCount + GameCfg.ballPlusCount;
                this._synBallCount();
                this._refreshBallCount();
                break;
            case 'btnItem2':
                let _arr = [];
                this.blockLayer.children.forEach(_block => {
                    let _type = _block.getComponent('Block')._type;
                    if ([1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17].indexOf(_type) !== -1) {
                        _arr.push(_block.getLocalZOrder());
                    }
                });
                let _max = Math.max(..._arr);
                this.blockLayer.children.forEach(_block => {
                    let _type = _block.getComponent('Block')._type;
                    if (_block.getLocalZOrder() === _max && [1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17].indexOf(_type) !== -1) {
                        _block.destroy();
                    }
                });
                this.scheduleOnce(this._refreshEnd, 0.5);
                break;
            case 'btnItem3':
                let _xArr = [];
                let _indexMap = [];
                // let _count = 0;
                this.blockLayer.children.forEach(_block => {
                    let _type = _block.getComponent('Block')._type;
                    let _index = _block.getComponent('Block')._index
                    if ([1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17].indexOf(_type) !== -1) {
                        _xArr.push(_index.x);
                        _indexMap.push(_index);
                    }
                });
                let _xMax = Math.max(..._xArr);
                let _xMin = Math.min(..._xArr);
                for (let i = 0; i < 4; ++i) {
                    let _type = 0;
                    if (i < 2) {
                        _type = 8;
                    } else {
                        _type = 7;
                    }
                    this._showUniqueBlock(_xMin, _xMax, _indexMap, _type);
                }
                break;
            case 'btnItem4':
                this.blockPlusFlag = true;
                for (let j = 6; j < 11; ++j) {
                    let _type = 20;
                    let _blockNode = this._blockPool.get();
                    if (!_blockNode) {
                        _blockNode = cc.instantiate(this.blockPre);
                    }
                    this.blockLayer.addChild(_blockNode);
                    _blockNode.getComponent('Block').initView(_type, cc.v2(0, j), this.blockLayer, this._blockPool, 0);
                    _blockNode.y = -this.blockLayer.height + _blockNode.height * 0.5;
                    _blockNode.name = 'plusBlock';
                }
                break;
        }
    },
    _showUniqueBlock(min, max, arr, type) { //道具4的功能：空位上生成道具
        let _r = Math.floor(cc.random0To1() * max) + min;
        let _c = Math.floor(cc.random0To1() * GameCfg.defaultCol);
        let _index = cc.v2(_r, _c);
        if (!this._canInclude(_index, arr)) {
            this._showBlock(type, _index, this.blockLayer, 0);
        } else {
            this._showUniqueBlock(min, max, arr, type);
        }
    },

    onBtnClickToShop() { //0:ruby,1:ball,2:gift
        let _i = 1;
        UIMgr.createPrefab(this.shopPre, function (root, ui) {
            this.addNode.addChild(root);
            ui.getComponent('Shop').initView(_i);
        }.bind(this));
    },

    //刷新底部道具列表
    _refreshProperty() {
        let _btnArr = this.propertyLayout.getComponentsInChildren(cc.Button);
        for (const _key in _btnArr) {
            if (_btnArr.hasOwnProperty(_key)) {
                let _elem = GameModule.property[_key];
                _btnArr[_key].node.getChildByName('layout').getComponentInChildren(cc.Label).string = _elem.price;
                _btnArr[_key].node.getChildByName('layout').active = _elem.num <= 0 ? true : false;
                _btnArr[_key].node.getChildByName('lblProperty').active = !_btnArr[_key].node.getChildByName('layout').active;
                _btnArr[_key].node.getChildByName('lblProperty').getComponent(cc.Label).string = 'x' + _elem.num;
                // if (GameModule.property[_key].num > 0 || GameModule.property[_key].price <= GameCfg.totalRuby) {
                //     _btnArr[_key].interactable = true;
                // } else {
                //     _btnArr[_key].interactable = false;
                // }
                _btnArr[_key].interactable = GameModule.property[_key].num > 0 || GameModule.property[_key].price <= GameCfg.totalRuby

            }
        }
    },
    _useProperty(i) {
        if (GameModule.property[i].num > 0) {
            GameModule.property[i].num--;
            GameCfg.savePropertyData();
        } else {
            if (GameCfg.totalRuby > GameModule.property[i].price) {
                GameCfg.totalRuby -= GameModule.property[i].price
                GameCfg.saveTotalRuby(GameCfg.totalRuby);
                ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshRuby, null);
            }
        }
        this._refreshProperty();
    }
});