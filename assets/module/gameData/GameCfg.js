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
        this.stageCfg = JSON.parse(cc.sys.localStorage.getItem('StageCfg'));
        if (this.stageCfg === undefined || this.stageCfg === null) {
            this.stageCfg = new Object();
            this.saveStageCfg();
        }
    },
    saveCurStage() {
        cc.sys.localStorage.setItem('CurStage', this.curStage);
    },
    getCurStage() {
        return this.curStage;
    },
    getStageCfg() {
        return this.stageCfg;
    },
    saveStageCfg() {
        cc.sys.localStorage.setItem('StageCfg', JSON.stringify(this.stageCfg));
    },
    getStageCfgOfStar(index) {
        if (this.stageCfg['stage' + index] === undefined) {
            this.stageCfg['stage' + index] = new Object();
            if (this.stageCfg['stage' + index].star === undefined) {
                this.stageCfg['stage' + index].star = new Object();
            }
            this.stageCfg['stage' + index].star = 0;
            this.saveStageCfg();
            return this.stageCfg['stage' + index].star;
        } else {
            return this.stageCfg['stage' + index].star;
        }
    },
}