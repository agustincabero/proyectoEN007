/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
    this.modelo.agregarPregunta(pregunta, respuestas);
  },

  borrarPregunta: function(id) {
    this.modelo.borrarPregunta(id);
  },

  agregarVotos: function(usuario, votos) {
    this.modelo.sumarVoto(usuario, votos);
  },

  editarPregunta: function(id, nuevoTextoPregunta) {
    this.modelo.editarPregunta(id, nuevoTextoPregunta);
  },

  borrarTodo: function() {
    this.modelo.borrarTodo();
  },

  getPreguntas: function() {
    this.modelo.sendPreguntas();
  },

  getRespuestas: function() {
    this.modelo.sendRespuestas();
  }  
};
