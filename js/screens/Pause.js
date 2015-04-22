game.PauseScreen = Object.extend ({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastPause = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        
    },
    
    update: function() {
        this.now = new Date().getTime();
        
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
    
    setPauseText: function() {       
        game.data.pauseText = new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, "init", [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                this.font = new me.Font("Arial", 46, "blue");
                this.updateWhenPaused = true;
                this.alwaysUpdate = true;
            },
                    
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PAUSED", 400, 250);
           }
        }));
        me.game.world.addChild(game.data.pauseText, 35);
    },
    
    stopPauseing: function() {
        this.paused = false;
        me.state.resume(me.state.PLAY);
        me.game.world.removeChild(game.data.pauseScreen);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.pauseText);
    }
});