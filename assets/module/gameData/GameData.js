module.exports = {
    gamedata_savelv: null,
    mapdata: null,
    stageData: null,
    init() {
        this.gamedata_savelv = null;
        this.mapdata = null;
        this.stageData = null;
    },

    initStageData(index) {
        let key = parseInt(index - 1);
        this.stageData = this.mapdata[key].json;
    }
};