//Manages the experience variables.
game.ExperienceManager = Object.extend ({
    //Sets the alwaysUpdate and gameOver values.
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        this.gameOver = false;
    },
    
    //Updates if you win or lose.
    update: function() {
        //If you win and if it is not game over, go to gameOverWin() and a message says "YOU WIN!".
        if(game.data.win === true && !this.gameOver) {
            this.gameOverWin();
            alert("YOU WIN!");
        }
        //If you do not win and if it is not game over, go to gameOverLose() and a message says "YOU LOSE!".
        else if(game.data.win === false && !this.gameOver) {
            this.gameOverLose();
            alert("YOU LOSE!");
        }
        return true;
    },
    
    //Adds 10 exp and saves the exp by using ajax.
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
    
    //Adds 1 exp and saves the exp using ajax.
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