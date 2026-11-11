# [#19] Cada tarjeta trae sus datos nuevos, y Juan los valida en la revisión

Tarjeta de Trello: https://trello.com/c/q2rtzUaG

<!-- Tarjeta de forma de trabajo: no cambia nada que vea Abril. Cambia las
     reglas que siguen los agentes y las personas del equipo. -->

## 1. Qué cambia para Abril

- **Hoy:** cuando una tarjeta de Flor o Jesi necesita guardar algo nuevo
  (por ejemplo, la categoría de un producto), se frena. Juan tiene que
  agregar ese dato primero, en su propia tarjeta de datos y su propio pedido
  de revisión, y recién después se puede planear la tarjeta. Cada etapa
  empieza con una tarjeta de datos de Juan que Abril no puede probar.
- **Después de esta tarjeta:** el plan dice en palabras qué se guarda y no
  se frena por eso. Al construir, el agente de Flor o Jesi agrega el dato
  nuevo a la base, con sus datos de ejemplo, y lo prueba en la base local.
  Juan revisa cómo se guardan los datos en el mismo pedido de revisión que
  el resto, y ahí se corrige lo que haga falta.
- **Por qué le importa a la panadería:** las funcionalidades llegan antes,
  porque una etapa ya no espera a que Juan prepare todos sus datos de
  antemano, y cada tarjeta sigue siendo algo que Abril puede probar sola.

## 2. Comportamiento esperado

| Situación                                                               | Qué pasa                                                                                                                                       |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| La tarjeta de categorías necesita guardar la categoría de cada producto | El plan lo describe en "Información nueva para guardar" ("un producto tiene una categoría o ninguna") y se manda a Mauricio sin esperar a Juan |
| Mauricio aprobó el plan y Flor empieza a construir                      | El agente agrega la categoría a la base, con categorías de ejemplo inventadas, y la prueba en la base local de Flor                            |
| Juan revisa el pedido de revisión                                       | Revisa también cómo se guarda la categoría; si algo no le cierra, lo pide en sus comentarios y el agente lo corrige                            |
| La base local de Flor apunta a la web real                              | El agente no agrega nada a la base y la manda a la guía para pasar a la base local                                                             |
| El cambio en la base borraría o renombraría algo                        | El agente no lo hace: va en otra tarjeta, como hoy                                                                                             |
| Otra tarjeta en construcción también agrega datos a los productos       | No se construyen en paralelo: una espera a que la otra esté terminada                                                                          |

## 3. Qué cambia respecto de hoy

- Desaparecen las tarjetas de datos de Juan y la regla de que una tarjeta
  que necesita datos nuevos se frena.
- Sigue igual: ningún cambio en la base llega a la versión principal sin la
  aprobación de Juan, las migraciones solo agregan, y todo dato de ejemplo
  es inventado.

## 4. Qué vamos a probar

- [ ] Con la tarjeta de práctica, "Escribamos el plan" para una tarjeta que
      necesita un dato nuevo describe el dato en "Información nueva para
      guardar" y no se frena.
- [ ] "Empecemos a construir" agrega el dato nuevo a la base local con sus
      datos de ejemplo, en un paso guardado propio.
- [ ] Si la base apunta a la web real, el agente se frena antes de tocar la
      base.
- [ ] La revisión de Juan revisa el modelado de datos.
- [ ] Los chequeos automáticos pasan, incluido el que compara las dos
      carpetas de skills.

## 5. Cómo lo comprueba Abril

No aplica: esta tarjeta no cambia nada que se vea en la plataforma.

## 6. Pasos

1. Cambiar las reglas que lee el agente y los documentos para personas.
2. Cambiar las skills de planear, construir, ver qué sigue y revisar.

## 7. Información nueva para guardar

No.

## 8. Fuera de esta tarjeta

- Cambiar los scripts o la configuración de la base.
- Rehacer los planes ya escritos.

## 9. Riesgos para el negocio

- Que un agente cambie la base equivocada. Por eso, antes de agregar
  cualquier dato, el agente confirma que la base es la local, y nunca acepta
  borrar ni reiniciar una base.
- Que dos tarjetas agreguen datos a lo mismo al mismo tiempo y choquen. Por
  eso no se construyen en paralelo.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación
