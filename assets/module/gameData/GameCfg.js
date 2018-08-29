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
        let _ruby = this.totalRuby;
        return _ruby;
    }
}