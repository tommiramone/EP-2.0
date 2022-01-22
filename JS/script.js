//JQUERY - FORMS

// PASAR LA INFORMACION A UN ARCHIVO LOCAL MEDIANTE AJAX 
// CUANDO SE PULSE "MÚSICA" U "OTRO" EN EL "SELECT" APARECER UN INPUT PARA COMPLETAR DEPENDIENDO EL CASO. 
$(() => {

    //ESTILO DE STATUS
    $('#status').css({
        'color': 'white',
    })

    //VARIABLES/INPUTS
    let metodo = $('#form').attr('method');
    let nombreU;
    let nombreP;
    let email;
    let material;
    let opciones;
    let genero;
    let otros;
    let adicional;

    const url = "https://jsonplaceholder.typicode.com/photos";

    //¿COMO VALIDAR CON JQUERY Y LUEGO HACER UNA LLAMADA AJAX?

    $('#form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            beforeSend: function () {
                //SPINNER DE LOADING PARA STATUS
                $('#status').append(
                        `
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    `
                    ),
                    //ASIGNACIÓN DE VALORES PARA LAS VARIABLES
                    nombreU = $('#nombre').val();
                nombreP = $('#proyecto').val();
                email = $('#email').val();
                material = $('#material').val();
                opciones = $('#opciones').val();
                adicional = $('#info').val();
                genero = $('#genero').val();
                otros = $('#otros').val();    
            },
            url: url,
            type: metodo,
            data: {
                'nombre del usuario': nombreU,
                'nombre del proyecto': nombreP,
                'email': email,
                'material': material,
                'tipo de proyecto': opciones,
                'genero músical': genero,
                'otro tipo de proyecto': otros,
                'descripción': adicional,

            },
            //ACCIÓN AL ENVIARSE O AL HABER ERROR
            success: function (jqXHR, resp, data) {
                console.log(data)
                console.log(resp)
                $('#status').text(resp);
                $('#form')[0].reset()
                $('#genero').hide()
            },
            error: function (jqXHR, status, resp) {
                $('#status').text(status)
            }
        })


    })

    //INPUT QUE APARECE PARA GENERO
    $('#genero').hide()
    $("#opciones").change(function () {
        if (this.value == 2) {
            $("#genero").show();
        } else {
            $("#genero").hide();
        }
    })

    //INPUT PARA OTROS
    $('#otros').hide() 
    $('#opciones').change(function () {
        if (this.value == 4) {
            $('#otros').show();
        } else {
            $('#otros').hide()
        }
    })
})