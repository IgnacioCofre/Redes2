import math


def square_root(pistas):
    i = 0
    for i in range(len(pistas)):
        if pistas[i] == 0:
            print "se puede asignar la pista: "+str(i)
            return i

def Asigaltura(alturas):
    i = 1
    cond = True
    while cond:
        print "entro al while"
        if i not in alturas:
            alturas.add(i)
            cond = False
        else:
            i=i+1
    return i
