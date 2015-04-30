game.PauseScreen = Object.extend ({
    //Initializes the following variables used in this file.
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastPause = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        
    },
    
    update: function() {
        this.now = new Date().getTime();
        
        //If the "pause" screen is set and it hase been 1 seconds since the last pause, start pauseing.
        if(me.input.isKeyPressed("pause") && this.now - this.lastPause >= 1000) {
            this.lastPause = this.now;
            if(!this.paused) {
                this.startPauseing();
            }
            else {
                this.stopPauseing();
            }
        }
        
        return true;
    },
    
    //The following makes the game pauses the game, pulls up an image, and sets the velocity to 0. Also sets up pause text.
    startPauseing: function() {
        this.paused = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.pauseScreen = new me.Sprite(game.data.pausePos.x , game.data.pausePos.y, me.loader.getImage("pause-screen"));
        game.data.pauseScreen.updateWhenPaused = true;
        game.data.pauseScreen.setOpacity(0.8);
        me.game.world.addChild(game.data.pauseScreen, 34);
        game.data.player.body.setVelocity(0, 0);
        
        this.setPauseText();
    },
    
    //Sets the pause text.
    setPauseText: function() {       
        //Creates a new renderable.
        game.data.pauseText = new (me.Renderable.extend({
            //Sets thhe font style, font size, and font color.
            init: function() {
                this._super(me.Renderable, "init", [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                this.font = new me.Font("Arial", 46, "blue");
                this.updateWhenPaused = true;
                this.alwaysUpdate = true;
            },
            
            //Draws the word "PAUSED".
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PAUSED", 400, 250);
            }
        }));
        //Adds the child in front of everything.
        me.game.world.addChild(game.data.pauseText, 35);
    },
    
    //If the game is not pauseing, then the game resumes.
    stopPauseing: function() {
        this.paused = false;
        me.state.resume(me.state.PLAY);
        me.game.world.removeChild(game.data.pauseScreen);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.pauseText);
    }
});