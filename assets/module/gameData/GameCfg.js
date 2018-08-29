let ShopModule = require('ShopModule');
let GameModule = require('GameModule');
module.exports = {
    width: null,
    heigth: null,
    curStage: 1, //当前关卡
    stageCfg: null, //所有关卡配置,
    defaultCol: 11, //关卡列数,
    ballSpeed: 2000, //小球速度,
    baseScore: 10, //基础分数,
    lineLength: 1500, //提示线长度
    dotCount: 20, //提示点数量,
    ballPlusCount: 30, //道具增加小球数量
    //道具及成绩相关数据
    totalStar: 0,
    totalRuby: 1500,
    ballIndex: 8,
    ballData: null,

    init() {
        this.width = cc.view.getVisibleSize().width;
        this.heigth = cc.view.getVisibleSize().height;
        let _curStage = cc.sys.localStorage.getItem('CurStage');
        if (_curStage === undefined || _curStage === null) {
            _curStage = 1;
            this.saveCurStage(_curStage);
        }
        this.getTotalStar(); //初始化totalStar
        this.getTotalRuby(); //初始化totalRuby
        this.initShopData(); //初始化小球商店数据及索引
        this.initPropertyData(); //初始化道具数据
    },
    saveCurStage(value) {
        cc.sys.localStorage.setItem('CurStage', value);
    },
    getCurStage() {
        return cc.sys.localStorage.getItem('CurStage');
    },
    getStageCfg() {
        return JSON.parse(cc.sys.localStorage.getItem('StageCfg'));
    },
    saveStageCfg(obj) {
        cc.sys.localStorage.setItem('StageCfg', JSON.stringify(obj));
    },
    getTotalStar() {
        let _star = 0;
        let _stageData = this.getStageCfg();
        for (const _key in _stageData) {
            if (_stageData.hasOwnProperty(_key)) {
                const _elem = _stageData[_key];
                _star += _elem[1];
            }
        }
        this.totalStar = _star;
        return _star;
    },
    getTotalRuby() {
        let _ruby = cc.sys.localStorage.getItem('TotalRuby');
        if (_ruby === null || _ruby === undefined) {
            _ruby = 1000;
        }
        this.totalRuby = _ruby;
        this.saveTotalRuby(this.totalRuby);
        return this.totalRuby;
    },
    saveTotalRuby(value) {
        cc.sys.localStorage.setItem('TotalRuby', value);
    },
    initShopData() {
        let _shopData = JSON.parse(cc.sys.localStorage.getItem('ShopData'));
        if (_shopData !== null || _shopData !== undefined) {
            ShopModule = _shopData;
        }
        let _ballIndex = cc.sys.localStorage.getItem('BallIndex');
        if (_ballIndex === null || _ballIndex === undefined) {
            _ballIndex = 8;
        }
        this.ballIndex = _ballIndex;
        this.saveShopData();
    },
    saveShopData() {
        cc.sys.localStorage.setItem('ShopData', JSON.stringify(ShopModule));
        cc.sys.localStorage.setItem('BallIndex', this.ballIndex);
    },
    initPropertyData() {
        let _propertyData = JSON.parse(cc.sys.localStorage.getItem('PropertyData'));
        if (_propertyData !== null || _propertyData !== undefined) {
            GameModule = _propertyData;
        }
        this.savePropertyData();
    },
    savePropertyData() {
        cc.sys.localStorage.setItem('PropertyData', JSON.stringify(GameModule));
    }
}