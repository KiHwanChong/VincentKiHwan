game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
            me.game.world.addChild( new me.Sprite (0, 0, me.loader.getImage('title-screen')), -10); 
            
                game.data.win = "";
            
            game.data.option1 = new (me.Renderable.extend({
                init: function(){
                    this._super(me.Renderable, 'init', [270, 240, 300, 50])
                    this.font = new me.Font("Arial", 46, "white");
                    me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                },
                //drawing text and adjusting its position with width and height
                draw: function(renderer){
                    this.font.draw(renderer.getContext(), "START A NEW GAME", this.pos.x, this.pos.y);
                },
                
                update: function(dt){
                    return true;
                },
                
                newGame: function(){
                    me.input.releasePointerEvent('pointerdown', this);
                    me.input.releasePointerEvent('pointerdown', game.data.option2);
                    me.save.remove('exp');
                    me.save.remove('exp1');
                    me.save.remove('exp2');
                    me.save.remove('exp3');
                    me.save.remove('exp4');
                    me.save.add({exp:0, exp1: 0, exp2: 0, exp3: 0, exp4: 0})
                    me.state.change(me.state.NEW);
                    
                }
                
            }));
            
            me.game.world.addChild(game.data.option1);
            
            game.data.option2 = new (me.Renderable.extend({
                init: function(){
                    this._super(me.Renderable, 'init', [380, 340, 250, 50])
                    this.font = new me.Font("Arial", 46, "white");
                    me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                },
                //drawing text and adjusting its position with width and height
                draw: function(renderer){
                    this.font.draw(renderer.getContext(), "CONTINUE", this.pos.x, this.pos.y);
                },
                
                update: function(dt){
                    return true;
                },
                
                newGame: function(){
                    game.data.exp = me.save.exp;
                    game.data.exp1 = me.save.exp1;
                    game.data.exp2 = me.save.exp2;
                    game.data.exp3 = me.save.exp3;
                    game.data.exp4 = me.save.exp4;
                    me.input.releasePointerEvent('pointerdown', this);
                    me.input.releasePointerEvent('pointerdown', game.data.option1);
                    me.state.change(me.state.LOAD);
                }
                
            }));
            
            me.game.world.addChild(game.data.option2);
            
            
        },
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	}
});
