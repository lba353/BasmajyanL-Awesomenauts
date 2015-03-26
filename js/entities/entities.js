game.PlayerEntity = me.Entity.extend ({
    init: function(x, y, settings){
        this._super(me.Entity, "init", [x, y, {
            image: "player",
            width: 64,
            height: 64,
            spritewidth: "64",
            spriteheight: "64",
            getShape: function () {
                return(new me.Rect(0, 0, 64, 64)).toPolygon();
            }
        }]);
        this.type = "PlayerEntity";
        
        this.health = game.data.playerHealth;
        
        this.attack = game.data.playerAttack;
        
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        
        //Keeps track on where your character is going.
        this.facing = "right";
        
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
        this.dead = false;
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        this.renderable.addAnimation("idle", [130]);
        this.renderable.addAnimation("walk", [143, 144, 145, 146, 147, 148, 149, 150, 151], 80);
        this.renderable.addAnimation("attack", [91, 92, 93, 94, 95, 96, 97, 98], 80);
        
        this.renderable.setCurrentAnimation("idle");
    
    },
    
    update: function(delta){
        this.now = new Date().getTime();
        
        if(this.health <= 0) {
            this.dead = true;
        }
        
        if(me.input.isKeyPressed("right")) {
            //Sets the position of x by adding the velocity (made in setVelocity)
            //and multiplies it by me.timer.tick. me.timer.tick makes the movement
            //nice and smooth.
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(false);
        }
        else if(me.input.isKeyPressed("left")) {            
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.facing = "left";
            this.flipX(true);
        }
        else {
            this.body.vel.x = 0;
        }
        
        if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            this.body.jumping = true;
        }
       
        if(me.input.isKeyPressed("attack")) {
            if(!this.renderable.isCurrentAnimation("attack")) {
                //Sets animation to attack and when done goes to idle.
                this.renderable.setCurrentAnimation("attack", "idle");
                //Makes it so that we start off on frame one every time we start.
                this.renderable.setAnimationFrame();
            }
        }        
        else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if(!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else if(!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
        me.collision.check(this, true, this.collideHandler.bind(this), true);        
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;        
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    
    collideHandler: function(response) {
        this.now = new Date().getTime();
        if(response.b.type === "EnemyBaseEntity") {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            
            if(ydif < -40 && xdif < 70  && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = - 1;
            }
            else if(xdif > -35 && this.facing === "right" && (xdif < 0)) {
                this.body.vel.x = 0;
            //    this.pos.x = this.pos.x - 1;
            }
            else if(xdif < 70 && this.facing === "left" && (xdif > 0)) {
                this.body.vel.x = 0;
            //    this.pos.x = this.pos.x + 1;
            }
            
            if(this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);               
            }
        }    
        else if(response.b.type === "EnemyCreep") {
                var xdif = this.pos.x - response.b.pos.x;
                var ydif = this.pos.y - response.b.pos.y;
                
                if(xdif > 0) {
                //    this.pos.x = this.pos.x + 1;
                    if(this.facing === "left") {
                        this.body.vel.x = 0;
                    }
                }
                else {
                //    this.pos.x = this.pos.x - 1;
                    if(this.facing === "right") {
                        this.body.vel.x = 0;
                    }
                }
                
                if((this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer)
                       && (Math.abs(ydif) <= 40) 
                       && (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                       ) {
                    this.lastHit = this.now;
                    //If the creeps code is less than our attack, gain gold for a creep kill.
                    if(response.b.health <= game.data.playerAttack) {
                        game.data.gold += 1;
                        console.log("Current Gold: " + game.data.gold);
                    }
                    
                    response.b.loseHealth(game.data.playerAttack);
            }
        }
        
    }
});

game.PlayerBaseEntity = me.Entity.extend ({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
            image: "tower",
            width: 100,
            height: 100,
            spritewidth: "100",
            spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
        }]);
        this.broken = false;
        this.health = game.data.playerBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = "PlayerBase";
        
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    
    update: function(delta) {
        if(this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    }, 
    
    onCollision: function() {
        
    } 
    
});

game.EnemyBaseEntity = me.Entity.extend ({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
            image: "tower",
            width: 100,
            height: 100,
            spritewidth: "100",
            spriteheight: "100",
            getShape: function() {
                return (new me.Rect(0, 0, 100, 70)).toPolygon();
            }
        }]);
        this.broken = false;
        this.health = game.data.enemyBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = "EnemyBaseEntity";
        
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
        
    },
    
    update: function(delta) {
        if(this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    onCollision: function() {
        
    },
    
    loseHealth: function() {
        this.health--;
    }
    
});

game.EnemyCreep = me.Entity.extend ({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
            image: "creep1",
            width: 32,
            height: 64,
            spritewidth: "32",
            spriteheight: "64",
            getShape: function() {
                return (new me.Rect(0, 0, 32, 64)).toPolygon();
            }
        }]);
        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        this.now = new Date().getTime();
        //this.attacking lets us know if the creep is attacking.
        this.attacking = false;
        //Keeps track of when the creep last attacked.
        this.lastAttacking = new Date().getTime();
        //Keeps track of the last time the creep it anything.
        this.lastHit = new Date().getTime();
        
        this.body.setVelocity(3, 20);
        
        this.type = "EnemyCreep";
        
        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
        
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    
    update: function(delta){
        console.log(this.health);
        if(this.health <= 0) {            
            me.game.world.removeChild(this);
        }
        
        this.now = new Date().getTime();
        
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        
        me.collision.check(this, true, this.collideHandler.bind(this), true); 
        
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);        
        return true;
    },
    
    collideHandler: function(response) {
        if(response.b.type === "PlayerBase") {
            this.attacking = true;
            //this.lastAttacking = this.now;
            this.body.vel.x = 0;
            //Keeps moving the creep to the right to maintain the position.
            this.pos.x = this.pos.x + 1;
            //Checks to see if it has been at leat 1 second until the creep's last base hit.
            if(this.now - this.lastHit >= game.data.enemyCreepAttackTimer) { 
                //Updates lastHit timer.
                this.lastHit = this.now;
                //Makes the player base call the lose health function and take 1 damage.
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }    
        else if(response.b.type === "PlayerEntity") {
            var xdif = this.pos.x - response.b.pos.x;
            
            this.attacking = true;
            //this.lastAttacking = this.now;            
            if(xdif > 0) {
                //Keeps moving the creep to the right to maintain the position.
                this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;
            }            
            //Checks to see if it has been at leat 1 second until the creep's last player hit.
            if((this.now - this.lastHit) >= game.data.enemyCreepAttackTimer && xdif > 0) { 
                //Updates lastHit timer.
                this.lastHit = this.now;
                //Makes the player base call the lose health function and take 1 damage.
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }
    }
});

game.GameManager = Object.extend ({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    
    update: function() {
        this.now = new Date().getTime();
        
        if(game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
            
        }
        
        if(Math.round(this.now / 1000)%20 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += 1;
            console.log("Current Gold: " + game.data.gold);
        }
        
        if(Math.round(this.now / 1000)%10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
        }
        
        return true;
    }
});