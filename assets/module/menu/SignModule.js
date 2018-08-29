module.exports = {
    signData: null,
    reward: {
        day0: {
            isChecked: false
        },
        day1: {
            isChecked: false
        },
        day2: {
            isChecked: false
        },
        day3: {
            isChecked: false
        },
        day4: {
            isChecked: false
        },
        day5: {
            isChecked: false
        },
        day6: {
            isChecked: false
        },
    },

    initSignData() {
        this.signData = JSON.parse(cc.sys.localStorage.getItem('Sign'));
        if (this.signData === null || this.signData === undefined) {
            this.signData = {
                isSigned: false,
                videoSigned: false,
                time: new Date(),
                reward: this.reward
            };
        }
        let _curTime = new Date();
        let _lastTime = new Date(this.signData.time);
        _lastTime.setHours(23, 59, 59);

        if (_curTime.getTime() > _lastTime.getTime()) {
            this.signData.time = _curTime;
            this.signData.isSigned = false;
            this.saveSignData(this.signData);
        }
        return this.signData;
    },
    saveSignData(data) {
        cc.sys.localStorage.setItem('Sign', JSON.stringify(data));
    }
};