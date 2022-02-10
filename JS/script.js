// PASAR LA INFORMACION A UN ARCHIVO LOCAL MEDIANTE AJAX 
// CUANDO SE PULSE "MÚSICA" U "OTRO" EN EL "SELECT" APARECER UN INPUT PARA COMPLETAR DEPENDIENDO EL CASO. 
// BOTON PARA SUBIR 

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
                $('#otros').hide()
            },
            error: function (jqXHR, status, resp) {
                $('#status').text(status)
            }
        })


    })

    //INPUT QUE APARECE PARA 'GENERO'
    $('#genero').hide()
    $("#opciones").change(function () {
        if (this.value == 2) {
            $("#genero").show();
        } else {
            $("#genero").hide();
        }
    })

    //INPUT PARA 'OTROS'
    $('#otros').hide() 
    $('#opciones').change(function () {
        if (this.value == 4) {
            $('#otros').show();
        } else {
            $('#otros').hide()
        }
    })

    
    //AGREGAMOS BOTÓN EN EL DOM
    $('#btnUp').append (
        `
        <button>
            <span class="iconify" data-icon="mdi:arrow-up-box" id="scroll" data-width="70" data-height="70"></span>
        </button>
        `
    )

    //HACEMOS QUE EL BOTÓN APAREZCA O DESAPAREZCA A MEDIDA QUE SCROLLEAMOS
    $(window).scroll(function (e) {
        if ($(this).scrollTop() > 1000) {
            $('#scroll').show('slow');
        } else {
            $('#scroll').hide('slow');
        }
    });

    //LE DAMOS LA FUNCIÓN DE PODER SUBIR LA PÁGINA SI HACEMOS CLICK EN ÉL
    $('#btnUp').on('click', function () {
        $('body, html').animate({
            scrollTop: '0px',
        })

    })
})