let AudioMgr = require('AudioMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        clickSound: {
            displayName: 'clickSound',
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('touchstart', function () {
            if (this.clickSound) {
                cc.audioEngine.playEffect(this.clickSound, false);
            } else {
                AudioMgr.playButtonSound();
            }
        });
    },

    start() {

    },

    // update (dt) {},
});