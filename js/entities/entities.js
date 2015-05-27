game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.level1 = true;
        this.level2 = false;
        if(this.level1 === true) {
            this.setSuper(x, y);
        }
        else if(this.level2 === true) {
            
            this.setSuper2(x, y);
        }
        this.setPlayerTimers();
        this.setAttribute();
        this.type = "PlayerEntity";

        this.setFlags();
        //fixing the camera on the player
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.addAnimation();

        this.renderable.setCurrentAnimation("idle");
    },
    setSuper: function(x, y) {
        //loading player with 64*64 size
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

    },
    setSuper2: function(x, y) {
        //loading player with 64*64 size
        this._super(me.Entity, 'init', [x, y, {
                image: "playerX",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

    },
    setPlayerTimers: function() {
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastSpear = this.now;
        this.lastEat = this.now;
        this.lastSpeed = this.now;
        this.lastAttack = new Date().getTime(); //haven't used this

    },
    setAttribute: function() {
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;

    },
    setFlags: function() {
        this.facing = "right";
        //Keeps track of which direction your character is going
        this.dead = false;
        this.attacking = false;
        this.superfast = false;
    },
    addAnimation: function() {
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

    },
    update: function(delta) {
        console.log(this.level2);
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();
        this.checkAbilityKeys();
        this.setAnimation();
        if ((this.now - this.lastSpeed) >= 2000 && this.superfast) {
            this.superfast = false;
            this.body.setVelocity(game.data.playerMoveSpeed, 20);
        }
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    checkIfDead: function() {
        if (this.health <= 0) {
            return true;
        }
    },
    checkKeyPressesAndMove: function() {

        if (me.input.isKeyPressed("right")) {
            //adds to the position of my x by adding the velocity defined above in
            //setVelocity() and multiplying it by me.timer tick.
            //me.timer.tick makes the movements look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);

        } else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
            this.flipX(false);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }
        else {
            this.body.vel.x = 0;
        }
        //enables mario to jump
        if (me.input.isKeyPressed("jump")) {
            if (!this.body.jumping && !this.body.falling) {
                this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                this.body.jumping = true;
                // play some audio
                me.audio.play("jump-sound");
            }
        }
        
            
            
        

    },
    checkAbilityKeys: function() {
        if (me.input.isKeyPressed("skill1")) {
            this.speedBurst();
        } else if (me.input.isKeyPressed("skill3")) {
            this.throwSpear();
        }
    },
    speedBurst: function() {
        if ((this.now - this.lastSpeed) >= (game.data.spearTimer * 100) && game.data.ability1 > 0 && !this.superfast) {
            this.superfast = true;
            this.lastSpeed = this.now;
            this.body.setVelocity(12, 20);
        }
    },
    eatCreep: function(response) {
        if ((this.now - this.lastEat) >= (game.data.spearTimer * 10) && game.data.ability2 > 0) {
            this.lastEat = this.now;
            if (me.input.isKeyPressed("skill2")) {
                response.b.loseHealth(20);
                this.health = this.health + 3;
            }

        }

    },
    throwSpear: function() {
        if ((this.now - this.lastSpear) >= (game.data.spearTimer * 50) && game.data.ability3 > 0) {
            this.lastSpear = this.now;
            var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(spear, 10);
        }

    },
    setAnimation: function() {
        if (this.attacking) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                //Sets the current animation to attack and once that is over
                //goes back to the idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //makes it so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another animation
                this.renderable.setAnimationFrame();
            }
        }

        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }

    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
        console.log(this.health);
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            this.collideWithEnemyBase(response);
        } else if (response.b.type === 'Monster1') {
            this.collideWithEnemyCreep(response);
        } else if (response.b.type === 'Armor1') {
            //checking if the player collides with creep, enabling the player to eat the creep
            this.collideWithArmor1(response);
        }
    },
    
    collideWithArmor1: function(response){
        
        this.level2 = true;
        me.game.world.removeChild(response.b);
        
    },
    
    collideWithEnemyBase: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;

        //standing on the enemy base
        if (ydif < -40 && xdif < 70 && xdif > -35) {
            this.body.falling = false;
            this.body.vel.y = -1;
        }
        //can't go through the base in either way
        else if (xdif > -35 && this.facing === 'right' && (xdif < 0)) {
            this.body.vel.x = 0;

        } else if (xdif < 70 && this.facing === 'left' && (xdif > 0)) {
            this.body.vel.x = 0;
        }
        //timer will prevent the player from attacking infinitely
        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer)
        {
            this.lastHit = this.now;
            response.b.loseHealth(game.data.playerAttack);
        }
    },
    collideWithEnemyCreep: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;
        //the player stops when collided by enemy creep
        this.stopMovement(xdif);

        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);

        }
        ;
    },
    collideWithEnemyEntity: function(response) {
        //same thing with the enemy creep
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;

        this.stopMovement(xdif);

        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);

        }
        ;


    },
    stopMovement: function(xdif) {
        if (xdif > 0) {
            if (this.facing === "left") {
                this.body.vel.x = 0;
            }
        } else {
            if (this.facing === "right") {
                this.body.vel.x = 0;
            }
        }
    },
    checkAttack: function(xdif, ydif) {
        //set timer for not attacking infinitely
        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer
                && (Math.abs(ydif) <= 40) &&
                (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                ) {
            this.lastHit = this.now;
            //if the creeps health is less thtan our attack, execute code in if statment is true
            return true;
        }
        return false;
    },
    hitCreep: function(response) {
        if (response.b.health <= game.data.playerAttack) {
            //adds one gold for a creep kill
            game.data.gold += 1;
            console.log("Current gold: " + game.data.gold);
        }
        response.b.loseHealth(game.data.playerAttack);
    }
});

game.Armor1 = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "armor1",
                spritewidth: "72",
                spriteheight: "47",
                width: 72,
                height: 47,
                getShape: function() {
                    return (new me.Rect(0, 0, 72, 47)).toPolygon();
                }
            }]);

        me.collision.check(this);
        this.type = "armor1";
    }

});