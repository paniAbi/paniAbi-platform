# [#10] Mostrar los precios sin centavos cuando son enteros

Tarjeta de Trello: https://trello.com/c/nBy4rWGp

## 1. Qué cambia para Abril

- **Hoy:** Todos los precios de la lista de productos muestran dos decimales, incluso cuando no tienen centavos.
- **Después de esta tarjeta:** Los precios enteros se muestran sin ",00". Los precios con centavos conservan sus dos decimales y los miles se siguen separando con punto.
- **Por qué le importa a la panadería:** Abril y sus clientes pueden leer los precios enteros con mayor facilidad.

## 2. Comportamiento esperado

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
| Un producto cuesta 800 pesos. | Ve "$ 800". |
| Un producto cuesta 1500 pesos. | Ve "$ 1.500". |
| Un producto cuesta 1250 pesos con 50 centavos. | Ve "$ 1.250,50". |
| Un producto cuesta 800 pesos con 5 centavos. | Ve "$ 800,05". |

## 3. Qué cambia respecto de hoy

Se deja de mostrar ",00" en los precios enteros de la lista de productos. Los importes siguen siendo los mismos.

## 4. Qué vamos a probar

- [ ] Un precio entero de 800 pesos aparece como "$ 800", sin ",00".
- [ ] Un precio entero de 1500 pesos aparece como "$ 1.500" y conserva el punto de los miles.
- [ ] Un precio de 1250 pesos con 50 centavos aparece como "$ 1.250,50", con sus dos decimales.
- [ ] Un precio de 800 pesos con 5 centavos aparece como "$ 800,05", conservando el cero antes del cinco.
- [ ] Si no hay productos, se sigue mostrando el mensaje actual de lista vacía.
- [ ] Los nombres de los productos siguen apareciendo junto a sus precios y el símbolo de pesos se conserva.

## 5. Cómo lo comprueba Abril

1. Una vez que Juan publique el cambio, abrir la página de productos de la web real: https://pani-abi-platform.vercel.app/products.
2. Mirar los productos que ya existen: los precios enteros deben verse sin ",00" y conservar el punto de los miles. Por ejemplo, un precio de 1500 pesos se verá como "$ 1.500".
3. Si entre los productos existentes hay precios con centavos, comprobar que siguen mostrando dos decimales. Por ejemplo, 1250 pesos con 50 centavos se verá como "$ 1.250,50".
4. Comprobar que cada producto conserva su nombre y el mismo importe. No hace falta crear ni modificar productos para esta revisión. Los ejemplos que no estén entre los productos existentes se cubrirán con los chequeos automáticos antes de publicar.

## 6. Pasos

1. Mostrar los precios enteros sin ",00" y comprobar que los precios con centavos, los puntos de los miles, los nombres y la lista vacía se conservan.

## 7. Información nueva para guardar

No.

## 8. Fuera de esta tarjeta

La forma de cargar el precio en el formulario para agregar productos y los demás textos de la página.

## 9. Riesgos para el negocio

Ocultar centavos que sí existen podría hacer que Abril o sus clientes lean un precio incorrecto. Al revisar, prestar atención a que se conserven ambos decimales cuando el precio tiene centavos y al punto de los miles.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación
