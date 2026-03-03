

## Tutti Frutti 💖 José & Nicol

Un juego romántico de Tutti Frutti en tiempo real para dos jugadores.

### Pantalla de Acceso
- Fondo degradado suave (rosado/lila/beige)
- Título "Tutti Frutti 💖 José & Nicol" con tipografía elegante
- Dos botones grandes: "Entrar como José 💙" y "Entrar como Nicol 💜"
- Sin registro ni contraseñas

### Sala de Espera
- Cuando un jugador entra, espera al otro
- Cuando ambos están conectados: "José y Nicol están listos 💕"
- Botón "Empezar Ronda" (cualquiera puede presionarlo)

### Ronda de Juego
- Se genera una letra aleatoria (A-Z sin Ñ) y se muestra grande y animada
- 7 campos editables: Nombre, Apellido, Color, Animal, Fruta o Verdura, Cosa, País
- Cada jugador solo ve sus propias respuestas
- Botón "¡Basta! 💘" que al presionarse bloquea ambos jugadores inmediatamente

### Pantalla de Resultados
- Animación de "¡BASTA!" con efecto visual
- Tabla comparativa lado a lado con las respuestas de ambos
- Puntaje automático: 10 pts (válida y única), 5 pts (coincidente), 0 pts (vacía o letra incorrecta)
- Marcador acumulado con corazoncitos
- Botón "Siguiente Ronda 💞"

### Backend (Supabase)
- Tabla `game_state` para sincronizar estado del juego (letra actual, ronda, quién presionó basta)
- Tabla `answers` para guardar respuestas de cada jugador por ronda
- Tabla `scores` para puntaje acumulado
- **Supabase Realtime** para sincronización instantánea entre dispositivos
- Canal de presencia para detectar quién está conectado

### Diseño
- Paleta cálida: rosados suaves, lilas, beige
- Minimalista y responsive (optimizado para celular)
- Animaciones sutiles (aparición de letra, efecto basta, transiciones)
- Detalles románticos: corazones, emojis, tipografía elegante

