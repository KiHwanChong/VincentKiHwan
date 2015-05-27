//drawing monster
game.Monster1 = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "monster1",
                spritewidth: "100",
                spriteheight: "85",
                width: 100,
                height: 85,
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 85)).toPolygon();
                }
            }]);
        this.health = 10;
//making monster walk from starX to endX
        this.spritewidth = 100;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width - this.spritewidth;
        this.updateBounds();

        this.alwaysUpdate = true;

        this.walkLeft = false;
        this.alive = true;
        this.type = "monster1";
//animation for skeleton
        this.renderable.addAnimation("run", [0, 1, 2], 80);
        this.renderable.setCurrentAnimation("run");

        this.body.setVelocity(3, 6);
    },
    //enabling skeleton to move left and right
    update: function(delta) {
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        } else {
            me.game.world.removeChild(this);
        }

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function() {

    }

});

