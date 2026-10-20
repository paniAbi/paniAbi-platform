# [#9] Quitar el texto repetido de cada producto

Tarjeta de Trello: https://trello.com/c/zZfIae5a/9-sacar-available-for-sale-de-cada-producto-de-la-lista-flor

## 1. Qué cambia para Abril

- **Hoy:** debajo del nombre de cada producto aparece el texto “Available for sale”.
- **Después de esta tarjeta:** cada producto muestra solo su nombre y su precio.
- **Por qué le importa a la panadería:** la lista queda más limpia y fácil de recorrer, sin repetir una información que ya vale para todos los productos visibles.

## 2. Comportamiento esperado

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
| La lista tiene uno o varios productos | Cada producto muestra su nombre y su precio, sin el texto “Available for sale”. |
| Un producto tiene un nombre largo | El nombre sigue viéndose como hoy y el texto repetido no aparece. |
| Los productos tienen precios distintos | Cada precio sigue viéndose igual que hoy. |
| La lista no tiene productos | La pantalla sin productos sigue viéndose igual que hoy. |

## 3. Qué cambia respecto de hoy

Debajo de cada nombre desaparece el texto “Available for sale”. Los nombres, los precios, la pantalla sin productos y el formulario para agregar productos no cambian.

## 4. Qué vamos a probar

- [ ] Que una lista con varios productos muestre el nombre y el precio de cada uno, sin el texto “Available for sale”.
- [ ] Que los nombres largos y los precios distintos sigan apareciendo como hoy.
- [ ] Que la pantalla sin productos siga igual.

## 5. Cómo lo comprueba Abril

1. Abrir la página de productos.
2. Revisar una lista con productos inventados.
3. Confirmar que cada producto muestra su nombre y su precio, y que ya no aparece “Available for sale”.

## 6. Pasos

1. Comprobar automáticamente que la lista conserva los nombres y precios de los productos, quitar el texto repetido y guardar el paso.

## 7. Información nueva para guardar

No.

## 8. Fuera de esta tarjeta

- El resto de los textos de la página de productos.
- El formulario para agregar productos.

## 9. Riesgos para el negocio

- Que al quitar el texto se deje de mostrar por error el nombre o el precio de algún producto.
- Que cambie la pantalla que ve Abril cuando todavía no hay productos.

## 10. Preguntas abiertas para Abril

Ninguna.

## 11. Cambios después de la aprobación

Ninguno.
