# MEMORIA TÉCNICA Y DE DISEÑO: PITCH BIBLE INTERACTIVA «GATO Y CRUNCHY»

---

## 1. Introducción y Justificación del Formato Interactivo Transmedia

El presente Trabajo de Fin de Grado aborda la conceptualización, desarrollo visual y programación integral de la *Pitch Bible* interactiva de la serie de animación infantil *«Gato y Crunchy»*. En la industria audiovisual contemporánea, las biblias de proyectos de animación han dependido históricamente de formatos estáticos convencionales, principalmente documentos en PDF o presentaciones de diapositivas lineales. Si bien estos soportes permiten recopilar fichas de personajes, tramas y conceptos visuales, presentan una limitación insoslayable: resultan documentos pasivos que no logran transmitir el pulso, la cadencia cómica (*timing* cómico), la energía viva de los personajes ni la experiencia lúdica inherente a una producción de animación infantil actual.

Frente a este paradigma tradicional, este proyecto propone una ruptura metodológica y conceptual: transformar la *Pitch Bible* en un cuento digital interactivo y transmedia accesible desde cualquier navegador web moderno. A través de la hibridación de la narrativa ilustrada, el diseño sonoro diegético, la simulación física en tiempo real y la retroalimentación háptica y táctil, el usuario (ya sea un productor audiovisual, un distribuidor, un educador o el propio público infantil de entre 6 y 11 años) deja de ser un mero lector pasivo para convertirse en coprotagonista activo de la historia.

Cada una de las decisiones formales, técnicas y narrativas que articulan la obra ha sido concebida bajo una premisa fundamental: que la interacción nunca sea un artificio cosmético superfluo, sino un vehículo narrativo y emocional indispensable. La comedia física (*slapstick*), la curiosidad imprudente de Gato, el carácter protector y meticuloso de Crunchy, la sabiduría serena de Oti Reboti y el aprendizaje cooperativo con los habitantes del Mundo Volcánico encuentran su máxima expresión a través de acciones directas del usuario.

---

## 2. Sistema Global de Interfaz de Usuario y Experiencia (UI/UX)

La interfaz de usuario se diseñó bajo una filosofía diegética e inmersiva. Se evitó deliberadamente la apariencia de una página web utilitaria o de un lector de documentos ofimático; en su lugar, la interfaz se mimetiza con el lenguaje gráfico de los dibujos animados contemporáneos de alta gama (referencias como *Gravity Falls*, *Star vs. The Forces of Evil* o *Amphibia*), combinando contornos negros orgánicos, paletas cálidas y vibrantes, y microanimaciones que confieren vitalidad continua a la pantalla.

*(Espacio reservado para bocetos del diseño de interfaz: Libro de personajes, iconos de control y componentes de UI)*

### 2.1. El Libro Interactivo de Personajes
El Libro de Personajes responde a la necesidad fundamental de toda *Pitch Bible* de exponer con claridad las biografías, arquetipos psicológicos y desgloses de diseño (*model sheets*) de los protagonistas, pero sustituyendo las páginas frías de texto por un artefacto lúdico. 

- **Lo que se ve en pantalla**: En la esquina superior izquierda de la ventana descansa un botón flotante con el icono de un libro antiguo encuadernado. Al interactuar con él, se despliega a pantalla completa un panel modal superpuesto con textura cálida de pergamino ilustrado. En la versión de escritorio, el libro presenta una doble página abierta con cinco marcapáginas superiores que exhiben los rostros en miniatura de Gato, Crunchy, Oti, Riolita y Basalto. La página izquierda aloja el arte conceptual de cuerpo entero en alta definición, mientras que la página derecha despliega el nombre en tipografía cartoon personalizada y una ficha descriptiva detallada. En la versión adaptada a dispositivos móviles, el modal se transforma automáticamente en un carrusel vertical optimizado mediante tarjetas individuales táctiles de lectura fluida.
- **Interacción y función**: El usuario puede consultar la información de cualquiera de los cinco personajes haciendo clic o tocando en sus respectivas pestañas superiores. Esto permite sumergirse en la psicología de los personajes en cualquier instante de la lectura del cuento sin perder el hilo de la escena.
- **Implementación técnica**: El componente se gobierna en JavaScript mediante un objeto maestro de datos de personajes. Al pulsar sobre un marcador, la función actualiza de forma síncrona el contenido textual (`textContent`) y la fuente de la imagen (`src`), al tiempo que aplica clases de transición CSS para generar un deslizamiento suave de entrada (`slideInFromRight`) y un realce del marcador seleccionado mediante transformaciones de traslación negativa (`translateY(-8px)`). Para preservar la accesibilidad, el sistema bloquea el desplazamiento del fondo (`document.body.style.overflow = 'hidden'`) mientras el modal está activo y restituye el scroll al cerrarse exclusivamente mediante el botón de aspa (X), garantizando que el usuario no cierre el libro de forma involuntaria al interactuar o tocar fuera.
- **Diseño sonoro**: La apertura y el hojeado del libro se acompañan del sonido foley de paso de hojas gruesas de papel vegetal y crujido de encuadernación artesanal (`520437__fupicat__book-pages-or-paper-flutter.mp3`), aportando una sensación táctil de peso y presencia física.
- **Justificación de la decisión**: En un dossier estándar, las fichas biográficas obligan a detener la lectura y ocupan páginas densas que dispersan la atención. Al convertirlo en un tomo desplegable disponible en todo momento, se respeta el ritmo del lector y se potencia el valor de coleccionabilidad y descubrimiento.

#### 📜 Fichas Textuales del Libro de Personajes:
1. **🐱 Gato**: *«Gato es el protagonista principal y mellizo de Crunchy. Es un gato naranja, delgado, curioso, impulsivo e ingenuo. Actúa sin pensar, provocando el caos sin mala intención. Es bondadoso, confía en los demás y siempre busca ayudar. Le encanta explorar, hacer amigos, comer y coleccionar objetos extraños. Cada aventura le ayuda a comprender mejor sus emociones y las de Crunchy.»*
2. **🐷 Crunchy**: *«Crunchy es una pequeña cerdita rosa, racional, organizada y observadora. Melliza de Gato, suele intentar mantener el control y pensar antes de actuar, aunque se frustra cuando las cosas no salen como planea. Admira profundamente a su hermano y, pese a sus diferencias, siempre lo acompaña en sus aventuras. Es responsable, sensible y protectora, y su objetivo es ayudar a los demás y proteger a quienes quiere.»*
3. **🐻 Oti Reboti**: *«Oti es un enorme oso marrón de aspecto bonachón, tranquilo, paciente y protector. Tiene una personalidad serena y siempre intenta mantener la calma ante los conflictos. Es quien cuida y guía a Gato y Crunchy, ayudándolos a afrontar sus problemas sin darles las respuestas directamente. Confía en que aprendan de sus propias experiencias y descubran sus emociones por sí mismos.»*
4. **🌋 Riolita**: *«Riolita es una exploradora intrépida de pelaje rosa con manchas, cuya apariencia y colores están inspirados en la piedra volcánica riolita. Curiosa y aventurera, siempre está preparada para descubrir nuevos lugares y enfrentarse a cualquier desafío. Lleva su equipo de exploración siempre listo, convirtiéndola en una compañera preparada para cualquier aventura.»*
5. **🪨 Basalto**: *«Basalto es un oso trabajador, resistente y de gran fortaleza, inspirado en la roca que lleva su nombre. Aunque puede parecer serio y rudo, esconde un corazón noble y siempre está dispuesto a ayudar. Conoce todos los secretos subterráneos y destaca por su experiencia y conocimiento de las profundidades del mundo volcánico.»*

### 2.2. Control Global de Audio y Gestión de Permisos Sonoros
- **Lo que se ve en pantalla**: En la esquina superior derecha se sitúa un botón circular flotante con diseño de pastilla de cómic, borde negro pronunciado y el icono de un altavoz emitiendo ondas de sonido (*SFX ON*) o cruzado por una línea roja diagonal (*SFX OFF*).
- **Interacción y función**: Permite al usuario activar o silenciar con un solo toque la totalidad de los efectos de sonido, ambientes atmosféricos y síntesis de voz, otorgándole el control absoluto de su entorno auditivo.
- **Implementación técnica**: Dado que los navegadores modernos restringen severamente la reproducción automática de sonido (*autoplay policy*), se diseñó un motor de inicialización perezosa (`lazy audio unlock`). Durante el primer evento de interacción del usuario con la página (`pointerdown`, `click` o `touchstart`), el sistema despierta y desbloquea el contexto de audio. Al conmutar el botón de sonido, una variable de control booleano (`isMuted`) intercepta todas las llamadas de los motores de audio (`SFXEngine` y `VoiceEngine`). Si el usuario silencia el cuento, los audios en reproducción experimentan un desvanecimiento inmediato mediante funciones de *fade-out* para evitar chasquidos acústicos desagradables (*pop clicks*).
- **Diseño sonoro**: El propio acto de pulsar el botón reproduce un clic mecánico nítido (`1154937__bram__click-button.mp3`), reforzando la confirmación de la acción del usuario.
- **Justificación de la decisión**: La accesibilidad es prioritaria en entornos educativos, bibliotecas o espacios públicos donde el lector infantil no siempre puede reproducir sonido abierto. Proveer un conmutador visible, inmediato y universal garantiza una experiencia cómoda en cualquier contexto de uso.

### 2.3. Barra Superior de Progreso de Lectura
- **Lo que se ve en pantalla**: Una barra delgada y pulida con esquinas redondeadas y sutil contorno negro que recorre el borde superior de la ventana del navegador, llenándose progresivamente con un gradiente anaranjado y amarillo cálido a medida que se avanza en la historia.
- **Interacción y función**: Es un componente pasivo de retroalimentación en tiempo real que comunica visualmente al usuario cuánto ha recorrido del cuento y cuánto le resta para alcanzar el desenlace.
- **Implementación técnica**: Se vinculó al evento de desplazamiento (`window.addEventListener('scroll')`), calculando dinámicamente la relación porcentual entre el desplazamiento vertical actual (`window.scrollY`) y la altura total desplazable del documento (`document.documentElement.scrollHeight - window.innerHeight`). Dicho porcentaje se asigna a la propiedad CSS `width` del elemento utilizando transformaciones aceleradas por hardware GPU, asegurando una tasa de refresco constante de 60 fotogramas por segundo sin generar cuellos de botella de rendimiento (*layout thrashing*).
- **Justificación de la decisión**: En narrativas de scroll vertical (*scrollytelling*), los lectores necesitan referencias espaciales para gestionar su tiempo y anticipar los clics de clímax, especialmente en públicos infantiles donde la noción de longitud de un texto digital puede resultar abstracta.

### 2.4. Sistema Diegético de Diálogos, Avatares Expresivos y Síntesis de Voz
- **Lo que se ve en pantalla**: En cada viñeta, el diálogo de los personajes no se imprime como un bloque de texto plano, sino enmarcado en una pastilla de cómic con fondo blanco puro, sombra proyectada nítida y un borde redondeado de 4 píxeles cuyo color codifica la identidad del personaje que habla: naranja vibrante para Gato, rosa chicle para Crunchy, marrón cálido para Oti, carmesí para Riolita y grafito volcánico para Basalto. En el lateral izquierdo de la burbuja descansa un avatar circular con la cabeza del personaje, cuya ilustración cambia según el estado emocional de la frase (sonrisa, asombro, enfado o grito).
- **Interacción y función**: Cuando el usuario interactúa con la escena, los diálogos avanzan secuencialmente réplica a réplica. En momentos de fuerte carga dramática o comedia (como los gritos de abducción o las discusiones), la pastilla ejecuta una sacudida visual animada (*shake / rage*), comunicando visualmente la intensidad vocal del personaje.
- **Implementación técnica**: El sistema opera mediante el motor `VoiceEngine`, el cual se comunica con la API estándar del navegador `SpeechSynthesisUtterance`. Para conferir personalidad acústica diferenciada a cada criatura sin requerir gigabytes de audios pregrabados, el motor modula algorítmicamente el tono (*pitch*), la velocidad (*rate*) y la frecuencia: Gato posee un tono agudo y acelerado propio de un felino hiperactivo; Crunchy exhibe una dicción más articulada y rápida; Oti utiliza un tono grave, calmado y pausado; y las criaturas volcánicas modulan frecuencias más ásperas. Un sistema de bloqueo temporal (*debounce* de 300 ms) previene que pulsaciones repetidas y apresuradas del usuario solapen las pistas de voz o rompan la coherencia del diálogo.
- **Justificación de la decisión**: Esta hibridación de cómic clásico, avatar expresivo y síntesis fonética aproxima el cuento a una serie de animación televisiva. Facilita la comprensión lectora en niños que están aprendiendo a leer y demuestra ante los evaluadores de la *Pitch Bible* el ritmo de comedia y la complementariedad psicológica de los protagonistas.

---

## 3. La Portada Interactiva (Hero Section)

*(Espacio reservado para bocetos del diseño de la Portada, logotipo y poses alternativas de los personajes)*

- **Lo que se ve en pantalla**: La experiencia da la bienvenida al usuario con una gran portada editorial. En la parte central destaca el imponente logotipo oficial de *«Gato y Crunchy»*, con tipografía redondeada, borde cartoon pronunciado y una sutil sombra de elevación. Flanqueando el título, se encuentran las figuras de cuerpo entero de los mellizos: Crunchy a la izquierda, observando sonriente, y Gato a la derecha, con su clásica pose curiosa y enérgica. Bajo ellos se sitúa una pastilla interactiva que invita a iniciar la aventura.
- **Interacción y función**: Tanto el logotipo como los personajes responden activamente al contacto del usuario. Al hacer clic sobre el logotipo, este se deforma elásticamente; por su parte, al pasar el cursor o posar el dedo sobre Crunchy y Gato, ambos personajes reaccionan revelando elementos clave de la trama: Crunchy aparece sujetando el racimo de uvas dulces de fuego que protagoniza la misión, mientras que Gato empuña con entusiasmo la pistola interdimensional que provocará el incidente de la historia.
- **Implementación técnica**: El efecto sobre el logotipo se implementó mediante la clase CSS `.logo-boing` controlada por JavaScript, la cual ejecuta una curva de interpolación elástica (`cubic-bezier(0.68, -0.55, 0.265, 1.55)`) que escala y comprime la imagen alternativamente a lo largo de los ejes X e Y antes de retornar a su reposo. Para los personajes, se implementó una estructura de doble capa de sprites (`.char-img-normal` y `.char-img-hover`) con transición de opacidad acelerada y soporte dual tanto para pseudo-clases `:hover` de escritorio como para eventos de pulsación táctil (`pointerdown`), garantizando que la sorpresa funcione de forma idéntica en pantallas táctiles de móviles y tabletas.
- **Diseño sonoro**: La pulsación sobre el logotipo desencadena un sonido cómico clásico de resorte elástico cartoon (*boing*) (`542320__eminyildirim__boing.mp3`), reforzando de inmediato el tono de humor ligero y desenfadado que vertebra la obra.
- **Justificación de la decisión**: La portada debe generar una impresión imborrable en los primeros cinco segundos. En lugar de una carátula inerte, este recibimiento interactivo introduce desde el primer instante las dos dinámicas centrales del proyecto: que el universo responde al tacto del usuario y cuáles son los dos objetos detonantes del conflicto narrativo (las uvas y el artefacto dimensional).

#### 📜 Textos Editoriales de la Portada:
- **Subtítulo Teaser**: *«Una aventura cartoon donde cada mundo fantástico es el reflejo de una emoción y cada conflicto se convierte en una oportunidad para crecer.»*
- **Llamada a la Acción (CTA)**: *«Desliza hacia abajo para adentrarte en el bosque y comenzar la aventura.»*

---

## 4. Desarrollo Escena por Escena (Capítulos 01 al 10)

### 4.1. Escena 01: Érase una vez... (El Portal Flotante y el Lip-Sync)

*(Espacio reservado para bocetos de la Escena 01: Fondo del bosque, estructura del portal dimensional y animación de bocas de Gato)*

- **Lo que se ve en pantalla**: El primer capítulo introduce el bosque donde habitan los protagonistas, frente al cual ha surgido una anomalía extraordinaria: un vórtice circular azulado que gira sobre sí mismo y flota en el aire. En su interior asoma Gato con medio cuerpo dentro del portal, mirando con curiosidad y asombro hacia el exterior. En la parte inferior descansa la pastilla de diálogo con el avatar del guante interactivo.
- **Interacción y función**: La viñeta invita al usuario a tocar el portal para descubrir qué está sucediendo. Al pulsarlo, el portal cobra vida acústica, Gato abre y modula su boca en sincronía con la voz y el diálogo avanza hasta que Crunchy interviene advirtiéndole del peligro de asomarse a lugares desconocidos.
- **Implementación técnica**: La escena integra la API nativa de `IntersectionObserver`: el portal emerge suavemente del vacío en el momento exacto en que entra en el campo de visión del usuario al hacer scroll. El giro continuo del vórtice se ejecuta mediante una animación CSS pura de rotación continua (`transform: rotate(360deg)` en 12 segundos lineales). La sincronización labial (*lip-sync*) de Gato se resolvió mediante un secuenciador en JavaScript que cicla rápidamente entre cuatro fotogramas transparentes de boca dibujados individualmente en Procreate (`Gato_Boca-1.png` a `Gato_Boca-4.png`) mientras la síntesis de voz o el audio de la escena se encuentran activos, deteniéndose en el fotograma neutro cerrado al concluir la locución.
- **Diseño sonoro**: Al pulsar la escena, se reproduce el efecto continuo de resonancia magnética y plasma espacial del portal (`Portal.mp4` / `Portal.mov`). Para evitar cualquier corte estridente, el volumen se incrementa suavemente de 0 a 0.75 mediante un algoritmo de rampa temporal progresiva (*fade-in* en 800 milisegundos).
- **Justificación de la decisión**: Abrir la historia con un portal en movimiento y un personaje animado cuadro a cuadro rompe de inmediato las expectativas de un cuento tradicional en papel, demostrando la viabilidad técnica del *lip-sync* ligero sobre navegadores web sin requerir motores pesados de videojuegos.

#### 📜 Guion y Textos Integrados de la Escena 01:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«¡Bienvenidos al comienzo de una gran aventura! Toda historia emocionante empieza con una invitación a descubrir nuevos mundos, grandes lecciones y divertidas sorpresas.*  
  > *En un rincón donde la magia y la curiosidad se dan la mano, comienza una gran aventura entre hermanos.»*
- **Diálogos Interactivos y Voz (`script.js`)**:
  1. 🐱 **Gato** *(asomándose por el portal, sonriente)*: «¡Hola! Soy Gato. Sí, soy un gato y me llamo Gato, ¡no se rompieron la cabeza con el nombre! ¿Listo para una gran aventura?»
  2. 🐷 **Crunchy** *(con voz distante desde el interior del portal)*: «¡Gatooo! ¿Dónde te has metido? ¡Oti nos está llamando y como se enfríen las migas te las comes tú!»
  3. 🐱 **Gato** *(volviéndose hacia el lector)*: «¡Un momento, Crunchy! ¡Que estoy hablando con el lector y hay que ser educado!»
  4. 🐷 **Crunchy** *(impaciente)*: «¡Pues date prisa, que ya sabes cómo se pone Oti cuando no venimos a comer!»
  5. 🐱 **Gato** *(guiñando un ojo)*: «¡Vale, ya voy! ¡Ponte cómodo, que esto se va a poner interesante!»

---

### 4.2. Escena 02: La Cabaña del Gran Árbol (Cuadro Familiar 3D con Perspectiva Parallax)

*(Espacio reservado para bocetos de la Escena 02: Despiece en capas del retrato familiar: fondo de madera, grupo de personajes y marco rústico)*

- **Lo que se ve en pantalla**: La viñeta contextualiza la cotidianidad de los mellizos en la cabaña del gran árbol antes de la aventura. Se muestra un entrañable retrato familiar enmarcado en madera rústica tallada, donde aparecen Oti Reboti, Crunchy y Gato (este último con una divertida expresión bizca). Sobre la superficie de la foto se aprecia un sutil brillo reflectante de cristal.
- **Interacción y función**: Cumpliendo con el requerimiento de accesibilidad multiplataforma, la interacción es doble: al deslizar el dedo en pantallas táctiles o mover el ratón en escritorio, el cuadro entero se inclina tridimensionalmente en el espacio, generando un profundo efecto de paralelaje donde los personajes parecen salir de la madera; por otro lado, al pulsar sobre la foto, se dispara el sonido de una cámara fotográfica y la familia comparte sus recuerdos sobre ese día.
- **Implementación técnica**: El efecto se fundamenta en propiedades tridimensionales de CSS3 (`perspective: 1000px` y `transform-style: preserve-3d`). La ilustración se exportó en tres capas transparentes independientes con coordenadas Z diferenciadas: el fondo del árbol a `translateZ(-15px)`, el grupo de personajes en el plano medio a `translateZ(10px)` y el marco exterior en el primer plano a `translateZ(30px)`. Los controladores de eventos táctiles y de ratón (`touchmove` y `mousemove`) normalizan las coordenadas del cursor respecto al centro del marco y actualizan los ángulos de inclinación X e Y mediante interpolación continua en `requestAnimationFrame`. Simultáneamente, la capa de reflejo (`cuadro-glass-glare`) desplaza un degradado blanco semi-transparente en sentido opuesto al ángulo de inclinación, simulando la refracción física de la luz natural sobre el cristal.
- **Diseño sonoro**: La primera pulsación reproduce el clic mecánico de un obturador de cámara réflex clásica (`Foto.mp4`), seguido de las voces de Gato riéndose de su propia cara bizca y Crunchy recordándole con ternura que siempre sale así en los retratos familiares.
- **Justificación de la decisión**: Esta interacción sustituye la típica fotografía plana de dossier por un objeto casi tangible. Permite al usuario "jugar" con la foto familiar, generando empatía inmediata con los personajes y anclando la relación fraternal y afectiva del trío protagonista antes de que estalle el conflicto.

#### 📜 Guion y Textos Integrados de la Escena 02:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«En lo alto de las ramas del bosque vivían **Gato** y **Crunchy**, dos pequeños mellizos inseparables, junto a su tío **Oti Reboti**, un oso bonachón de gran corazón y mejor cocinero.*  
  > *Su hogar en el gran árbol era un refugio acogedor donde nunca faltaban los juegos, las risas, el aroma a comidas caseras y mil rincones por explorar.»*
- **Diálogos Interactivos y Voz (`script.js`)**:
  1. 🐱 **Gato** *(mirando la foto, divertido)*: «¡Mirad qué fotaza familiar! Crunchy y yo con Oti en el gran árbol... ¡aunque salgo un poco bizco!»
  2. 🐷 **Crunchy** *(riéndose con picardía)*: «¡Ja, ja, ja! ¡Pero si tú siempre sales bizco en todas las fotos, Gato!»
  3. 🐻 **Oti Reboti** *(con voz paternal y serena)*: «¡Ja, ja, ja! La familia siempre unida. ¡Incluso con tus caras raras!»

---

### 4.3. Escena 03: Las Migas de Oti (Sartén Cenital con Simulación Física de 38 Partículas)

*(Espacio reservado para bocetos de la Escena 03: Vista cenital de la sartén y banco de alimentos: migas de pan, dados de panceta y ajos)*

- **Lo que se ve en pantalla**: La escena transporta al usuario a la cocina de la cabaña, observando desde una perspectiva cenital (plano picado aéreo) la gran sartén de hierro de Oti sobre el fogón. En su interior descansa una generosa ración de migas de pan doradas, tacos de panceta y ajos tiernos. 
- **Interacción y función**: El usuario puede interactuar directamente con la sartén: al deslizar sobre ella o tocarla enérgicamente, los alimentos saltan, rebotan y vuelan como si la sartén se estuviera salteando al fuego en tiempo real. Al mismo tiempo, Oti explica la importancia de su receta tradicional y se lamenta de que falte el ingrediente estrella: las uvas dulces, detonando la carrera hacia el desván.
- **Implementación técnica**: Se implementó un motor físico bidimensional a medida en JavaScript. Dentro del contenedor circular de la sartén se instanciaron 38 elementos DOM individuales, cada uno correspondiente a un sprite real ilustrado en Procreate (`Migas-1.png` a `Migas-38.png`). Cada partícula posee un vector de posición $(x, y)$, velocidad $(vx, vy)$ y masa. En cada fotograma de `requestAnimationFrame`, el algoritmo aplica un vector de gravedad central, una fricción cinética del 97% (`friction = 0.97`) para frenar el movimiento orgánicamente, y un algoritmo de colisión elástica circular: si la distancia euclidiana entre una partícula y el centro de la sartén excede el radio interior, su vector de velocidad se invierte con un factor de restitución del 75% (`bounce = -0.75`), manteniéndola siempre confinada dentro del perímetro de cocinado. La interacción del usuario inyecta impulsos aleatorios de aceleración que disparan los alimentos hacia el aire.
- **Diseño sonoro**: La interacción despierta el sonido real y envolvente de fritura de alimentos crujiendo en aceite caliente (`249128-Frying_Food_2.wav`). Gracias a un gestor de volumen dinámico, el crepitar de la comida sube suavemente de volumen durante el salteado y se mantiene como colchón sonoro continuo durante toda la conversación con Oti, extinguiéndose con un elegante *fade-out* solo cuando el diálogo concluye.
- **Justificación de la decisión**: Las migas son el ancla cultural y emocional de toda la serie; representan el hogar y la unión familiar. Permitir al lector saltear las migas y escuchar su chisporroteo convierte un plato tradicional en una experiencia multisensorial inolvidable, haciendo comprensible por qué los mellizos están dispuestos a viajar a otra dimensión con tal de conseguir las uvas que faltan.

#### 📜 Guion y Textos Integrados de la Escena 03:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«Una tarde soleada, un aroma irresistible inundó toda la casa: el tío **Oti** estaba preparando su famosa receta de migas caseras.*  
  > *—¡Casi está listo! —anunció con una sonrisa—. Solo falta el toque final: las uvas más dulces del desván. ¿Quién sube a buscarlas?*  
  > *Movidos por las ganas de ser el primero y ayudar en el festín, **Gato** y **Crunchy** se ofrecieron a subir al desván a buscarlas.»*
- **Diálogos Interactivos y Voz (`script.js`)**:
  1. 🐻 **Oti Reboti** *(removiendo la sartén)*: «¡Mmm! ¡Estas migas huelen de maravilla! Solo faltan las uvas del desván para que queden perfectas.»
  2. 🐱 **Gato** *(entusiasmado y competitivo)*: «¡Voy yo, voy yo! ¡A que llego yo antes al desván!»
  3. 🐷 **Crunchy** *(saliendo tras él)*: «¡Eso lo veremos, listo! ¡Espérame!»
  4. 🐻 **Oti Reboti** *(riéndose desde la cocina)*: «¡Ja, ja, ja! ¡No corráis tanto, pillines, que las uvas no se van a escapar!»

---

### 4.4. Escena 04: Lío en el Desván (Despeje Balístico de Cajas y la Pistola Dimensional)

*(Espacio reservado para bocetos de la Escena 04: Cajas de cartón del desván, objetos arrinconados y la pistola interdimensional con sus estados de carga)*

- **Lo que se ve en pantalla**: Tras el encargo de Oti, Gato y Crunchy suben al desván en busca de las uvas guardadas, encontrándose con una caótica pila de cuatro cajas de cartón viejas que bloquean el baúl del fondo. 
- **Interacción y función**: La tarea del usuario consiste en despejar el camino caja por caja. Con cada toque, una caja sale despedida por los aires mientras Gato comenta lo que va encontrando. Al retirar la cuarta caja, queda al descubierto un extraño artefacto alienígena con luces de neón: la pistola interdimensional. Al pulsar sobre ella, el artefacto vibra, se sobrecarga de energía y dispara un haz lumínico incontrolable ante los gritos de advertencia de Crunchy y la insolencia de Gato.
- **Implementación técnica**: Las cuatro cajas (`caja_1.png` a `caja_4.png`) se apilaron con z-index descendente y posiciones milimétricas de solapamiento. Al recibir un evento de clic, JavaScript añade alternativamente las clases CSS `.caja-flung-left` y `.caja-flung-right`, las cuales ejecutan animaciones balísticas con rotaciones de hasta $\pm 45^{\circ}$ y traslaciones laterales de 350 píxeles combinadas con un desvanecimiento de opacidad a cero. Una vez que el contador de cajas despejadas llega a cuatro, se remueve la clase oculta de la pistola dimensional y se habilitan sus estados de animación reactiva: `.is-charging` (resplandor cian parpadeante y microvibración de 2 píxeles a alta frecuencia) y `.is-shooting` (expansión de un haz de plasma mediante degradado cónico acelerado).
- **Diseño sonoro**: Cada caja apartada reproduce sonidos secos de cartón y madera. La activación de la pistola desencadena un zumbido creciente de energía eléctrica de ciencia ficción (`whoop`), seguido de la disputa a gritos entre los mellizos (*«¡Gato, no toques eso! ¡Que nos conocemos y lo acabarás rompiendo!»* / *«¡Que no lo iba a romper, aguafiestas! ¡No me mandes!»*).
- **Justificación de la decisión**: Esta escena es el punto de giro (*inciting incident*) del cuento. La acción mecánica de desenterrar objetos con las manos traslada directamente al usuario la sensación física de buscar en un desván desordenado, haciendo al lector cómplice y testigo directo de la travesura imprudente de Gato.

#### 📜 Guion y Textos Integrados de la Escena 04:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«**Gato** y **Crunchy** subieron al desván, un rincón repleto de baúles polvorientos y recuerdos guardados durante generaciones.*  
  > *Rebuscando entre las cajas, **Gato** encontró un extraño artefacto luminoso. **Crunchy** le dijo enseguida que lo dejase en su sitio y se centrase en buscar las uvas, pero **Gato**, llevado por la curiosidad, no quiso hacerle caso y la discusión empezó al instante.*  
  > *Al alimentarse de la tensión y los gritos, la misteriosa **pistola interdimensional** comenzó a sobrecargarse de energía azul, respondiendo incontrolablemente al enfado de ambos...»*
- **Diálogos Interactivos al apartar cajas (`script.js`)**:
  - 🐱 **Gato** *(1ª caja apartada)*: «¡Aaaatchís! ¡Cuántos trastos viejos tiene Oti aquí guardados!»
  - 🐱 **Gato** *(2ª caja apartada)*: «¡Por aquí no hay nada! Solo juguetes viejos y cachivaches...»
  - 🐱 **Gato** *(3ª caja apartada)*: «¡Ya casi llego al fondo! ¿Dónde habrá metido las uvas?»
  - 🐱 **Gato** *(4ª caja apartada, descubriendo el arma)*: «¡Halaaa! ¡Mira qué pasada de cacharro con luces!»
- **Diálogos del disparo y discusión (`script.js`)**:
  1. 🐷 **Crunchy** *(enfadada y alarmada al ver el arma cargándose)*: «¡Gato, no toques eso! ¡Que nos conocemos y lo acabarás rompiendo!»
  2. 🐱 **Gato** *(picado, apretando el botón)*: «¡Que no lo iba a romper, aguafiestas! ¡No me mandes!»

---

### 4.5. Escena 05: ¡Salto Dimensional! (El Vórtice del Portal y Revelación en Vivo del Fondo)

*(Espacio reservado para bocetos de la Escena 05: Vórtice del portal azul, abducción de los mellizos y el resplandor de lava del mundo interior)*

- **Lo que se ve en pantalla**: El disparo descontrolado de la pistola sobrecarga el tejido del espacio y abre un agujero de gusano masivo en mitad del desván. Visualmente, el portal se presenta como una lente dimensional circular rodeada de plasma azul energético. En su núcleo, sin embargo, se vislumbra una atmósfera rojiza de brasas flotantes que anticipa el destino.
- **Interacción y función**: Al tocar el portal o posar el cursor sobre él, la membrana de plasma se dilata y revela en alta resolución el interior del Mundo Volcánico al que van a parar. Si se pulsa, se desata la abducción: los mellizos son absorbidos dando vueltas mientras los bocadillos de diálogo sacuden la pantalla en señal de pánico cósmico.
- **Implementación técnica**: La escena emplea una estructura multicapa donde el fondo volcánico (`portal-inner-world`) se encuentra enmascarado mediante la propiedad CSS `clip-path: circle(0% at center)`. Al interactuar (`mouseenter` o `touchstart`), la máscara se expande fluidamente hasta `circle(55% at center)` en 500 ms con aceleración suave. Paralelamente, una capa superpuesta de partículas de ascuas (`portal-embers-fx`) ejecuta animaciones ascendentes con variaciones pseudoaleatorias de retardo (`animation-delay`). Al pulsar para avanzar el diálogo, la clase `.is-transporting` aplica una distorsión de escala y desenfoque radial (`backdrop-filter: blur(4px)`) que simula la fuerza de succión del agujero negro.
- **Diseño sonoro**: La apertura visual del portal activa el cruce de pistas sonoras: el zumbido de plasma se funde con un rugido profundo y envolvente de fuego y lava incandescente (`361580-FireGroaning05.wav`), acompañado de los gritos desesperados de los hermanos (*«¡Gatoooo! ¡Nos absorbe el portal!»* y el célebre *«¡¡Agarra mi pata y no me sueltes!! ¡¡Aaaaah!!»*).
- **Justificación de la decisión**: Revelar interactivamente el mundo de lava a través de la ventana del portal antes de caer en él genera una poderosa anticipación visual y auditiva. El cambio cromático brusco (del azul frío al rojo ígneo) impacta al espectador y materializa visualmente el viaje dimensional de la serie.

#### 📜 Guion y Textos Integrados de la Escena 05:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«Con un potente zumbido, la pistola liberó toda la energía acumulada y abrió un enorme portal dimensional en medio del desván.*  
  > *Antes de que pudiesen salir corriendo, **el portal los abdujo en un instante**. Dando vueltas y más vueltas por el **túnel interdimensional**, **Gato** y **Crunchy** salieron disparados hacia **una dimensión completamente desconocida**.»*
- **Diálogos Interactivos y Voz en el Vórtice (`script.js`)**:
  1. 🐷 **Crunchy** *(gritando despavorida mientras gira en el túnel)*: «¡Gatoooo! ¡Nos absorbe el portal! ¡¿Ves lo que pasa por tocar?!»
  2. 🐱 **Gato** *(aterrorizado, intentando sujetarla)*: «¡¡Agarra mi pata y no me sueltes!! ¡¡Aaaaah!!»
  3. *Aviso del sistema*: *«¡Aterrizaje forzoso en el Mundo Volcánico! Desplaza hacia abajo...»*

---

### 4.6. Escena 06: Mundo Volcánico (Observación con Prismáticos y la Avalancha de Roca)

*(Espacio reservado para bocetos de la Escena 06: Máscara óptica de prismáticos de Crunchy, disputa de Riolita y Basalto, y la roca rodante)*

- **Lo que se ve en pantalla**: Tras aterrizar forzosamente en el interior de una gruta volcánica, Crunchy saca sus prismáticos de exploradora para inspeccionar el horizonte. La pantalla adopta la visión subjetiva de la cerdita: una máscara oscura con dos aperturas circulares unidas que recortan el paisaje de volcanes, géiseres de humo y ríos de lava. En la distancia se distingue a dos criaturas autóctonas, Riolita y Basalto, enzarzadas en una acalorada discusión por una gran piedra ígnea.
- **Interacción y función**: Al tocar los prismáticos, el usuario asume la mirada de Crunchy. Al hacer avanzar el diálogo, se escucha a los dos mineros disputándose la pertenencia de la roca hasta que, en un descuido cómico, la piedra se precipita montaña abajo rodando a toda velocidad y colisiona violentamente contra la entrada de la cueva donde están los mellizos, taponando la salida.
- **Implementación técnica**: El visor se construyó mediante un elemento de superposición absoluta (`prismatics-mask-layer`) que utiliza la propiedad CSS `mask-image` compuesta por dos círculos radiales tangentes y un marco oscuro perimetral. Dentro del área visible, el sprite de la roca (`Roca-1.png`) se encuentra vinculado a una animación dirigida por JavaScript (`.is-rolling-down`): al desencadenarse el evento, la roca rota sobre su centro a 720 grados por segundo mientras su posición horizontal y vertical se desplaza a lo largo de una trayectoria rectilínea acelerada (`translate(380px, 140px)`). Al llegar al final de su recorrido, el contenedor completo de la viñeta ejecuta la clase `.shake-hard` (oscilaciones rápidas de $\pm 6$ píxeles en 400 ms), simulando el temblor de tierra provocado por el impacto.
- **Diseño sonoro**: La escena combina las voces enfrentadas de Riolita y Basalto con el sonido físico y áspero de cantos rodados y piedras frotándose a gran velocidad (`303479-Stones-Scrape-Jolt-052.wav`), que culmina en un estruendo seco de explosión y caída de escombros en el momento exacto del taponamiento.
- **Justificación de la decisión**: La introducción de los prismáticos como mirilla óptica rompe la cuarta pared y sumerge al lector en el punto de vista de Crunchy. Narrativamente, la disputa infantil de los mineros funciona como un "espejo cómico" de la discusión que acababan de tener Gato y Crunchy en el desván, preparando el terreno para la lección de cooperación.

#### 📜 Guion y Textos Integrados de la Escena 06:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«Al cruzar el portal, aparecieron en el interior de una cueva frente a un imponente paisaje de volcanes y ríos de magma. **Crunchy** sacó sus prismáticos para explorar los alrededores y, a lo lejos, descubrieron a dos habitantes locales, **Riolita** y **Basalto**, disputándose a gritos una gran roca de lava.*  
  > *Estaban tan ocupados discutiendo y gritándose que ni se dieron cuenta del peligro: la roca empezó a rodar montaña abajo hasta encajarse con un tremendo estruendo en la boca de la cueva.»*
- **Diálogos Interactivos en los Prismáticos (`script.js`)**:
  1. 🌋 **Riolita** *(tirando de la roca con enfado)*: «¡Esta roca la vi yo primero! ¡Suéltala, Basalto, que es mía!»
  2. 🪨 **Basalto** *(aguantando con terquedad)*: «¡De eso nada, que la he picado yo! ¡Búscate otra!»
  3. 🌋 **Riolita** *(alarmada al ver que la roca se suelta)*: «¡Cuidado, bruto, que se nos resbala cuesta abajo!»

---

### 4.7. Escena 07: ¡La Cueva Bloqueada! (El Pacto de Equipo Progresivo de Manos/Patas)

*(Espacio reservado para bocetos de la Escena 07: Despiece de los 4 brazos/patas de los personajes: Riolita, Basalto, Crunchy y Gato)*

- **Lo que se ve en pantalla**: Tras el desastre, la cueva ha quedado completamente sellada por la mole de piedra. Gato y Crunchy se reúnen con Riolita y Basalto frente a la roca. En el centro visual de la escena se presenta una pastilla interactiva circular que invita a formalizar una alianza.
- **Interacción y función**: En lugar de resolver el problema mediante una decisión automática, el cuento exige que el usuario forje la amistad paso a paso. Cada toque en la pantalla añade secuencialmente una mano/pata de los cuatro personajes al centro en señal de unión de equipo (primero Riolita, luego Basalto, después Crunchy y finalmente Gato), mientras cada uno verbaliza su compromiso de dejar a un lado el orgullo y trabajar juntos.
- **Implementación técnica**: El escenario (`team-hands-box`) alberga cuatro capas de brazos dibujados de forma independiente (`brazo_riolita.png`, `brazo_basalto.png`, `brazo_crunchy.png` y `brazo_gato.png`), orientados hacia las cuatro esquinas exteriores. Un autómata finito de cuatro estados en JavaScript gestiona el progreso: con cada clic válido, se recupera el índice correspondiente, se remueven los brazos no alcanzados y se activa la clase `.is-active` del brazo entrante. Esta clase aplica una transición de traslación desde fuera del marco hacia el centro del punto de convergencia (`transform: translate(0, 0) scale(1)`) con un rebote elástico. Al situarse la cuarta pata (Gato), se dispara un destello radial dorado mediante un elemento pseudo-animado `.team-pact-flash` que ilumina fugazmente la escena.
- **Diseño sonoro**: Cada incorporación de una pata se celebra con el sonido enérgico de un choque de palmas o *high-five* cartoon, culminando en un acorde brillante de éxito armónico al completarse la unión de los cuatro amigos.
- **Justificación de la decisión**: En las series infantiles contemporáneas, el trabajo en equipo suele explicarse mediante diálogos moralizantes que los niños olvidan con facilidad. Al requerir que el usuario junte materialmente las cuatro extremidades una a una, el valor de la cooperación se asimila a través de la propia acción lúdica, convirtiendo el mensaje moral en una vivencia física.

#### 📜 Guion y Textos Integrados de la Escena 07:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«La gigantesca roca había sellado la entrada de la cueva, bloqueando el acceso al portal que estaba dentro y les permitiría volver a casa.*  
  > *Al ver el desastre causado por su disputa, **Riolita** y **Basalto** se sintieron fatal. **Gato** y **Crunchy**, recordando su propia discusión en el desván, se acercaron para buscar una solución juntos.*  
  > *Los cuatro comprendieron que echarse la culpa no servía de nada: la única manera de despejar la entrada y volver a casa era dejar a un lado el orgullo y trabajar como un verdadero equipo.»*
- **Diálogos Interactivos al juntar las 4 extremidades (`script.js`)**:
  1. 🌋 **Riolita** *(colocando la 1ª pata al centro, apenada)*: «Vaya... por pelearnos hemos tapado la cueva entera...»
  2. 🪨 **Basalto** *(colocando la 2ª pata, reconociendo el error)*: «La verdad es que nos hemos pasado de cabezotas...»
  3. 🐷 **Crunchy** *(colocando la 3ª pata, con determinación)*: «¡Pues si golpeamos los cuatro a la vez, seguro que la rompemos!»
  4. 🐱 **Gato** *(colocando la 4ª pata y cerrando el pacto)*: «¡Venga, manos al centro! ¡A la de tres todos a una!»

---

### 4.8. Escena 08: ¡Fuerza de Equipo! (Destrucción Secuencial de la Gran Roca en 4 Fases)

*(Espacio reservado para bocetos de la Escena 08: Estados evolutivos de agrietamiento de la roca volcánica: Roca-4, Roca-3, Roca-2 y fractura total)*

- **Lo que se ve en pantalla**: Con el pacto sellado, los cuatro aliados se posicionan frente a la colosal roca volcánica que bloquea la gruta para demolerla de forma coordinada golpeando a la de tres.
- **Interacción y función**: El usuario asume el rol de ejecutor del golpe colectivo. La roca requiere cuatro impactos directos y rítmicos. Con cada pulsación, la roca sufre un resquebrajamiento visible de creciente gravedad, temblando con mayor violencia hasta que, en el cuarto y definitivo impacto, estalla en mil pedazos liberando el acceso al portal.
- **Implementación técnica**: Se diseñó una máquina de estados para la entidad física de la roca. En lugar de aplicar una simple animación genérica, se ilustraron en Procreate cuatro variantes gráficas consecutivas con fisuras de lava progresivas (`Roca-4.png`, `Roca-3.png`, `Roca-2.png` y estado pulverizado). Cada pulsación incrementa un contador interno que permuta la fuente de imagen (`src`), al tiempo que aplica animaciones de sacudida lateral con decremento de amortiguación. Al alcanzar el cuarto golpe, se inyecta la clase `.is-destroyed`, la cual disuelve la imagen mediante una combinación de escala explosiva (`transform: scale(1.35)`), dispersión de partículas y desvanecimiento a cero, revelando al fondo la salida despejada.
- **Diseño sonoro**: Se implementó una escalera de foley compuesta por tres impactos contundentes de intensidad ascendente (`1229730`, `1229731`, `1229732`), culminando en el cuarto toque con el sonido estruendoso de desmoronamiento de toneladas de roca y caída de cascotes (`303423-Stones-Hit-Drop-053.wav`), sincronizado con un fuerte *rumble* de baja frecuencia.
- **Justificación de la decisión**: Es el clímax de acción de la historia. Un solo clic habría resultado insípido y anticlimático; exigir cuatro golpes sucesivos y sincronizados con los gritos de aliento de los cuatro personajes genera un incremento tangible de adrenalina (*game feel* y satisfacción de impacto), haciendo que la victoria final se sienta merecida y celebrada.

#### 📜 Guion y Textos Integrados de la Escena 08:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«Con un propósito común y las paces hechas, **Riolita** y **Basalto** unieron su formidable fuerza mineral a la agilidad de **Gato** y el entusiasmo de **Crunchy**.*  
  > *Coordinando sus golpes al mismo compás, lograron fracturar **la gran roca** hasta reducirla a escombros, liberando el camino y descubriendo que la verdadera fuerza nace de la empatía y la colaboración.»*
- **Diálogos Interactivos al romper la roca (`script.js`)**:
  1. 🌋 **Riolita** *(tras el 1er golpe conjunto)*: «¡Buen primer golpe entre todos! ¡Seguid dándole juntos!»
  2. 🪨 **Basalto** *(tras el 2º golpe conjunto, empujando)*: «¡Eso es! ¡Otro golpe juntos con todas nuestras fuerzas!»
  3. 🐷 **Crunchy** *(tras el 3er golpe, viendo las grietas)*: «¡Ya se está agrietando! ¡El último esfuerzo entre todos!»
  4. 🐱 **Gato** *(tras el 4º golpe, la roca salta en pedazos)*: «¡¡TOMA YA!! ¡¡La rompimos entre todos!! ¡Camino libre!»

---

### 4.9. Escena 09: Un Regalo Especial (La Mochila de Crunchy y la Trayectoria Parabólica de las Uvas Ígneas)

*(Espacio reservado para bocetos de la Escena 09: Mochila dimensional de Crunchy, racimo de uvas de fuego y trayectoria de vuelo)*

- **Lo que se ve en pantalla**: Con la salida despejada y agradecidos por la ayuda mutua, Riolita y Basalto obsequian a los mellizos con el mayor tesoro gastronómico de su dimensión: las uvas ígneas recién brotadas del cráter, dulces, cálidas y luminosas como gemas de magma. Al otro lado de la viñeta, Crunchy sostiene su mochila mágica abierta y lista para almacenarlas.
- **Interacción y función**: El usuario debe recolectar el regalo. Al pulsar repetidamente sobre el racimo de uvas de fuego que sostienen los mineros, cada una de las uvas sale disparada trazando una parábola aérea en el espacio hasta aterrizar con precisión dentro de la mochila de Crunchy.
- **Implementación técnica**: El vuelo balístico de las uvas se consiguió mediante la instanciación dinámica de sprites clonados en JavaScript. Al registrarse la interacción, el script calcula las coordenadas de origen del racimo y las de destino del bolsillo de la mochila mediante `getBoundingClientRect()`. Con dichos vectores, se aplica una animación CSS keyframe con curva de aceleración bezier (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`) que descompone el movimiento en una elevación en el eje Y y un avance sostenido en el eje X, acompañado de una rotación continua de $360^{\circ}$ y una reducción de escala al entrar al fondo de la bolsa. Un contador numérico controla la recolección total de las seis uvas necesarias para completar la provisión.
- **Diseño sonoro**: Cada uva en vuelo va acompañada de un silbido cartoon ascendente (*whoosh* mágico) y un sonido acuoso y blando al encajarse dentro del bolsillo, mientras Basalto y Riolita advierten con simpatía que no se quemen los dedos y les desean un buen viaje de retorno.
- **Justificación de la decisión**: Esta escena cierra el objetivo primario que puso en marcha la aventura (conseguir las uvas para las migas de Oti). La mecánica de "recogida de objetos" (*collectible pickup*) es altamente intuitiva y gratificante en el público infantil, cerrando el bucle de recompensa de la aventura.

#### 📜 Guion y Textos Integrados de la Escena 09:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«Con el túnel despejado y la armonía recuperada, llegó el momento de despedirse y regresar al hogar.*  
  > *En señal de gratitud por su ayuda y como símbolo de su nueva amistad, **Riolita** y **Basalto** les obsequiaron con un tesoro único: **unas deliciosas uvas ígneas** recién brotadas del cráter, dulces, luminosas y cálidas como caramelo de lava.*  
  > *Crunchy abrió su bolsa de viaje para protegerlas con cariño. Tras un emotivo abrazo de despedida, ambos cruzaron el portal rumbo a su cocina.»*
- **Diálogos Interactivos durante la recolección (`script.js`)**:
  - 🐷 **Crunchy** *(abriendo la mochila)*: «¡Abre la bolsa, a ver esas uvas de lava!»
  - 🌋 **Riolita** *(lanzando la 1ª uva)*: «¡Aquí tenéis una bien calentita y dulce!»
  - 🪨 **Basalto** *(lanzando la 2ª uva)*: «¡Cuidado que queman un poco, métela rápido!»
  - 🐷 **Crunchy** *(viendo entrar la 3ª uva)*: «¡Madre mía qué ricas van a quedar con las migas!»
  - 🐱 **Gato** *(viendo la 4ª uva)*: «¡Nos van a saber a gloria después del susto que nos hemos llevado!»
  - 🌋 **Riolita** *(lanzando la 5ª uva)*: «¡Ya casi las tenéis todas dentro!»
  - 🪨 **Basalto** *(lanzando la 6ª uva)*: «¡Listo! ¡Buen viaje de vuelta a casa, amigos!»

---

### 4.10. Escena 10: El Gran Festín (El Emplatado Final de Uvas sobre las Migas y Cierre de la Historia)

*(Espacio reservado para bocetos de la Escena 10: Plato de migas doradas humeantes, uvas de fuego emplatadas y la imagen final cartoon de despedida)*

- **Lo que se ve en pantalla**: De regreso en la cabaña del gran árbol tras cruzar el portal de vuelta, la escena final presenta la mesa familiar donde Oti tiene servido un gran plato humeante de migas doradas recién cocinadas. 
- **Interacción y función**: El usuario tiene el honor de coronar la receta familiar. Con cada toque sobre el plato, una uva de fuego recolectada en el Mundo Volcánico se deposita mágicamente sobre el montículo de migas. Una vez colocadas las uvas, el plato queda completado, Oti felicita a los mellizos por haber descubierto el verdadero secreto de la cocina (la cooperación y el cariño) y la pantalla da paso a la ilustración oficial de ¡FIN!
- **Implementación técnica**: El contenedor del plato (`#kitchen-dish-stage`) contiene una matriz de seis posiciones relativas predefinidas. Cada evento de interacción desvela una de las uvas ígneas con una animación de caída por gravedad y un rebote elástico suave (`transform: scale(1.15)` seguido de reposo en escala normal). Al depositarse la última uva, la escena dispara una secuencia temporal de cierre: el plato emite un resplandor dorado permanente, los diálogos de Oti agradecen la aventura y, tras una breve pausa de 1,5 segundos, se habilita el desplazamiento suave (*smooth scroll*) hacia el bloque de rúbrica final (`#seccio-final`), donde se presenta la ilustración cartoon de cierre y los créditos autorales de Marc Gil Mayor.
- **Diseño sonoro**: La colocación de cada uva emite una nota musical armónica en escala ascendente, culminando al completarse el plato en un repique festivo de campanas y risas de los personajes, simbolizando el éxito del viaje.
- **Justificación de la decisión**: Constituye el clímax narrativo y el cierre del arco de transformación: los niños que comenzaron discutiendo en el desván regresan como un equipo maduro que ha aprendido a cooperar. Permitir que el usuario emplate las uvas con sus propias manos brinda una profunda sensación de logro y resolución satisfactoria.

#### 📜 Guion y Textos Integrados de la Escena 10:
- **Texto Narrativo Editorial (`index.html`)**:
  > *«De vuelta en la acogedora cocina del gran árbol, **Oti** los esperaba con los brazos abiertos, una sonrisa de alivio y la sartén humeante sobre la mesa.*  
  > *Al incorporar las uvas ígneas a las migas, el plato se transformó en un manjar mágico y reconfortante. Sentados en familia, **Gato** y **Crunchy** compartieron una mirada de complicidad: habían salvado la merienda y aprendido que escuchar al otro es el ingrediente más valioso de la convivencia.»*
- **Diálogos Interactivos al emplatar y epílogo (`script.js`)**:
  1. 🐱 **Gato** *(1ª uva al plato, contento)*: «¡Oti, ya estamos aquí! ¡Mira qué uvas más raras y ricas hemos traído!»
  2. 🐻 **Oti Reboti** *(2ª uva, abrazándolos)*: «¡Menudo susto me habéis dado! ¡No pensaba que ese viejo trasto del desván aún funcionaba!»
  3. 🐷 **Crunchy** *(3ª uva)*: «¡Casi nos quedamos atrapados, pero al final hicimos amigos y todo!»
  4. 🐻 **Oti Reboti** *(4ª uva, oliendo el plato)*: «¡Ja, ja, ja! Pues huelen de maravilla. ¡Echemos las uvas al plato!»
  5. 🐱 **Gato** *(5ª uva, mirando al lector)*: «¡Y gracias por acompañarnos en esta aventura y ayudarnos a volver!»
  6. 🐷 **Crunchy** *(6ª uva, fiesta final)*: «¡Venga, a la mesa todos, que las migas se enfrían!»

---

## 5. Pipeline de Producción y Stack Tecnológico Nativo

Para materializar este proyecto con el máximo rendimiento y control estético, se estableció un flujo de trabajo optimizado dividido en dos grandes fases: la producción artística en **Procreate** y el desarrollo asistido por IA en el entorno **Google Antigravity**.

### 5.1. Producción Artística por Capas en Procreate
A diferencia de la ilustración editorial tradicional, donde las viñetas se conciben como estampas planas integradas, la totalidad de los assets de *«Gato y Crunchy»* se crearon bajo una metodología de despiece funcional (*modular asset breakdown*):
- **Dibujo y entintado digital**: Creación de personajes, atrezo, fondos y bocadillos mediante iPad Pro y Apple Pencil, manteniendo una resolución nativa de 300 ppp para garantizar nitidez en pantallas de ultra alta definición (Retina y 4K).
- **Estructura en capas transparentes**: Cada elemento susceptible de interactividad (manos de personajes, fotogramas de boca, cajas individuales, lentes de prismáticos, migas independientes y piedras fracturadas) se aisló en capas exclusivas y se exportó en formato **PNG-24 sin compresión destructiva** con canal alfa transparente, asegurando que el navegador pudiera componerlas y animarlas libremente sin halos ni bordes blancos indeseados.

### 5.2. Programación en Google Antigravity (Vanilla Stack)
El desarrollo web se ejecutó sobre **Google Antigravity IDE**, priorizando un código limpio, estructurado y sin dependencias de frameworks externos pesados (como React, Angular o TailwindCSS):
- **HTML5 Semántico**: Estructuración del documento mediante etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<article>`), asegurando una jerarquía lógica de encabezados (`<h1>` a `<h2>`), atributos ARIA de accesibilidad y una arquitectura por viñetas aisladas identificables inequívocamente (`#escena-01` a `#escena-10`).
- **CSS3 Vanilla y Perspectiva Tridimensional**: Empleo de variables CSS globales (*design tokens* para paletas, tipografías y espaciados), diseño totalmente *responsive* articulado mediante CSS Grid y Flexbox con funciones matemáticas de escalado fluido (`clamp()`, `min()`, `max()`), y transformaciones 3D aceleradas por GPU (`transform-style: preserve-3d`, `translate3d`), garantizando transiciones suaves a 60 FPS sin sobrecargar la CPU del dispositivo.
- **JavaScript ES6+ Nativo**: Programación modular orientada a eventos. Se implementó una arquitectura de control de concurrencia basada en tokens (`cancelAllSequences`), la cual previene colisiones asíncronas cuando el usuario hace clics rápidos entre diferentes escenas. Asimismo, se integraron APIs web modernas como `requestAnimationFrame` para la física continua de la sartén, `IntersectionObserver` para la optimización de recursos según el scroll del usuario, y la Web Speech API para la síntesis fónica procedural.

---

## 6. Conclusión y Valor Diferenciador del Proyecto

El desarrollo de la *Pitch Bible* interactiva de *«Gato y Crunchy»* demuestra que la tecnología web moderna no solo es un canal de distribución, sino una poderosa herramienta narrativa capaz de revolucionar la manera en que se presentan los proyectos de animación ante la industria y el público.

Frente a la rigidez y frialdad de los dossieres tradicionales en PDF, esta propuesta ofrece una experiencia inmersiva donde el diseño de arte, la animación, el sonido foley y la interacción del usuario convergen en una misma dirección: dar vida tangible a los personajes y a su universo fantástico. El evaluador del TFG, así como cualquier productor o distribuidor audiovisual que examine la obra, no necesita imaginar cómo sonaría la serie o cuál sería el ritmo cómico de los mellizos; lo experimenta de primera mano al saltear las migas, al asomarse al vórtice dimensional o al forjar el pacto de manos en el Mundo Volcánico.

Este enfoque transmedia sitúa el proyecto a la vanguardia de las nuevas narrativas digitales, demostrando la viabilidad de concebir biblias de animación que cautivan no solo por la calidad de su historia y su acabado visual, sino por su capacidad para emocionar, divertir y conectar a través de la interacción directa.
