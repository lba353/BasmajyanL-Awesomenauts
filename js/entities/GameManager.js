game.GameTimerManager = Object.extend ({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    
    update: function() {
        this.now = new Date().getTime();
        
        this.goldTimerCheck();
        this.creepTimerCheck();
        
        return true;
    },
    
    goldTimerCheck: function() {
        if(Math.round(this.now / 1000)%20 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += (game.data.exp1 + 1);
            console.log("Current Gold: " + game.data.gold);
        }
    },
    
    creepTimerCheck: function() {
        if(Math.round(this.now / 1000)%10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
        }
    }
});

game.HeroDeathManager = Object.extend ({
    init: function(x, y, settings){
        this.alwaysUpdate = true;
    },
    
    update: function() {
        if(game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
            
        }
    }
});

game.ExperienceManager = Object.extend ({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        this.gameOver = false;
    },
    
    update: function() {
        if(game.data.win === true && !this.gameOver) {
            this.gameOverWin();
        }
        else if(game.data.win === false && !this.gameOver) {
            this.gameOverLose();
        }
        return true;
    },
    
    gameOverWin: function() {
        game.data.exp += 10;
        this.gameOver = true;
        console.log(game.data.exp);
        me.save.exp = game.data.exp;
    },
    
    gameOverLose: function() {
        game.data.exp += 1;
        this.gameOver = true;
        console.log(game.data.exp);
        me.save.exp = game.data.exp;
    }
});

game.SpendGold = Object.extend ({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastBuy = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        this.buying = false;
    },
    
    update: function() {
        this.now = new Date().getTime();
        
        if(me.input.isKeyPressed("buy") && this.now - this.lastBuy >= 1000) {
            this.lastBuy = this.now;
            if(!this.buying) {
                this.startBuying();
            }
            else {
                this.stopBuying();
            }
        }
        
        return true;
    },
    
    startBuying: function() {
        this.buying = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.buyScreen = new me.Sprite(game.data.pausePos.x , game.data.pausePos.y, me.loader.getImage("gold-screen"));
        game.data.buyScreen.updateWhenPaused = true;
        game.data.buyScreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyScreen, 34);
        game.data.player.body.setVelocity(0, 0);
        
        me.input.bindKey(me.input.KEY.F1, "F1", true);
        me.input.bindKey(me.input.KEY.F1, "F2", true);
        me.input.bindKey(me.input.KEY.F1, "F3", true);
        me.input.bindKey(me.input.KEY.F1, "F4", true);
        me.input.bindKey(me.input.KEY.F1, "F5", true);
        me.input.bindKey(me.input.KEY.F1, "F6", true);
        
        this.setBuyText();
    },
    
    setBuyText: function() {
        me.game.world.addChild(new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, "init", [10, 10, 300, 50]);
                this.font = new me.Font("Arial", 26, "green");
            },
                    
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PRESS F1-F6 TO BUY, B TO EXIT", this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x + 100, this.pos.y + 50);
                this.font.draw(renderer.getContext(), "F1: INCREASE GOLD PRODUCTION! (Current Level: Level " + game.data.exp1.toString() + ")" + " COST: " + exp1cost, this.pos.x, this.pos.y + 150);
                this.font.draw(renderer.getContext(), "F2: INCREASE STARTING GOLD!", this.pos.x, this.pos.y + 200);
                this.font.draw(renderer.getContext(), "F3: INCREASE DAMAGE!", this.pos.x, this.pos.y + 250);
                this.font.draw(renderer.getContext(), "F4: INCREASE STARTING HEALTH!", this.pos.x, this.pos.y + 300);
           }
        })));
    },
    
    stopBuying: function() {
        this.buying = false;
        me.state.resume(me.state.PLAY);
        me.game.world.removeChild(game.data.buyScreen);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        
        me.input.unbindKey(me.input.KEY.F1, "F1", true);
        me.input.unbindKey(me.input.KEY.F1, "F2", true);
        me.input.unbindKey(me.input.KEY.F1, "F3", true);
        me.input.unbindKey(me.input.KEY.F1, "F4", true);
        me.input.unbindKey(me.input.KEY.F1, "F5", true);
        me.input.unbindKey(me.input.KEY.F1, "F6", true);
    }
});