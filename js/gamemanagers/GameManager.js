game.ExperienceManager = Object.extend ({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        this.gameOver = false;
    },
    
    update: function() {
        if(game.data.win === true && !this.gameOver) {
            this.gameOverWin();
            alert("YOU WIN!");
        }
        else if(game.data.win === false && !this.gameOver) {
            this.gameOverLose();
            alert("YOU LOSE!");
        }
        return true;
    },
    
    gameOverWin: function() {
        game.data.exp += 10;
        this.gameOver = true;
        console.log(game.data.exp);
        me.save.exp = game.data.exp;
        
        
        $.ajax({
            type: "POST",
            url: "php/Controller/Save-User.php",
            data: {
                exp: game.data.exp,
                exp1: game.data.exp1,
                exp2: game.data.exp2,
                exp3: game.data.exp3,
                exp4: game.data.exp4
            },
            dataType: "text"
        })
                .success(function(response) {
                    if (response === "true") {
                        me.state.change(me.state.MENU);
                    }
                    else {
                        alert(response);
                    }
                })
                .fail(function(response) {
                    alert("Fail");
                });
    },
    
    gameOverLose: function() {
        game.data.exp += 1;
        this.gameOver = true;
        console.log(game.data.exp);
        me.save.exp = game.data.exp;
       
        $.ajax({
            type: "POST",
            url: "php/Controller/Save-User.php",
            data: {
                exp: game.data.exp,
                exp1: game.data.exp1,
                exp2: game.data.exp2,
                exp3: game.data.exp3,
                exp4: game.data.exp4
            },
            dataType: "text"
        })
                .success(function(response) {
                    if (response === "true") {
                        me.state.change(me.state.MENU);
                    }
                    else {
                        alert(response);
                    }
                })
                .fail(function(response) {
                    alert("Fail");
                });
    }

});