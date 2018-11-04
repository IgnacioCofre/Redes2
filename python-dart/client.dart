import 'dart:async';

import 'package:grpc/grpc.dart';

//import 'common.dart';
import 'calculator.pb.dart';
import 'calculator.pbgrpc.dart';


Future<Null> main(List<String> args) async {
  final channel = new ClientChannel('localhost',
      port: 50051,
      options: const ChannelOptions(
          credentials: const ChannelCredentials.insecure()));
  final stub = new CalculatorClient(channel);

  final name = args.isNotEmpty ? args[0] : 'Ip Client';

  try {
    final response = await stub.SquareRoot(new Request()..ip_client = name);
    print('Pista usada: ${response.pista}');
    print('Altura de espera: ${response.altura}');
    print('Ip del servidor: ${response.ip_server}');
  } catch (e) {
    print('Caught error: $e');
  }
  await channel.shutdown();
}
