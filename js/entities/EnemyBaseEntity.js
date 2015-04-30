game.EnemyBaseEntity = me.Entity.extend ({
    init: function(x, y, settings) {
        //Initializes the base sprite.
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
        //Variables used throughout the code.
        this.broken = false;
        this.health = game.data.enemyBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        //Sets the type
        this.type = "EnemyBaseEntity";
        
        //Adds and sets the animations.
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
        
    },
    
    update: function(delta) {
        //If the base is broken, set broken and win to true and change the animation to broken.
        if(this.health <= 0) {
            this.broken = true;
            game.data.win = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    onCollision: function() {
        
    },
    
    //Lose health by one (Not affected by different attack values).
    loseHealth: function() {
        this.health--;
    }
    
});