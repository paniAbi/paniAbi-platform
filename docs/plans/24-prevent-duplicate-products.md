# [#24] Avisar cuando ya existe un producto con ese nombre

Tarjeta de Trello: https://trello.com/c/1WkjAZC8/24-avisar-cuando-ya-existe-un-producto-con-ese-nombre

## 1. Qué cambia para Abril

- **Hoy:** si intenta guardar un producto con un nombre exactamente igual a otro, no se guarda y no recibe explicación.
- **Después de esta tarjeta:** verá debajo del nombre en qué categoría está el producto que ya existe. Por ejemplo: “Ya hay un producto con ese nombre en Budines. Elegí otro nombre o buscá el que ya cargaste.” Si ese producto no tiene categoría, dirá “en Sin categoría”. El producto repetido no se guardará.
- **Por qué le importa a la panadería:** Abril sabrá qué pasó y podrá evitar cargar el mismo producto dos veces.

## 2. Comportamiento esperado

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
| Ya existe “Budín de limón” en Budines e intenta cargar “budin de limon” | Ve debajo del nombre: “Ya hay un producto con ese nombre en Budines. Elegí otro nombre o buscá el que ya cargaste.” El segundo producto no se guarda. |
| Ya existe “Budín de limón” en Budines e intenta cargarlo en Tortas | Ve el mismo aviso que indica Budines y el segundo producto no se guarda. |
| Solo cambia mayúsculas, tildes, signos o espacios de más | Cuenta como el mismo nombre. Por ejemplo, “Budín-de-limón” también se rechaza. |
| Escribe solo signos, como “---” o “!!!” | No se guarda porque, al comparar, el nombre queda vacío. Ve el mismo aviso que con un nombre vacío. |
| Elige un nombre diferente | El producto se guarda normalmente y no aparece el aviso. |
| Recibe el aviso | Conserva el nombre y el precio que escribió para poder corregir solo el nombre sin volver a cargar todo. |
| Ya había productos antiguos con nombres que ahora contarían como iguales | Se mantienen tal como están; esta tarjeta no los borra, une ni renombra. Si intenta cargar otro con alguno de esos nombres, ve el aviso y no se guarda. |

## 3. Qué cambia respecto de hoy

Hoy solo se detectan nombres escritos exactamente igual y no se explica el problema. Después, se detectarán las distintas formas acordadas de escribir el mismo nombre y Abril recibirá un aviso claro.

## 4. Qué vamos a probar

- [ ] Rechazar “Budín de limón” / “budin de limon” e indicar la categoría donde está el producto existente.
- [ ] Rechazar “Budín de limón” en Tortas cuando ya existe en Budines, indicando Budines en el aviso.
- [ ] Rechazar diferencias solo de mayúsculas, tildes, signos o espacios.
- [ ] No guardar un nombre formado solo por signos, como “---” o “!!!”, y mostrar el mismo aviso que para un nombre vacío.
- [ ] Mostrar el aviso exacto debajo del nombre.
- [ ] Mantener el nombre y el precio escritos cuando aparece el aviso.
- [ ] Guardar correctamente un nombre que no está repetido.
- [ ] No modificar los productos antiguos que podrían resultar duplicados con la nueva regla.

## 5. Cómo lo comprueba Abril

1. En Productos, abre Budines y carga “TEST - Budín de limón 24” con un precio inventado.
2. Abre Tortas e intenta cargar “TEST - budin-de-limon 24” con otro precio inventado.
3. Ve el aviso debajo del nombre, que indica Budines, y comprueba que el nombre y el precio escritos siguen allí sin crear un segundo producto.
4. Prueba también un nombre formado solo por signos, como “---”, y ve el aviso de nombre vacío sin que se guarde.
5. Cambia el nombre por uno distinto y lo guarda correctamente.

## 6. Pasos

1. Reconocer las distintas formas acordadas de escribir un mismo nombre en todo el catálogo y evitar guardar productos duplicados.
2. Mostrar el aviso en español debajo del nombre, indicando la categoría del producto existente, y conservar el nombre y el precio que Abril escribió.

## 7. Información nueva para guardar

Cada producto conserva su nombre tal como Abril lo escribió y tendrá una forma de comparación que ignore mayúsculas, tildes, signos y espacios de más, para evitar nuevos duplicados en todo el catálogo. Los productos antiguos que ya resulten iguales con esta regla no cambian; un producto nuevo que coincida con alguno de ellos no se guarda.

## 8. Fuera de esta tarjeta

- Editar, borrar, unir o renombrar productos.
- Mostrar avisos para revisar productos antiguos duplicados. Eso se hará cuando exista la edición de productos.

## 9. Riesgos para el negocio

- La tarjeta 23 puede trasladar la pantalla de productos a la administración. Si termina antes de construir esta tarjeta, se traerá ese cambio a nuestra copia de trabajo antes de empezar.
- Los posibles duplicados antiguos seguirán existiendo hasta que Abril pueda revisarlos y corregirlos con la futura edición de productos.

## 10. Preguntas abiertas para Abril

Ninguna.

## 11. Cambios después de la aprobación

<!-- Cualquier cambio acá vuelve la tarjeta a Planning para una nueva
     aprobación. Una línea con fecha por cambio: qué cambió y por qué. -->
