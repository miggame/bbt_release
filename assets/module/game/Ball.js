let ObserverMgr = require('ObserverMgr');
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
        let vel = _phyBody.linearVelocity;
        vel = V;
        _phyBody.linearVelocity = vel;
    },

    onBeginContact(contact, self, other) { //tag:block-1, ground-2,wall-3
        switch (other.tag) {
            case 1:
                other.node.getComponent('Block').hit();
                break;
            case 2:
                this._hitGround++;
                if (this._hitGround >= 2) {
                    let pos = this.node.position;
                    this._pool.put(this.node);
                    this._hitGround = 0;
                    ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BallEndPos, pos);
                }
                break;
        }

    }
});