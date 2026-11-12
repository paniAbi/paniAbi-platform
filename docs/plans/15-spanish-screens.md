# [#15] Las pantallas de Abril en español

Tarjeta de Trello: https://trello.com/c/40I2G5YR/15-las-pantallas-de-abril-en-espa%C3%B1ol

## 1. Qué cambia para Abril

- **Hoy:** todo lo que Abril lee en la página de productos está en inglés:
  los títulos, el formulario para cargar un producto, el aviso cuando lo
  guarda, la lista vacía y los mensajes cuando algo sale mal. Si deja el
  precio vacío, ve incluso un mensaje técnico en inglés que no entiende.
- **Después de esta tarjeta:** todo lo que lee está en español, con frases
  completas que le dicen qué hacer ("Escribí el nombre del producto.").
  Las pantallas nuevas ya nacen en español.
- **Por qué le importa a la panadería:** Abril trabaja en español, y desde
  la etapa 3 estas pantallas también las van a leer sus clientes. Cuantas
  menos pantallas haya, más fácil es cerrarlo ahora.

## 2. Comportamiento esperado

Los textos nuevos que proponemos. Mauricio puede cambiar cualquiera al
revisar el plan.

| Dónde | Hoy | Después |
| ----- | --- | ------- |
| Nombre de la pestaña del navegador | Products \| paniAbi | Productos \| paniAbi |
| Arriba, al lado de "paniAbi" | Bakery workspace | Gestión de la panadería |
| Arriba a la derecha | Inventory | Inventario |
| Encima del título | The daily shelf | La vitrina del día |
| Título de la página | Products | Productos |
| Cantidad de productos | 1 item / 7 items | 1 producto / 7 productos |
| Lista vacía, título | Nothing on the shelf yet | Todavía no hay productos |
| Lista vacía, texto | Add the first product using the form. It will appear here for the whole team. | Agregá el primer producto con el formulario. Va a aparecer acá para todo el equipo. |
| Título del formulario | Add a product | Agregar un producto |
| Campo del nombre | Product name | Nombre del producto |
| Ejemplo dentro del campo | e.g. Lemon poppy loaf | Por ejemplo: Budín de limón |
| Campo del precio | Price in pesos | Precio en pesos |
| Botón | Add product | Agregar producto |
| Aviso al guardar | Product added to the list. | Producto agregado a la lista. |
| Pie de página | paniAbi platform / Product catalogue | Plataforma paniAbi / Catálogo de productos |

Los avisos cuando algo sale mal:

| Situación | Qué ve Abril |
| --------- | ------------ |
| Deja el nombre vacío o solo con espacios | Escribí el nombre del producto. |
| Deja el precio vacío | Escribí el precio del producto. |
| Pone un precio de 0 o negativo | El precio tiene que ser de al menos un centavo. |
| Algo falla al guardar | Revisá los datos del producto y probá de nuevo. |

Los avisos los muestra siempre la plataforma, debajo del campo y en
español. Hoy, según el navegador, algunos casos (como un precio de 0)
muestran un globito del navegador en su propio idioma.

## 3. Qué cambia respecto de hoy

Cambian los textos de la página de productos y los avisos de error. Lo que
Abril escribe no cambia: si cargó un producto llamado "Lemon loaf", sigue
apareciendo así. Los precios se siguen viendo igual ($ 800, $ 1.250,50).
El navegador y los lectores de pantalla pasan a saber que la página está
en español.

## 4. Qué vamos a probar

- [ ] La página muestra cada texto nuevo de la tabla.
- [ ] Ninguno de los textos en inglés de la columna "Hoy" queda en pantalla.
- [ ] Con un producto dice "1 producto"; con siete, "7 productos".
- [ ] Sin productos, muestra "Todavía no hay productos" y su texto.
- [ ] Nombre vacío o solo con espacios: avisa "Escribí el nombre del
      producto." y no guarda.
- [ ] Precio vacío: avisa "Escribí el precio del producto." y no guarda.
- [ ] Precio 0 o negativo: avisa "El precio tiene que ser de al menos un
      centavo." y no guarda.
- [ ] Si los datos llegan mal al guardar, avisa "Revisá los datos del
      producto y probá de nuevo."
- [ ] Al guardar "TEST - Medialuna de prueba" a 800 pesos, avisa "Producto
      agregado a la lista."
- [ ] Los nombres que escribió Abril no se traducen y los precios se ven
      igual que hoy.

## 5. Cómo lo comprueba Abril

1. Abrir la página de productos: título, botones, cantidad de productos y
   pie de página están en español.
2. Tocar "Agregar producto" sin escribir nada: debajo del nombre aparece
   "Escribí el nombre del producto." y debajo del precio "Escribí el
   precio del producto.".
3. Escribir "TEST - Medialuna de prueba" con precio 0: aparece "El precio
   tiene que ser de al menos un centavo.".
4. Cambiar el precio a 800 y guardar: aparece "Producto agregado a la
   lista." y el producto se ve en la lista a $ 800.

## 6. Pasos

1. Pasar al español los textos de la página de productos y del formulario,
   con los avisos de error de la tabla.
2. Dejar escrita la regla de que todo lo que lee Abril va en español, para
   que las pantallas nuevas nazcan así.

## 7. Información nueva para guardar

No.

## 8. Fuera de esta tarjeta

- El repositorio sigue en inglés: archivos, comentarios del código y
  pedidos de revisión.
- La etiqueta "+ New listing": la quita la tarjeta #6. Si esta tarjeta se
  construye antes de que la #6 esté mezclada, la etiqueta queda como está
  y la #6 la saca.
- Cambiar el diseño o los colores de la pantalla.

## 9. Riesgos para el negocio

- Que quede algún texto en inglés escondido (por ejemplo, un aviso que
  solo aparece cuando algo falla). Por eso se prueba cada aviso y que
  ninguno de los textos viejos quede en pantalla.
- La tarjeta de colores (#14), la #6 y la práctica de Flor (#16) tocan la
  misma pantalla. Esta tarjeta se construye después de que se mezcle la de
  colores, para no pisarse.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación
