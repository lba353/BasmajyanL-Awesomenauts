game.EnemyPlayerEntity = me.Entity.extend ({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
            image: "orc",
            width: 64,
            height: 64,
            spritewidth: "64",
            spriteheight: "64",
            getShape: function() {
                return (new me.Rect(0, 0, 64, 64)).toPolygon();
            }
        }]);
        this.health = 20;
        this.alwaysUpdate = true;
        this.now = new Date().getTime();
        //this.attacking lets us know if the enemy hero is attacking.
        this.attacking = false;
        //Keeps track of when the enemy hero last attacked.
        this.lastAttacking = new Date().getTime();
        //Keeps track of the last time the enemy hero hit anything.
        this.lastHit = new Date().getTime();
        
        this.body.setVelocity(5, 20);
        
        this.type = "EnemyPlayerEntity";
        
        this.renderable.addAnimation("walk", [143, 144, 145, 146, 147, 148, 149, 150, 151], 80);
        this.renderable.addAnimation("attack", [91, 92, 93, 94, 95, 96, 97, 98], 80);
        this.renderable.setCurrentAnimation("walk");
        
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    
    update: function(delta){
        if(this.health <= 0) {            
            me.game.world.removeChild(this);
        }
        
        this.flipX(true);
        
        this.now = new Date().getTime();
        
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        
        me.collision.check(this, true, this.collideHandler.bind(this), true); 
        
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);        
        return true;
    },
    
    collideHandler: function(response) {
        if(response.b.type === "PlayerBaseEntity") {
            this.attacking = true;
            
            if(!this.renderable.setCurrentAnimation("attack") && this.attacking) {
                this.renderable.setCurrentAnimation("attack");
                this.renderable.setAnimationFrame();
            }
            else {
                this.renderable.setCurrentAnimation("walk");
            }
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
        else if(response.b.type === "PlayerEntity" || response.b.type === "TeamCreep") {
            var xdif = this.pos.x - response.b.pos.x;
            
            this.attacking = true;
            
            if(!this.renderable.setCurrentAnimation("attack") && this.attacking) {
                this.renderable.setCurrentAnimation("attack");
                this.renderable.setAnimationFrame();
            }
            else {
                this.renderable.setCurrentAnimation("walk");
            }
            
            //this.lastAttacking = this.now;            
            if(xdif > 0) {
                this.body.vel.x = 0;
            }            
            //Checks to see if it has been at leat 1 second until the enemy hero's last player hit.
            if((this.now - this.lastHit) >= 1000 && xdif > 0) { 
                //Updates lastHit timer.
                this.lastHit = this.now;
                //Makes the player entity call the lose health function and take 1 damage.
                response.b.loseHealth(1);
            }
        }
    }
});