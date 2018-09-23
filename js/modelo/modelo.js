/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = JSON.parse(localStorage.getItem('preguntas'));    
  if (localStorage.getItem('preguntas') === null) {
    this.preguntas = [];
  };

  this.respuestas = JSON.parse(localStorage.getItem('respuestas'));
  if (localStorage.getItem('respuestas') === null) {
    this.respuestas = [];
  };

  this.ultimoId = parseInt(localStorage.getItem("ultimoId"));
  if (localStorage.getItem("ultimoId") === null) {
    this.ultimoId = 0;
  };

  //inicializacion de eventos
  this.preguntasModificadas = new Evento(this);
  this.votoSumado = new Evento(this);
  this.respuestasModificadas = new Evento(this);  
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    return this.ultimoId++;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    this.guardarId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntasModificadas.notificar(this.preguntas);
  },

  //se elimina una pregunta dado su ID
  borrarPregunta: function(id) {
    for (var i = 0; i < this.preguntas.length; i++) {
      if(this.preguntas[i].id == id) {
        this.preguntas.splice(i, 1);
        break;
      }
    }
    this.guardar();
    this.preguntasModificadas.notificar(this.preguntas);
  },

  //se edita una pregunta dado su ID y la nueva pregunta
  editarPregunta: function(id, nuevoTextoPregunta) {
    for (var i = 0; i < this.preguntas.length; i++) {
      if (this.preguntas[i].id == id) {
        this.preguntas[i].textoPregunta = nuevoTextoPregunta;
        break;
      }
    }
    this.guardar();
    this.preguntasModificadas.notificar(this.preguntas);
  },

  //se suman los votos realizados por el usuario a las preguntas disponibles.
  //se guarda la eleccion de cada uno de los usuarios que votan.
  sumarVoto: function(usuario, votos) {
    for (let i = 0; i < votos.length; i++) {
      var id = votos[i].id;
      var voto = votos[i].cantidadPorRespuesta.textoRespuesta;
      for (var j = 0; j < this.preguntas.length; j++) {
        if(this.preguntas[j].id == id) {
          for (var y = 0; y < this.preguntas[j].cantidadPorRespuesta.length; y++) {
            if (this.preguntas[j].cantidadPorRespuesta[y].textoRespuesta == voto) {
              this.preguntas[j].cantidadPorRespuesta[y].cantidad++;
              break;
            }
          }
          break;
        }
      }      
    }
    var votoUsuario = {usuario: usuario, votos: votos};
    this.respuestas.push(votoUsuario);
    this.guardar();    
    this.votoSumado.notificar(this.preguntas);
  },

  //se eliminan las preguntas, respuestas y se re-inicializa el ID.
  borrarTodo: function () {
    this.preguntas = [];
    this.respuestas = [];
    this.ultimoId = 0;
    this.guardar();    
    this.preguntasModificadas.notificar(this.preguntas);
    this.respuestasModificadas.notificar(this.respuestas);
  },

  sendPreguntas: function () {
    this.preguntasModificadas.notificar(this.preguntas);
  },

  sendRespuestas: function () {
    this.respuestasModificadas.notificar(this.respuestas);
  },

  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem('preguntas', JSON.stringify(this.preguntas));    
    localStorage.setItem('respuestas', JSON.stringify(this.respuestas));
  },
  
  guardarId: function() {
    localStorage.setItem('ultimoId', this.ultimoId);
  }
};
