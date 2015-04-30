game.LoadProfile = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {
                //Plays audio.
                me.audio.playTrack("Preparing_For_Battle");
                
                //Adds a new child which is the "load-screen" image.
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("load-screen")), -10);
                
                //Makes the input and load IDs visible.
                document.getElementById("input").style.visibility = "visible";
                document.getElementById("load").style.visibility = "visible";
                
                //Unbinds keys that might be used for entering username and password.
                me.input.unbindKey(me.input.KEY.B);
                me.input.unbindKey(me.input.KEY.Q);
                me.input.unbindKey(me.input.KEY.W);
                me.input.unbindKey(me.input.KEY.E);
                me.input.unbindKey(me.input.KEY.A);
                
                //Adds the following renderable.
                me.game.world.addChild(new (me.Renderable.extend({
                    //Sets the font, font size, and the font color.
                    init: function() {
                        this._super(me.Renderable, "init", [10, 10, 300, 50]);
                        this.font = new me.Font("Arial", 26, "green");
                    },
                    
                    //Draws the following text.
                    draw: function(renderer) {
                        this.font.draw(renderer.getContext(), "ENTER YOUR USERNAME AND PASSWORD", this.pos.x + 250, this.pos.y);
                    },
                    
                    //The update function always returns true;
                    update: function() {
                        return true;
                    }
                    
                })));
                
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
            //Sets the IDs to hidden again.
            document.getElementById("input").style.visibility = "hidden";
            document.getElementById("load").style.visibility = "hidden";
	}
});
