module.exports = {
    curStage: 1, //当前关卡
    stageCfg: null, //所有关卡配置
    init() {
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
            cc.log(this.stageCfg['stage' + index]);
            cc.log(this.stageCfg['stage' + index].star);
            this.stageCfg['stage' + index].star = 0;
            this.saveStageCfg();
            return this.stageCfg['stage' + index].star;
        } else {
            return this.stageCfg['stage' + index].star;
        }
    },
}