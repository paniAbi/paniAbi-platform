# [#13] Que Flor y Jesi puedan probar su cambio en su computadora

Tarjeta de Trello: https://trello.com/c/l5OWnMhV/13-que-flor-y-jesi-puedan-probar-su-cambio-en-su-computadora

## 1. Qué cambia para Abril

- **Hoy:** Flor y Jesi construyen cada tarjeta con su agente, pero nadie ve
  el cambio funcionando antes de pedir la revisión. Si dicen "quiero
  probarlo", el agente improvisa. "¿Está todo bien?" responde que sí con solo
  los chequeos automáticos. El guion "Cómo lo comprueba Abril" ya está escrito
  en cada plan, pero nadie lo sigue: Juan termina siendo el primero que abre la
  pantalla.
- **Después de esta tarjeta:** después de construir, Flor o Jesi dicen
  "quiero verlo funcionando" y el agente las lleva hasta ver el cambio en su
  computadora, siguiendo el guion del plan paso por paso. El pedido de
  revisión no sale hasta que lo probaron.
- **Por qué le importa a la panadería:** a Abril le llegan cambios que alguien
  ya miró en pantalla, con menos idas y vueltas en la revisión. Y cuando la
  web crezca (clientes, pedidos, recetas), siempre va a haber datos de ejemplo
  para probar sin cargar todo a mano.

## 2. Comportamiento esperado

| Situación                                                                            | Qué ve o puede hacer Flor o Jesi                                                                                                                         |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Terminaron un paso que cambia algo visible y dicen "quiero verlo funcionando"        | El agente revisa que todo esté listo, levanta la web en su computadora y les da la dirección exacta para abrir.                                          |
| Docker está cerrado                                                                  | El agente les pide abrir Docker Desktop y esperar a que diga que está andando, y recién ahí sigue.                                                       |
| La base de datos de su computadora está apagada o vacía                              | El agente la prende y la llena con los datos de ejemplo, sin borrar nada.                                                                                |
| Su configuración todavía apunta a la base de la web real                             | El agente no sigue y les indica la sección del README para pasarse a la base de su computadora.                                                          |
| La web ya está levantada de antes                                                    | El agente usa la que ya está andando, sin abrir otra.                                                                                                    |
| La web no levanta en su computadora                                                  | El agente no insiste ni prueba arreglos por su cuenta: les explica qué pasó en palabras simples y les dice que le pidan ayuda a Juan.                    |
| La tarjeta no cambia nada que se vea en la web (por ejemplo, esta misma)             | El agente les dice que no hay nada para mirar en pantalla y que la prueba no aplica a esta tarjeta.                                                      |
| El plan tiene el guion "Cómo lo comprueba Abril"                                     | El agente lo lee de a un paso: qué abrir, qué hacer y qué tienen que ver. Después de cada paso pregunta qué vieron.                                      |
| Lo que ven coincide con el guion en todos los pasos                                  | El agente les confirma que el cambio funciona y les sugiere el siguiente paso (seguir construyendo o "Terminé").                                         |
| Lo que ven no coincide en algún paso                                                 | El agente no sigue con el guion. Les explica la diferencia y propone corregirla dentro del plan, o pedir ayuda si no sabe por qué pasa.                  |
| La tarjeta es de un plan viejo, en inglés                                            | El agente usa la sección equivalente ("How we will know it works").                                                                                      |
| Dicen "Terminé" en una tarjeta que cambia algo visible                               | El agente pregunta si lo probaron siguiendo el guion después del último paso guardado. No se acuerda de charlas anteriores, así que no lo da por hecho.  |
| Responden que no, o no están seguras                                                 | El agente no manda el pedido de revisión: les ofrece recorrer el guion ahora, antes de mandarlo.                                                         |
| Responden que sí, y vieron todo lo que dice el guion                                 | El agente marca en el pedido de revisión "Lo probé en mi computadora siguiendo Cómo lo comprueba Abril" y lo manda a Juan.                               |
| Dicen "Terminé" en una tarjeta que no cambia nada visible                            | El agente marca ese punto como "No aplica: esta tarjeta no cambia nada visible" y "Terminé" sigue funcionando como hoy.                                  |
| Una tarjeta necesita guardar algo nuevo (por ejemplo clientes) que todavía no existe | Igual que hoy: frenan y le piden a Juan. La tarjeta de datos de Juan va primero y trae sus propios datos de ejemplo, así después se puede probar a mano. |

## 3. Qué cambia respecto de hoy

- "Quiero verlo funcionando" pasa a tener una receta propia, en lugar de que
  el agente improvise.
- "Terminé" ya no manda el pedido de revisión sin que el cambio se haya
  probado en pantalla.
- Cuando el agente termina un paso que cambia algo visible, sugiere probarlo
  con la receta nueva en lugar de dar instrucciones sueltas.
- Queda escrito que cada etapa empieza con la tarjeta de datos de Juan, y que
  esa tarjeta trae sus datos de ejemplo.
- "¿Está todo bien?" sigue igual: corre los chequeos automáticos.

## 4. Qué vamos a probar

- [ ] La revisión automática de recetas sigue pasando con la receta nueva y
      su copia para Claude Code.
- [ ] En una tarjeta de diseño con un cambio visible, "quiero verlo
      funcionando" lleva hasta ver el cambio en la pantalla, siguiendo el
      guion del plan.
- [ ] Con Docker cerrado, el agente pide abrirlo y no sigue.
- [ ] Si la web no levanta, el agente no insiste y les dice que le pidan
      ayuda a Juan.
- [ ] En una tarjeta que no cambia nada visible, "quiero verlo funcionando"
      dice que no hay nada para mirar.
- [ ] Con la configuración apuntando a la web real, el agente no sigue y
      manda a la sección del README.
- [ ] Si lo que ven no coincide con el guion, el agente frena y no sugiere
      "Terminé".
- [ ] Con un plan viejo en inglés, el agente usa su sección equivalente.
- [ ] "Terminé" siempre pregunta si lo probaron, también en una charla nueva
      al día siguiente.
- [ ] Si responden que no o que no están seguras, ofrece recorrer el guion y
      no manda el pedido de revisión.
- [ ] Si responden que sí y vieron todo, marca el punto nuevo en el pedido de
      revisión.
- [ ] En una tarjeta que no cambia nada visible, "Terminé" marca ese punto
      como "No aplica" y manda el pedido de revisión como hoy.
- [ ] Una tarjeta que necesita guardar algo nuevo sigue frenando y pidiéndole
      a Juan.
- [ ] Lo que no tiene que cambiar: "¿Está todo bien?" sigue corriendo solo
      los chequeos automáticos.

Cada caso que necesita una charla con el agente se agrega a la lista de
escenarios de prueba de las recetas.

## 5. Cómo lo comprueba Abril

Esta tarjeta no cambia la web, así que la comprueban Flor o Jesi con la
próxima tarjeta de diseño de verdad que construyan (por ejemplo la #6, quitar
"+ New listing" del formulario). La tarjeta de práctica no sirve: dice "no
construir", así que no tiene ningún cambio para mirar.

1. En esa tarjeta, con el paso ya construido, decirle al agente "quiero verlo
   funcionando".
2. Seguir lo que pide hasta abrir la dirección que les da.
3. Ver el cambio en la pantalla, paso por paso, como dice el guion del plan,
   sin pedirle ayuda a nadie.
4. Decir "Terminé" y comprobar que el pedido de revisión trae marcado "Lo
   probé en mi computadora siguiendo Cómo lo comprueba Abril".

## 6. Pasos

1. Crear la receta "quiero verlo funcionando", con su copia para Claude Code
   y sus escenarios en la lista de pruebas.
2. Sumar "Quiero verlo funcionando" a las tablas de qué decirle al agente
   (reglas del repositorio, guía del equipo y README), y que el agente la
   sugiera al terminar un paso que cambia algo visible.
3. Agregar "Lo probé en mi computadora" a la lista de control del pedido de
   revisión, y que "Terminé" pregunte si lo probaron antes de mandárselo a
   Juan (o lo marque "No aplica" si la tarjeta no cambia nada visible).
4. Escribir la regla de las tarjetas de datos: cada etapa empieza con la
   tarjeta de datos de Juan, y esa tarjeta trae sus datos de ejemplo.

## 7. Información nueva para guardar

No. Esta tarjeta solo escribe la regla para las próximas tarjetas de datos.

## 8. Fuera de esta tarjeta

- Datos de ejemplo nuevos (clientes, pedidos, recetas): llegan con cada
  tarjeta de datos de Juan.
- Probar en las URLs de prueba de Vercel en lugar de la computadora.
- Cambiar "¿Está todo bien?".

## 9. Riesgos para el negocio

- Que probar se vuelva un paso que se saltea o se marca sin hacerlo. Por eso
  "Terminé" siempre pregunta, y solo lo marca si la persona confirma que vio
  todo lo del guion después del último paso guardado. Sigue siendo de
  palabra: el agente no puede comprobar solo qué vio la persona.
- Que una prueba en la computadora termine cambiando la web real: el agente
  frena si la configuración apunta a la web real.
- Que la receta trabe a Flor o Jesi por un problema de su computadora (Docker,
  el puerto ocupado): en ese caso pide ayuda a Juan en lugar de insistir.

## 10. Preguntas abiertas para Abril

## 11. Cambios después de la aprobación
