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
        cc.log('2');
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
    _initPhysics() {

    }
});