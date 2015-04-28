game.GameTimerManager = Object.extend ({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastTeamCreep = new Date().getTime();
        this.lastEnemyCreep = new Date().getTime();
        this.lastEnemyPlayer = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    
    update: function() {
        this.now = new Date().getTime();
        
        this.goldTimerCheck();
        this.teamCreepTimerCheck();
        this.creepTimerCheck();
        
        return true;
    },
    
    goldTimerCheck: function() {
        if(Math.round(this.now / 1000)%20 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += Number(game.data.exp1 + 1);
            console.log("Current Gold: " + game.data.gold);
        }
    },
    
    teamCreepTimerCheck: function() {
        if(Math.round(this.now / 1000)%10 === 0 && (this.now - this.lastTeamCreep >= 1000)) {
            this.lastTeamCreep = this.now;
            var creept = me.pool.pull("TeamCreep", 0, 0, {});
            me.game.world.addChild(creept, 5);
        }
    },
    
    creepTimerCheck: function() {
        if(Math.round(this.now / 1000)%10 === 0 && (this.now - this.lastEnemyCreep >= 1000)) {
            this.lastEnemyCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1018, 0, {});
            me.game.world.addChild(creepe, 5);
        }
    },
    
    enemyPlayerTimerCheck: function() {
        if(Math.round(this.now / 1000)%10 === 0 && (this.now - this.lastEnemyPlayer >= 1000)) {
            this.lastEnemyPlayer = this.now;
            var playere = me.pool.pull("EnemyPlayerEntity", 1018, 0, {});
            me.game.world.addChild(playere, 5);
        }
    }
});