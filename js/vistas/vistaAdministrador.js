/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEliminada.suscribir(function() {
    contexto.reconstruirLista();
  });
  //TODO suscribir al evento para reconstruir lista y así desacoplar esa funcion del Modelo
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    validacionDeFormulario();
    this.reconstruirLista();
    this.configuracionDeBotones();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
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

  //TODO desacoplar funcion del modelo
  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    //TODO Desacoplar esta linea del modelo
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociación de eventos
    e.botonAgregarPregunta.click(function() {
      var pregunta = e.pregunta.val();
      var respuestas = [];
      
      $('[name="option[]"]').each(function() {
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
    e.botonBorrarPregunta.click(function() {
      var id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.borrarPregunta(id);
    });   
  },


  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
