game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
	    // reset the score
	    game.data.score = 0;
            //Starts the game at Level 1
            me.levelDirector.loadLevel("Level01");
            
            //Starting gold  amount based on exp2's level.
            game.data.gold += Number(game.data.exp2 * 5);
            
            //Sets player at 350 pixels right and 0 pixels down.
            this.resetPlayer(350, 0);
                
            //Variables set that are used throught out the game (Lines 18-34).    
            var gameTimerManager = me.pool.pull("GameTimerManager", 0, 0, {});
            me.game.world.addChild(gameTimerManager, 0);
            
            var heroDeathManager = me.pool.pull("HeroDeathManager", 0, 0, {});
            me.game.world.addChild(heroDeathManager, 0);
            
            var experienceManager = me.pool.pull("ExperienceManager", 0, 0, {});
            me.game.world.addChild(experienceManager, 0);
            
            var spendGold = me.pool.pull("SpendGold", 0, 0, {});
            me.game.world.addChild(spendGold, 0);
            
            var pause = me.pool.pull("PauseScreen", 0, 0, {});
            me.game.world.addChild(pause, 0);
            
            game.data.minimap = me.pool.pull("minimap", 10, 10, {});
            me.game.world.addChild(game.data.minimap, 30);
            
            //Binds the movement keys.
            me.input.bindKey(me.input.KEY.RIGHT, "right");
            me.input.bindKey(me.input.KEY.LEFT, "left");
            me.input.bindKey(me.input.KEY.UP, "jump");
            me.input.bindKey(me.input.KEY.A, "attack");
            
            //Binds the pause key.
            me.input.bindKey(me.input.KEY.P, "pause");
            
            //Binds the shop keys.
            me.input.bindKey(me.input.KEY.B, "buy");
            me.input.bindKey(me.input.KEY.Q, "ability1");
            me.input.bindKey(me.input.KEY.W, "ability2");
            me.input.bindKey(me.input.KEY.E, "ability3");

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
	},
        
        //When the player gets reset, these functions are carried out.
        resetPlayer: function(x, y) {
            game.data.player = me.pool.pull("player", x, y, {});
            me.game.world.addChild(game.data.player, 5);
            
            game.data.miniPlayer = me.pool.pull("miniplayer", 10, 10, {});
            me.game.world.addChild(game.data.miniPlayer, 31);
        }
});
