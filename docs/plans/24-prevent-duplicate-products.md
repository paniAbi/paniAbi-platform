# [#24] Avisar cuando ya existe un producto con ese nombre

Tarjeta de Trello: https://trello.com/c/1WkjAZC8/24-avisar-cuando-ya-existe-un-producto-con-ese-nombre

## 1. Qué cambia para Abril

- **Hoy:** si intenta guardar un producto con un nombre exactamente igual a otro, no se guarda y no recibe explicación.
- **Después de esta tarjeta:** verá debajo del nombre: “Ya hay un producto con ese nombre. Elegí otro nombre o buscá el que ya cargaste.” El producto repetido no se guardará.
- **Por qué le importa a la panadería:** Abril sabrá qué pasó y podrá evitar cargar el mismo producto dos veces.

## 2. Comportamiento esperado

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
| Ya existe “Budín de limón” e intenta cargar “budin de limon” | Ve el aviso debajo del nombre y el segundo producto no se guarda. |
| Solo cambia mayúsculas, tildes, signos o espacios de más | Cuenta como el mismo nombre. Por ejemplo, “Budín-de-limón” también se rechaza. |
| Elige un nombre diferente | El producto se guarda normalmente y no aparece el aviso. |
| Recibe el aviso | Conserva lo que escribió para poder corregir el nombre sin volver a cargarlo. |
| Ya había productos antiguos con nombres que ahora contarían como iguales | Se mantienen tal como están; esta tarjeta no los borra, une ni renombra. |

## 3. Qué cambia respecto de hoy

Hoy solo se detectan nombres escritos exactamente igual y no se explica el problema. Después, se detectarán las distintas formas acordadas de escribir el mismo nombre y Abril recibirá un aviso claro.

## 4. Qué vamos a probar

- [ ] Rechazar “Budín de limón” / “budin de limon”.
- [ ] Rechazar diferencias solo de mayúsculas, tildes, signos o espacios.
- [ ] Mostrar el aviso exacto debajo del nombre.
- [ ] Mantener lo escrito cuando aparece el aviso.
- [ ] Guardar correctamente un nombre que no está repetido.
- [ ] No modificar los productos antiguos que podrían resultar duplicados con la nueva regla.

## 5. Cómo lo comprueba Abril

1. En Productos, abre una categoría y carga “TEST - Budín de limón 24”.
2. Intenta cargar “TEST - budin-de-limon 24”.
3. Ve el aviso debajo del nombre y comprueba que no aparece un segundo producto.
4. Cambia el nombre por uno distinto y lo guarda correctamente.

## 6. Pasos

1. Reconocer las distintas formas acordadas de escribir un mismo nombre y evitar guardar productos duplicados.
2. Mostrar el aviso en español debajo del nombre y conservar lo que Abril escribió.

## 7. Información nueva para guardar

Cada producto conserva su nombre tal como Abril lo escribió y tendrá una forma de comparación que ignore mayúsculas, tildes, signos y espacios de más, para evitar nuevos duplicados. Los productos antiguos que ya resulten iguales con esta regla no cambian.

## 8. Fuera de esta tarjeta

- Editar, borrar, unir o renombrar productos.
- Mostrar avisos para revisar productos antiguos duplicados. Eso se hará cuando exista la edición de productos.

## 9. Riesgos para el negocio

- La tarjeta 15 debe incorporarse antes de construir esta, porque ambas cambian el formulario de productos.
- Los posibles duplicados antiguos seguirán existiendo hasta que Abril pueda revisarlos y corregirlos con la futura edición de productos.

## 10. Preguntas abiertas para Abril

Ninguna.

## 11. Cambios después de la aprobación

<!-- Cualquier cambio acá vuelve la tarjeta a Planning para una nueva
     aprobación. Una línea con fecha por cambio: qué cambió y por qué. -->
