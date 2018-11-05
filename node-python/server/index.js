const grpc = require('grpc');

const proto = grpc.load('proto/vuelos.proto');
const server = new grpc.Server();

console.log("Ingrese los datos del servidor")
var readline = require('readline-sync');
var nombre_torre = readline.question("Ingrese el nombre de la torre:");
var n_pistas_aterrizaje = parseInt(readline.question("Ingrese el numero de pistas de aterrizaje:"));
var n_pistas_despegue = parseInt(readline.question("Ingrese el numero de pistas de despegue:"));
console.log();
console.log("El numero de pistas de aterrizaje es: "+n_pistas_aterrizaje);
console.log("El numero de pistas de despegue: "+n_pistas_despegue);
console.log("El nombre del aeropuerto: "+nombre_torre);
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
server.addProtoService(proto.vuelos.Asig.service, {
  Asig_pistas(call, callback) {
    var ip_client = call.request.ip_client;
    console.log(ip_client);

    let pista_at = n_pistas_aterrizaje;
    let altura = 3;

    callback(null, {
      permiso: true,
      pista_at,
      altura
    });
  }
});

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());

//Start the server
server.start();
console.log('grpc server running on port:', '0.0.0.0:50050');
