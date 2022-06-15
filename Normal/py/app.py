from cmath import log
from math import exp, pi, sqrt, inf
from scipy.integrate import quad

mu = Element("mu")
si = Element("si")
x = Element("x")
option = Element("option")
z = Element("z")

def f(x):
    return (1/sqrt(2*pi))*exp(-.5*x**2)

def calculate(*ags, **kws):
    xAux = (float(x.element.value) - float(mu.element.value)) / float(si.element.value)

    res, err = quad(f, xAux, inf)
    
    if option.element.value == '1':
        z.element.value = round(res, 5)
    elif option.element.value == '2':
        z.element.value = 1 - round(res, 5)
    elif option.element.value == '3':
        z.element.value = 2 * round(res, 5)
    elif option.element.value == '4':
        z.element.value = 1 - (2 * round(res, 5))
    # res, err = quad(f, float(x.element.value), inf)
