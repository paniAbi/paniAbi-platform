# [#23] Entrada con usuario y contraseña para la administración, y una vista pública para clientes

Tarjeta de Trello: https://trello.com/c/kBXLco3b/23-entrada-con-usuario-y-contrase%C3%B1a-para-la-administraci%C3%B3n-y-una-vista-p%C3%BAblica-para-clientes

## 1. Qué cambia para Abril

- **Hoy:** hay una sola pantalla de productos y cualquiera que tenga el link
  puede verla y cargar o cambiar productos. Por eso en el sitio solo hay datos
  inventados.
- **Después de esta tarjeta:**
  - Los clientes abren la página principal y ven el nombre de la panadería y
    los productos con su precio. No pueden cargar ni cambiar nada.
  - Abril entra a la administración con su usuario y su contraseña. Solo ahí
    se cargan y se organizan los productos.
- **Por qué le importa a la panadería:** es lo que falta para que Abril pueda
  cargar sus productos reales sin que nadie más los pueda cambiar.

## 2. Comportamiento esperado

| Situación                                                                                                               | Qué ve o puede hacer                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Un cliente abre la página principal                                                                                     | Ve "paniAbi" y la lista de productos con nombre y precio, por ejemplo "Budín de limón — $ 850". No ve botones para cargar ni cambiar.       |
| Hay categorías (tarjeta #18 terminada)                                                                                  | En la página principal los productos aparecen agrupados por categoría, y los que no tienen categoría quedan al final, en "Otros productos". |
| Un producto está marcado como no disponible (tarjeta #17)                                                               | Sigue apareciendo en la página principal, con la marca "No disponible", por ejemplo "Chocotorta — $ 35.000 — No disponible".                |
| Todavía no hay productos                                                                                                | La página principal dice "Todavía no hay productos para mostrar."                                                                           |
| Abril abre "/admin" sin haber entrado                                                                                   | La plataforma la lleva a la pantalla para entrar.                                                                                           |
| Abril escribe bien su usuario y su contraseña                                                                           | Entra a la administración de productos ("/admin/productos") y puede cargar y organizar productos como hoy.                                  |
| Escribe mal el usuario o la contraseña                                                                                  | Ve "El usuario o la contraseña no son correctos." y no entra. El aviso no dice cuál de los dos está mal.                                    |
| Deja el usuario o la contraseña vacíos                                                                                  | Ve "Escribí tu usuario." o "Escribí tu contraseña." debajo del campo.                                                                       |
| Abril vuelve a los 10 días desde el mismo dispositivo                                                                   | Sigue adentro, sin volver a escribir la contraseña.                                                                                         |
| Pasaron más de 30 días desde que entró                                                                                  | La plataforma le pide que vuelva a entrar.                                                                                                  |
| Toca "Salir"                                                                                                            | Sale de la administración y vuelve a la pantalla para entrar. Si después abre "/admin/productos", tiene que entrar de nuevo.                |
| Alguien intenta guardar o cambiar un producto o una categoría sin haber entrado, incluso sin pasar por ninguna pantalla | No se guarda nada.                                                                                                                          |
| Alguien abre la dirección vieja "/products"                                                                             | La plataforma lo lleva a "/admin/productos", que le pide entrar si todavía no entró.                                                        |
| Abril se olvida la contraseña                                                                                           | Le pide a Juan que se la resetee. En la pantalla para entrar dice "¿Te olvidaste la contraseña? Pedile a Juan que te la cambie."            |

## 3. Qué cambia respecto de hoy

- La página principal deja de mandar a la lista de productos y pasa a ser la
  vista pública para clientes.
- La administración de productos se mueve de "/products" a
  "/admin/productos" y solo se puede usar después de entrar. La dirección
  vieja lleva a la nueva.
- Cargar y cambiar productos o categorías exige haber entrado.
- La regla del proyecto que dice "el sitio solo tiene datos inventados porque
  no hay login" se actualiza: la cuenta real de Abril puede cargar sus
  productos reales; el resto del equipo sigue usando datos inventados.

## 4. Qué vamos a probar

- [ ] La página principal muestra el nombre de la panadería y cada producto
      con su nombre y su precio, sin botones para cargar ni cambiar.
- [ ] La página principal agrupa los productos por categoría y deja los que
      no tienen categoría al final, en "Otros productos" (si la #18 ya está
      terminada al construir esta tarjeta).
- [ ] Un producto no disponible aparece con la marca "No disponible" (si la
      #17 ya está terminada al construir esta tarjeta).
- [ ] Sin productos, la página principal dice "Todavía no hay productos para
      mostrar."
- [ ] Con el usuario y la contraseña correctos, Abril entra a
      "/admin/productos".
- [ ] Con un usuario que no existe, o con la contraseña equivocada, ve el
      mismo aviso y no entra.
- [ ] Con el usuario o la contraseña vacíos, ve el aviso del campo que falta.
- [ ] Abrir "/admin" o "/admin/productos" sin haber entrado lleva a la
      pantalla para entrar.
- [ ] Guardar un producto, crear una categoría o cambiar la categoría de un
      producto sin haber entrado no guarda nada, aunque se intente
      directamente, sin pasar por la pantalla.
- [ ] Una entrada de hace más de 30 días ya no sirve y pide volver a entrar.
- [ ] Después de "Salir", la entrada anterior ya no sirve.
- [ ] La contraseña nunca se guarda tal como se escribe: lo guardado no
      permite leerla.
- [ ] "/products" lleva a "/admin/productos".
- [ ] Todos los textos nuevos están en español.

## 5. Cómo lo comprueba Abril

En la computadora de Juan, con la base de prueba y una cuenta inventada
("abril-prueba", que solo existe en las bases de prueba):

1. Abrir la página principal sin haber entrado: aparecen "paniAbi" y los
   productos de ejemplo con su precio, sin botones.
2. Abrir "/admin/productos": la plataforma lleva a la pantalla para entrar.
3. Escribir "abril-prueba" y una contraseña equivocada: aparece "El usuario o
   la contraseña no son correctos."
4. Escribir la contraseña correcta: aparece la administración de productos.
   Cargar "TEST - Budín de prueba" a 850 pesos: se guarda.
5. Volver a la página principal: "TEST - Budín de prueba — $ 850" aparece en
   la lista pública.
6. Tocar "Salir" y volver a abrir "/admin/productos": pide entrar de nuevo.

## 6. Pasos

1. Guardar la cuenta de Abril y sus entradas, con una cuenta inventada para
   las bases de prueba, y una forma para que Juan cree o resetee la cuenta
   real sin que la contraseña quede escrita en el repositorio.
2. La pantalla para entrar y el botón para salir, con sus avisos.
3. La administración de productos pasa a "/admin/productos", solo se puede
   usar después de entrar, y nada se guarda sin haber entrado.
4. La página principal pasa a ser la vista pública para clientes.
5. Actualizar las reglas del proyecto y la guía de instalación: cómo entrar en
   la computadora de cada uno y qué datos se pueden cargar en el sitio.

## 7. Información nueva para guardar

- **La cuenta de Abril:** un usuario y su contraseña protegida. La contraseña
  se guarda de una forma que no permite leerla; solo sirve para comprobar si
  lo que Abril escribe es correcto. Por ahora hay una sola cuenta y no hay
  pantalla para registrarse.
- **Las entradas abiertas:** cada vez que Abril entra desde un dispositivo se
  guarda esa entrada, con su vencimiento a los 30 días. "Salir" la borra.
  Cuando Juan resetea la contraseña, se cierran todas las entradas abiertas.
- **Cuenta de prueba:** las bases de prueba (las de cada computadora) traen
  una cuenta inventada, "abril-prueba", con una contraseña de prueba que
  figura en la guía de instalación. Esa cuenta no existe en el sitio en vivo.
- **Cómo se crea la cuenta real:** Juan corre un comando desde su computadora,
  apuntando a la base del sitio en vivo. El comando le pide la contraseña en
  el momento y guarda solo la versión protegida. La contraseña no queda
  escrita en ningún archivo, ni en el repositorio, ni en la configuración del
  sitio. Juan se la pasa a Abril por un canal privado. El mismo comando sirve
  para resetearla.

No hace falta sumar ninguna herramienta externa: alcanza con lo que ya usa el
proyecto.

Otras tarjetas que tocan los mismos datos: la #18 (categorías) agrega
información a los productos y la #17 (no disponible) también. Esta tarjeta no
cambia los productos; solo agrega la cuenta y sus entradas.

## 8. Fuera de esta tarjeta

- Recuperar la contraseña por mail.
- Más de una cuenta, o permisos distintos por persona.
- El diseño del catálogo público, el contacto de la panadería y la
  navegación por categorías (tarjeta del catálogo).
- Que los clientes compren o hagan pedidos.
- Marcar productos como no disponibles: es la tarjeta #17. Si la #17 todavía
  no está terminada al construir esta, la marca "No disponible" se suma
  cuando la #17 esté.

## 9. Riesgos para el negocio

- **Que alguien pueda cambiar productos sin entrar.** Es el riesgo principal.
  Por eso cada forma de guardar comprueba que Abril haya entrado, y hay un
  chequeo automático que intenta guardar sin entrar y confirma que no se
  guarda nada.
- **Que la contraseña de Abril se filtre.** El repositorio es público. La
  contraseña real nunca se escribe en un archivo y lo guardado no permite
  leerla.
- **Que Abril quede afuera.** Si se olvida la contraseña, Juan la resetea
  mientras tanto. La pantalla para entrar lo dice.
- **Que alguien pruebe contraseñas una y otra vez.** Esta tarjeta no limita
  los intentos. Se recomienda que Abril use una contraseña larga. Limitar los
  intentos puede ir en otra tarjeta si hace falta.
- **Choque con otras tarjetas.** La #18 (categorías), la #6 ("New listing") y
  la #15 (pantallas en español) cambian la misma pantalla de productos. Esta
  tarjeta se construye después de que esas tres estén incorporadas.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación
