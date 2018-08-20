module.exports = {
    width: null,
    heigth: null,
    curStage: 1, //当前关卡
    stageCfg: null, //所有关卡配置,
    defaultCol: 11, //关卡列数,
    ballSpeed: 1500, //小球速度,
    baseScore: 10, //基础分数
    init() {
        this.width = cc.view.getVisibleSize().width;
        this.heigth = cc.view.getVisibleSize().height;
        let _curStage = cc.sys.localStorage.getItem('CurStage');
        if (_curStage === undefined || _curStage === null) {
            _curStage = 1;
            this.saveCurStage(_curStage);
        }
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
}