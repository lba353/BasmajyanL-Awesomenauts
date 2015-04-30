game.SpendExp = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {
                //Adds new child that contains the exp-screen image.
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("exp-screen")), -10);
                
                //Binds the shop keys.
                me.input.bindKey(me.input.KEY.F1, "F1");
                me.input.bindKey(me.input.KEY.F2, "F2");
                me.input.bindKey(me.input.KEY.F3, "F3");
                me.input.bindKey(me.input.KEY.F4, "F4");
                me.input.bindKey(me.input.KEY.F5, "F5");
                
                //Variables set for how much exp is needed.
                var exp1cost = ((Number(game.data.exp1) + 1) * 10);
                var exp2cost = ((Number(game.data.exp2) + 1) * 15);
                var exp3cost = ((Number(game.data.exp3) + 1) * 30);
                var exp4cost = ((Number(game.data.exp4) + 1) * 30);
                
                //Adds the following renderable.
                me.game.world.addChild(new (me.Renderable.extend({
                    //Initializes the font, font size, and font color.
                    init: function() {
                        this._super(me.Renderable, "init", [10, 10, 300, 50]);
                        this.font = new me.Font("Arial", 26, "green");
                    },
                    
                    //Draws the following text.
                    draw: function(renderer) {
                        this.font.draw(renderer.getContext(), "PRESS F1-F4 TO BUY, F5 TO SKIP", this.pos.x, this.pos.y);
                        this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x + 100, this.pos.y + 50);
                        this.font.draw(renderer.getContext(), "F1: INCREASE GOLD PRODUCTION! (Current Level: Level " + game.data.exp1.toString() + ")" + " COST: " + exp1cost, this.pos.x, this.pos.y + 150);
                        this.font.draw(renderer.getContext(), "F2: INCREASE STARTING GOLD! (Current Level: Level " + game.data.exp2.toString() + ")" + " COST: " + exp2cost, this.pos.x, this.pos.y + 200);
                        this.font.draw(renderer.getContext(), "F3: INCREASE DAMAGE! (Current Level: Level " + game.data.exp3.toString() + ")" + " COST: " + exp3cost,this.pos.x, this.pos.y + 250);
                        this.font.draw(renderer.getContext(), "F4: INCREASE STARTING HEALTH! (Current Level: Level " + game.data.exp4.toString() + ")" + " COST: " + exp4cost,this.pos.x, this.pos.y + 300);
                    },
                    
                    //The updates return true;
                    update: function() {
                        return true;
                    }
                })));
                //Subscribes the keyddown event.
                this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge){
                    //If "F1" is pressed and if your exp is greater than the exp cost, purchase the skill. (Same concept for "F2" to "F4")
                    if(action === "F1") {
                        if(game.data.exp >= exp1cost) {
                            game.data.exp1 += 1;
                            game.data.exp -= exp1cost;
                            exp1cost = ((Number(game.data.exp1) + 1) * 10);
                        }
                        else {
                            alert ("NOT ENOUGH EXPERIENCE");
                        }
                    }
                    else if(action === "F2") {
                        if(game.data.exp >= exp2cost) {
                            game.data.exp2 += 1;
                            game.data.exp -= exp2cost;
                            exp2cost = ((Number(game.data.exp2) + 1) * 15);
                        }
                        else {
                            alert ("NOT ENOUGH EXPERIENCE");
                        }
                    }
                    //Similar to above, but adds 1 to player attack.
                    else if(action === "F3") {
                        if(game.data.exp >= exp3cost) {
                            game.data.exp3 += 1;
                            game.data.exp -= exp3cost;
                            exp3cost = ((Number(game.data.exp3) + 1) * 30);
                            game.data.playerAttack += 1;
                        }
                        else {
                            alert ("NOT ENOUGH EXPERIENCE");
                        }
                    }
                    //Adds 5 to player health.
                    else if(action === "F4") {
                        if(game.data.exp >= exp4cost) {
                            game.data.exp4 += 1;
                            game.data.exp -= exp4cost;
                            exp4cost = ((Number(game.data.exp4) + 1) * 30);
                            game.data.playerHealth += 5;
                        }
                        else {
                            alert ("NOT ENOUGH EXPERIENCE");
                        }
                    }
                    //If "F5" is pressed, then change to the play state.
                    else if(action === "F5") {
                        me.state.change(me.state.PLAY);
                    }
                });
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
            //Stops audio.
            me.audio.stopTrack();
            
            //Unbinds the shop keys.
            me.input.unbindKey(me.input.KEY.F1, "F1");
            me.input.unbindKey(me.input.KEY.F2, "F2");
            me.input.unbindKey(me.input.KEY.F3, "F3");
            me.input.unbindKey(me.input.KEY.F4, "F4");
            me.input.unbindKey(me.input.KEY.F5, "F5");
            
            //Unsubscribes from the event.
            me.event.unsubscribe(this.handler);
	}
});
