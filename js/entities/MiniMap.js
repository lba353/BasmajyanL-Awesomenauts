game.MiniMap = me.Entity.extend({
    //Initializes the minimap.
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "minimap",
                width: 876,
                height: 262,
                spritewidth: "876",
                spriteheight: "262",
                getShape: function() {
                    return (new me.Rect(0, 0, 876, 262)).toPolygon();
                }
        }]);
        //Floating is set to true so that the minimap does not drop down.
        this.floating = true;
    }
});