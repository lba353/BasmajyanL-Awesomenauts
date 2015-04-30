

/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

	init: function() {
		// call the constructor
		this._super(me.Container, 'init');
		
		// persistent across level change
		this.isPersistent = true;
		
		// non collidable
		this.collidable = false;
		
		// make sure our object is always draw first
		this.z = Infinity;

		// give a name
		this.name = "HUD";
		
		// add our child score object at the top left corner
		this.addChild(new game.HUD.ScoreItem(5, 5));
	}
});


/** 
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({	
	/** 
	 * constructor
	 */
	init: function(x, y) {
		
		// call the parent constructor 
		// (size does not matter here)
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
                this.font = new me.Font("Arial", 26, "yellow");
		
		// local copy of the global score
		this.score = -1;

		// make sure we use screen coordinates
		this.floating = true;
	},

	/**
	 * update function
	 */
	update : function () {
		return true;
	},

	/**
	 * draw the score
	 */
	draw : function(renderer) {
		this.font.draw(renderer.getContext(), "Gold: " + game.data.gold, this.pos.x + 700, this.pos.y);
                this.font.draw(renderer.getContext(), "Attack: " + game.data.playerAttack, this.pos.x + 900, this.pos.y);
	}

});
