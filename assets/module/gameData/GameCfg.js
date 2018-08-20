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
        this.curStage = cc.sys.localStorage.getItem('CurStage');
        if (this.curStagestage === undefined || this.curStage === null) {
            this.curStage = 1;
            this.saveCurStage();
        }
    },
    saveCurStage() {
        cc.sys.localStorage.setItem('CurStage', this.curStage);
    },
    getCurStage() {
        return this.curStage;
    },
    getStageCfg() {
        return JSON.parse(cc.sys.localStorage.getItem('StageCfg'));
    },
    saveStageCfg(obj) {
        cc.sys.localStorage.setItem('StageCfg', JSON.stringify(obj));
    },
}