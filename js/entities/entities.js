game.PlayerEntity = me.Entity.extend({
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
        
        this.renderable.addAnimation("idle", [130]);
        this.renderable.addAnimation("walk", [143, 144, 145, 146, 147, 148, 149, 150, 151], 80);
        
        this.renderable.setCurrentAnimation("idle");
        
        this.body.setVelocity(5, 20);
    
    },
    
    update: function(delta){
        if(me.input.isKeyPressed("right")) {
            //Sets the position of x by adding the velocity (made in setVelocity)
            //and multiplies it by me.timer.tick. me.timer.tick makes the movement
            //nice and smooth.
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(false);
        }
        else {
            this.body.vel.x = 0;
        }
        if(me.input.isKeyPressed("left")) {
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } 
        
        if(this.body.vel.x !== 0) {
            if(!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else {
            this.renderable.setCurrentAnimation("idle");
        }
        
        
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    }
});