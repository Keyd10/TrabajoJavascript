//--------------CAROUSEL-------------//
let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

function showSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides; // Ajusta el índice para que sea cíclico
   
}

// Iniciar el carrusel
showSlide(currentIndex);

//Cargar datos del JSON
function cargar() {
    $.ajax({
        url: "../JSON/noticias.json", // Usa esta ruta si el archivo JSON está en la carpeta 'Json'
        type: "GET",
        dataType: "json",
        success: function(data) {
            console.log("Solicitud AJAX exitosa");
            console.log(data); // Verifica el contenido del JSON

            let obj_json = data;
            let cadena = ""; // Inicializa la variable cadena

            for (let i = 0; i < obj_json.noticias.length; i++) {
                cadena += "Título: <strong>" + obj_json.noticias[i].titulo + "</strong><br>";
                cadena += "Descripción: <strong>" + obj_json.noticias[i].descripcion + "</strong><br>";
                cadena += "Fecha: <strong>" + obj_json.noticias[i].fecha + "</strong><br>";
                cadena += "Enlace: <a href='" + obj_json.noticias[i].enlace + "'>" + obj_json.noticias[i].enlace + "</a><br><br>";
            }

            console.log("Contenido generado: ", cadena); // Verifica el contenido generado
            $("#noticiasFit").html(cadena); // Inserta el contenido en el div
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar el archivo JSON: ", status, error); // Muestra errores en la consola
            alert("Error al cargar el archivo JSON");
        }
    });
}
cargar()

/*--------------------Formulario---------------*/

// Verifica si existe el botón 'enviar' y el formulario antes de añadir el eventListener
document.addEventListener("DOMContentLoaded", function() {
    let miBoton = document.getElementById("enviar");
    let miForm = document.getElementById("formulario");

    if (miBoton && miForm) {  // Solo si ambos elementos existen
        miBoton.addEventListener("click", (evento) => {
            evento.preventDefault();
            calcularPresupuesto();

            let valido = validar();
            if (valido === true) {
                miForm.submit();
            }
        });
    }
});

function validar(){
    let nombre = document.getElementById("nombreForm").value;
    let apellido = document.getElementById("apellidoForm").value
    let telefono = document.getElementById("tfnForm").value
    let email = document.getElementById("emailForm").value
/*-------------nombre----------*/    
    if(nombre == null || nombre.trim() == ""){
        alert("El campo de nombre no puede estar vacío")
        return false;
    }
  //expresion regular del nombre
    let name_re = /^[a-zA-Z]{2,15}$/

    if(!name_re.exec(nombre)){
        alert("El campo de nombre puede tener una longitud máxima de 15 caracteres")
        return false;
    }
/*-------apellido--------*/

//expresion regular del apellido
    let apellido_re = /^[a-zA-Z\s]{2,40}$/;

    if(apellido == null|| apellido.trim() == ""){
        alert("El campo de apellido no puede estar vacío")
        return false;
    }
    if(!apellido_re.exec(apellido)){
        alert("El campo de apellido no puede tener una longitud mayor a 40 caracteres")
        return false;
    }
/*--------telefono------*/
    let telefono_re = /^[6789]\d{8}$/;
    if(telefono == null || telefono.trim() == ""){
        alert("el campo de teléfono, no puede estar vacío ")
        return false;
    }
    if(!telefono_re.exec(telefono)){
        alert("el campo teléfono no puede tener mas ni menos de 9 dígitos y comenzar en 6,7,8 o 9")
        return false;
    }

/*-------EMAIL--------*/

    let email_re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(email==null || email.trim() == ""){
        alert("el campo de email no puede estar vacío")
        return false;
    }
    if(!email_re.exec(email)){
        alert("el campo de email es erróneo")
        return false;
    }

    // condiciones 

    let condiciones = document.getElementById("condiciones")

    if(!condiciones.checked){
        alert("debes aceptar las condiciones")
        return false;
    }



    // si todo va bien 
        return true;
    }

/*-----------2º parte formulario--------*/

if (document.getElementById("actividades")) {
    document.getElementById("actividades").addEventListener("change", calcularPresupuesto);
    document.getElementById("plazo").addEventListener("input", calcularPresupuesto);
    document.getElementById("extra1").addEventListener("change", calcularPresupuesto);
    document.getElementById("extra2").addEventListener("change", calcularPresupuesto);
    document.getElementById("extra3").addEventListener("change", calcularPresupuesto);
}
function calcularPresupuesto(){
    //obtener el plan seleccionado
    let plan = document.getElementById("actividades").value;
    let precioPlan = 0;
    if(plan === ""){
        alert("Debe seleccionar un plan")
        return
    }else if(plan=="fitness"){
        precioPlan = 50;
        document.getElementById("PresupuestoEsti").value = 50
    }else if(plan=="boxeo"){
        precioPlan = 70;
        document.getElementById("PresupuestoEsti").value = 70
    }else if(plan == "soloGym"){
        precioPlan = 30;
        document.getElementById("PresupuestoEsti").value = 30
    }

    //obtener un plazo

    let plazo = parseInt(document.getElementById("plazo").value);
    if (isNaN(plazo) || plazo <=0 || plazo>12){
        alert("Debe ingresar un número de meses válido")
        return
    }

    //aplicar descuento del % por cada mes
    let descuento = 1 - (plazo*0.05);
    if (descuento <0.5){ 
        descuento = 0.5 ;//máximo 50%
    }

    //obtener los extras
    let extrasTotal = 0;
    if(document.getElementById("extra1").checked){
        extrasTotal += 10; //precio bebidas
    }
    if(document.getElementById("extra2").checked){
        extrasTotal +=20; //precio mochila
    }
    if(document.getElementById("extra3").checked){
        extrasTotal += 50 //precio personal trainer
    }

    //calcular precio final
    let total = (precioPlan + extrasTotal) * descuento;

    //mostrar el precio total
    document.getElementById("PresupuestoEsti").value = "$" + total.toFixed(2)

}

/*-----------CONTACTO--------------*/
let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        success,
        error,
        options
    )
}else{
    alert("Los servicios de geolocalización no están disponibles");
}



function success(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let map = L.map('mapa',{
        center:[latitude,longitude],
        zoom:17
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'¡Encuentranos con este mapa!'
    }).addTo(map)

    // configura el control de rutas
    
    let control = L.Routing.control({
        waypoints: [
            L.latLng(latitude,longitude),
            L.latLng(40.492639,-3.653881)
        ],
        language:'es',
        
    }).addTo(map)
}

function error(){
    let map = L.map('mapa',{
        center:[40.49367, -3.65894],
        zoom:14
    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'Mapa de muestra'}).addTo(map)
}