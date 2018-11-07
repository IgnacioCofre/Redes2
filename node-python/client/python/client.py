import grpc
import time
import vuelos_pb2 as pb


def main():
    """Python Client for Employee leave days"""

    ip_client = raw_input("Ingrese identificador del vuelo: ")
    # Create channel and stub to server's address and port.
    channel = grpc.insecure_channel('localhost:50050')
    stub = pb.AsigStub(channel)


    try:
        response = stub.Asig_pistas(pb.Request(ip_client = ip_client, altura = 0))
        if response.permiso == True:
            print "La torre "+response.ip_server+" a asignado la pista "+str(response.pista_at)
            time.sleep(10)
            cond_despegue = True
            while cond_despegue :
                print "Se hace la peticion de despegue"
                response_again = stub.Asig_salida(pb.Request(ip_client = ip_client, altura = 0))
                if response_again.permiso :
                    print "La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at)
                    print "La altura de despeque es: "+str(response_again.altura * 10)+"[m] de altura"
                    cond_despegue = False
                else :
                    print "La torre "+response_again.ip_server+" no ha podido asignar "
                    print "El despegue a quedado en lista de espera" #poner la posicion en la lista de espera
                    time.sleep(10)
        else:
            print "La torre "+response.ip_server+" no ha podido asignar pista de aterrizaje"
            print "Se debe esperar a una altura de: "+str(response.altura * 10)+"[m] de altura"
            altura_espera = response.altura
            time.sleep(10)
            cond = True
            while cond :
                response_again = stub.Asig_pistas(pb.Request(ip_client = ip_client,altura = altura_espera))
                if response_again.permiso :
                    cond = False
                    print "La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at)
                    cond_despegue = True
                    while cond_despegue :
                        time.sleep(10)
                        print "Se hace la peticion de despegue"
                        response_again = stub.Asig_salida(pb.Request(ip_client = ip_client, altura = 0))
                        if response_again.permiso :
                            print "La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at)
                            cond_despegue = False
                        else :
                            print "La torre "+response_again.ip_server+" no ha podido asignar "
                            print "El despegue a quedado en lista de espera"
                else:
                    print "La torre "+response_again.ip_server+" no ha podido asignar pista de aterrizaje"
                    print "Se debe esperar a una altura de: "+str(response_again.altura * 10)+"[m] de altura"
                    time.sleep(10)



    # Catch any raised errors by grpc.
    except grpc.RpcError as e:
        print("Error raised: " + e.details())

if __name__ == '__main__':
    main()
