# [#18] Crear categorías y organizar productos

Tarjeta de Trello: https://trello.com/c/XEk6CsOd/18-crear-categor%C3%ADas-y-organizar-productos

## 1. Qué cambia para Abril

- **Hoy:** Abril carga productos con nombre y precio y los ve en una lista, pero no puede ordenarlos.
- **Después de esta tarjeta:** podrá crear las categorías que use en su negocio, asignar un producto a una, moverlo entre categorías o dejarlo temporalmente sin categoría dentro de su administración. Verá una lista alfabética de categorías, con “Sin categoría” al final, y al elegir una verá los productos que contiene.
- **Por qué le importa a la panadería:** encontrará más rápido sus productos y podrá reorganizarlos sin perder nombre, precio ni disponibilidad.

## 2. Comportamiento esperado

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
| Crea “Budines” | La categoría queda disponible en su administración. |
| Intenta crear “pAn dulce”, “Pan Dulce” o “Pan-Dulce” cuando ya existe “Pan dulce” | Ve una advertencia y no se duplica la categoría. |
| Intenta crear un nombre vacío, con solo espacios o con más de 50 caracteres | Ve un aviso en español que le indica que debe achicarlo y la categoría no se crea. |
| Entra a una categoría que todavía no tiene productos | La categoría sigue visible y ve un botón “+” para cargar allí un producto. |
| Todavía no creó ninguna categoría | “Sin categoría” sigue visible; al entrar y usar “+”, puede cargar allí un producto todavía sin ordenar. |
| Entra a “Budines” y usa “+” | Carga “Budín de limón” y queda dentro de “Budines”. |
| Ve la lista de categorías | Las encuentra ordenadas alfabéticamente y “Sin categoría” aparece siempre al final. |
| Entra a “Postres” | Ve los productos cargados allí, por ejemplo “Lemon pie” y “Chocotorta”. |
| Luego crea “Tortas” | En el producto ya creado, elige “Cambiar categoría a…”, selecciona “Tortas”, confirma el guardado y el producto pasa a esa categoría. |
| Quita una categoría | En “Cambiar categoría a…” elige “Sin categoría”, confirma el guardado y el producto continúa guardado, sin perder sus demás datos ni su disponibilidad. |
| Usa “Otros” | Puede crearla y manejarla igual que cualquier otra categoría. |
| Un producto todavía no tiene categoría | Aparece en la sección “Sin categoría” dentro de la administración, para ubicarlo y asignarle una cuando Abril esté lista. |
| Hay productos creados antes de esta tarjeta | Aparecen inicialmente en “Sin categoría” hasta que Abril los ordene. |

## 3. Qué cambia respecto de hoy

- Los productos se cargan desde el botón “+” de una categoría. Para cargar uno todavía sin ordenar, Abril usa el botón “+” dentro de “Sin categoría”.
- La administración muestra una lista alfabética de categorías; al elegir una, Abril ve los productos cargados dentro de ella. “Sin categoría” queda al final.
- Cada producto ya creado suma la opción “Cambiar categoría a…”, desde donde Abril puede elegir otra categoría o “Sin categoría” y confirmar el cambio antes de guardarlo.
- Los productos ya existentes aparecen inicialmente en “Sin categoría” hasta que Abril les asigne una.
- El alta de productos y su disponibilidad siguen siendo independientes de la organización por categorías.

## 4. Qué vamos a probar

- [ ] Crear una categoría y comprobar que aparece en la administración.
- [ ] Rechazar categorías sin nombre, que solo tengan espacios o superen los 50 caracteres, con un aviso que indique que Abril debe achicar el nombre.
- [ ] Rechazar como repetidas “Pan dulce”, “pAn dulce”, “Pan Dulce” y “Pan-Dulce”; permitir como distintas “Pan dulce” y “Panes dulces”.
- [ ] Cargar un producto desde el botón “+” de “Sin categoría” cuando todavía no existe ninguna categoría y comprobar que queda allí.
- [ ] Cargar un producto desde el botón “+” de una categoría y comprobar que queda en ella.
- [ ] Mover un producto a otra categoría y comprobar que deja de figurar en la anterior.
- [ ] Quitar la categoría de un producto y comprobar que queda identificado como “Sin categoría”, sin perder sus datos ni su disponibilidad.
- [ ] Crear un producto sin categoría y encontrarlo en la administración.
- [ ] Volver a abrir la página y comprobar que las categorías y las ubicaciones se mantienen.
- [ ] Comprobar que las categorías aparecen alfabéticamente, que “Sin categoría” queda al final y que las categorías vacías continúan visibles con la opción de cargar un producto.
- [ ] Comprobar que los productos que ya existían quedan inicialmente en “Sin categoría”, sin perder sus datos ni su disponibilidad.
- [ ] Comprobar que los mensajes y controles nuevos visibles estén en español.

## 5. Cómo lo comprueba Abril

1. Abre la administración de productos en su pantalla local.
2. Crea las categorías inventadas “Budines”, “Tortas”, “Otros” y “Postres”, y comprueba que aparecen en orden alfabético.
3. Intenta crear “pAn dulce”, “Pan Dulce” y “Pan-Dulce” cuando ya existe “Pan dulce”, una categoría vacía y otra de más de 50 caracteres; comprueba que recibe los avisos correspondientes sin crear categorías.
4. Entra a “Postres”, comprueba que ve el botón “+”, carga allí los productos inventados “Lemon pie” y “Chocotorta”, y los encuentra dentro de esa categoría.
5. Entra a “Budines”, usa el botón “+”, carga el producto inventado “Budín de limón” por $ 850 y comprueba que queda allí.
6. En ese producto, elige “Cambiar categoría a…”, selecciona “Tortas”, confirma el guardado y comprueba que conserva su nombre y precio.
7. En “Cambiar categoría a…”, elige “Sin categoría”, confirma el guardado, comprueba que figura allí y luego lo asigna a “Otros”.
8. Entra a “Sin categoría”, usa el botón “+”, carga un producto inventado todavía sin ordenar, vuelve a abrir la página y comprueba que puede encontrar ambos productos y sus categorías.

## 6. Pasos

1. Guardar las categorías que crea Abril y la categoría opcional de cada producto, con ejemplos inventados y sus chequeos automáticos.
2. Permitir que Abril cree categorías, con aviso ante nombres repetidos o inválidos, y comprobarlo automáticamente.
3. Permitir que Abril cargue un producto desde una categoría o desde “Sin categoría”, incluso cuando todavía no creó ninguna, y comprobarlo automáticamente.
4. Permitir que Abril cambie o quite la categoría de un producto ya creado, con confirmación antes de guardarlo, mostrarlo en la categoría correspondiente o en “Sin categoría”, y comprobarlo automáticamente.

## 7. Información nueva para guardar

- Las categorías elegidas por Abril.
- La categoría opcional de cada producto.
- Un producto tiene una categoría o ninguna.
- Cuentan como la misma categoría “Pan dulce”, “pAn dulce”, “Pan Dulce” y “Pan-Dulce”; “Pan dulce” y “Panes dulces” son categorías distintas.
- El nombre de una categoría tiene entre 1 y 50 caracteres, sin contar los espacios al comienzo o al final.
- Las categorías se muestran en orden alfabético y “Sin categoría” siempre queda al final; las categorías vacías se mantienen visibles.
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

