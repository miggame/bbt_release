let GameData = require('GameData');
let Observer = require('Observer');
let UIMgr = require('UIMgr');
let GameCfg = require('GameCfg');

cc.Class({
    extends: Observer,

    properties: {
        _stageNodePool: null,
        stagePre: {
            displayName: 'stagePre',
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            displayName: 'scrollView',
            default: null,
            type: cc.ScrollView
        },
        lblRuby: {
            displayName: 'lblRuby',
            default: null,
            type: cc.Label
        },
        lblTime: {
            displayName: 'lblTime',
            default: null,
            type: cc.Label
        },
        lblStar: {
            displayName: 'lblStar',
            default: null,
            type: cc.Label
        },
        _preloadedInterstitial: null,

        //截图
        // sprite: {
        //     displayName: 'sprite',
        //     default: null,
        //     type: cc.Sprite
        // },

        addNode: {
            displayName: 'addNode',
            default: null,
            type: cc.Node
        },
        shopPre: {
            displayName: 'shopPre',
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.GoGame
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.GoGame) {
            this._close();
        }
    },
    onLoad() {
        this._initMsg();
        //创建节点池
        let len = 30
        this._stageNodePool = new cc.NodePool('Stage');
        for (let i = 0; i < len; ++i) {
            let _tempNode = cc.instantiate(this.stagePre);
            this._stageNodePool.put(_tempNode);
        }
    },

    start() {

    },

    // update (dt) {},
    initView() {
        this.scrollView.content.destroyAllChildren();
        let len = GameData.mapdata.length;
        for (let i = 0; i < len; ++i) {
            let _stageNode = this._stageNodePool.get();
            if (!_stageNode) {
                _stageNode = cc.instantiate(this.stagePre);
            }
            this.scrollView.content.addChild(_stageNode);
            _stageNode.getComponent('Stage').initView(i + 1);
        }
        this.lblStar.string = GameCfg.totalStar;
        this.lblRuby.string = GameCfg.totalRuby;

        // if (typeof FBInstant === 'undefined') return;
        // console.log('FBInstant.player.getName(): ', FBInstant.player.getName());

        // this._preloadedInterstitial = null;

        // FBInstant.getInterstitialAdAsync(
        //     '516008902181730_516903352092285', // Your Ad Placement Id
        // ).then(function (interstitial) {
        //     // Load the Ad asynchronously
        //     this._preloadedInterstitial = interstitial;
        //     return this._preloadedInterstitial.loadAsync();
        // }.bind(this)).then(function () {
        //     console.log('Interstitial preloaded')
        // }).catch(function (err) {
        //     console.error('Interstitial failed to preload: ' + err.message);
        // });
    },
    _close() {
        UIMgr.destroyUI(this);
    },
    // 分享功能
    onBtnClickToShareGame() {
        console.log('share>>>: ');
        console.log('cc.find("canvas"): ', cc.find('canvas'));
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: this.getImgBase64(),
            text: 'X is asking for your help!',
            data: {
                myReplayData: '...'
            },
        }).then(() => {
            // continue with the game.
            console.log('well done: ');
        });
        // this.captureScreenshot();
    },

    // 截屏返回 iamge base6，用于 Share
    getImgBase64() {
        // let sp = cc.find('Canvas/New Sprite(Splash)').getComponent(cc.Sprite);

        let target = cc.find('Canvas');
        // let width = cc.view.getVisibleSize().width,
        //     height = cc.view.getVisibleSize().height;
        // let width = cc.director.getWinSize().width;
        // let height = cc.director.getWinSize().height;
        let width = 1080;
        let height = 1920;
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        let canvas = document.createElement('canvas');

        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        return canvas.toDataURL('image/png');
    },

    onBtnClickToShowAd() {
        console.log('showAd: ');
        this._preloadedInterstitial.showAsync()
            .then(function () {
                // Perform post-ad success operation
                console.log('Interstitial ad finished successfully');
            })
            .catch(function (e) {
                console.error(e.message);
            });
    },

    captureScreenshot() {
        function callback() {
            var canvas = document.getElementById("GameCanvas");
            var base64 = canvas.toDataURL("image/png");
            cc.director.off(cc.Director.EVENT_AFTER_DRAW);
            var frame = this.base64ToSpriteFrame(base64, (frame) => {
                this.sprite.spriteFrame = frame;
            });
        }
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, callback.bind(this));
    },

    base64ToSpriteFrame(base64, callback) {
        var img = new Image();
        img.src = base64;
        img.onload = function () {
            var texture = new cc.Texture2D();
            texture.initWithElement(img);
            texture.handleLoadedTexture();
            var newframe = new cc.SpriteFrame(texture);
            if (callback) callback(newframe);
        }
    },

    onBtnClickToShop() {
        UIMgr.createPrefab(this.shopPre, function (root, ui) {
            this.addNode.addChild(root);
            ui.getComponent('Shop').initView(i);
        }.bind(this));
    }
});