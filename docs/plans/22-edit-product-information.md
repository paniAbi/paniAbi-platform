# [#22] Editar la información de un producto

Tarjeta de Trello: https://trello.com/c/2JrHKmDr/22-editar-la-informaci%C3%B3n-de-un-producto

## 1. Qué cambia para Abril

- **Hoy:** Abril puede cargar productos, pero no corregir el nombre o el precio de uno ya creado.
- **Propuesta:** podrá abrir un producto, cambiar solo la información que necesite y guardar sin perder los demás datos.
- **Por qué le importa a la panadería:** podrá corregir la información sin volver a cargar el producto ni modificar los demás por accidente.

## 2. Comportamiento esperado

Las siguientes propuestas quedan sujetas a las respuestas de Mauricio en la sección 10.

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
| Corrige “Budín de limon” por “Budín de limón” | Guarda el nuevo nombre; el precio, la categoría y la disponibilidad permanecen iguales. |
| Cambia el precio de $7.000 a $70.000 | Ve ambos importes antes de guardar y puede confirmar o cancelar para seguir editando. |
| Cambia un nombre por el de otro producto | Ve el aviso de nombre repetido, incluyendo la categoría del producto existente, y no se guarda el cambio. |
| Corrige solo la escritura del nombre del mismo producto, por ejemplo “budín” a “Budín” | Puede guardar la corrección sin que el producto se considere duplicado de sí mismo. |
| El nombre está vacío o el precio es inválido | Ve un aviso claro y conserva lo que escribió para corregirlo. |
| Intenta salir o cancelar con cambios sin guardar | Ve un aviso y puede seguir editando o descartar los cambios. |
| Guarda correctamente | Ve una confirmación y al volver a abrir el producto encuentra los cambios guardados. |
| Ocurre un error al guardar | Ve un aviso y conserva su edición para volver a intentar. |

## 3. Qué cambia respecto de hoy

Se agrega la edición de información de un producto existente. El cambio se aplica solo al guardar y no crea otro producto ni altera los demás.

## 4. Qué vamos a probar

- [ ] Cambiar solo el nombre y conservar precio, categoría y disponibilidad.
- [ ] Cambiar solo el precio, mostrar el anterior y el nuevo y confirmar; al cancelar, mantener el precio guardado y la edición disponible.
- [ ] Confirmar un precio nuevo y comprobarlo después de volver a abrir la página.
- [ ] Conservar y mostrar correctamente un precio con centavos; mostrar uno entero sin decimales.
- [ ] Rechazar nombre vacío, nombre formado solo por signos y precio cero o inválido, con avisos claros y sin perder lo escrito.
- [ ] Avisar si el nombre pertenece a otro producto, aunque difiera solo en mayúsculas, tildes, signos o espacios de más; indicar su categoría o “Sin categoría”.
- [ ] Permitir corregir la escritura del nombre del mismo producto sin tratarlo como otro producto.
- [ ] Avisar al salir o cancelar con cambios sin guardar; permitir continuar o descartar sin aplicar los cambios.
- [ ] Confirmar el guardado y conservar la edición si falla, para reintentar.
- [ ] No modificar otros productos ni la categoría y disponibilidad del producto editado.
- [ ] Mostrar los avisos y confirmaciones en español.

## 5. Cómo lo comprueba Abril

1. En la administración, abre un producto inventado y cambia solo su nombre. Comprueba que su precio y categoría permanecen iguales.
2. Cambia su precio de $7.000 a $70.000; comprueba que ve ambos importes y puede cancelar o confirmar.
3. Prueba un nombre que ya pertenece a otro producto, un precio inválido y la salida con cambios sin guardar; comprueba los avisos y que puede seguir editando.
4. Guarda una edición válida, vuelve a abrir el producto y comprueba que quedó como esperaba, sin modificar los demás productos.

## 6. Pasos

1. Permitir abrir un producto y editar su nombre y precio, conservando sus demás datos.
2. Mostrar avisos por datos inválidos o un nombre que ya pertenece a otro producto.
3. Agregar las confirmaciones para el cambio de precio y para salir sin guardar, según confirme Mauricio.

## 7. Información nueva para guardar

No se propone información nueva: se editan el nombre y el precio que ya tiene cada producto. La tarjeta 17 también trabaja sobre productos; se esperará a que esté incorporada y se traerán sus cambios antes de construir esta tarjeta.

## 8. Fuera de esta tarjeta

- Cambiar categorías o disponibilidad: corresponden a las tarjetas 18 y 17.
- Agregar fotos, descripción, porciones, presentación u opciones: corresponden a sus propias tarjetas.
- Cambiar precios automáticamente, calcular costos o crear el historial de pedidos y ventas.
- Guardado automático o recuperación de borradores al cerrar la pantalla.

## 9. Riesgos para el negocio

- Un precio incorrecto podría afectar lo que ven los clientes; se propone confirmar el precio anterior y el nuevo antes de guardar.
- La tarjeta 17 modifica la pantalla de productos: debe incorporarse antes de construir esta tarjeta.
- La conservación de datos históricos de pedidos y ventas deberá resolverse cuando se construya ese historial; esta tarjeta no lo crea.

## 10. Preguntas abiertas

### Para Mauricio

1. En esta primera versión, ¿Abril podrá editar solo nombre y precio, o algún otro dato?
2. ¿Confirmamos el cambio de precio mostrando el importe anterior y el nuevo antes de guardar?
3. ¿Avisamos al salir o cancelar con cambios sin guardar y permitimos continuar o descartarlos?
4. ¿Aplicamos al editar la misma regla y aviso de nombres repetidos de la tarjeta 24, permitiendo corregir la escritura del nombre del propio producto?

### Para Abril

Ninguna por ahora.

## 11. Cambios después de la aprobación

Ninguno.
