import grpc

# import the generated classes
import calculator_pb2
import calculator_pb2_grpc

# open a gRPC channel
channel = grpc.insecure_channel('localhost:50051')

# create a stub (client)
stub = calculator_pb2_grpc.CalculatorStub(channel)

# create a valid request message
# make the call
response = stub.SquareRoot(calculator_pb2.Request(ip_client="ip server"))

print(response.pista)
print(response.altura)
print(response.ip_server)
