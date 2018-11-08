const grpc = require('grpc');
const proto = grpc.load('proto/vuelos.proto');
const server = new grpc.Server();
var readline = require('readline-sync');
var towers = true;
var torres = {};
console.log("Ingrese el Nombre, la IP y el Puerto de las otras torres: ")
while(towers){
  var namet = readline.question("Nombre del Aeropuerto: ");
  var Ipt = readline.question("Ip del Aeropuerto: ");
  var puertot = readline.question("Puerto del Aeropuerto: ");
  torres[namet]=Ipt.concat(':',puertot);

  var condi = readline.question("Desea ingresar mas Aeropuertos?: (Y/N) ");
  if (condi == 'N'){
    towers=false;
  }

}


let aero = dir;
console.log("Ingrese los datos del servidor")
var nombre_torre = readline.question("Ingrese el nombre de la torre: ");
var n_pistas_aterrizaje = parseInt(readline.question("Ingrese el numero de pistas de aterrizaje: "));
var n_pistas_despegue = parseInt(readline.question("Ingrese el numero de pistas de despegue: "));
var puerto = readline.question("Ingrese el Puerto de la torre: ");
console.log();
console.log("El numero de pistas de aterrizaje es: "+n_pistas_aterrizaje);
console.log("El numero de pistas de despegue: "+n_pistas_despegue);
console.log("El nombre del aeropuerto: "+nombre_torre);
var ip = '0.0.0.0:';
var dir = ip.concat(puerto);

var c_espera = [];
var c_despegue = [];
var p_aterrizaje = {};
var p_despegue = {};
var alturas= new Set();


for (var i = 0; i<n_pistas_aterrizaje; i++){
  p_aterrizaje[i]="";
}
for (var j = 0; j<n_pistas_despegue; j++){
  p_despegue[j]="";
}
console.log(p_aterrizaje);
console.log(p_despegue);

//define the callable methods that correspond to the methods defined in the protofile
/**
Torre:
- Bencina
- Capacidad de pasajeros
- Altura del avion antes de aterrizar
- pista de aterrizaje de un vuelo entrante
- pista de despegue, en que lugar de la cola esta y cual viene antes que el
(aerolinea y numero de vuelo)
- Antes de finalizar la comunicacion con el avion, comunicar la direccion
IP de la torre de control destino al avion saliente y la altura a la que
debe despegar para evitar colisiones.
*/
server.addService(proto.vuelos.Asig.service, {
  Asig_pistas(call, callback) {
    var ip_client = call.request.ip_client;
    console.log("Llego llamada del avion con direccion ip: "+ip_client);
    var permiso_aterrisaje = 1;
    var pista = 0;

    if (c_espera.length == 0){
      while (permiso_aterrisaje == 1 && pista < n_pistas_aterrizaje){
        if (p_aterrizaje[pista] == ""){
          p_aterrizaje[pista] = ip_client;
          permiso_aterrisaje = 0;
          let ip_server = "localhost";
          let altura = 0;
          let pista_at = pista;
          console.log("Al vuelo "+ip_client+" se le ha asignado la pista de aterrizaje "+pista);
          callback(null, {
            permiso: true,
            pista_at,
            altura,
            ip_server,
            aero,
          });
        }
        else { //caso contrario
          pista = pista + 1;
          if (pista == n_pistas_aterrizaje){
            let pista_at = 0;
            let ip_server = "localhost";
            cond = true;
            alt = 5;
            while (cond){
              if(alturas.has(alt) == false){
                alturas.add(alt);
                let altura = alt;
                cond =false;
                c_espera.push(ip_client);
                callback(null, {
                  permiso: false,
                  pista_at,
                  altura,
                  ip_server,
                  aero,
                });
              }
              else {alt = alt +5;}
            }
            console.log("no se pudo asignar pista de aterizaje a al vuelo"+ip_client)
          }
        }
      }
    }

    else {
      var permiso_aterrisaje = 1;
      var pista = 0;
      if (c_espera[0] == ip_client){
        while (permiso_aterrisaje == 1 && pista < n_pistas_aterrizaje){
          if (p_aterrizaje[pista] == ""){
            p_aterrizaje[pista] = ip_client;
            permiso_aterrisaje = 0;
            let ip_server = "localhost";
            let altura = 0;

            let pista_at = pista;
            console.log("Al vuelo "+ip_client+" se le ha asignado la pista de aterrizaje "+pista);
            callback(null, {
              permiso: true,
              pista_at,
              altura,
              ip_server,
              aero,
            });
            alturas.delete(call.request.altura);
            c_espera.splice(0,1,);
          }
          else {
            pista = pista + 1;

            if (pista == n_pistas_aterrizaje){
              let pista_at = 0;
              let ip_server = "localhost";
              let altura = call.request.altura;
              callback(null, {
                permiso: false,
                pista_at,
                altura,
                ip_server,
                aero,
              });
              console.log("no se pudo asignar pista de aterizaje a al vuelo"+ip_client)
            }
          }
        }
      }
      else { //caso contrario
        let pista_at = 0;
        let ip_server = "localhost";
        if (c_espera.includes(ip_client) == false){
          c_espera.push(ip_client);
          cond = true;
          alt = 5;
          while (cond){
            if(alturas.has(alt) == false){
              alturas.add(alt);
              let altura = alt;
              cond =false;
              callback(null, {
                permiso: false,
                pista_at,
                altura,
                ip_server,
                aero,
              });
            }
            else {alt = alt +5;}
          }
        }
        else{
          let altura = call.request.altura;
          callback(null, {
            permiso: false,
            pista_at,
            altura,
            ip_server,
            aero,
          });
        }


        console.log("no se pudo asignar pista de aterizaje a al vuelo"+ip_client)
      }
    }
    console.log(p_aterrizaje);
    console.log(c_espera);
  },

  Asig_salida(call, callback){
    var ip_client = call.request.ip_client;
    console.log("Llego llamada del avion con direccion ip: "+ip_client);
    var permiso_despegue = 1;
    var pista = 0;
    var despeg = true;

    if (c_despegue.length == 0){
      while (permiso_despegue == 1 && pista < n_pistas_despegue){
        if (p_despegue[pista] == ""){
          p_despegue[pista] = ip_client;
          permiso_despegue = 0;
          let ip_server = "localhost";

          let pista_des = pista;
          console.log("Al vuelo "+ip_client+" se le ha asignado la pista de despegue "+pista_des);

          var l = 0;
          
          if(despeg){
            var destiny = readline.question("A que destino desea ir?: ");
            let pista_at = 0;
            let altura = Math.floor((Math.random() * 50) + 1);
            if (destiny in torres){
              let aero = torres[destiny];
              p_despegue[ip_client] = "";
              callback(null, {
                permiso: true,
                pista_at,
                altura,
                ip_server,
                aero,
              });
              
            }
            else{
              console.log("Porfavor ingrese un aeropuerto valido!");
            }
          }
          
          while (l < n_pistas_aterrizaje){
            if (p_aterrizaje[l] == ip_client){
              p_aterrizaje[l] = "";
              console.log("se desocupo la pista de aterrizaje: "+l);
              l = n_pistas_aterrizaje;
            }
            else{l = l+1;}
          }
          
        }
        

        else {
          pista = pista + 1;
          if (pista == n_pistas_despegue){
            let pista_at = 0;
            let ip_server = "localhost";
            let altura = 0;
            c_despegue.push(ip_client);
            
            console.log("no se pudo asignar pista de despegue a al vuelo "+ ip_client +" se asigna a la cola de espera");
            console.log(c_despegue);
          }
        }
      }
    }

    else {
      var permiso_despegue = 1;
      var pista = 0;
      if (c_despegue[0] == ip_client){
        while (permiso_despegue == 1 && pista < n_pistas_despegue){
          if (p_despegue[pista] == ""){
            p_despegue[pista] = ip_client;
            console.log("Al vuelo "+ip_client+" se le ha asignado la pista de despegue "+pista);

            while (l < n_pistas_aterrizaje){
              if (p_aterrizaje[l]== ip_client){
                p_aterrizaje[l] = "";
                console.log("se desocupo la pista de despegue: "+l);
              }
              l = l+1;
            }

            permiso_despegue = 0;
            let ip_server = "localhost";
            cond = true;
            alt = 5;
            while (cond){
              if(alturas.has(alt) == false){
                let altura = alt;
                cond =false;
                let pista_at = pista;
                //desocupar pista de despegue
                
              }
              else {alt = alt +5;}
            }

            c_despegue.splice(0,1,);//eliminar el primer elemento de la lista de espera
          }
          else {
            pista = pista + 1;
            if (pista == n_pistas_despegue){
              let pista_at = 0;
              let ip_server = "localhost";
              let altura = 0;
              var k = 0;

              console.log("no se pudo asignar pista de despegue a al vuelo"+ip_client)
            }
          }
        }
      }
      else {
        let pista_at = 0;
        let ip_server = "localhost";
        cond = true;
        alt = 5;
        if (c_despegue.includes(ip_client) == false){
          c_despegue.push(ip_client);
        }
        console.log("no se pudo asignar pista de despegue a al vuelo"+ip_client)
        console.log(c_espera);
      }
    }
  },

});



//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind(dir, grpc.ServerCredentials.createInsecure());

//Start the server
server.start();
console.log('grpc server running on port:', dir);
