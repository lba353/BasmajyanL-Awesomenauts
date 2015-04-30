game.HeroDeathManager = Object.extend ({
    //Initializes the class by always updating
    init: function(x, y, settings){
        this.alwaysUpdate = true;
    },
    
    //If the player died, then he and the mini player location gets reset.
    update: function() {
        if(game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            me.game.world.removeChild(game.data.miniPlayer);
            me.state.current().resetPlayer(350, 0);
        }
    }
});