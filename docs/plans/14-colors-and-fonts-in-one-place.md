# [#14] Los colores y tipografías en un solo lugar

Tarjeta de Trello: https://trello.com/c/MvHzyWiE/14-los-colores-y-tipograf%C3%ADas-en-un-solo-lugar

## 1. Qué cambia para Abril

- **Hoy:** los colores de la pantalla de productos están escritos a mano, uno
  por uno, en cada parte de la pantalla (la lista, el formulario, el
  encabezado). Son 30 lugares con 16 colores distintos, y algunos grises
  difieren en un tono casi invisible. La letra de los títulos también se elige
  en cada lugar. Cada pantalla nueva copia todo eso.
- **Después de esta tarjeta:** los colores y las tipografías tienen nombre
  ("el verde de los botones", "el gris de los textos secundarios", "la letra
  de los títulos") y viven en un solo lugar. La pantalla de productos los usa
  por nombre. Abril ve exactamente lo mismo que hoy.
- **Por qué le importa a la panadería:** con nueve etapas por delante, las
  pantallas nuevas van a salir con el mismo aspecto sin esfuerzo, y si algún
  día Abril quiere cambiar un color de la marca, se cambia en un solo lugar y
  se actualiza en todas las pantallas.

## 2. Comportamiento esperado

| Situación                                                                                              | Qué ve o puede hacer Abril                                                                           |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Abre la página de productos con productos cargados                                                     | La ve igual que hoy: los mismos colores en el encabezado, la lista, los precios y el formulario.     |
| Abre la página de productos sin productos                                                              | El mensaje de lista vacía se ve igual que hoy.                                                       |
| Pasa el mouse sobre el botón "Add product"                                                             | El botón cambia al mismo verde más oscuro que hoy.                                                   |
| Guarda un producto o comete un error en el formulario                                                  | Los mensajes aparecen con los mismos colores que hoy.                                                |
| Mira los títulos ("Products", "Add a product", el nombre paniAbi)                                      | Tienen la misma letra que hoy.                                                                       |
| Alguien del equipo agrega una pantalla nueva y escribe un color a mano en lugar de usar uno con nombre | Un chequeo automático lo frena antes de que llegue a Abril, y le indica usar los colores con nombre. |

## 3. Qué cambia respecto de hoy

Nada que Abril pueda ver: la pantalla queda idéntica. Cambia cómo está
ordenado por dentro, y queda la regla de que las pantallas nuevas usan los
colores y tipografías con nombre.

## 4. Qué vamos a probar

- [ ] Que en las pantallas no quede ningún color escrito a mano (un chequeo
      automático recorre todas las pantallas y falla si encuentra uno).
- [ ] Que ese mismo chequeo falle si alguien escribe un color a mano en una
      pantalla nueva.
- [ ] Que cada color con nombre tenga exactamente el mismo valor que el color
      que reemplaza, incluidos los grises casi iguales: no se unifica ninguno.
- [ ] Que los títulos sigan usando la misma letra que hoy.
- [ ] Lo que no tiene que cambiar: la lista con productos, la lista vacía, los
      precios, el formulario y sus mensajes siguen mostrándose como hoy (los
      chequeos automáticos que ya existen siguen pasando).

## 5. Cómo lo comprueba Abril

1. Abrir la página de productos en la web real,
   https://pani-abi-platform.vercel.app/products, y al lado la misma página
   con este cambio (en la computadora, o en el link de prueba del pedido de
   revisión).
2. Comparar las dos: encabezado, títulos, la lista de productos con sus
   precios, el formulario y el botón "Add product" (también pasando el mouse
   por encima). Tienen que verse iguales.
3. En la versión con el cambio, guardar un producto inventado
   ("TEST - Muffin de prueba") y ver que el mensaje aparece con los mismos
   colores que en la web real.

## 6. Pasos

1. Darles nombre a los colores y tipografías en un solo lugar, y hacer que la
   pantalla de productos los use por nombre, sin cambiar nada de lo que se ve.
2. Agregar el chequeo automático que frena colores escritos a mano en las
   pantallas, y escribir la regla en las reglas de código del equipo.

## 7. Información nueva para guardar

No.

## 8. Fuera de esta tarjeta

- Unificar los grises casi iguales en uno solo: cambiaría el aspecto, aunque
  sea muy poco. Si se quiere, va en otra tarjeta, mirándolo con Abril.
- Cambiar colores, tamaños de letra o espacios.
- Los textos de las pantallas (los pasa a español la tarjeta #15).

## 9. Riesgos para el negocio

- Que algún color cambie sin querer al moverlo y la pantalla se vea distinta.
  Por eso cada color conserva su valor exacto y se compara lado a lado con la
  web real.
- Que el botón o los mensajes cambien de color solo en un estado (al pasar el
  mouse, al mostrar un error), que no se ve a primera vista. Por eso el guion
  incluye esos estados.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación
