# [#20] Que el comando de migrar la base solo funcione en la base de la computadora

Tarjeta de Trello: https://trello.com/c/of3p7Fqx/20-que-el-comando-de-migrar-la-base-solo-funcione-en-la-base-de-la-computadora

## 1. Qué cambia para Abril

- **Hoy:** cuando una tarjeta guarda información nueva (por ejemplo, las
  categorías de los productos), el agente de Flor o Jesi prepara la base
  con un comando que no se fija a qué base está conectada la computadora.
  Si esa computadora todavía tiene la dirección de la web real, el cambio
  llegaría directo a la web de Abril, sin revisión, y el comando hasta
  puede ofrecer borrar la base entera.
- **Después de esta tarjeta:** ese comando se niega a correr si la
  computadora no está conectada a su propia base de prueba, igual que ya
  hace el comando que prepara la base local. Explica por qué frenó y qué
  hacer.
- **Por qué le importa a la panadería:** los productos y precios que Abril
  cargó en la web no pueden perderse ni cambiar por una prueba. Esta
  tarjeta tiene que estar terminada antes de la primera tarjeta de Flor o
  Jesi que guarde información nueva.

## 2. Comportamiento esperado

| Situación | Qué pasa |
| --------- | -------- |
| La computadora está conectada a su base de prueba | El comando prepara la base como hoy. |
| La computadora todavía apunta a la base de la web real | El comando frena antes de tocar nada, con el mismo aviso que el de preparar la base local ("no apunta a esta computadora") y la indicación de qué sección del README seguir. |
| Una de las dos direcciones de la base apunta a la computadora y la otra a la web real | Frena igual: alcanza con que una no sea de la computadora. |
| Falta el archivo de configuración | Frena y explica cómo crearlo a partir del ejemplo. |
| La dirección está vacía o mal escrita | Frena: ante la duda, no toca nada. |

## 3. Qué cambia respecto de hoy

El comando de migrar la base ahora controla primero a qué base apunta.
Cuando apunta a la base de la computadora, funciona exactamente igual que
hoy, con las mismas opciones.

## 4. Qué vamos a probar

- [ ] Con las dos direcciones de la computadora, el control deja seguir.
- [ ] Con una dirección de la web real (Neon), frena y no corre la migración.
- [ ] Con una dirección de la computadora y otra de la web real, frena.
- [ ] Sin archivo de configuración, frena con la indicación de cómo crearlo.
- [ ] Con una dirección vacía o mal escrita, frena.
- [ ] El comando que prepara la base local sigue frenando en los mismos
      casos que hoy, con el mismo mensaje.
- [ ] Las opciones que hoy se le pasan al comando (por ejemplo, el nombre
      del cambio) le siguen llegando igual.

## 5. Cómo lo comprueba Abril

Esta tarjeta no cambia nada que Abril vea en pantalla. La comprueba Juan en
su computadora:

1. Con la configuración apuntando a la base de la computadora, correr el
   comando de migrar: dice que no hay cambios pendientes, como hoy.
2. Cambiar temporalmente la configuración a una dirección inventada que no
   sea de la computadora (por ejemplo `ejemplo.neon.tech`) y volver a
   correrlo: frena con el aviso y no se conecta a nada.
3. Volver la configuración a la de la computadora.

## 6. Pasos

1. El comando de migrar la base frena si la computadora no está conectada a
   su propia base, usando el mismo control que el de preparar la base local,
   y la guía de instalación y las reglas del agente lo mencionan.

## 7. Información nueva para guardar

No.

## 8. Fuera de esta tarjeta

- Cambiar qué se puede migrar: se sigue pudiendo solo agregar.
- Los demás comandos de la base. El de cargar los productos de ejemplo
  tampoco controla hoy a qué base apunta; si Mauricio quiere, va en otra
  tarjeta.
- La web real y las vistas previas, que se actualizan solas al publicar y
  no usan este comando.

## 9. Riesgos para el negocio

- Que el control frene cuando no debería y bloquee a Flor o Jesi mientras
  construyen. Por eso usa exactamente el mismo control que el comando de
  preparar la base local, que ya usan sin problemas.
- Que el control deje pasar una dirección de la web real. Se prueba con
  direcciones de Neon inventadas.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación
