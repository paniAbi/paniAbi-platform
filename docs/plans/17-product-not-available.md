# [#17] Marcar un producto como no disponible

Tarjeta de Trello: https://trello.com/c/FyjL9UiD/17-marcar-un-producto-como-no-disponible

## 1. Qué cambia para Abril

- **Hoy:** cuando Abril deja de hacer un producto (por temporada, porque le
  falta un insumo o porque ya no le conviene), no tiene cómo indicarlo desde
  la administración. La plataforma ya guarda si un producto está disponible,
  pero ninguna pantalla permite cambiarlo. Y si un producto figurara como no
  disponible, desaparecería de la lista de Abril y de la página pública.
- **Después de esta tarjeta:**
  - Abril marca un producto como no disponible con un botón y lo vuelve a
    marcar como disponible cuando lo retoma, sin perder nada.
  - En su lista, los no disponibles siguen apareciendo y se distinguen a
    simple vista.
  - Los clientes también los ven, con la marca "No disponible".
- **Por qué le importa a la panadería:** los clientes saben qué pueden pedir
  hoy sin que Abril tenga que sacar un producto y volver a cargarlo después.

## 2. Comportamiento esperado

| Situación                                             | Qué ve o puede hacer Abril                                                                                                                                                                |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mira un producto disponible en su lista               | Ve el botón "Marcar como no disponible".                                                                                                                                                  |
| Toca ese botón en "TEST - Chocotorta" ($ 35.000)      | El producto sigue en su lugar de la lista, más apagado y con la marca "No disponible". El botón pasa a decir "Marcar como disponible". Ve el aviso "Producto marcado como no disponible." |
| Toca "Marcar como disponible"                         | El producto vuelve a verse como antes, con el mismo nombre, precio y categoría. Ve el aviso "Producto marcado como disponible."                                                           |
| Recarga la página                                     | El producto sigue en el estado en que lo dejó.                                                                                                                                            |
| Le cambia la categoría a un producto no disponible    | Cambia de categoría y sigue no disponible.                                                                                                                                                |
| Una categoría tiene solo productos no disponibles     | La lista los muestra; no dice "Todavía no hay productos".                                                                                                                                 |
| Carga un producto nuevo                               | Nace disponible, como hoy.                                                                                                                                                                |
| Un cliente abre la página principal                   | Ve el producto en su grupo, con su precio y la marca: "TEST - Chocotorta — No disponible — $ 35.000". No ve ningún botón.                                                                 |
| Todos los productos de un grupo están no disponibles  | El grupo sigue apareciendo en la página principal, con sus productos marcados.                                                                                                            |
| Toca el botón después de haber salido en otra pestaña | No cambia nada y ve "Tenés que entrar para guardar cambios."                                                                                                                              |
| Algo falla al guardar                                 | El producto queda como estaba y ve "No se pudo guardar el cambio. Probá de nuevo."                                                                                                        |

## 3. Qué cambia respecto de hoy

- La lista de Abril y la página pública dejan de esconder los productos no
  disponibles y los muestran marcados.
- El orden no cambia: alfabético, con los disponibles y los no disponibles
  mezclados.
- Todo lo demás de la lista (cargar productos, cambiar la categoría, los
  precios) sigue igual.

La página pública sigue la decisión de Mauricio del 16/11/2026 y el plan
aprobado de la #23: los no disponibles aparecen marcados y no se ocultan.

## 4. Qué vamos a probar

- [ ] Un producto disponible muestra el botón "Marcar como no disponible" y
      ninguna marca.
- [ ] Un producto no disponible muestra la marca "No disponible" y el botón
      "Marcar como disponible".
- [ ] Al marcarlo como no disponible se guarda, y al volver a marcarlo como
      disponible tiene el mismo nombre, precio y categoría.
- [ ] Marcar un producto no cambia a los demás.
- [ ] Marcar como no disponible uno que ya lo estaba (por ejemplo, desde otra
      pestaña) lo deja no disponible, sin error.
- [ ] Sin haber entrado no se cambia nada, aunque se intente directamente,
      sin pasar por la pantalla, y aparece el aviso.
- [ ] Si el producto no existe o algo falla, nada cambia y aparece el aviso.
- [ ] La lista de Abril incluye los no disponibles en todas las categorías y
      en "Sin categoría".
- [ ] Una categoría con solo productos no disponibles no aparece como vacía.
- [ ] Cambiar la categoría de un producto no disponible no lo vuelve
      disponible.
- [ ] Un producto nuevo nace disponible.
- [ ] La página pública muestra los no disponibles con su precio y la marca,
      también en "Otros productos", y sin botones.
- [ ] En la página pública, los disponibles no llevan ninguna marca.
- [ ] Con un nombre muy largo, la marca y el precio se siguen viendo.
- [ ] La marca se lee como texto: no depende solo del color.
- [ ] En ninguna pantalla aparece una opción para borrar el producto.

## 5. Cómo lo comprueba Abril

En la computadora de Juan, con la base de prueba y la cuenta inventada
"abril-prueba":

1. Entrar a la administración y cargar "TEST - Torta de chocolate" a 9.000
   pesos en "Sin categoría".
2. Tocar "Marcar como no disponible": la torta sigue en la lista, más apagada
   y con la marca "No disponible".
3. Recargar la página: sigue marcada.
4. Abrir la página principal: aparece en "Otros productos", a $ 9.000 y con
   la marca "No disponible".
5. Volver a la administración y tocar "Marcar como disponible": se ve como al
   principio, con el mismo nombre y precio. En la página principal ya no
   lleva la marca.

## 6. Pasos

1. Abril ve en su lista los productos no disponibles, marcados.
2. Abril marca un producto como no disponible o disponible con un botón, con
   sus avisos, y nada cambia si no entró.
3. La página pública muestra los productos no disponibles con su marca.

## 7. Información nueva para guardar

No. La plataforma ya guarda si cada producto está disponible. Solo se agrega
un producto inventado no disponible a los datos de ejemplo de las
computadoras del equipo, para poder verlo.

## 8. Fuera de esta tarjeta

- Borrar productos: no se hace (decisión del 26/10/2026), para no romper el
  historial de pedidos.
- Filtrar la lista o poner los disponibles primero. El orden del catálogo
  público lo propone la #26.
- Avisar cuándo vuelve a estar disponible un producto.
- Desactivar categorías: es la #21.
- El diseño del catálogo público: es la #26.

## 9. Riesgos para el negocio

- **Que un cliente crea que puede pedir algo que no hay.** Por eso la marca es
  un texto y está junto al producto, también en el celular.
- **Que Abril marque un producto sin querer.** Se deshace con el mismo botón,
  así que no se pide confirmación.
- **Que reaparezcan productos ocultos.** Todo producto que hoy figure como no
  disponible en la web va a volver a verse, marcado. Importa para la #33
  (sacar los productos de ejemplo): si esos productos se ocultan, hay que
  resolver qué pasa con ellos antes de publicar esta tarjeta.
- **Choque con otras tarjetas.** La #24 (nombre repetido) y la #22 (editar)
  también cambian los productos. No conviene construirlas al mismo tiempo:
  Mauricio decide el orden. Hoy la #24 está primera.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación
