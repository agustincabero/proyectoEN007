/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntasModificadas.suscribir( function(modelo, preguntas) {
    contexto.reconstruirLista(preguntas);
  });
  this.modelo.respuestasModificadas.suscribir( function(modelo, respuestas) {
    contexto.reconstruirRespuestas(respuestas);
  });  
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.controlador.getPreguntas();
    this.controlador.getRespuestas();
    validacionDeFormulario();
    this.configuracionDeBotones();
  },

  construirElementoPregunta: function(pregunta){
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var nuevoItem = $(`<li class="list-group-item" id="${pregunta.id}">${pregunta.textoPregunta}</li>`);
    var interiorItem = $('.d-flex');
    interiorItem.find('h5').text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  construirElementoRespuesta: function(respuesta) {
    var nuevoItem = $(`<li class="">${respuesta.usuario}</li>`);
    var interiorItem = $('.d-flex');
    interiorItem.find('h5').text(respuesta.usuario);
    interiorItem.find('small').text(respuesta.votos.map(function(resp){
      var nombrePregunta = $('#'+resp.id).find('h5').text();
      return " " + nombrePregunta + ") " + resp.cantidadPorRespuesta.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function(preguntas) {
    var preguntas = preguntas;
    var lista = this.elementos.lista;
    lista.html('');    
    for (var i=0; i < preguntas.length; ++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  reconstruirRespuestas: function(respuestas) {
    var respuestas = respuestas;
    var listaResp = this.elementos.listaResp;
    listaResp.html('').removeClass('list-group');
    for (var i=0; i < respuestas.length; ++i){
      listaResp.append(this.construirElementoRespuesta(respuestas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;
    //asociación de eventos
    e.botonAgregarPregunta.click( function() {
      var pregunta = e.pregunta.val();
      var respuestas = [];      
      $('[name="option[]"]').each( function() {
        var respuesta = $(this).val();
        if(respuesta.length > 0){
          respuestas.push({
            'textoRespuesta': respuesta,
            'cantidad': 0
          });
        }
      });
      contexto.controlador.agregarPregunta(pregunta, respuestas);
      contexto.limpiarFormulario();
    });

    // Completar la asociación de de eventos a los
    // botones editarPregunta, borrarPregunta y borrarTodo
    e.botonBorrarPregunta.click( function() {
      var id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.borrarPregunta(id);
    });
    
    e.botonEditarPregunta.click( function() {
      var id = parseInt($('.list-group-item.active').attr('id'));
      if (isNaN(id)) {
        alert("Seleccione la pregunta a editar.");
      } else {
        var nuevoTextoPregunta = prompt("Por favor ingrese el nuevo texto de la pregunta", "");
        contexto.controlador.editarPregunta(id, nuevoTextoPregunta);
      }
    });

    e.borrarTodo.click( function(){
      contexto.controlador.borrarTodo();
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
