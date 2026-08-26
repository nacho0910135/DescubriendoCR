-- ==============================================================================
-- DESCUBRIENDO CR - SEED DATA POPULATION SCRIPT (COMPLETO)
-- 6 Regiones ICT, 128 Destinos Turísticos PostGIS, Normativas SINAC y Fauna
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
SET search_path = public, extensions;

-- 1. TIPO DE CAMBIO INICIAL
INSERT INTO public.system_exchange_rates (rate_buy, rate_sell, source, updated_at)
VALUES (505.00, 512.00, 'BCCR Oficial / Pruebas Iniciales', NOW());

-- 2. REGIONES TURÍSTICAS OFICIALES DEL ICT (6 REGIONES)
INSERT INTO public.regiones_ict (id, nombre_region, provincia, descripcion) VALUES
(1, 'Valle Central', 'San José', 'Corazón histórico, cultural y volcanes centrales Poás, Irazú, Barva y Turrialba'),
(2, 'Guanacaste', 'Guanacaste', 'Playas doradas del Pacífico Norte, sabanas, Bosque Tropical Seco y cordillera volcánica'),
(3, 'Pacífico Medio', 'Puntarenas', 'Playas de surf, Parque Nacional Manuel Antonio, Marino Ballena y manglares de Quepos'),
(4, 'Puntarenas y Golfo de Nicoya', 'Puntarenas', 'Península de Nicoya (Montezuma, Santa Teresa), islas del golfo y Península de Osa / Corcovado'),
(5, 'Caribe', 'Limón', 'Tortuguero, canales fluviales, arrecifes de Cahuita, Gandoca-Manzanillo y cultura afrocostarricense y bribri'),
(6, 'Zona Norte', 'Alajuela', 'Volcán Arenal, llanuras de San Carlos, Río Celeste, cavernas de Venado y humedal Caño Negro')
ON CONFLICT (id) DO UPDATE SET 
    nombre_region = EXCLUDED.nombre_region,
    provincia = EXCLUDED.provincia,
    descripcion = EXCLUDED.descripcion;

-- 3. 128 DESTINOS TURÍSTICOS CON GEOMETRÍA POSTGIS (SRID 4326)
INSERT INTO public.destinations (
    legacy_id, name, region_id, province, region, category, description,
    location, difficulty, price_national_crc, price_foreigner_usd,
    fee_type, sinac_restricted, requires_sinac_booking, sinac_booking_url,
    has_high_tides_risk, waze_url, status, cover_image_url
) VALUES
(
    1, 'Parque Nacional Volcán Poás', 1, 'Alajuela', 'Valle Central', 'Parque Nacional Volcánico', 'Uno de los cráteres activos más grandes del mundo con laguna ácida turquesa y miradores protegidos por cascos de seguridad.',
    ST_SetSRID(ST_MakePoint(-84.233, 10.1979), 4326), 'Fácil', 1130.00, 16.95,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.1979,-84.2330&navigate=yes', 'Abierto con Aforo Regulado', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    2, 'Parque Nacional Volcán Irazú (Sector Cráteres y Prusia)', 1, 'Cartago', 'Valle Central', 'Parque Nacional Volcánico', 'El volcán más alto de Costa Rica (3,432 msnm) con vistas simultáneas a los océanos Pacífico y Atlántico en días despejados.',
    ST_SetSRID(ST_MakePoint(-83.8525, 9.9792), 4326), 'Fácil', 1130.00, 16.95,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.9792,-83.8525&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
  ),
(
    3, 'Parque Nacional Volcán Arenal', 6, 'Alajuela', 'Zona Norte', 'Parque Nacional', 'Emblemático cono volcánico perfecto con senderos sobre antiguas coladas de lava y vistas panorámicas del Lago Arenal.',
    ST_SetSRID(ST_MakePoint(-84.6963, 10.4628), 4326), 'Moderado', 1130.00, 16.95,
    'Tarifa SINAC Oficial', FALSE, FALSE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.4628,-84.6963&navigate=yes', 'Abierto Diario', 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80'
  ),
(
    4, 'Parque Nacional Manuel Antonio', 3, 'Puntarenas', 'Pacífico Medio', 'Parque Nacional Costero', 'Playas paradisíacas de arena blanca, senderos de selva tropical, monos cariblancos, perezosos y arrecifes coralinos.',
    ST_SetSRID(ST_MakePoint(-84.1432, 9.3893), 4326), 'Fácil', 1808.00, 18.08,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.3893,-84.1432&navigate=yes', 'Abierto (Cierra Martes)', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80'
  ),
(
    5, 'Parque Nacional Corcovado (Estación Sirena & San Pedrillo)', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Parque Nacional Selva Virgen', 'El lugar biológicamente más intenso del planeta según National Geographic. Hogar de dantas, jaguares y 4 especies de monos.',
    ST_SetSRID(ST_MakePoint(-83.59, 8.48), 4326), 'Difícil', 2260.00, 33.90,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    TRUE, 'https://waze.com/ul?ll=8.4800,-83.5900&navigate=yes', 'Abierto (Requiere Guía Certificado)', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'
  ),
(
    6, 'Parque Nacional Cahuita & Punta Vargas', 5, 'Limón', 'Caribe', 'Parque Nacional Marino-Costero', 'Arrecife de coral caribeño protegido con senderos costeros sombreados por cocoteros y fauna marina multicolor.',
    ST_SetSRID(ST_MakePoint(-82.845, 9.736), 4326), 'Fácil', 0.00, 5.00,
    'Donación Voluntaria (Playa Blanca) / SINAC (Puerto Vargas)', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.7360,-82.8450&navigate=yes', 'Abierto Diario', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  ),
(
    7, 'Parque Nacional Tortuguero & Canales Fluviales', 5, 'Limón', 'Caribe', 'Parque Nacional Fluvial', 'Red navegable de lagunas y caños selváticos, principal santuario de anidación de la tortuga verde en el Atlántico.',
    ST_SetSRID(ST_MakePoint(-83.5042, 10.5414), 4326), 'Fácil', 1130.00, 16.95,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.5414,-83.5042&navigate=yes', 'Abierto Diario', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'
  ),
(
    8, 'Parque Nacional Chirripó (Base Crestones)', 1, 'San José', 'Valle Central', 'Parque Nacional Alta Montaña', 'La cumbre más alta de Costa Rica (3,820 msnm) a través de páramos glaciares, lagunas de origen glacial y los Crestones.',
    ST_SetSRID(ST_MakePoint(-83.4889, 9.4842), 4326), 'Extremo', 4520.00, 18.08,
    'Tarifa SINAC + Albergue Consorcio Rural', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.4842,-83.4889&navigate=yes', 'Abierto con Reserva Estricta', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
  ),
(
    9, 'Parque Nacional Volcán Tenorio & Río Celeste', 6, 'Guanacaste', 'Zona Norte', 'Parque Nacional & Río', 'Hogar del mágico Río Celeste y Los Teñideros, donde la dispersión de luz por minerales aluminosilicatos crea un azul celestial.',
    ST_SetSRID(ST_MakePoint(-84.9928, 10.7186), 4326), 'Moderado', 904.00, 13.56,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.7186,-84.9928&navigate=yes', 'Abierto Diario', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
  ),
(
    10, 'Parque Nacional Marino Ballena (Tómbolo de Uvita)', 3, 'Puntarenas', 'Pacífico Medio', 'Parque Marino & Playa', 'Famoso banco de arena en forma de cola de ballena visible en marea baja, epicentro del avistamiento de ballenas jorobadas.',
    ST_SetSRID(ST_MakePoint(-83.7589, 9.1558), 4326), 'Fácil', 1130.00, 6.78,
    'Tarifa SINAC Oficial', FALSE, FALSE, 'https://serviciosenlinea.sinac.go.cr/',
    TRUE, 'https://waze.com/ul?ll=9.1558,-83.7589&navigate=yes', 'Abierto Diario', 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80'
  ),
(
    11, 'Parque Nacional Rincón de la Vieja (Sector Las Pailas & Santa María)', 2, 'Guanacaste', 'Guanacaste', 'Parque Nacional Volcánico', 'Manifestaciones geotérmicas activas, pailas de barro hirviente, fumarolas volcánicas y cataratas escondidas La Cangreja.',
    ST_SetSRID(ST_MakePoint(-85.3344, 10.7725), 4326), 'Moderado', 1130.00, 16.95,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.7725,-85.3344&navigate=yes', 'Abierto (Cierra Lunes)', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
  ),
(
    12, 'Parque Nacional Santa Rosa & Casona Histórica', 2, 'Guanacaste', 'Guanacaste', 'Parque Nacional Histórico-Ecológico', 'Cuna de la soberanía patria costarricense de 1856 y mayor remanente de Bosque Tropical Seco de Mesoamérica.',
    ST_SetSRID(ST_MakePoint(-85.6125, 10.84), 4326), 'Fácil', 1130.00, 16.95,
    'Tarifa SINAC Oficial', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.8400,-85.6125&navigate=yes', 'Abierto Diario', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  ),
(
    13, 'Monumento Nacional Guayabo', 1, 'Cartago', 'Valle Central', 'Arqueología & Bosque', 'El sitio arqueológico precolombino más importante de Costa Rica.',
    ST_SetSRID(ST_MakePoint(-83.6917, 9.9722), 4326), 'Fácil', 1130.00, 5.65,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.9722,-83.6917&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    14, 'Parque Nacional Braulio Carrillo (Sector Quebrada González)', 1, 'Heredia', 'Valle Central', 'Bosque Lluvioso & Aves', 'Impresionante bosque nuboso atravesado por el teleférico del dosel.',
    ST_SetSRID(ST_MakePoint(-83.9389, 10.1583), 4326), 'Moderado', 1130.00, 13.56,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.1583,-83.9389&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    15, 'Parque Nacional Los Quetzales (San Gerardo de Dota)', 1, 'San José', 'Valle Central', 'Bosque Nuboso de Altura', 'Santuario primordial para el avistamiento del Quetzal Resplandeciente.',
    ST_SetSRID(ST_MakePoint(-83.805, 9.5583), 4326), 'Moderado', 1130.00, 11.30,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.5583,-83.805&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    16, 'Parque Nacional Volcán Turrialba', 1, 'Cartago', 'Valle Central', 'Parque Nacional Volcánico', 'Acceso regulado con casco y guía obligatorio por emisiones de ceniza.',
    ST_SetSRID(ST_MakePoint(-83.7667, 10.0333), 4326), 'Difícil', 1130.00, 13.56,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.0333,-83.7667&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    17, 'Parque Nacional Tapantí Macizo de la Muerte', 1, 'Cartago', 'Valle Central', 'Parque Nacional Selva de Agua', 'Una de las zonas más lluviosas del planeta, cuenca del río Orosí.',
    ST_SetSRID(ST_MakePoint(-83.7833, 9.75), 4326), 'Moderado', 904.00, 11.30,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.75,-83.7833&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    18, 'Catarata del Toro & Poza Azul', 1, 'Alajuela', 'Valle Central', 'Catarata & Cañón', 'Caída de 90 metros dentro de un cráter volcánico extinto.',
    ST_SetSRID(ST_MakePoint(-84.2811, 10.2583), 4326), 'Moderado', 4000.00, 14.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.2583,-84.2811&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    19, 'Bosque Prusia (Parque Nacional Irazú)', 1, 'Cartago', 'Valle Central', 'Senderismo & Pinos', 'Senderos del Árbol Embrujado y El Roble bajo densa neblina.',
    ST_SetSRID(ST_MakePoint(-83.875, 9.9583), 4326), 'Moderado', 1130.00, 16.95,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.9583,-83.875&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    20, 'Jardín Botánico Lankester (UCR)', 1, 'Cartago', 'Valle Central', 'Botánica & Orquídeas', 'Más de 1,400 especies de orquídeas y jardín de epífitas.',
    ST_SetSRID(ST_MakePoint(-83.89, 9.84), 4326), 'Fácil', 3000.00, 10.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.84,-83.89&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    21, 'Refugio Silvestre Cerro Dantas', 1, 'Heredia', 'Valle Central', 'Bosque Nuboso & Aventura', 'Rutas de trekking de montaña y bosque primario nuboso.',
    ST_SetSRID(ST_MakePoint(-84.05, 10.0833), 4326), 'Difícil', 3500.00, 12.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.0833,-84.05&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    22, 'Cerro de la Muerte & Páramo Andino', 1, 'San José', 'Valle Central', 'Páramo de Altura', 'Vegetación achaparrada única sobre la Carretera Interamericana Sur.',
    ST_SetSRID(ST_MakePoint(-83.75, 9.5667), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.5667,-83.75&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    23, 'Playa Conchal & Bahía Brasilito', 2, 'Guanacaste', 'Guanacaste', 'Playa de Conchas & Snorkel', 'Playa de conchas trituradas con aguas turquesas cristalinas.',
    ST_SetSRID(ST_MakePoint(-85.815, 10.398), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=10.398,-85.815&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    24, 'Parque Nacional Barra Honda (Cavernas)', 2, 'Guanacaste', 'Guanacaste', 'Espeleología & Cavernas', 'Descenso en rapel a cavernas de estalactitas y estalagmitas.',
    ST_SetSRID(ST_MakePoint(-85.3567, 10.1747), 4326), 'Difícil', 1130.00, 13.56,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.1747,-85.3567&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    25, 'Parque Nacional Palo Verde', 2, 'Guanacaste', 'Guanacaste', 'Humedal & Aves Acuáticas', 'Santuario de miles de aves migratorias en la cuenca del Tempisque.',
    ST_SetSRID(ST_MakePoint(-85.34, 10.35), 4326), 'Fácil', 1130.00, 13.56,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.35,-85.34&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    26, 'Refugio de Vida Silvestre Ostional', 2, 'Guanacaste', 'Guanacaste', 'Arribadas de Tortuga Lora', 'Arribadas masivas de miles de tortugas lora desovando en luna menguante.',
    ST_SetSRID(ST_MakePoint(-85.7, 9.9967), 4326), 'Fácil', 1800.00, 12.00,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.9967,-85.7&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    27, 'Parque Nacional Marino Las Baulas (Playa Grande)', 2, 'Guanacaste', 'Guanacaste', 'Playa & Tortuga Baula', 'Zona de anidación de la tortuga marina más grande del mundo.',
    ST_SetSRID(ST_MakePoint(-85.84, 10.32), 4326), 'Fácil', 1800.00, 16.95,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    TRUE, 'https://waze.com/ul?ll=10.32,-85.84&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    28, 'Playa Tamarindo & Estero', 2, 'Guanacaste', 'Guanacaste', 'Surf & Vida Costera', 'Epicentro del surf internacional y vida nocturna guanacasteca.',
    ST_SetSRID(ST_MakePoint(-85.8417, 10.2983), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.2983,-85.8417&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    29, 'Playa Samara & Arrecife Isla Chora', 2, 'Guanacaste', 'Guanacaste', 'Playa Familiar & Kayak', 'Bahía tranquila de olas suaves ideal para niños y kayak.',
    ST_SetSRID(ST_MakePoint(-85.5267, 9.88), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.88,-85.5267&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    30, 'Playa Nosara & Guiones (Surf & Yoga)', 2, 'Guanacaste', 'Guanacaste', 'Surf & Bienestar', 'Destino global de retiros de bienestar y olas consistentes todo el año.',
    ST_SetSRID(ST_MakePoint(-85.67, 9.96), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.96,-85.67&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    31, 'Playa Flamingo & Marina Flamingo', 2, 'Guanacaste', 'Guanacaste', 'Playa de Arena Blanca & Veleros', 'Moderna marina deportiva y tours de pesca deportiva y catamarán.',
    ST_SetSRID(ST_MakePoint(-85.79, 10.435), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=10.435,-85.79&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    32, 'Playa Hermosa & Playas del Coco', 2, 'Guanacaste', 'Guanacaste', 'Buceo & Veleros', 'Punto de partida para expediciones de buceo a Islas Murciélago.',
    ST_SetSRID(ST_MakePoint(-85.6767, 10.585), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.585,-85.6767&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    33, 'Parque Nacional Carara (Río Tárcoles & Lapas)', 3, 'Puntarenas', 'Pacífico Medio', 'Transición Seco-Húmedo & Aves', 'Observación masiva de guacamayas rojas y puente de cocodrilos.',
    ST_SetSRID(ST_MakePoint(-84.605, 9.775), 4326), 'Fácil', 1130.00, 11.30,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.775,-84.605&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    34, 'Playa Jacó & Mirador del Miro', 3, 'Puntarenas', 'Pacífico Medio', 'Surf & Aventura', 'Cercana al Valle Central, vida nocturna y murales de arte urbano.',
    ST_SetSRID(ST_MakePoint(-84.6283, 9.615), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.615,-84.6283&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    35, 'Playa Hermosa Jacó (Santuario Mundial del Surf)', 3, 'Puntarenas', 'Pacífico Medio', 'Surf de Olas Grandes', 'Playa de arena volcánica negra con olas tubulares potentes.',
    ST_SetSRID(ST_MakePoint(-84.6, 9.57), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.57,-84.6&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    36, 'Playa Esterillos Este & Oeste (Escultura La Sirena)', 3, 'Puntarenas', 'Pacífico Medio', 'Playa Extensa & Surf', 'Playa virgen de 15 km con piscinas naturales en marea baja.',
    ST_SetSRID(ST_MakePoint(-84.45, 9.53), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.53,-84.45&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    37, 'Catarata Nauyaca (Valle de Guabo)', 3, 'Puntarenas', 'Pacífico Medio', 'Cataratas & Poza de Nado', 'Dos impresionantes cascadas escalonadas con piscina natural de 6m.',
    ST_SetSRID(ST_MakePoint(-83.8242, 9.2789), 4326), 'Moderado', 5000.00, 15.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.2789,-83.8242&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    38, 'Playa Dominical (Surf & Ambiente Bohemio)', 3, 'Puntarenas', 'Pacífico Medio', 'Surf & Selva Costera', 'Pueblo de surfistas con escuelas, gastronomía orgánica y artesanías.',
    ST_SetSRID(ST_MakePoint(-83.86, 9.25), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.25,-83.86&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    39, 'Playa Ventanas & Cavernas Marinas', 3, 'Puntarenas', 'Pacífico Medio', 'Playa & Cuevas del Mar', 'Cavernas naturales esculpidas en la roca donde ruge el oleaje.',
    ST_SetSRID(ST_MakePoint(-83.66, 9.07), 4326), 'Fácil', 2000.00, 5.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.07,-83.66&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    40, 'Manglares de Isla Damas & Quepos', 3, 'Puntarenas', 'Pacífico Medio', 'Kayak & Manglares', 'Tours en lancha y kayak entre túneles de mangle rojo y blanco.',
    ST_SetSRID(ST_MakePoint(-84.18, 9.46), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.46,-84.18&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    41, 'Catarata Bijagual & Cañón de Carara', 3, 'Puntarenas', 'Pacífico Medio', 'Catarata de 180 metros', 'Una de las cataratas más altas del Pacífico central.',
    ST_SetSRID(ST_MakePoint(-84.55, 9.75), 4326), 'Difícil', 4000.00, 12.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.75,-84.55&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    42, 'Playa Matapalo (Refugio Comunitario)', 3, 'Puntarenas', 'Pacífico Medio', 'Playa Virgen & Ecoturismo', 'Playa tranquila de arena clara con proyectos de desove de tortugas.',
    ST_SetSRID(ST_MakePoint(-84, 9.32), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.32,-84&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    43, 'Reserva Natural Absoluta Cabo Blanco', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Reserva Histórica & Playa', 'La primera área silvestre protegida de Costa Rica (creada en 1963).',
    ST_SetSRID(ST_MakePoint(-85.11, 9.57), 4326), 'Difícil', 1800.00, 13.56,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    TRUE, 'https://waze.com/ul?ll=9.57,-85.11&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    44, 'Montezuma & Cascadas de Montezuma', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Pueblo Bohemio & Cascadas', 'Piscina natural con tres niveles de cascadas en el bosque.',
    ST_SetSRID(ST_MakePoint(-85.07, 9.65), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.65,-85.07&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    45, 'Santa Teresa & Mal País (Surf & Puestas de Sol)', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Surf & Gastronomía', 'Atardeceres legendarios y atmósfera cosmopolita de surf.',
    ST_SetSRID(ST_MakePoint(-85.16, 9.64), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.64,-85.16&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    46, 'Isla Tortuga & Refugio Curú', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Isla de Arena Blanca & Snorkel', 'Aguas turquesas, senderos con monos en Curú y snorkel marino.',
    ST_SetSRID(ST_MakePoint(-84.89, 9.78), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.78,-84.89&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    47, 'Reserva Biológica Isla del Caño', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Santuario Marino de Buceo', 'Buceo con tiburones de arrecife, mantarrayas gigantes y tortugas.',
    ST_SetSRID(ST_MakePoint(-83.88, 8.71), 4326), 'Moderado', 2260.00, 16.95,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    TRUE, 'https://waze.com/ul?ll=8.71,-83.88&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    48, 'Refugio Nacional de Vida Silvestre Golfito', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Bosque Tropical Lluvioso', 'Senderos panorámicos con vistas sobre el fiordo tropical del Golfo Dulce.',
    ST_SetSRID(ST_MakePoint(-83.16, 8.64), 4326), 'Moderado', 1130.00, 11.30,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=8.64,-83.16&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    49, 'Parque Nacional Piedras Blancas', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Selva Virgen & Corredor Biológico', 'Conecta Corcovado con la Cordillera de Talamanca.',
    ST_SetSRID(ST_MakePoint(-83.25, 8.7), 4326), 'Difícil', 1130.00, 16.95,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=8.7,-83.25&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    50, 'Bahía Drake & Sendero Costero', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Ecoturismo & Acceso Marino', 'Pueblo costero base para tours a Sirena y Caño.',
    ST_SetSRID(ST_MakePoint(-83.67, 8.69), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=8.69,-83.67&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    51, 'Península de Nicoya (Paseo de los Turistas & Puntarenas)', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Cultura Porteña & Vigorones', 'Famosos Churchills, terminal de ferris hacia Paquera y Naranjo.',
    ST_SetSRID(ST_MakePoint(-84.83, 9.97), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.97,-84.83&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    52, 'Isla Chira & Golfo de Nicoya', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Turismo Rural Comunitario', 'La isla habitada más grande del golfo con posadas locales lideradas por mujeres.',
    ST_SetSRID(ST_MakePoint(-85.15, 10.1), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.1,-85.15&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    53, 'Refugio Nacional Gandoca-Manzanillo', 5, 'Limón', 'Caribe', 'Arrecifes & Bosque Húmedo', 'Punta Mona, calas de arena dorada y lagunas de manatíes.',
    ST_SetSRID(ST_MakePoint(-82.65, 9.63), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.63,-82.65&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    54, 'Puerto Viejo de Talamanca & Playa Chiquita', 5, 'Limón', 'Caribe', 'Cultura Afro & Gastronomía', 'Rice and beans, salsa caribeña, raggamuffin y playas paradisíacas.',
    ST_SetSRID(ST_MakePoint(-82.75, 9.65), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.65,-82.75&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    55, 'Playa Cocles & Olas de Salsa Brava', 5, 'Limón', 'Caribe', 'Surf Caribeño de Arrecife', 'La ola más famosa y exigente de Costa Rica sobre fondo de coral.',
    ST_SetSRID(ST_MakePoint(-82.73, 9.64), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.64,-82.73&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    56, 'Playa Punta Uva & Mirador de la Cueva', 5, 'Limón', 'Caribe', 'Playa Virgen & Palmeras', 'Aguas calmas como piscina natural rodeadas de densa selva verde.',
    ST_SetSRID(ST_MakePoint(-82.68, 9.635), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.635,-82.68&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    57, 'Reserva Indígena Bribri (Talamanca)', 5, 'Limón', 'Caribe', 'Cultura Ancestral & Cacao', 'Tours de chocolate ancestral con familias originarias Bribri.',
    ST_SetSRID(ST_MakePoint(-82.85, 9.58), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.58,-82.85&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    58, 'Parque Nacional Barbilla', 5, 'Limón', 'Caribe', 'Selva Virgen & Aves', 'Territorio ancestral Cabécar y refugio de dantas y jaguares.',
    ST_SetSRID(ST_MakePoint(-83.45, 9.97), 4326), 'Extremo', 1130.00, 11.30,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=9.97,-83.45&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    59, 'Canales de Parismina & Barra del Tortuguero', 5, 'Limón', 'Caribe', 'Pesca Deportiva & Canales', 'Poblados pesqueros costeros accesibles únicamente por lancha.',
    ST_SetSRID(ST_MakePoint(-83.35, 10.3), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.3,-83.35&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    60, 'Isla Uvita (Monumento Histórico Portete Limón)', 5, 'Limón', 'Caribe', 'Historia Colonial & Snorkel', 'Sitio exacto donde Cristóbal Colón fondeó en su cuarto viaje (1502).',
    ST_SetSRID(ST_MakePoint(-83.01, 9.99), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.99,-83.01&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    61, 'Refugio Nacional Caño Negro', 6, 'Alajuela', 'Zona Norte', 'Humedal Ramsar & Safari Acuático', 'Uno de los humedales más ricos del neotrópico, hogar del pez gaspar.',
    ST_SetSRID(ST_MakePoint(-84.73, 10.88), 4326), 'Fácil', 1130.00, 11.30,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.88,-84.73&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    62, 'Cavernas de Venado', 6, 'Alajuela', 'Zona Norte', 'Espeleología Subterránea', 'Laberinto subterráneo de 2.7 km con fósiles marinos de 5 millones de años.',
    ST_SetSRID(ST_MakePoint(-84.78, 10.56), 4326), 'Difícil', 8000.00, 28.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.56,-84.78&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    63, 'Catarata La Fortuna (Río Fortuna)', 6, 'Alajuela', 'Zona Norte', 'Catarata & Selva', 'Caída de 70 metros administrada por la Asociación de Desarrollo Comunal (ADIFORT).',
    ST_SetSRID(ST_MakePoint(-84.67, 10.44), 4326), 'Moderado', 4500.00, 18.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.44,-84.67&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    64, 'Termales Geotérmicas de La Fortuna (Tabacón, Baldi & EcoTermales)', 6, 'Alajuela', 'Zona Norte', 'Aguas Termales Minerales', 'Ríos de agua termal caliente calentados de forma natural por el magma del Arenal.',
    ST_SetSRID(ST_MakePoint(-84.72, 10.48), 4326), 'Fácil', 12000.00, 40.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.48,-84.72&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    65, 'Puentes Colgantes Mistico Park (Arenal)', 6, 'Alajuela', 'Zona Norte', 'Dosel & Puentes Colgantes', '16 puentes sobre el dosel de la selva con vistas directas al volcán.',
    ST_SetSRID(ST_MakePoint(-84.75, 10.49), 4326), 'Fácil', 8000.00, 26.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.49,-84.75&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    66, 'Parque Nacional Juan Castro Blanco (Parque de las Aguas)', 6, 'Alajuela', 'Zona Norte', 'Bosque Nuboso & Manantiales', 'Naciente de más de 50 ríos y lagunas volcánicas de alta montaña.',
    ST_SetSRID(ST_MakePoint(-84.35, 10.28), 4326), 'Moderado', 904.00, 11.30,
    'Tarifa SINAC Oficial', TRUE, TRUE, 'https://serviciosenlinea.sinac.go.cr/',
    FALSE, 'https://waze.com/ul?ll=10.28,-84.35&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    67, 'Reserva Biológica Tirimbina (Sarapiquí)', 6, 'Heredia', 'Zona Norte', 'Investigación & Tour de Chocolate', 'Puente colgante más largo de Costa Rica sobre el Río Sarapiquí.',
    ST_SetSRID(ST_MakePoint(-84.12, 10.42), 4326), 'Fácil', 5000.00, 18.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.42,-84.12&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    68, 'Estación Biológica La Selva (OTS Sarapiquí)', 6, 'Heredia', 'Zona Norte', 'Centro Científico & Ecoturismo', 'Santuario de investigación biológica global con más de 2,000 especies de plantas.',
    ST_SetSRID(ST_MakePoint(-84, 10.43), 4326), 'Fácil', 6000.00, 25.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.43,-84&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    69, 'Laguna de Hule & Bosque Alegre', 6, 'Alajuela', 'Zona Norte', 'Laguna en Cráter Volcánico', 'Cráter volcánico extinto rodeado de colinas verdes y senderos ecológicos.',
    ST_SetSRID(ST_MakePoint(-84.21, 10.29), 4326), 'Moderado', 2000.00, 5.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.29,-84.21&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    70, 'Catarata Pozo Azul (Bajos del Toro)', 6, 'Alajuela', 'Zona Norte', 'Cataratas & Pozas Turquesas', 'Pozas cristalinas de color azul intenso en medio del bosque nuboso.',
    ST_SetSRID(ST_MakePoint(-84.31, 10.22), 4326), 'Moderado', 3500.00, 10.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.22,-84.31&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    71, 'Río Pacuare (Sector Siquirres - Rápidos Clase IV)', 5, 'Limón', 'Caribe', 'Rafting de Clase Mundial & Cañones', 'Nombrado por National Geographic entre los 5 mejores ríos del planeta para rafting.',
    ST_SetSRID(ST_MakePoint(-83.55, 9.95), 4326), 'Extremo', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.95,-83.55&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    72, 'Playa San Juanillo (Playa Doble & Pescadores)', 2, 'Guanacaste', 'Guanacaste', 'Playa de Arena Blanca & Pozas', 'Península que divide dos playas de arena clara y aguas cristalinas.',
    ST_SetSRID(ST_MakePoint(-85.74, 10.02), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=10.02,-85.74&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    73, 'Playa San Miguel & Coyote (Península Sur)', 2, 'Guanacaste', 'Guanacaste', 'Playa Virgen & Mareas', 'Kilómetros de playa desierta y esteros con anidación de aves marinas.',
    ST_SetSRID(ST_MakePoint(-85.31, 9.77), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.77,-85.31&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    74, 'Cataratas Llanos de Cortés (Bagaces)', 2, 'Guanacaste', 'Guanacaste', 'Catarata con Playa de Arena', 'Cortina ancha de agua con laguna de nado y arena dorada.',
    ST_SetSRID(ST_MakePoint(-85.3, 10.52), 4326), 'Fácil', 2000.00, 7.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=10.52,-85.3&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    75, 'Catarata La Leona (Curubandé Rincón de la Vieja)', 2, 'Guanacaste', 'Guanacaste', 'Aventura en Cañón de Río', 'Caminata dentro de una cueva de río con chaleco salvavidas hasta la catarata.',
    ST_SetSRID(ST_MakePoint(-85.39, 10.74), 4326), 'Moderado', 8000.00, 25.00,
    'Entrada Privada / Comunal', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.74,-85.39&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    76, 'Playa Avellanas & Mirador Lola''s', 2, 'Guanacaste', 'Guanacaste', 'Surf & Esteros', 'Mítico puente de madera sobre los manglares y olas legendarias.',
    ST_SetSRID(ST_MakePoint(-85.84, 10.22), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Público Gratuito', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.22,-85.84&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    77, 'Mirador Cerro Pelado', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.5, 8.5), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.5000,-85.5000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    78, 'Catarata Viento Fresco', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.46, 8.53), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.5300,-85.4600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    79, 'Playa Pelada Nosara', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.42, 8.56), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=8.5600,-85.4200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    80, 'Refugio Silvestre Camaronal', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.38, 8.59), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.5900,-85.3800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    81, 'Isla Bolaños', 5, 'Limón', 'Caribe', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Caribe, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.34, 8.62), 4326), 'Moderado', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=8.6200,-85.3400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    82, 'Parque Marino del Pacífico', 6, 'Alajuela', 'Zona Norte', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Zona Norte, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.3, 8.65), 4326), 'Difícil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.6500,-85.3000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    83, 'Senderos Cerro Espíritu Santo', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.26, 8.68), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.6800,-85.2600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    84, 'Catarata Oropéndola', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.22, 8.71), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.7100,-85.2200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    85, 'Playa San Juanillo Sur', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.18, 8.74), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=8.7400,-85.1800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    86, 'Catarata Los Chorros Grecia', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.14, 8.77), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.7700,-85.1400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    87, 'Mirador Pico Blanco Escazú', 5, 'Limón', 'Caribe', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Caribe, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.1, 8.8), 4326), 'Moderado', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.8000,-85.1000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    88, 'Bosque de la Hoja Heredia', 6, 'Alajuela', 'Zona Norte', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Zona Norte, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.06, 8.83), 4326), 'Difícil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.8300,-85.0600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    89, 'Cerro Cedral Aserrí', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-85.02, 8.86), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.8600,-85.0200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    90, 'Parque Recreativo Laguna de Fraijanes', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.98, 8.89), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.8900,-84.9800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    91, 'Parque del Este Montes de Oca', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.94, 8.92), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.9200,-84.9400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    92, 'Mirador de Orosí', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.9, 8.95), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.9500,-84.9000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    93, 'Ruinas de Cartago & Basílica', 5, 'Limón', 'Caribe', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Caribe, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.86, 8.98), 4326), 'Moderado', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=8.9800,-84.8600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    94, 'Valle de Ujarrás & Presa Cachí', 6, 'Alajuela', 'Zona Norte', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Zona Norte, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.82, 9.01), 4326), 'Difícil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.0100,-84.8200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    95, 'Catarata Chindama Guápiles', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.78, 9.04), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.0400,-84.7800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    96, 'Refugio Nacional Maquenque', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.74, 9.07), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.0700,-84.7400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    97, 'Playa Blanca Punta Leona', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.7, 9.1), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.1000,-84.7000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    98, 'Catarata El Rey Quepos', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.66, 9.13), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.1300,-84.6600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    99, 'Playa Biesanz Manuel Antonio', 5, 'Limón', 'Caribe', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Caribe, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.62, 9.16), 4326), 'Moderado', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.1600,-84.6200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    100, 'Playa Linda Matapalo', 6, 'Alajuela', 'Zona Norte', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Zona Norte, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.58, 9.19), 4326), 'Difícil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.1900,-84.5800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    101, 'Playa Dominicalito', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.54, 9.22), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.2200,-84.5400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    102, 'Playa Hermosa Osa', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.5, 9.25), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.2500,-84.5000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    103, 'Humedal Térraba-Sierpe', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.46, 9.28), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.2800,-84.4600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    104, 'Catarata Cascada Verde Uvita', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.42, 9.31), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.3100,-84.4200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    105, 'Playa Piñuela Osa', 5, 'Limón', 'Caribe', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Caribe, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.38, 9.34), 4326), 'Moderado', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.3400,-84.3800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    106, 'Mirador Fila de Cal Osa', 6, 'Alajuela', 'Zona Norte', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Zona Norte, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.34, 9.37), 4326), 'Difícil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.3700,-84.3400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    107, 'Isla San Lucas (Antiguo Penal)', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.3, 9.4), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.4000,-84.3000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    108, 'Refugio Peñas Blancas Esparza', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.26, 9.43), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.4300,-84.2600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    109, 'Catarata Bijagua Rainforest', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.22, 9.46), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.4600,-84.2200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    110, 'Laguna Pocosol San Ramón', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.18, 9.49), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.4900,-84.1800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    111, 'Senderos Reserva Karen Mogensen', 5, 'Limón', 'Caribe', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Caribe, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.14, 9.52), 4326), 'Moderado', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.5200,-84.1400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    112, 'Playa Manzanillo Península', 6, 'Alajuela', 'Zona Norte', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Zona Norte, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.1, 9.55), 4326), 'Difícil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.5500,-84.1000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    113, 'Playa Cabuya & Isla del Cementerio', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.06, 9.58), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.5800,-84.0600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    114, 'Reserva Indígena Guatuso Maleku', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-84.02, 9.61), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.6100,-84.0200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    115, 'Volcán Cacao Guanacaste', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.98, 9.64), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.6400,-83.9800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    116, 'Cerro Chirripó - Crestones', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.94, 9.67), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.6700,-83.9400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    117, 'Cerro Kamuk Parque Internacional La Amistad', 5, 'Limón', 'Caribe', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Caribe, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.9, 9.7), 4326), 'Moderado', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.7000,-83.9000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    118, 'Parque Internacional La Amistad (PILA)', 6, 'Alajuela', 'Zona Norte', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Zona Norte, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.86, 9.73), 4326), 'Difícil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.7300,-83.8600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    119, 'Catarata San Luis Monteverde', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.82, 9.76), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.7600,-83.8200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    120, 'Playa Junquillal Santa Cruz', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.78, 9.79), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.7900,-83.7800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    121, 'Playa Negra Puerto Viejo', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.74, 9.82), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.8200,-83.7400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    122, 'Playa Grande Santa Teresa', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.7, 9.85), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.8500,-83.7000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    123, 'Playa Rajada Bahía Salinas', 5, 'Limón', 'Caribe', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Caribe, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.66, 9.88), 4326), 'Moderado', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.8800,-83.6600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    124, 'Playa El Hacha Guanacaste', 6, 'Alajuela', 'Zona Norte', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Zona Norte, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.62, 9.91), 4326), 'Difícil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=9.9100,-83.6200&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    125, 'Laguna Cuartel Caño Negro', 1, 'San José', 'Valle Central', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Valle Central, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.58, 9.94), 4326), 'Fácil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.9400,-83.5800&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    126, 'Río Frío Los Chiles', 2, 'Guanacaste', 'Guanacaste', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Guanacaste, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.54, 9.97), 4326), 'Moderado', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=9.9700,-83.5400&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    127, 'Cataratas El Pavón Ojochal', 3, 'Puntarenas', 'Pacífico Medio', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Pacífico Medio, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.5, 10), 4326), 'Difícil', 1500.00, 8.00,
    'Entrada Comunitaria / Privada', FALSE, FALSE, NULL,
    FALSE, 'https://waze.com/ul?ll=10.0000,-83.5000&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  ),
(
    128, 'Playa Arco Marino Ballena', 4, 'Puntarenas', 'Puntarenas y Golfo de Nicoya', 'Destino Ecoturístico & Naturaleza', 'Atractivo natural representativo de la región Puntarenas y Golfo de Nicoya, ideal para turismo sostenible, senderismo y observación de biodiversidad.',
    ST_SetSRID(ST_MakePoint(-83.46, 10.03), 4326), 'Fácil', 0.00, 0.00,
    'Acceso Libre', FALSE, FALSE, NULL,
    TRUE, 'https://waze.com/ul?ll=10.0300,-83.4600&navigate=yes', 'Abierto', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (legacy_id) DO NOTHING;

-- 4. NORMATIVAS Y ALERTAS SINAC
CREATE UNIQUE INDEX IF NOT EXISTS idx_normativas_dest_unique ON public.normativas_destinos(destination_id);

INSERT INTO public.normativas_destinos (
    destination_id, reserva_linea_obligatoria, guia_obligatorio,
    limite_boletos_transaccion, dia_cierre, horario_ingreso,
    observaciones_especiales, alertas_volcanicas_clima
)
SELECT 
    d.id,
    d.requires_sinac_booking,
    CASE 
        WHEN d.name LIKE '%Corcovado%' OR d.name LIKE '%Turrialba%' OR d.name LIKE '%Tortuguero%' THEN TRUE 
        ELSE FALSE 
    END,
    CASE WHEN d.name LIKE '%Chirripó%' THEN 4 ELSE 6 END,
    CASE 
        WHEN d.name LIKE '%Manuel Antonio%' THEN 'Martes'
        WHEN d.name LIKE '%Rincón de la Vieja%' THEN 'Lunes'
        ELSE 'Ninguno'
    END,
    CASE 
        WHEN d.name LIKE '%Poás%' THEN '08:00 AM - 03:00 PM (Turnos en Cráter)'
        WHEN d.name LIKE '%Chirripó%' THEN '04:00 AM - 10:00 AM'
        ELSE '07:00 AM - 04:00 PM'
    END,
    CASE 
        WHEN d.sinac_restricted THEN 'Prohibido plásticos de un solo uso. Respetar senderos demarcados del SINAC.'
        ELSE 'Respetar flora y fauna silvestre. Prohibido extraer conchas, piedras o especies botánicas.'
    END,
    CASE 
        WHEN d.category LIKE '%Volcán%' THEN 'Monitoreo vulcanológico continuo por OVSICORI-UNA y RSN.'
        WHEN d.has_high_tides_risk THEN 'Consultar tabla de mareas y oleaje CIMAR antes de transitar por zonas costeras.'
        ELSE 'Verificar pronóstico del Instituto Meteorológico Nacional (IMN).'
    END
FROM public.destinations d
ON CONFLICT (destination_id) DO UPDATE SET
    reserva_linea_obligatoria = EXCLUDED.reserva_linea_obligatoria,
    guia_obligatorio = EXCLUDED.guia_obligatorio,
    limite_boletos_transaccion = EXCLUDED.limite_boletos_transaccion,
    dia_cierre = EXCLUDED.dia_cierre,
    horario_ingreso = EXCLUDED.horario_ingreso,
    observaciones_especiales = EXCLUDED.observaciones_especiales,
    alertas_volcanicas_clima = EXCLUDED.alertas_volcanicas_clima;

-- 5. CATÁLOGO DE FAUNA DE COSTA RICA CON POSTGIS
INSERT INTO public.fauna_species (
    common_name_es, common_name_en, scientific_name, category,
    description, habitat, vulnerability_status, sound_url, sound_name,
    image_url, approx_location
) VALUES
(
    'Rana Calzonuda de Ojos Rojos', 'Red-eyed Tree Frog', 'Agalychnis callidryas', 'anfibios',
    'Emblemática rana arbórea nocturna con vívidos ojos escarlata, flancos azules y patas anaranjadas que asustan depredadores.', 'Hojas de árboles cerca de charcas temporales en bosques húmedos tropicales.', 'Preocupación Menor (LC)', 'https://assets.mixkit.co/active_storage/sfx/2416/2416-preview.mp3', 'Choc-choc nocturno tropical',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-84.05, 10.35), 4326)
  ),
(
    'Quetzal Resplandeciente', 'Resplendent Quetzal', 'Pharomachrus mocinno', 'aves',
    'Ave sagrada mesoamericana con plumas caudales de más de 65 cm de longitud de color verde esmeralda y pecho carmesí.', 'Bosques nubosos de alta montaña ricos en aguacatillo silvestre (San Gerardo de Dota y Monteverde).', 'Casi Amenazado (NT)', NULL, 'Silbido melodioso descendente',
    'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-83.8, 9.55), 4326)
  ),
(
    'Perezoso de Tres Dedos', 'Three-toed Sloth', 'Bradypus variegatus', 'mamiferos',
    'Símbolo Nacional de la Fauna de Costa Rica. Mamífero folívoro que pasa el 90% de su vida colgado en las copas de guarumo.', 'Bosque húmedo tropical y plantaciones agroforestales de bajura en el Caribe y Pacífico.', 'Preocupación Menor (LC)', NULL, 'Balido agudo en el dosel',
    'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-84.1432, 9.3893), 4326)
  ),
(
    'Lapa Roja / Guacamaya Macao', 'Scarlet Macaw', 'Ara macao', 'aves',
    'Majestuoso psitácido monógamo de vívidos colores rojo, amarillo y azul que surca en parejas las copas del Pacífico.', 'Bosques costeros del Pacífico Central y Osa, alimentándose de semillas de almendro de playa.', 'Preocupación Menor (LC)', NULL, 'Grajido estrepitoso en vuelo',
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-84.6, 9.7), 4326)
  ),
(
    'Ballena Jorobada', 'Humpback Whale', 'Megaptera novaeangliae', 'marino',
    'Cetáceo migratorio que visita Costa Rica tanto del hemisferio norte (enero-marzo) como del sur (julio-octubre) para dar a luz en Bahía Ballena.', 'Aguas cálidas y protegidas del Pacífico Sur (Uvita, Golfo Dulce e Isla del Caño).', 'Preocupación Menor (LC)', NULL, 'Canto submarino de baja frecuencia',
    'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-83.75, 9.15), 4326)
  ),
(
    'Jaguar / Balam', 'Jaguar', 'Panthera onca', 'mamiferos',
    'El felino más grande de América y máximo depredador de los ecosistemas selváticos tropicales de Costa Rica.', 'Bosques densos primarios de Corcovado, Tortuguero, Santa Rosa y Cordillera de Talamanca.', 'Casi Amenazado (NT)', NULL, 'Rugido gutural de acecho',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-83.59, 8.48), 4326)
  ),
(
    'Danta o Tapir Centroamericano', 'Baird''s Tapir', 'Tapirus bairdii', 'mamiferos',
    'El mamífero terrestre autóctono más grande de los neotrópicos, excelente nadador y jardinero clave del bosque.', 'Selvas húmedas y pantanosas de Corcovado, Tapantí y Parque Nacional Braulio Carrillo.', 'En Peligro (EN)', NULL, 'Silbido agudo entre matorrales',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-83.56, 8.52), 4326)
  ),
(
    'Tortuga Verde Marina', 'Green Sea Turtle', 'Chelonia mydas', 'marino',
    'Tortuga marina herbívora que realiza impresionantes migraciones oceánicas para desovar en las playas de Tortuguero.', 'Praderas de pastos marinos en el Caribe y playas protegidas de Tortuguero.', 'En Peligro (EN)', NULL, 'Resoplido al emerger del agua',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-83.5042, 10.5414), 4326)
  ),
(
    'Tucán Pico Iris / Tucán Real', 'Keel-billed Toucan', 'Ramphastos sulfuratus', 'aves',
    'Famoso tucán de colorido pico arcoíris que vive en bandadas en el dosel alimentándose de frutas tropicales.', 'Dosel de selvas húmedas tropicales de las llanuras del Caribe y Zona Norte.', 'Preocupación Menor (LC)', NULL, 'Crocante canto similar a una rana arbórea',
    'https://images.unsplash.com/photo-1550853024-fae8dd4be47f?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-84.6963, 10.4628), 4326)
  ),
(
    'Mono Cariblanco / Capuchino', 'White-headed Capuchin', 'Cebus imitator', 'mamiferos',
    'Primate altamente inteligente y social que utiliza herramientas y vive en grupos jerárquicos estructurados.', 'Bosques primarios y secundarios de Manuel Antonio, Santa Rosa y Cahuita.', 'Vulnerable (VU)', NULL, 'Chillidos y chasquidos de alerta',
    'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80', ST_SetSRID(ST_MakePoint(-84.1432, 9.3893), 4326)
  )
ON CONFLICT (scientific_name) DO NOTHING;
