# [#18] Crear categorías y organizar productos

Tarjeta de Trello: https://trello.com/c/XEk6CsOd/18-crear-categor%C3%ADas-y-organizar-productos

## 1. Qué cambia para Abril

- **Hoy:** Abril carga productos con nombre y precio y los ve en una lista, pero no puede ordenarlos.
- **Después de esta tarjeta:** podrá crear las categorías que use en su negocio, asignar un producto a una, moverlo entre categorías o dejarlo temporalmente sin categoría dentro de su administración.
- **Por qué le importa a la panadería:** encontrará más rápido sus productos y podrá reorganizarlos sin perder nombre, precio ni disponibilidad.

## 2. Comportamiento esperado

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
| Crea “Budines” | La categoría queda disponible en su administración. |
| Intenta crear “ budines ” o “BUDINES” | Ve una advertencia y no se duplica la categoría. |
| Carga “Budín de limón” | Puede asignarlo a “Budines” o guardarlo temporalmente sin categoría. |
| Luego crea “Tortas” | Puede mover el producto a “Tortas”; deja de aparecer en “Budines”. |
| Quita una categoría | El producto continúa guardado, sin perder sus datos ni su disponibilidad. |
| Usa “Otros” | Puede crearla y manejarla igual que cualquier otra categoría. |
| Un producto todavía no tiene categoría | Aparece identificado como “Sin categoría” dentro de la administración, para ubicarlo y asignarle una cuando Abril esté lista. |

## 3. Qué cambia respecto de hoy

Nada: solo se agrega la organización por categorías. El alta de productos y su disponibilidad siguen siendo independientes.

## 4. Qué vamos a probar

- [ ] Crear una categoría y comprobar que aparece en la administración.
- [ ] Rechazar nombres duplicados aunque cambien mayúsculas o tengan espacios de más.
- [ ] Crear un producto, asignarle una categoría y comprobar que la conserva.
- [ ] Mover un producto a otra categoría y comprobar que deja de figurar en la anterior.
- [ ] Quitar la categoría de un producto y comprobar que queda identificado como “Sin categoría”, sin perder sus datos ni su disponibilidad.
- [ ] Crear un producto sin categoría y encontrarlo en la administración.
- [ ] Volver a abrir la página y comprobar que las categorías y las ubicaciones se mantienen.
- [ ] Probar nombres de categoría muy largos y comprobar que los mensajes y controles visibles estén en español.

## 5. Cómo lo comprueba Abril

1. Abre la administración de productos en su pantalla local.
2. Crea las categorías inventadas “Budines”, “Tortas” y “Otros”, y comprueba que aparecen.
3. Intenta crear “ budines ” y comprueba que recibe una advertencia sin crear un duplicado.
4. Carga el producto inventado “Budín de limón” por $ 850, lo asigna a “Budines” y comprueba que queda allí.
5. Lo cambia a “Tortas” y confirma que conserva su nombre, precio y disponibilidad.
6. Le quita la categoría, comprueba que figura como “Sin categoría”, y luego lo asigna a “Otros”.
7. Carga un producto inventado sin categoría, vuelve a abrir la página y comprueba que puede encontrar ambos productos y sus categorías.

## 6. Pasos

1. Guardar las categorías que crea Abril y la categoría opcional de cada producto, con ejemplos inventados para probar.
2. Permitir que Abril cree categorías, asigne, cambie o quite la categoría de un producto, y mostrar claramente “Sin categoría” cuando corresponda.
3. Comprobar todos los casos acordados en la pantalla local y con chequeos automáticos.

## 7. Información nueva para guardar

- Las categorías elegidas por Abril.
- La categoría opcional de cada producto.
- Un producto tiene una categoría o ninguna.
- Dos categorías no pueden tener el mismo nombre si solo cambian mayúsculas o espacios al comienzo o al final.
- Cambiar o quitar una categoría no modifica los demás datos ni la disponibilidad del producto.

## 8. Fuera de esta tarjeta

- Renombrar, desactivar o borrar categorías.
- Borrar productos.
- Editar fotos, descripciones, precios, opciones o características del producto.
- Activar o desactivar productos.
- Crear o modificar la navegación y las secciones del catálogo público.
- Recetas, costos e insumos.

## 9. Riesgos para el negocio

- Que Abril cree por error categorías duplicadas y se desordenen los productos. Por eso se advierte y no se guardan duplicados.
- Que al reorganizar un producto se cambie su precio, sus datos o su disponibilidad. Por eso se comprobará expresamente que se conservan.
- Que un producto sin categoría quede difícil de encontrar. Por eso se identificará claramente como “Sin categoría” en la administración.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación

