module.exports = {
    _bgMusic: null,
    _guideMusic: null,
    //播放按钮声音
    playButtonSound() {
        cc.loader.loadRes('sound/btn', cc.AudioClip, function (err, clip) {
            cc.audioEngine.play(clip);
        });
    },

    //播放撞击声音
    playHitSound() {
        cc.loader.loadRes('sound/hit', cc.AudioClip, function (err, clip) {
            cc.audioEngine.play(clip);
        });
    },

    //播放胜利声音
    playWinSound() {
        cc.loader.loadRes('sound/win', cc.AudioClip, function (err, clip) {
            cc.audioEngine.play(clip);
        });
    },
    //播放失败声音
    playFailSound() {
        cc.loader.loadRes('sound/fail', cc.AudioClip, function (err, clip) {
            cc.audioEngine.play(clip);
        });
    },
    //播放背景音乐
    playMainMusic() {
        cc.loader.loadRes('sound/bg', cc.AudioClip, function (err, clip) {
            this._bgMusic = cc.audioEngine.play(clip, true);
        }.bind(this));
    },

    //停止当前正在播放的背景音乐
    stopCurrentBackgroundMusic() {
        if (this._bgMusic !== null) {
            cc.audioEngine.stop(this._bgMusic); //TODO cc.audioEngine.stopMusic();???
            this._bgMusic = null;
        }
    },

    //播放音效
    playEffectMusic(path, isLoop) {
        if (typeof (isLoop) === 'undefined') {
            isLoop = false;
        }
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            cc.audioEngine.playEffect(clip, isLoop);
        });
    }
};