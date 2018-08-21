let ObserverMgr = require('ObserverMgr');
let AudioMgr = require('AudioMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        spBall: {
            displayName: 'spBall',
            default: null,
            type: cc.Sprite
        },
        _pool: null,
        _hitGround: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._hitGround = 0;
    },

    start() {

    },

    // update (dt) {},
    initView(V, pool) { //v代表速度向量
        this._pool = pool;
        let _phyBody = this.node.getComponent(cc.RigidBody);
        let _vel = _phyBody.linearVelocity;
        _vel = V;
        _phyBody.linearVelocity = _vel;
        // this.node.getComponent(cc.RigidBody).enabledContactListener = true;
    },

    onBeginContact(contact, self, other) { //tag:block-1, ground-2,wall-3

        switch (other.tag) {
            case 1:
                AudioMgr.playHitSound();
                other.node.getComponent('Block').hit();
                if (other.node.getComponent('Block')._type === 24) {
                    let _v = self.node.getComponent(cc.RigidBody).linearVelocity;
                    let _radianArr = [0, -Math.PI / 6, Math.PI / 6];
                    let _randIndex = Math.floor(cc.rand() % 3);
                    _v.rotateSelf(_radianArr[_randIndex]);
                    self.node.getComponent(cc.RigidBody).linearVelocity = _v;
                }
                break;
            case 2:
                this._hitGround++;
                if (this._hitGround >= 2) {
                    AudioMgr.playHitSound();
                    let pos = this.node.position;
                    this._pool.put(this.node);
                    this._hitGround = 0;
                    ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BallEndPos, pos);
                }
                break;
        }

    }
});