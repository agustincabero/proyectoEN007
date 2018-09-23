/*
 * Vista usuario
 */
var VistaUsuario = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  //suscripcion a eventos del modelo
  this.modelo.preguntasModificadas.suscribir( function(modelo, preguntas) {
    contexto.reconstruirLista(preguntas);
    contexto.reconstruirGrafico(preguntas);
  });
  this.modelo.votoSumado.suscribir( function(modelo, preguntas) {
    contexto.reconstruirGrafico(preguntas);
  });
};

VistaUsuario.prototype = {
  //muestra la lista por pantalla y agrega el manejo del boton agregar
  inicializar: function() {
    this.controlador.getPreguntas();
    var elementos = this.elementos;
    var contexto = this;
    
    elementos.botonAgregar.click( function() {
      var usuario = $('#nombreUsuario').val();
      var inputRespuestas = $('input:checked');
      var votos = [];
      for (let i = 0; i < inputRespuestas.length; i++) {
        var id = inputRespuestas[i].name;
        var res = inputRespuestas[i].value;
        var voto = {id: id, cantidadPorRespuesta: {textoRespuesta: res}};
        votos.push(voto);        
      };
      contexto.controlador.agregarVotos(usuario, votos);  
    });
  },

  //reconstruccion de los graficos de torta
  reconstruirGrafico: function(preguntas){
    var contexto = this;
    preguntas.forEach( function(clave){
      var listaParaGrafico = [[clave.textoPregunta, 'Cantidad']];
      var respuestas = clave.cantidadPorRespuesta;
      respuestas.forEach ( function(elemento) {
        listaParaGrafico.push([elemento.textoRespuesta,elemento.cantidad]);
      });
      contexto.dibujarGrafico(clave.textoPregunta, listaParaGrafico);
    })
  },

  //reconstruccion de la lista de preguntas disponibles
  reconstruirLista: function(preguntas) {
    var listaPreguntas = this.elementos.listaPreguntas;
    listaPreguntas.html('');
    var contexto = this;
    preguntas.forEach( function(clave){
      listaPreguntas.append(`<div id="${clave.id}" value="${clave.textoPregunta}">${clave.textoPregunta}</div>`);
      var respuestas = clave.cantidadPorRespuesta;
      contexto.mostrarRespuestas(listaPreguntas, respuestas, clave);
    })
  },

  //muestra respuestas
  mostrarRespuestas:function(listaPreguntas,respuestas, clave){
    respuestas.forEach ( function(elemento) {
      listaPreguntas.append($('<input>', {
        type: 'radio',
        value: elemento.textoRespuesta,
        name: clave.id,
      }));
      listaPreguntas.append($("<label>", {
        for: elemento.textoRespuesta,
        text: elemento.textoRespuesta
      }));
    });
  },

  dibujarGrafico: function(nombre, respuestas){
    var seVotoAlgunaVez = false;
    for(var i=1;i<respuestas.length;++i){
      if(respuestas[i][1]>0){
        seVotoAlgunaVez = true;
      }
    }
    var contexto = this;
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable(respuestas);

      var options = {
        title: nombre,
        is3D: true,
      };
      var ubicacionGraficos = contexto.elementos.graficosDeTorta;
      var id = (nombre.replace(/\W/g, '')).split(' ').join('')+'_grafico';
      if($('#'+id).length){$('#'+id).remove()}
      var div = document.createElement('div');
      ubicacionGraficos.append(div);
      div.id = id;
      div.style.width = '400';
      div.style.height = '300px';
      var chart = new google.visualization.PieChart(div);
      if(seVotoAlgunaVez){
        chart.draw(data, options);
      }
    }
  },
};
