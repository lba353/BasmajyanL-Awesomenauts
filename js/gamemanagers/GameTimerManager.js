game.GameTimerManager = Object.extend ({
    //Initializes the following items used in this script.
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastTeamCreep = new Date().getTime();
        this.lastEnemyCreep = new Date().getTime();
        this.lastEnemyPlayer = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    
    //Updates by running the following functions.
    update: function() {
        this.now = new Date().getTime();
        
        this.goldTimerCheck();
        this.teamCreepTimerCheck();
        this.creepTimerCheck();
        this.enemyPlayerTimerCheck();
        
        return true;
    },
    
    //Spawns gold on any multiple of 15 seconds.
    goldTimerCheck: function() {
        if(Math.round(this.now / 1000)%15 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += Number(game.data.exp1 + 1);
            console.log("Current Gold: " + game.data.gold);
        }
    },
    
    //Spawns team creeps on any multiple of 10 seconds at the player base.
    teamCreepTimerCheck: function() {
        if(Math.round(this.now / 1000)%10 === 0 && (this.now - this.lastTeamCreep >= 1000)) {
            this.lastTeamCreep = this.now;
            var creept = me.pool.pull("TeamCreep", 350, 0, {});
            me.game.world.addChild(creept, 5);
        }
    },
    
    //Spawns enemy creeps on any multiple of 10 seconds at the enemy base.
    creepTimerCheck: function() {
        if(Math.round(this.now / 1000)%10 === 0 && (this.now - this.lastEnemyCreep >= 1000)) {
            this.lastEnemyCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 3200, 0, {});
            me.game.world.addChild(creepe, 5);
        }
    },
    
    //Spawns enemy players on any multiple of 20 seconds at the enemy base.
    enemyPlayerTimerCheck: function() {
        if(Math.round(this.now / 1000)%20 === 0 && (this.now - this.lastEnemyPlayer >= 1000)) {
            this.lastEnemyPlayer = this.now;
            var playere = me.pool.pull("enemyPlayer", 3200, 0, {});
            me.game.world.addChild(playere, 5);
        }
    }
});