$(document).ready(function(){

    let SelectMoneda = $('#moneda');
    let SelectBodega = $('#bodega');
    let SelectSucursal = $('#sucursal');
    
    var codigo = $('#codigo');
    codigo.on('input', function() {
        codigo.val(codigo.val().toUpperCase())
        console.log(codigo.val());
    });
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-------------------------OBTENCION DE BODEGA---------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//


    const permisobod = {'permisobod':'bodega'};
    function obtenerBodega(permisobod){
        $.ajax({
            url: 'controlador/ProductoController.php',
            type: 'POST',
            data: permisobod,
            success: function(response){
                const bodega = JSON.parse(response);
                let template = `<option value="0" selected disabled></option>`;
                $.each(bodega,function(index,bodega) {  
                    template += `<option value="${bodega.id_bod}">${bodega.nom_bod}</option>`
                });
                SelectBodega.html(template)
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Error: '+ textStatus+'||'+errorThrown)
            }
        })
    }

    obtenerBodega(permisobod);

//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------OBTENCION DE SUCURSAL---------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//

    SelectBodega.on('change',function(){
        const idBodega = SelectBodega.val()
        const permisosuc = {'idBodega':idBodega}
        obtenerSucursal(permisosuc)
        
    })

    function obtenerSucursal(idBodega){
        $.ajax({
            url: 'controlador/ProductoController.php',
            type: 'POST',
            data: idBodega,
            success: function(response){
                const sucursal = JSON.parse(response);
                let template = `<option value="0" selected disabled></option>`;
                $.each(sucursal, function(index,sucursal) {  
                    template += `<option value="${sucursal.id_suc}">${sucursal.desc_suc}</option>`
                });
                SelectSucursal.html(template)
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Error: '+ textStatus+'||'+errorThrown)
            }
        })
    }
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-------------------------OBTENCION DE MONEDA---------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//

    function obtenerMoneda(){
        $.ajax({
            url: 'controlador/ProductoController.php',
            type: 'GET',
            success: function(response){
                const moneda = JSON.parse(response);
                let template = `<option value="0" selected disabled></option>`;
                $.each(moneda, function(index,moneda) {
                    template += `<option value="${moneda.id_mon}">${moneda.desc_mon}</option>`
                });
                SelectMoneda.html(template);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Error: '+ textStatus+'||'+errorThrown)
            }
        })
    }
    obtenerMoneda();

//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------VALIDACION DE CASILLAS--------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//


    const checkboxes = $('.opciones');

    checkboxes.on('change', function() {
        const checkedCheckboxes = $('.opciones:checked');  

        if (checkedCheckboxes.length >= 2) {
            checkboxes.each(function() {
                if (!$(this).is(':checked')) {
                    $(this).prop('disabled',true);
                }
            });
        } else {
            checkboxes.prop('disabled',false)

        }
    });


    $("input[type='checkbox']").on('change', function() {

        $("input[type='checkbox']").removeAttr('id');
        var checkboxesSeleccionados = $("input[type='checkbox']:checked");
        checkboxesSeleccionados.each(function(index) {
            $(this).attr('id', 'checkbox' + (index + 1));
        });
    });





//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//------------------------GUARDADO DE PRODUCTO---------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
    
    $('#formulario').on('submit',function(e){

        e.preventDefault();
        const codigo = $('#codigo').val();
        const nombre = $('#nombre').val();
        const bodega = $('#bodega').val();
        const precio = $('#precio').val();
        const sucursal = $('#sucursal').val();
        const checkedCheckboxes = $('.opciones:checked');
        const moneda = $('#moneda').val();
        const documento = $('#descripcion').val();

        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
        const regexDecimal = /[0-9]{2,}\.[0-9]{2,}/;

        if (codigo.trim() === "") {
            alert("El código del producto no puede estar en blanco")
        } else if (!regex.test(codigo)) {
            alert("El código del producto debe contener letras y números");
        } else if(codigo.length < 5 || codigo.length > 15){
            alert("El código del producto debe tenerentre 5 y 15 caracteres")
        } else{
            if (nombre.trim() === "") {
                alert("El nombre del producto no puede estar vacio");
            }else if(nombre.length < 2 || nombre.length > 50){
                alert("El nombre del producto debe tener entre 2 y 50 caracteres")
            }else{
                if (bodega === "0") {
                    alert("Debe seleccionar una bodega")
                }else{
                    if (sucursal === "0") {
                        alert("Debe seleccionar una sucursal para la bodega seleccionada")
                    }else{
                        if (moneda === "0") {
                            alert("Debe seleccionar una moneda para el producto")
                        }else{
                            if (precio.trim()==="") {
                                alert("El precio del producto no puede estar en blanco");
                            }else if (!precio.match(regexDecimal)) {
                                alert("El precio del producto debe ser un número positivo con hasta dos decimales");
                            }else{
                                if (checkedCheckboxes.length<2) {
                                    alert("Debe seleccionar al menos dos materiales para el producto");
                                }else{
                                    if (documento.trim()==="") {
                                        alert("La descripcion del producto no puede estar en blanco")
                                    }else if(documento.length<10 || documento.length>1000){
                                        alert("La descripcion del producto debe tener entre 10 a 1000 caracteres")
                                    }else{
                                        var checkboxes = {}
                                        checkedCheckboxes.each(function(){
                                            checkboxes [$(this).attr("id")] = $(this).val()
                                        })
                                        
                                        var check = $.param(checkboxes);
                                        var datos = $("#formulario").serialize();
                                        var datosCombinados = datos + '&' + check;
                                        $.ajax({
                                            url: 'controlador/ProductoController.php',
                                            type: 'POST',
                                            data:{'datosCombinados':datosCombinados},
                                            success: function(response){
                                                console.log(response)
                                                var respuesta = JSON.parse(response);
                                                if (respuesta.status == 1) {
                                                    alert(respuesta.message)
                                                    $('#formulario')[0].reset()
                                                    $('.opciones:disabled').prop('disabled', false);
                                                }else{
                                                    alert(respuesta.message)
                                                }
                                            },
                                            error: function(jqXHR, textStatus, errorThrown){
                                                console.log('Error: '+ textStatus+'||'+errorThrown)
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
    })
})