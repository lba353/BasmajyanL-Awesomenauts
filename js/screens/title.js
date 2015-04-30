game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {
                //Adds a child that contains the title screen image.
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("title-screen")), -10);
                
                //States that this is option 1. (Start a new game).
                game.data.option1 = new (me.Renderable.extend({
                    init: function() {
                        this._super(me.Renderable, "init", [270, 240, 300, 50]);
                        this.font = new me.Font("Arial", 46, "green");
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },
                    
                    draw: function(renderer) {
                        this.font.draw(renderer.getContext(), "Awesomenauts!", 350, 130);
                        this.font.draw(renderer.getContext(), "START A NEW GAME", this.pos.x, this.pos.y);
                    },
                    
                    update: function(dt) {
                        return true;
                    },
                    //Changes to the new player screen.
                    newGame: function() {
                        me.input.releasePointerEvent('pointerdown', this);
                        me.input.releasePointerEvent('pointerdown', game.data.option2);
                        me.state.change(me.state.NEW);
                    }
                }));
                //Adds the child "Option 1".
                me.game.world.addChild(game.data.option1);
                
                //States that this is option 2. (Continue your game).
                game.data.option2 = new (me.Renderable.extend({
                    init: function() {
                        this._super(me.Renderable, "init", [380, 340, 250, 50]);
                        this.font = new me.Font("Arial", 46, "green");
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },
                    
                    draw: function(renderer) {
                        this.font.draw(renderer.getContext(), "CONTINUE", this.pos.x, this.pos.y);
                    },
                    
                    update: function(dt) {
                        return true;
                    },
                        
                    newGame: function() {
                        //Goes to the load game screen.
                        me.input.releasePointerEvent('pointerdown', this);
                        me.input.releasePointerEvent('pointerdown', game.data.option1);
                        me.state.change(me.state.LOAD);
                    }
                }));
                
                //Adds the child "Option 2"
                me.game.world.addChild(game.data.option2);
                
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
            
	}
});
