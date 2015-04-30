game.TeamCreep = me.Entity.extend ({
    //Initiallizes the creep sprite.
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
            image: "creep2",
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
        //Keeps track of the last time the creep hit anything.
        this.lastHit = new Date().getTime();
        
        //Sets the velocity
        this.body.setVelocity(3, 20);
        
        //Sets the type
        this.type = "TeamCreep";
        
        //Adds and sets the animations
        this.renderable.addAnimation("walk", [6, 7, 8], 80);
        this.renderable.setCurrentAnimation("walk");
        
    },
    
    //If the creep takes damage, subtract the amount of damage from the total health.
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    
    update: function(delta){
        //If the creep's health is less than 0, then remove the child.
        if(this.health <= 0) {            
            me.game.world.removeChild(this);
        }
        
        this.now = new Date().getTime();
        
        //Moves the creep to the right.
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        
        //Check to see if the creep collides with something.
        me.collision.check(this, true, this.collideHandler.bind(this), true); 
        
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);        
        return true;
    },
    
    collideHandler: function(response) {
        if(response.b.type === "EnemyBaseEntity") {
            this.attacking = true;
            //this.lastAttacking = this.now;
            this.body.vel.x = 0;
            //Checks to see if it has been at least 1 second until the creep's last base hit.
            if(this.now - this.lastHit >= 1000) { 
                //Updates lastHit timer.
                this.lastHit = this.now;
                //Makes the player base call the lose health function and take 1 damage.
                response.b.loseHealth(1);
            }
        }    
        else if(response.b.type === "EnemyPlayerEntity" || response.b.type === "EnemyCreep") {
            var xdif = this.pos.x - response.b.pos.x;
            
            this.attacking = true;
            //this.lastAttacking = this.now;            
            if(xdif < 0) {
                this.body.vel.x = 0;
            }            
            //Checks to see if it has been at leat 1 second until the creep's last player hit.
            if((this.now - this.lastHit) >= 1000 && xdif < 0) { 
                //Updates lastHit timer.
                this.lastHit = this.now;
                //Makes the player entity call the lose health function and take 1 damage.
                response.b.loseHealth(1);
            }
        }
    }
});