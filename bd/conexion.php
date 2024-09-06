<?php
    $host = "localhost";
    $usuario = "root";
    $clave = "";
    $bd = "bodega";

    $conexion = mysqli_connect($host,$usuario,$clave,$bd);

    if (!$conexion) {
        die("error en conexion: ". mysqli_connect_error());
    }
?>