from concurrent import futures
import grpc
import time
import vuelos_pb2 as pb
import random


def main():
    """Python Client for Employee leave days"""

    ip_client = input("Ingrese identificador del vuelo: ")
    # Create channel and stub to server's address and port.
    channel = grpc.insecure_channel('localhost:50050')
    stub = pb.AsigStub(channel)
    existe=True
    pasajeros={}
    combustible={}
    peso={}
    pamax=random.randint(60,500)
    pact=random.randint(60,500)
    comax=random.randint(100000,200000)
    comact=random.randint(100000,200000)
    while(pact>pamax):
        pact=random.randint(60,500)
    pasajeros[pamax]=pact
    while(comact>comax):
        comact=random.randint(100000,200000)
    pesmax=random.randint(5000,75*pamax+10*pamax)
    while(pesmax<75*pact+10*pact):
        pesmax=random.randint(5000,75*pamax+10*pamax)
    peso[pesmax]=75*pact+10*pact
    


    while(existe):

        try:
            response = stub.Asig_pistas(pb.Request(ip_client = ip_client))
            if response.permiso == True:
                print ("La torre "+ response.ip_server + " a asignado la pista " + str(response.pista_at))
                time.sleep(10)
                cond_despegue = True
                while cond_despegue :
                    print ("Se hace la peticion de despegue")
                    response_again = stub.Asig_salida(pb.Request(ip_client = ip_client))
                    if response_again.permiso :
                        print ("La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at))
                        cond_despegue = False
                    else :
                        print ("La torre "+response_again.ip_server+" no ha podido asignar ")
                        print ("El despegue a quedado en lista de espera")
                        time.sleep(10)
            else:
                print ("La torre "+response.ip_server+" no ha podido asignar pista de aterrizaje")
                time.sleep(10)
                cond = True
                while cond :
                    response_again = stub.Asig_pistas(pb.Request(ip_client = ip_client))
                    if response_again.permiso :
                        cond = False
                        print ("La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at))
                        cond_despegue = True
                        while cond_despegue :
                            time.sleep(10)
                            print ("Se hace la peticion de despegue")
                            response_again = stub.Asig_salida(pb.Request(ip_client = ip_client))
                            if response_again.permiso :
                                print ("La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at))
                                cond_despegue = False
                            else :
                                print ("La torre "+response_again.ip_server+" no ha podido asignar ")
                                print ("El despegue a quedado en lista de espera")
                    else:
                        print ("La torre "+response_again.ip_server+" no ha podido asignar pista de aterrizaje")
                        time.sleep(10)



        # Catch any raised errors by grpc.
        except grpc.RpcError as e:
            print("Error raised: " + e.details())

if __name__ == '__main__':
    main()
