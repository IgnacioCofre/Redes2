from concurrent import futures
import grpc
import time
from vuelos_pb2 import *
from vuelos_pb2_grpc import *
import random


def main():
    """Python Client for Employee leave days"""
    inicio = input("Nombre de la Aerolınea y numero de Avion: ")
    aeroline=inicio.split()[0]
    ip_client=inicio.split()[1]
    # Create channel and stub to server's address and port.
    existe=True
    pasajeros={}
    combustible={}
    peso={}
    pemax = input("[Avion - "+ip_client +"]: Peso Maximo de carga [Kg]:")
    comb = input("[Avion - "+ip_client +"]: Capacidad del tanque de combustible [L]:")
    datos = input("[Avion - "+ip_client +"]: IP y Puerto Torre de Control inicial:")
    print(datos)
    channel = grpc.insecure_channel(datos)
    stub = AsigStub(channel)

    while(existe):

        try:
            response = stub.Asig_pistas(Request(ip_client = ip_client,altura = 0))
            if response.permiso == True:
                print ("La torre "+ response.ip_server + " a asignado la pista " + str(response.pista_at))
                time.sleep(10)
                cond_despegue = True
                while cond_despegue :
                    print ("Se hace la peticion de despegue")
                    response_again = stub.Asig_salida(Request(ip_client = ip_client, altura = 0))
                    if response_again.permiso :
                        print ("La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at))
                        print ("La altura de despegue es: "+str(response_again.altura * 10)+"[km] de altura")
                        channel = grpc.insecure_channel(response_again.aero)
                        stub = AsigStub(channel)
                        print(response_again.aero)
                        cond_despegue = False
                    else :
                        print ("La torre "+response_again.ip_server+" no ha podido asignar ")
                        print ("El despegue a quedado en lista de espera")
                        time.sleep(10)
            else:
                print ("La torre "+response.ip_server+" no ha podido asignar pista de aterrizaje")
                print ("Se debe esperar a una altura de: "+str(response.altura * 10)+"[km] de altura")
                altura_espera = response.altura
                time.sleep(10)
                cond = True
                while cond :
                    response_again = stub.Asig_pistas(Request(ip_client = ip_client, altura = altura_espera))
                    if response_again.permiso :
                        cond = False
                        print ("La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at))
                        cond_despegue = True
                        while cond_despegue :
                            time.sleep(10)
                            print ("Se hace la peticion de despegue")
                            response_again = stub.Asig_salida(Request(ip_client = ip_client, altura = 0))
                            if response_again.permiso :
                                print ("La torre "+response_again.ip_server+" a asignado la pista de despegue "+str(response_again.pista_at))
                                cond_despegue = False
                            else :
                                print ("La torre "+response_again.ip_server+" no ha podido asignar ")
                                print ("El despegue a quedado en lista de espera")
                    else:
                        print ("La torre "+response_again.ip_server+" no ha podido asignar pista de aterrizaje")
                        print ("Se debe esperar a una altura de: "+str(response_again.altura * 10)+"[km] de altura")
                        time.sleep(10)



        # Catch any raised errors by grpc.
        except grpc.RpcError as e:
            print("Error raised: " + e.details())

if __name__ == '__main__':
    main()
