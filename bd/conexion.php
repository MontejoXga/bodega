<?php
    $host = "localhost";
    $usuario = "root";
    $clave = "";
    $bd = "bodega";

    $conexion = mysqli_connect($host,$usuario,$clave,$bd);

    if (!$conexion) {
        die("error en conexion: ". mysqli_connect_error());
    }
    if (!$conexion->set_charset("utf8")) {
        printf("Error cargando el conjunto de caracteres utf8", $conexion->error);
        exit();
    }

?>