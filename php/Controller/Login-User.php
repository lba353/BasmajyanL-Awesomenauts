<?php
    require_once (__DIR__ . "/../View/Header.php");
    require_once (__DIR__ . "/../Model/Config.php");
    require_once (__DIR__ . "/../View/Footer.php");
    
    $array = array(
        'exp' => '',
        'exp1' => '',
        'exp2' => '',
        'exp3' => '',
        'exp4' => '',
    );
    
    //Adds username and password input to login your user.
    $username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

    //Gets the salt and password from the users table where the username is the same as the variable username.
    $query = $_SESSION["connection"]->query("SELECT * FROM users WHERE BINARY username = '$username'");
    
    //Checks to see if the login information is true or not.
    if($query->num_rows == 1) {
        $row = $query->fetch_array();
        
        if($row["password"] === crypt($password , $row["salt"])) {
            $_SESSION["authenticated"] = true;
            $array["exp"] = $row["exp"];
            $array["exp1"] = $row["exp1"];
            $array["exp2"] = $row["exp2"];
            $array["exp3"] = $row["exp3"];
            $array["exp4"] = $row["exp4"];
            
            echo json_encode($array);
        }
        else {
            echo "<p>Invalid username and password.</p>";
        }
    }
    else {
        echo "<p>Invalid username and password.</p>";
    }