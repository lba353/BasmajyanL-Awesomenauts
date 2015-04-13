<?php
    require_once (__DIR__ . "/../View/Header.php");
    require_once (__DIR__ . "/../Model/Config.php");
    require_once (__DIR__ . "/../View/Footer.php");
    
    //Removes your authentication.
    unset($_SESSION["authenticated"]);
    
    //Removes your session and goes back to the index page.
    session_destroy();
    header("Location: " . $path . "index.php");