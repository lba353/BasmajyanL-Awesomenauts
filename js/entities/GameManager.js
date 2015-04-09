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
        
        this.checkBuyKeys();
        
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
        game.data.buyText = new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, "init", [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                this.font = new me.Font("Arial", 26, "green");
                this.updateWhenPaused = true;
                this.alwaysUpdate = true;
            },
                    
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PRESS F1-F6 TO BUY, B TO EXIT. (Current Gold: " + game.data.gold + ")", this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "(Passive) Increase Damage. (Current Level: " + game.data.skill1 + ") Cost: " + ((game.data.skill1 + 1) * 10), this.pos.x, this.pos.y + 80);
                this.font.draw(renderer.getContext(), "(Passive) Increase Speed. (Current Level: " + game.data.skill2 + ") Cost: " + ((game.data.skill2 + 1) * 10), this.pos.x, this.pos.y + 120);
                this.font.draw(renderer.getContext(), "(Passive) Increase Health. (Current Level: " + game.data.skill3 + ") Cost: " + ((game.data.skill3 + 1) * 10), this.pos.x, this.pos.y + 160);
                this.font.draw(renderer.getContext(), "(Q) Ability: Speed Burst (Current Level: " + game.data.ability1 + ") Cost: " + ((game.data.ability1 + 1) * 10), this.pos.x, this.pos.y + 200);
                this.font.draw(renderer.getContext(), "(W) Ability: Eat Creep for Health (Current Level: " + game.data.ability2 + ") Cost: " + ((game.data.ability2 + 1) * 10), this.pos.x, this.pos.y + 240);
                this.font.draw(renderer.getContext(), "(E) Ability: Spear Throw (Current Level: " + game.data.ability3 + ") Cost: " + ((game.data.ability3 + 1) * 10), this.pos.x, this.pos.y + 280);
           }
        }));
        me.game.world.addChild(game.data.buyText, 35);
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
        me.game.world.removeChild(game.data.buyText);
    },
    
    checkBuyKeys: function() {
        if(me.input.isKeyPressed("F1")) {
            if(this.checkCost(1)){
                this.makePurchase(1);
            }
        }
        else if(me.input.isKeyPressed("F2")) {
            if(this.checkCost(2)){
                this.makePurchase(2);
            }
        }
        else if(me.input.isKeyPressed("F3")) {
            if(this.checkCost(3)){
                this.makePurchase(3);
            }
        }
        else if(me.input.isKeyPressed("F4")) {
            if(this.checkCost(4)){
                this.makePurchase(4);
            }
        }
        else if(me.input.isKeyPressed("F5")) {
            if(this.checkCost(5)){
                this.makePurchase(5);
            }
        }
        else if(me.input.isKeyPressed("F6")) {
            if(this.checkCost(6)){
                this.makePurchase(6);
            }
        }
    },
    
    checkCost: function(skill) {
        if(skill === 1 && (game.data.gold >= ((game.data.skill1 + 1) * 10))) {
            return true;
        }
        else if(skill === 2 && (game.data.gold >= ((game.data.skill2 + 1) * 10))) {
            return true;
        }
        else if(skill === 3 && (game.data.gold >= ((game.data.skill3 + 1) * 10))) {
            return true;
        }
        else if(skill === 4 && (game.data.gold >= ((game.data.ability1 + 1) * 10))) {
            return true;
        }
        else if(skill === 5 && (game.data.gold >= ((game.data.ability2 + 1) * 10))) {
            return true;
        }
        else if(skill === 6 && (game.data.gold >= ((game.data.ability3 + 1) * 10))) {
            return true;
        }
        else {
            return false;
        }
    },
    
    makePurchase: function(skill) {
        if(skill === 1) {
            game.data.gold -= (game.data.skill1 + 1) * 10;
            game.data.skill1 += 1;
            game.data.player.attack += 1;
        }
        else if(skill === 2) {
            game.data.gold -= (game.data.skill2 + 1) * 10;
            game.data.skill2 += 1;
            game.data.player.body.setVelocity += 1;
        }
        else if(skill === 3) {
            game.data.gold -= (game.data.skill3 + 1) * 10;
            game.data.skill3 += 1;
            game.data.player.health += 1;
        }
        else if(skill === 4) {
            game.data.gold -= (game.data.ability1 + 1) * 10;
            game.data.ability1 += 1;
        }
        else if(skill === 5) {
            game.data.gold -= (game.data.ability2 + 1) * 10;
            game.data.ability2 += 1;
        }
        else if(skill === 6) {
            game.data.gold -= (game.data.ability3 + 1) * 10;
            game.data.ability3 += 1;
        }
    }
});