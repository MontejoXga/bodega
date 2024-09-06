<?php

/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/
/*-------------OBTENER BODEGA DE BASE DE DATOS-------------------------*/
/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/

    function obtenerBodega(){
        include '../bd/conexion.php';
        $consulta = mysqli_query($conexion,"SELECT * FROM bodega");
        $results = array();

        while ($bodega = mysqli_fetch_array($consulta)){
            $results[]=array(
                'id_bod' => $bodega['id_bod'],
                'nom_bod' => $bodega['nom_bod']
            );
        }

        echo json_encode($results);

    }

/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/
/*-----------OBTENER SUCURSAL DE BASE DE DATOS-------------------------*/
/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/

    function obtenerSucursal($idBodega){
        include '../bd/conexion.php';
        $consulta = mysqli_query($conexion,"SELECT * FROM sucursal WHERE id_bod = $idBodega");
        $results = array();

        while ($sucursal = mysqli_fetch_array($consulta)){
            $results[]=array(
                'id_suc' => $sucursal['id_suc'],
                'desc_suc' => $sucursal['desc_suc']
            );
        }

        echo json_encode($results);
    }

/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/
/*-------------OBTENER MONEDAS DE BASE DE DATOS------------------------*/
/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/

    function obtenerMoneda(){
        include '../bd/conexion.php';
        $consulta = mysqli_query($conexion,"SELECT * FROM moneda");
        $results = array();

        while ($moneda = mysqli_fetch_array($consulta)){
            $results[]=array(
                'id_mon' => $moneda['id_mon'],
                'desc_mon' => $moneda['desc_mon']
            );
        }

        echo json_encode($results);
    }


/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/
/*---------------------FUNCION DE GUARDADO-----------------------------*/
/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/


    function guardar($datosCombinados){

        include '../bd/conexion.php';
        $results = array(
            'status' => 0,
            'message'=>'',
        );
    
        parse_str($datosCombinados, $datos);
        $ProdCodigo = $datos['codigo'];
        $ProdNombre = $datos['nombre'];
        $ProdBodega = $datos['bodega'];
        $ProdSucursal = $datos['sucursal'];
        $ProdMoneda = $datos['moneda'];
        $ProdPrecio = $datos['precio'];
        $ProdDescripcion = $datos['descripcion'];
        $checkbox1 = $datos['checkbox1'];
        $checkbox2 = $datos['checkbox2'];
        
        $consulta = "SELECT cod_prod FROM producto WHERE cod_prod = '$ProdCodigo'";
        $peticion = mysqli_query($conexion,$consulta);
    
        if (mysqli_num_rows($peticion)>0) {
            $results['message'] = '!!!!!!!!!!!!Su producto ya existe en la base de datos!!!!!!!!!!!!!!!!!!';
        }else{
    
            $consulta = "INSERT INTO producto(cod_prod, nom_prod, id_bod, id_suc, id_mon, precio, desc_prod, mat_prod_1,mat_prod_2)
                    VALUES ('$ProdCodigo','$ProdNombre','$ProdBodega','$ProdSucursal','$ProdMoneda','$ProdPrecio','$ProdDescripcion','$checkbox1','$checkbox2')";
            $insertar = mysqli_query($conexion,$consulta);
        
            if (!$insertar) {
                $results['status'] = 0; 
                $results['message'] = 'Ocurrio un error';
            } else {
                $results['status'] = 1; 
                $results['message'] = 'El producto se REGISTRO EXITOSAMENTE!!!';
            }
    
        }
    
        echo json_encode($results);
    }

/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/
/*--------------CONDICIONAL PARA LAS FUNCIONES-------------------------*/
/*---------------------------------------------------------------------*/
/*---------------------------------------------------------------------*/


    if (isset($_POST['permisobod'])) {
        obtenerBodega();
    }elseif (isset($_POST['idBodega'])) {
        $idBodega = $_POST['idBodega'];
        obtenerSucursal($idBodega);
    }elseif(isset($_POST['datosCombinados'])){
        guardar($_POST['datosCombinados']);
    }else{
        obtenerMoneda();
    }

?>