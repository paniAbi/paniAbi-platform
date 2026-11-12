# [#18] Crear categorías y organizar productos

Tarjeta de Trello: https://trello.com/c/XEk6CsOd/18-crear-categor%C3%ADas-y-organizar-productos

## 1. Qué cambia para Abril

- **Hoy:** Abril carga productos con nombre y precio y los ve en una lista, pero no puede ordenarlos.
- **Después de esta tarjeta:** podrá crear las categorías que use en su negocio, asignar un producto a una, moverlo entre categorías o dejarlo temporalmente sin categoría dentro de su administración. Verá sus productos agrupados por categoría, en orden alfabético, con “Sin categoría” al final.
- **Por qué le importa a la panadería:** encontrará más rápido sus productos y podrá reorganizarlos sin perder nombre, precio ni disponibilidad.

## 2. Comportamiento esperado

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
| Crea “Budines” | La categoría queda disponible en su administración. |
| Intenta crear “ budines ” o “BUDINES” | Ve una advertencia y no se duplica la categoría. |
| Intenta crear un nombre vacío, con solo espacios o con más de 40 caracteres | Ve un aviso en español y la categoría no se crea. |
| Todavía no creó ninguna categoría | Puede cargar un producto y queda en “Sin categoría”. |
| Carga “Budín de limón” | Puede asignarlo a “Budines” o guardarlo temporalmente sin categoría. |
| Ve la lista de productos | Encuentra secciones alfabéticas por categoría; “Sin categoría” aparece siempre al final. |
| Luego crea “Tortas” | En el producto ya creado, elige “Cambiar categoría”, selecciona “Tortas” y el producto pasa a esa sección. |
| Quita una categoría | En “Cambiar categoría” elige “Sin categoría”; el producto continúa guardado, sin perder sus demás datos ni su disponibilidad. |
| Usa “Otros” | Puede crearla y manejarla igual que cualquier otra categoría. |
| Un producto todavía no tiene categoría | Aparece en la sección “Sin categoría” dentro de la administración, para ubicarlo y asignarle una cuando Abril esté lista. |
| Hay productos creados antes de esta tarjeta | Aparecen inicialmente en “Sin categoría” hasta que Abril los ordene. |

## 3. Qué cambia respecto de hoy

- El formulario para cargar un producto suma la posibilidad de elegir una categoría, sin dejar de permitir guardarlo sin una.
- La lista de productos pasa a mostrarse en secciones alfabéticas por categoría, con “Sin categoría” al final.
- Cada producto ya creado suma la opción “Cambiar categoría”, desde donde Abril puede elegir otra categoría o “Sin categoría”.
- Los productos ya existentes aparecen inicialmente en “Sin categoría” hasta que Abril les asigne una.
- El alta de productos y su disponibilidad siguen siendo independientes de la organización por categorías.

## 4. Qué vamos a probar

- [ ] Crear una categoría y comprobar que aparece en la administración.
- [ ] Rechazar categorías sin nombre, que solo tengan espacios o superen los 40 caracteres.
- [ ] Rechazar nombres duplicados aunque cambien mayúsculas, tildes, espacios o signos, si al leerlos son el mismo nombre.
- [ ] Cargar un producto cuando todavía no existe ninguna categoría y comprobar que queda en “Sin categoría”.
- [ ] Crear un producto, asignarle una categoría y comprobar que la conserva.
- [ ] Mover un producto a otra categoría y comprobar que deja de figurar en la anterior.
- [ ] Quitar la categoría de un producto y comprobar que queda identificado como “Sin categoría”, sin perder sus datos ni su disponibilidad.
- [ ] Crear un producto sin categoría y encontrarlo en la administración.
- [ ] Volver a abrir la página y comprobar que las categorías y las ubicaciones se mantienen.
- [ ] Comprobar que las categorías aparecen alfabéticamente y que “Sin categoría” queda al final.
- [ ] Comprobar que los productos que ya existían quedan inicialmente en “Sin categoría”, sin perder sus datos ni su disponibilidad.
- [ ] Comprobar que los mensajes y controles nuevos visibles estén en español.

## 5. Cómo lo comprueba Abril

1. Abre la administración de productos en su pantalla local.
2. Crea las categorías inventadas “Budines”, “Tortas” y “Otros”, y comprueba que aparecen en orden alfabético.
3. Intenta crear “ budines ”, una categoría vacía y otra de más de 40 caracteres; comprueba que recibe los avisos correspondientes sin crear categorías.
4. Carga el producto inventado “Budín de limón” por $ 850, lo asigna a “Budines” y comprueba que queda en esa sección.
5. En ese producto, elige “Cambiar categoría”, selecciona “Tortas” y confirma que conserva su nombre y precio.
6. En “Cambiar categoría”, elige “Sin categoría”, comprueba que figura en esa sección y luego lo asigna a “Otros”.
7. Carga un producto inventado sin elegir categoría, vuelve a abrir la página y comprueba que puede encontrar ambos productos y sus categorías.

## 6. Pasos

1. Guardar las categorías que crea Abril y la categoría opcional de cada producto, con ejemplos inventados y sus chequeos automáticos.
2. Permitir que Abril cree categorías, con aviso ante nombres repetidos o inválidos, y comprobarlo automáticamente.
3. Permitir que Abril elija una categoría al cargar un producto, incluso cuando todavía no creó ninguna, y comprobarlo automáticamente.
4. Permitir que Abril cambie o quite la categoría de un producto ya creado, mostrarlo en la sección correspondiente o en “Sin categoría”, y comprobarlo automáticamente.

## 7. Información nueva para guardar

- Las categorías elegidas por Abril.
- La categoría opcional de cada producto.
- Un producto tiene una categoría o ninguna.
- Dos categorías no pueden tener el mismo nombre si solo cambian mayúsculas, tildes, espacios o signos y al leerlos se entiende el mismo nombre.
- El nombre de una categoría tiene entre 1 y 40 caracteres, sin contar los espacios al comienzo o al final.
- Las categorías se muestran en orden alfabético y “Sin categoría” siempre queda al final.
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
- Que Abril se sorprenda porque los productos que ya existían aparecen inicialmente en “Sin categoría”. Se le avisará para que pueda ordenarlos cuando esté lista.
- Que esta tarjeta se incorpore antes de la tarjeta 20 y cambie datos por error en la web real. Por eso se incorporará después de esa tarjeta.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación

