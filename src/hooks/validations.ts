// Listas de validación para categorías específicas

export const VALID_COLORS = new Set([
  'rojo', 'azul', 'verde', 'amarillo', 'naranja', 'morado', 'violeta', 'rosa', 'rosado',
  'blanco', 'negro', 'gris', 'marron', 'cafe', 'beige', 'celeste',
  'turquesa', 'fucsia', 'magenta', 'lila', 'purpura', 'dorado', 'plateado',
  'bronce', 'coral', 'salmon', 'carmesi', 'escarlata', 'granate',
  'borgona', 'ocre', 'ambar', 'crema', 'perla', 'marfil',
  'lavanda', 'indigo', 'cian', 'aguamarina', 'oliva', 'esmeralda',
  'rubi', 'jade', 'cobalto', 'anil', 'bermellon',
  'ceruleo', 'caqui', 'terracota', 'vino', 'tinto',
]);

export const VALID_NAMES = new Set([
  'alejandro', 'alberto', 'alvaro', 'andres', 'antonio', 'angel', 'arturo', 'ariel', 'alex', 'alfredo', 'alan', 'abraham', 'adrian', 'armando', 'aaron', 'augusto', 'alonso', 'axel', 'abel', 'aldo',
  'benjamin', 'bernardo', 'bruno', 'braian', 'boris', 'bautista', 'blas',
  'carlos', 'cesar', 'cristian', 'camilo', 'claudio', 'cruz', 'cristobal', 'carmelo', 'conrado', 'clemente', 'celso',
  'daniel', 'david', 'diego', 'dario', 'damian', 'dante', 'domingo', 'dylan', 'denis',
  'eduardo', 'enrique', 'emilio', 'esteban', 'ernesto', 'elias', 'emanuel', 'edgar', 'enzo', 'eugenio', 'eloy', 'edison',
  'francisco', 'fernando', 'federico', 'facundo', 'fabian', 'felipe', 'felix', 'fidel', 'florencio', 'fausto', 'francis',
  'gabriel', 'gustavo', 'guillermo', 'gonzalo', 'gerardo', 'gaston', 'german', 'gilberto', 'gregorio', 'gaspar', 'guido',
  'hector', 'hugo', 'humberto', 'horacio', 'hernan', 'homero', 'honorato',
  'ignacio', 'ivan', 'ismael', 'isaac', 'israel', 'iker', 'isidro', 'isidoro', 'igor',
  'jose', 'juan', 'javier', 'jorge', 'julio', 'jesus', 'joaquin', 'julian', 'jaime', 'justo', 'jacinto', 'jeronimo', 'jonathan',
  'kevin', 'karl', 'karim', 'kaleb', 'kurt',
  'luis', 'lucas', 'leonardo', 'lorenzo', 'leon', 'lautaro', 'luciano', 'leandro', 'lisandro', 'lazaro',
  'miguel', 'manuel', 'martin', 'mateo', 'mario', 'marcos', 'mauricio', 'matias', 'maximiliano', 'marcelo', 'mariano', 'milan',
  'nicolas', 'nestor', 'norberto', 'nahuel', 'nelson', 'noel', 'narciso', 'napoleon',
  'oscar', 'osvaldo', 'omar', 'orlando', 'octavio', 'oliver', 'osiel', 'ovidio', 'odin',
  'pedro', 'pablo', 'patricio', 'pascual', 'paulo', 'placido', 'pio', 'ponciano',
  'quentin', 'quirino',
  'roberto', 'raul', 'ricardo', 'ramon', 'rafael', 'ruben', 'rodrigo', 'rene', 'rolando', 'ramiro', 'romeo', 'rigoberto',
  'sergio', 'santiago', 'sebastian', 'simon', 'salvador', 'samuel', 'silvio', 'saul', 'santos', 'santino', 'stefano',
  'tomas', 'teodoro', 'tiago', 'thiago', 'tulio', 'tadeo', 'timoteo', 'tito',
  'uriel', 'ulises', 'urbano', 'uziel',
  'victor', 'vicente', 'valentin', 'vladimir', 'valerio',
  'walter', 'william', 'wenceslao', 'washington',
  'xavier', 'xoel',
  'yago', 'yamil', 'yair', 'yeray', 'yuri',
  'zacarias', 'zaid', 'zeus', 'zenon',

  'ana', 'alicia', 'andrea', 'amanda', 'angela', 'alba', 'alejandra', 'ariana', 'alma', 'antonella', 'abigail', 'agustina', 'adrianita', 'aurora', 'alisson',
  'barbara', 'beatriz', 'blanca', 'belen', 'brenda', 'brisa', 'bertha', 'betty',
  'carmen', 'camila', 'carolina', 'claudia', 'catalina', 'cristina', 'clara', 'carlota', 'cecilia', 'cynthia', 'celia', 'consuelo', 'carla',
  'daniela', 'diana', 'dayana', 'dolores', 'dora', 'delfina', 'denisse', 'dalia', 'dafne', 'dulce',
  'elena', 'eva', 'estefania', 'esmeralda', 'elba', 'elvira', 'emilia', 'emma', 'eugenia', 'estela', 'esperanza', 'evelyn', 'erika',
  'fernanda', 'fatima', 'florencia', 'francisca', 'fiorella', 'fabiola', 'flor', 'frida', 'felicia', 'fátima',
  'gabriela', 'gloria', 'guadalupe', 'graciela', 'gisela', 'gisel', 'gala', 'genesis', 'grecia', 'gina',
  'helena', 'hortensia', 'hilda', 'haidee', 'hannah', 'herminia',
  'isabel', 'ines', 'irma', 'isabella', 'irene', 'ivonne', 'ignacia', 'ivana', 'iris', 'ilse',
  'josefina', 'juana', 'julia', 'jesica', 'julieta', 'jimenna', 'jimena', 'jazmin', 'jacinta', 'johana', 'judith',
  'karina', 'karen', 'karla', 'kiara', 'keila', 'katia', 'katherin',
  'laura', 'lucia', 'leticia', 'lorena', 'lilian', 'luisa', 'lourdes', 'liliana', 'luz', 'lidia', 'lizeth', 'luciana', 'lara', 'luna', 'lucrecia',
  'maria', 'marta', 'margarita', 'monica', 'mercedes', 'magdalena', 'marcela', 'micaela', 'miriam', 'macarena', 'malena', 'marina', 'milagros', 'melissa', 'miranda', 'maite',
  'nicol', 'nicole', 'natalia', 'norma', 'noelia', 'nuria', 'nancy', 'nayeli', 'nerea', 'nayla', 'noemi', 'nidia', 'nora',
  'olivia', 'ofelia', 'olga', 'oriana', 'odette', 'olimpa',
  'patricia', 'paula', 'pamela', 'pilar', 'paulina', 'paloma', 'penelope', 'priscila', 'pia', 'paz',
  'quilleng',
  'rosa', 'rocio', 'raquel', 'rita', 'rosario', 'rubi', 'rebeca', 'romina', 'renata', 'rosalia', 'roxana', 'ruth',
  'silvia', 'susana', 'sofia', 'sara', 'sandra', 'sabrina', 'soledad', 'salome', 'samanta', 'samira', 'selena', 'soraya',
  'teresa', 'tatiana', 'tamara', 'trinidad', 'tania', 'talía',
  'ursula', 'uma',
  'victoria', 'valeria', 'vanesa', 'veronica', 'viviana', 'valentina', 'violeta', 'vanessa',
  'wanda', 'wendy',
  'ximena', 'xenia',
  'yanina', 'yesica', 'yolanda', 'yara', 'yazmin', 'yuridia', 'yamila',
  'zaida', 'zoe', 'zaira', 'zulema',
]);

export const VALID_SURNAMES = new Set([
  'alvarez', 'alonso', 'aguilar', 'arias', 'acosta', 'alvarado', 'aguirre', 'araya', 'arroyo', 'avila', 'arevalo', 'aparicio', 'arce', 'ayala', 'alfaro', 'avalos', 'alcantar', 'aragon', 'amador',
  'blanco', 'benitez', 'burgos', 'bravo', 'berrios', 'bustos', 'barrios', 'bernal', 'brito', 'baez', 'barriga', 'barrera', 'bueno', 'becerra', 'barros', 'buendia', 'bustamante',
  'castillo', 'cruz', 'cortes', 'cabrera', 'caballero', 'calderon', 'castro', 'campos', 'cardenas', 'carrillo', 'chavez', 'cruz', 'carrasco', 'cordero', 'contreras', 'coronel', 'correa', 'carmona', 'chacon', 'cisneros',
  'diaz', 'dominguez', 'delgado', 'duarte', 'duran', 'diez', 'davila', 'del rio', 'del valle', 'daza', 'de la cruz',
  'espinosa', 'espinoza', 'escobar', 'estrada', 'enriquez', 'escalante', 'esquivel', 'escudero', 'espina', 'eusebio',
  'fernandez', 'flores', 'fuentes', 'figueroa', 'franco', 'farias', 'falcon', 'fajardo', 'fonseca', 'fidalgo',
  'garcia', 'gonzalez', 'gomez', 'gutierrez', 'garza', 'guzman', 'gallardo', 'garrido', 'godoy', 'gallego', 'guevara', 'guillen', 'guerra', 'galvez', 'gamboa',
  'hernandez', 'herrera', 'hurtado', 'hidalgo', 'huang', 'huerta', 'holguin', 'heredia', 'hermosillo',
  'iglesias', 'ibañez', 'ibarra', 'izquierdo', 'infante', 'iraheta', 'islas',
  'jimenez', 'juarez', 'jaramillo', 'jara', 'jacinto', 'jauregui', 'jasso',
  'lozano', 'lopez', 'lara', 'luna', 'leal', 'lugo', 'legarda', 'lucero', 'lagos', 'ledesma', 'landa', 'leon', 'linares', 'luque', 'llorente', 'llanos',
  'martinez', 'morales', 'marquez', 'navarro', 'mora', 'medina', 'moreno', 'mendez', 'muñoz', 'mendoza', 'maldonado', 'mejia', 'macias', 'marin', 'marino', 'miranda', 'montes', 'montoya', 'merino', 'mota', 'machado',
  'nuñez', 'nieto', 'nava', 'narvaez', 'navarrete', 'neira', 'naranjo', 'noreña', 'nolasco',
  'ortiz', 'ortega', 'osorio', 'ochoa', 'olivares', 'ordonez', 'olmos', 'oliva', 'orozco', 'ovando', 'olivo', 'ojeda',
  'perez', 'pena', 'padilla', 'pacheco', 'ponce', 'parra', 'palacios', 'paz', 'paredes', 'pardo', 'pizarro', 'pastor', 'pascual', 'perea', 'prado', 'portillo', 'pulido',
  'quintero', 'quiroga', 'quesada', 'quintana', 'quiroz', 'quevedo', 'quiros', 'quijada',
  'ramirez', 'romero', 'rodriguez', 'rivera', 'reyes', 'ruiz', 'rojas', 'ramos', 'rios', 'rubio', 'roman', 'rosas', 'rocha', 'rosales', 'reyes', 'rosario', 'rincon', 'rendon', 'requena',
  'sanchez', 'santana', 'silva', 'soto', 'salazar', 'suarez', 'serrano', 'salgado', 'sosa', 'sepulveda', 'sierra', 'solis', 'saenz', 'salas', 'salinas', 'sepulveda', 'soriano', 'santacruz',
  'torres', 'tapia', 'trujillo', 'toro', 'tolosa', 'tobar', 'talavera', 'toledo', 'teran', 'tejeda', 'tirado', 'trejo',
  'ureña', 'uribe', 'urbina', 'ulloa', 'uzcategui', 'urtubey', 'uriarte',
  'velez', 'vega', 'velazquez', 'vargas', 'valencia', 'villanueva', 'vidal', 'velasco', 'vera', 'villalobos', 'villa', 'villagomez', 'villarreal', 'vallejo', 'valdes',
  'williams', 'wagner', 'wallace',
  'yanez', 'yañez', 'yabar', 'yamamoto',
  'zapata', 'zuñiga', 'zamora', 'zarate', 'zeballos', 'zambrano', 'zavala', 'zaragosa', 'zepeda', 'zelaya', 'zorrilla'
]);

export const VALID_ANIMALS = new Set([
  'abeja', 'aguila', 'araña', 'ardilla', 'armadillo', 'avestruz', 'avispa', 'asno', 'alce', 'almeja', 'anaconda', 'antilope', 'alpaca', 'atun',
  'ballena', 'babuino', 'babosa', 'bicho', 'bufalo', 'buitre', 'burro', 'boa', 'bisonte', 'bacalao',
  'caballo', 'cabra', 'caimán', 'calamar', 'camaleón', 'camarón', 'camello', 'canario', 'cangrejo', 'canguro', 'caracol', 'caribú', 'castor', 'cebra', 'cerdo', 'chacal', 'chimpancé', 'chinche', 'ciempiés', 'ciervo', 'cigala', 'cigueña', 'cisne', 'cobaya', 'cucaracha', 'colibri', 'conejo', 'coyote', 'cocodrilo', 'condor', 'cotorra', 'cuervo', 'culebra', 'chinchilla',
  'delfín', 'diablo de tasmania', 'dingo', 'dodo', 'dragon de komodo', 'dromedario',
  'elefante', 'escorpión', 'erizo', 'escarabajo', 'estrella de mar', 'esponja', 'emú',
  'faisan', 'flamenco', 'foca', 'frailecillo', 'fenec',
  'gacela', 'gallina', 'gallo', 'garrapata', 'gato', 'gavilan', 'gaviota', 'geco', 'golondrina', 'gorila', 'gorgojo', 'gorrión', 'guanaco', 'guepardo', 'gusano', 'guacamayo',
  'halcón', 'hámster', 'hiena', 'hipocampo', 'hipopótamo', 'hormiga', 'hurón', 'huemul',
  'iguana', 'impala', 'insecto palo', 'ibis',
  'jabalí', 'jaguar', 'jirafa', 'jilguero', 'jumento',
  'koala', 'kiwi', 'kril',
  'lagartija', 'lagarto', 'langosta', 'langostino', 'lechuza', 'lémur', 'león', 'leopardo', 'libélula', 'liebre', 'lince', 'llama', 'lobo', 'lombriz', 'loro', 'luciernaga', 'lucioperca', 'lobo marino', 'liron',
  'macaco', 'manatí', 'mandril', 'mangosta', 'manta raya', 'mapache', 'mariposa', 'mariquita', 'marmota', 'medusa', 'mejillón', 'mofeta', 'mono', 'morza', 'mosca', 'mosquito', 'mula', 'murciélago', 'mandril', 'morsa', 'merluza', 'mantis',
  'narval', 'nutria', 'ñandú', 'ñu', 'novillo',
  'okapi', 'oca', 'oso', 'ostra', 'oveja', 'orangután', 'oruga', 'ornitorrinco', 'orca',
  'pájaro', 'paloma', 'pantera', 'papagayo', 'pato', 'pavo', 'pelícano', 'periquito', 'perro', 'perezoso', 'pez', 'pingüino', 'piojo', 'piraña', 'polilla', 'puercoespín', 'pulga', 'pulpo', 'puma', 'poni', 'perdiz', 'pez espada', 'potro',
  'quetzal', 'quirquincho',
  'rana', 'rata', 'ratón', 'raya', 'reno', 'rinoceronte', 'ruiseñor', 'rapel',
  'salamandra', 'saltamontes', 'sancudo', 'sapo', 'sardina', 'sepia', 'serpiente', 'suricato', 'salmon', 'sanguijuela',
  'tábano', 'tapir', 'tarántula', 'tejón', 'tigre', 'topo', 'toro', 'tortuga', 'tití', 'tiburón', 'tucan', 'trucha', 'termita',
  'urraca', 'urogallo',
  'vaca', 'vampiro', 'venado', 'víbora', 'vicuña', 'visón', 'vencejo',
  'walabí', 'wombat',
  'xarda', 'xenopus',
  'yak', 'yegua', 'yacare',
  'zarigüeya', 'zorro', 'zorrillo', 'zancudo'
]);

export const VALID_FRUITS_VEGGIES = new Set([
  'acelga', 'aguacate', 'ajo', 'albahaca', 'alcachofa', 'almendra', 'aloe vera', 'alverja', 'anana', 'apio', 'arandano', 'arveja', 'avellana', 'avena', 'aji', 'alcaucil', 'algarroba',
  'babaco', 'batata', 'berenjena', 'berro', 'betarraga', 'betabel', 'boniato', 'brocoli', 'bellota',
  'calabacin', 'calabaza', 'camote', 'caqui', 'carambola', 'cebolla', 'cebollin', 'cereza', 'champiñon', 'chayote', 'choclo', 'pimenton', 'cilantro', 'ciruela', 'coco', 'col', 'coliflor', 'curcuma', 'castaña', 'chirimoya', 'ciruela pasas',
  'damasco', 'datil', 'durazno',
  'ejote', 'elote', 'endivia', 'eneldo', 'escarola', 'esparrago', 'espinaca', 'echalote',
  'frambuesa', 'fresa', 'frutilla', 'frijol', 'fruta del dragon',
  'garbanzo', 'granada', 'guanabana', 'guayaba', 'guinda', 'guisante', 'ginseng',
  'haba', 'higo', 'hongos', 'huacatay',
  'icaco', 'ilama',
  'jalapeño', 'jamaica', 'jengibre', 'jiotilla', 'jitomate', 'jojoba', 'judia', 'jicama',
  'kale', 'kiwi', 'kion', 'kumquat',
  'lechuga', 'lenteja', 'lima', 'limon', 'litchi', 'lulo', 'lucuma', 'limon sutil', 'longan',
  'macadamia', 'maiz', 'mamey', 'mandarina', 'mango', 'mani', 'manzana', 'marañon', 'maracuya', 'melocoton', 'melon', 'menbrillo', 'menta', 'mora', 'morron', 'mostaza', 'nabo', 'naranja', 'nectarina', 'nispero', 'nopal', 'nuez',
  'ñame',
  'oliva', 'zanahoria', 'oregano',
  'pacae', 'papa', 'papaya', 'palta', 'paraguayo', 'pepino', 'pepinillo', 'pera', 'perejil', 'pimiento', 'pimenton', 'piña', 'pitahaya', 'platano', 'pomelo', 'poroto', 'puerro', 'pecana', 'pistacho',
  'quingombo', 'quinoto', 'quinua',
  'rabano', 'rabanito', 'remolacha', 'repollo', 'romero', 'rucula', 'rocoto', 'rambutan',
  'sandia', 'soya', 'sauco', 'seta',
  'tamarindo', 'tangerina', 'tomate', 'toronja', 'trigo', 'tuna', 'tomillo',
  'uva', 'urucum',
  'vainilla', 'verdolaga', 'vid',
  'wasabi', 'wakame',
  'xoconostle',
  'yaca', 'yacon', 'yuca',
  'zanahoria', 'zapallo', 'zarzamora'
]);

export const VALID_THINGS = new Set([
  'abanico', 'abrigo', 'aceite', 'acordeón', 'aguja', 'alfiler', 'alfombra', 'almohada', 'amplificador', 'anillo', 'antena', 'anteojos', 'antorcha', 'ancla', 'armario', 'arpa', 'aspiradora', 'audifonos', 'auto', 'avion', 'azucar', 'arete', 'agenda', 'astrolabio', 'alcohol',
  'balanza', 'balde', 'balon', 'banco', 'bandera', 'bañera', 'barco', 'basurero', 'bata', 'bateria', 'batidora', 'baúl', 'bicicleta', 'bigote', 'billete', 'bisagra', 'bisturí', 'blusa', 'boligrafo', 'bolsa', 'bomba', 'bombilla', 'borrador', 'bota', 'bote', 'botella', 'boton', 'brocha', 'brujula', 'bufanda', 'buzon', 'biberon', 'boleto',
  'caballo (juguete)', 'cable', 'cadena', 'caja', 'cajon', 'calcetin', 'calculadora', 'calendario', 'calentador', 'cama', 'camara', 'camisa', 'camiseta', 'campana', 'canasta', 'candado', 'canica', 'caña', 'capa', 'carpeta', 'carretilla', 'carro', 'carta', 'cartera', 'carton', 'casco', 'cazuela', 'cd', 'celular', 'cenicero', 'cepillo', 'cera', 'cerradura', 'cesta', 'chaleco', 'chamarra', 'champu', 'chancla', 'chaqueta', 'chimenea', 'chincheta', 'cinta', 'cinturon', 'clavo', 'claxon', 'cobija', 'coche', 'cohete', 'cojin', 'colador', 'colchon', 'collar', 'cometa', 'computadora', 'control', 'copa', 'corbata', 'corona', 'cortina', 'cuaderno', 'cuadro', 'cuchara', 'cuchillo', 'cuerda', 'cuna', 'cuaderno', 'camion',
  'dado', 'dardo', 'dedal', 'delantal', 'despertador', 'destornillador', 'diadema', 'diario', 'diccionario', 'diente (postizo)', 'dinero', 'disco', 'disfraz', 'dvd', 'diamante',
  'edredon', 'embudo', 'empanada', 'enchufe', 'encendedor', 'engrapadora', 'escala', 'escalera', 'escoba', 'escritorio', 'escudo', 'esmeralda', 'espada', 'espejo', 'esponja', 'esquies', 'estante', 'estatua', 'estilo', 'estufa', 'estuche', 'extintor', 'embudo', 'esfera',
  'falda', 'faro', 'farol', 'fax', 'ferrocarril', 'fideo', 'ficha', 'fieltro', 'flauta', 'flecha', 'flor', 'florero', 'foco', 'fogata', 'folder', 'fonografo', 'foto', 'freidora', 'fusil', 'freno', 'flotador',
  'gafas', 'galon', 'galleta', 'gancho', 'garaje', 'gargantilla', 'gasolina', 'gato (herramienta)', 'gel', 'glorieta', 'globo', 'goma', 'gong', 'gorra', 'gorro', 'grapa', 'grapadora', 'grabadora', 'grifo', 'guitarra', 'generador',
  'hacha', 'hamaca', 'harina', 'hebilla', 'heladera', 'helice', 'herradura', 'herramienta', 'hielo', 'hilo', 'hoja', 'horno', 'hueso', 'huso', 'hilo', 'hielera',
  'iman', 'impermeable', 'impresora', 'incienso', 'inodoro', 'insecticida', 'instrumento', 'inyeccion', 'interruptor',
  'jabon', 'jarra', 'jarron', 'jaula', 'jeringa', 'joya', 'juego', 'juguete',
  'karaoke', 'kilt', 'kiosco', 'kayak', 'kilo', 'katana', 'ketchup',
  'labial', 'ladrillo', 'lampara', 'lana', 'lancha', 'lapiz', 'lapicero', 'lata', 'latigo', 'lavadora', 'lavamanos', 'lazo', 'leña', 'lente', 'letrero', 'libro', 'licuadora', 'liga', 'lija', 'lima', 'limpiavidrios', 'linterna', 'llave', 'llanta', 'llavero', 'loza', 'lupa', 'lustradora', 'lapida', 'lanza',
  'maceta', 'machete', 'madera', 'maleta', 'mall', 'mancuerna', 'mando', 'manga', 'manguera', 'mani', 'manta', 'mantel', 'mantequilla', 'mapa', 'maqina', 'marcador', 'marco', 'marioneta', 'martillo', 'mascara', 'mata', 'matamoscas', 'mate', 'medalla', 'medicina', 'megafono', 'mesa', 'metal', 'metro', 'mezcladora', 'microfono', 'microscopio', 'microondas', 'miel', 'mochila', 'molde', 'molinillo', 'molino', 'moneda', 'মনিitor', 'monopatin', 'montura', 'mopa', 'mosquitero', 'motor', 'moto', 'mueble', 'muñeca', 'muro', 'monedero',
  'naipes', 'navaja', 'nave', 'nevera', 'nintendo', 'notas', 'nuez',
  'odometro', 'olla', 'oro', 'ordenador', 'organo', 'ornamento', 'osciloscopio', 'oveja (juguete)', 'oxigeno (tanque)',
  'pala', 'palanca', 'paleta', 'palo', 'paloma (figura)', 'pan', 'panal', 'pantalla', 'pantalon', 'paño', 'pañuelo', 'papel', 'papelera', 'paracaidas', 'paraguas', 'parrilla', 'pasaporte', 'pasador', 'pasta', 'patin', 'patineta', 'pc', 'peine', 'pelota', 'peluche', 'pendiente', 'pendrive', 'perfume', 'pergamino', 'periódico', 'perla', 'perno', 'persiana', 'pesa', 'piano', 'pico', 'piedra', 'pila', 'pincel', 'pinza', 'pizarra', 'placa', 'plancha', 'planta', 'plastilina', 'plato', 'playstation', 'pluma', 'plumon', 'polea', 'polo', 'pomada', 'poncho', 'porcelana', 'portafolio', 'postal', 'poster', 'pozo', 'prensa', 'proyector', 'puerco (alcancia)', 'puerta', 'pulsera', 'puñal', 'purificador',
  'queso', 'quilla', 'quimico', 'quena', 'quitasol', 'quitamanchas',
  'rabiola', 'radar', 'radio', 'raqueta', 'rascador', 'rastrillo', 'raton', 'rayador', 'rebanadora', 'recibo', 'red', 'regadera', 'regalo', 'regla', 'reloj', 'remo', 'resaltador', 'resorte', 'revista', 'rifle', 'rin', 'riñonera', 'robot', 'roca', 'rodillo', 'ropa', 'ropero', 'rosario', 'rotor', 'router', 'rueda', 'ruleta', 'ruido',
  'sabana', 'saco', 'salero', 'salvavidas', 'sandalia', 'sarten', 'saxofon', 'secador', 'secadora', 'sello', 'semaforo', 'semilla', 'señal', 'serrucho', 'servilleta', 'silbato', 'silla', 'sillon', 'sirena', 'sobres', 'soga', 'sombrero', 'sombrilla', 'sonda', 'sopa', 'soplete', 'sosten', 'stickers', 'sueter', 'surf (tabla)',
  'tabaco', 'tabla', 'tablero', 'taco', 'tacon', 'tacho', 'taladro', 'tamal', 'tambor', 'tamiz', 'tanque', 'tapa', 'tapete', 'tapon', 'tarjeta', 'taza', 'tazon', 'teclado', 'techo', 'teja', 'tela', 'telefono', 'telegrafo', 'telescopio', 'televisor', 'tenedor', 'termometro', 'termo', 'tijera', 'tinta', 'tintero', 'tiza', 'toalla', 'tobogan', 'tolva', 'tomacorriente', 'tornillo', 'tortilla', 'tractor', 'traje', 'trampa', 'trapeador', 'trinche', 'trineo', 'tripode', 'trompeta', 'trompo', 'trofeo', 'tubo', 'tuerca',
  'uña', 'uniforme', 'urna', 'usb', 'utensilio', 'ukelele',
  'vagon', 'vajilla', 'valvula', 'vaso', 'vela', 'velero', 'veleta', 'venda', 'ventilador', 'ventana', 'vestido', 'vhs', 'videojuego', 'vidrio', 'viga', 'vinagre', 'vino', 'violin', 'visera', 'vitamina', 'volante',
  'walkie talkie', 'walkman', 'webcam', 'wok', 'water',
  'xilofono',
  'yate', 'yate', 'yelmo', 'yeso', 'yunque', 'yo-yo', 'yogur',
  'zapato', 'zapatilla', 'zaranda', 'zocalo', 'zumbador', 'zancona', 'zafiro'
]);

export const VALID_COUNTRIES = new Set([
  // América
  'argentina', 'bolivia', 'brasil', 'canada', 'chile', 'colombia', 'costa rica',
  'cuba', 'dominica', 'ecuador', 'el salvador', 'estados unidos', 'guatemala',
  'guyana', 'haiti', 'honduras', 'jamaica', 'mexico', 'nicaragua', 'panama',
  'paraguay', 'peru', 'republica dominicana', 'surinam', 'trinidad y tobago',
  'uruguay', 'venezuela', 'belice', 'bahamas', 'barbados', 'antigua y barbuda',
  'san vicente', 'santa lucia', 'granada',
  // Europa
  'alemania', 'austria', 'belgica', 'bulgaria', 'croacia', 'chipre',
  'dinamarca', 'eslovaquia', 'eslovenia', 'espana', 'estonia',
  'finlandia', 'francia', 'grecia', 'hungria', 'irlanda', 'islandia',
  'italia', 'letonia', 'lituania', 'luxemburgo', 'malta', 'noruega',
  'paises bajos', 'holanda', 'polonia', 'portugal',
  'reino unido', 'inglaterra', 'republica checa', 'chequia',
  'rumania', 'rusia', 'serbia', 'suecia', 'suiza', 'ucrania',
  'albania', 'andorra', 'bielorrusia', 'bosnia', 'georgia', 'kosovo',
  'liechtenstein', 'macedonia', 'moldavia', 'monaco', 'montenegro',
  'san marino', 'vaticano',
  // Asia
  'afganistan', 'arabia saudita', 'armenia', 'azerbaiyan',
  'bangladesh', 'camboya', 'china', 'corea del norte', 'corea del sur',
  'corea', 'emiratos arabes', 'filipinas', 'india', 'indonesia',
  'irak', 'iran', 'israel', 'japon', 'jordania', 'kazajistan',
  'kuwait', 'laos', 'libano', 'malasia', 'mongolia',
  'myanmar', 'birmania', 'nepal', 'oman', 'pakistan',
  'qatar', 'singapur', 'siria', 'sri lanka', 'tailandia', 'taiwan',
  'tayikistan', 'timor oriental', 'turkmenistan',
  'turquia', 'uzbekistan', 'vietnam', 'yemen',
  // África
  'argelia', 'angola', 'benin', 'botsuana', 'burkina faso', 'burundi',
  'cabo verde', 'camerun', 'chad', 'comoras', 'congo',
  'costa de marfil', 'egipto', 'eritrea', 'etiopia', 'gabon',
  'gambia', 'ghana', 'guinea', 'guinea ecuatorial', 'kenia', 'kenya',
  'lesoto', 'liberia', 'libia', 'madagascar', 'malaui', 'mali',
  'marruecos', 'mauricio', 'mauritania', 'mozambique', 'namibia', 'niger',
  'nigeria', 'ruanda', 'senegal', 'sierra leona', 'somalia', 'sudafrica',
  'sudan', 'tanzania', 'togo', 'tunez', 'uganda', 'zambia', 'zimbabue',
  // Oceanía
  'australia', 'fiyi', 'nueva zelanda', 'papua nueva guinea',
  'samoa', 'tonga', 'vanuatu',
]);

/**
 * Normaliza texto removiendo acentos y espacios extra
 */
export function normalizeWord(value: string): string {
  return value.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/\s+/g, ' '); // normalizar espacios
}

/**
 * Valida si un valor es válido para su categoría.
 * Retorna true si es válido o si la categoría no tiene validación especial.
 */
export function isValidForCategory(category: string, value: string): boolean {
  const normalized = normalizeWord(value);
  if (!normalized) return false;

  switch (category) {
    case 'nombre':
      return VALID_NAMES.has(normalized);
    case 'apellido':
      return VALID_SURNAMES.has(normalized);
    case 'color':
      return VALID_COLORS.has(normalized);
    case 'animal':
      return VALID_ANIMALS.has(normalized);
    case 'fruta_verdura':
      return VALID_FRUITS_VEGGIES.has(normalized);
    case 'cosa':
      return VALID_THINGS.has(normalized);
    case 'pais':
      return VALID_COUNTRIES.has(normalized);
    default:
      return true;
  }
}
