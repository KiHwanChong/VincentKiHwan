game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // play the audio track
//        me.audio.playTrack("play-bgm");

        // reset the score
        game.data.score = 0;
        me.levelDirector.loadLevel("level01");
        this.resetPlayer(10, 0);

        //pull the managers...
        var gameTimerManager = me.pool.pull("GameTimerManager", 0, 0, {});
        me.game.world.addChild(gameTimerManager, 0);

        var heroDeathManager = me.pool.pull("heroDeathManager", 0, 0, {});
        me.game.world.addChild(heroDeathManager, 0);

        var experienceManager = me.pool.pull("ExperienceManager", 0, 0, {});
        me.game.world.addChild(experienceManager, 0);
                
        var spendGold = me.pool.pull("SpendGold", 0, 0, {});
        me.game.world.addChild(spendGold, 0);

//        var pause = me.pool.pull("pause", 0, 0, {});
//        me.game.world.addChild(pause, 0);
       
        //setting up input keys for right, left, and jump
        me.input.bindKey(me.input.KEY.B, "buy");
        me.input.bindKey(me.input.KEY.Q, "skill1");
        me.input.bindKey(me.input.KEY.W, "skill2");
        me.input.bindKey(me.input.KEY.E, "skill3");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.UP, "jump");
        me.input.bindKey(me.input.KEY.A, "attack");
        me.input.bindKey(me.input.KEY.P, "pause");

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
        // stop the current audio track
        me.audio.stopTrack();
    },
    resetPlayer: function(x, y) {
        //as the game plays, add player on the screen
        game.data.player = me.pool.pull("player", x, y, {});
        me.game.world.addChild(game.data.player, 7);
    }

});
