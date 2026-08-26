-- ==============================================================================
-- DESCUBRIENDO CR - SUPABASE DATABASE SCHEMA & POSTGIS (SRID 4326)
-- Base de Datos Oficial para Descubriendo CR
-- Compatible con Supabase PostgreSQL 15+ / PostGIS 3+
-- ==============================================================================

-- 1. HABILITAR EXTENSIONES POSTGRESQL & POSTGIS
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Asegurar búsqueda de esquemas para PostGIS
SET search_path = public, extensions;

-- ==============================================================================
-- 2. TABLAS DEL SISTEMA Y USUARIOS
-- ==============================================================================

-- 2.1 TABLA USERS (Perfiles de Exploradores y Comerciantes)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'verified_merchant', 'admin')),
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_currency VARCHAR(3) NOT NULL DEFAULT 'CRC' CHECK (preferred_currency IN ('CRC', 'USD')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 2.2 TABLA SYSTEM_EXCHANGE_RATES (Histórico y Tipo de Cambio Oficial BCCR)
CREATE TABLE IF NOT EXISTS public.system_exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rate_buy NUMERIC(10, 2) NOT NULL,
    rate_sell NUMERIC(10, 2) NOT NULL,
    source TEXT DEFAULT 'BCCR / Indicador Público',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_updated_at ON public.system_exchange_rates(updated_at DESC);

-- 2.3 TABLA REGIONES_ICT (Regiones Turísticas Oficiales del ICT)
CREATE TABLE IF NOT EXISTS public.regiones_ict (
    id INT PRIMARY KEY,
    nombre_region VARCHAR(100) NOT NULL UNIQUE,
    provincia VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- ==============================================================================
-- 3. DESTINOS, PARQUES NACIONALES & NORMATIVAS SINAC
-- ==============================================================================

-- 3.1 TABLA DESTINATIONS (Geodatos PostGIS SRID 4326)
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id INT UNIQUE,
    name VARCHAR(255) NOT NULL,
    region_id INT REFERENCES public.regiones_ict(id) ON DELETE SET NULL,
    province VARCHAR(50) NOT NULL CHECK (province IN ('San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón')),
    region VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Parque Nacional',
    description TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Moderado' CHECK (difficulty IN ('Fácil', 'Moderado', 'Difícil', 'Extremo')),
    price_national_crc NUMERIC(12, 2) DEFAULT 0.00,
    price_foreigner_usd NUMERIC(10, 2) DEFAULT 0.00,
    fee_type VARCHAR(50) DEFAULT 'Tarifa SINAC Oficial',
    sinac_restricted BOOLEAN DEFAULT FALSE,
    requires_sinac_booking BOOLEAN DEFAULT FALSE,
    sinac_booking_url TEXT,
    has_high_tides_risk BOOLEAN DEFAULT FALSE,
    waze_url TEXT,
    status VARCHAR(50) DEFAULT 'Abierto',
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice Espacial GIST para consultas geográficas ultrarrápidas (ST_DWithin, ST_Distance, etc.)
CREATE INDEX IF NOT EXISTS idx_destinations_location ON public.destinations USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_destinations_province ON public.destinations(province);
CREATE INDEX IF NOT EXISTS idx_destinations_region_id ON public.destinations(region_id);

-- 3.2 TABLA NORMATIVAS_DESTINOS (Reglamentos y Directrices SINAC / MINAE)
CREATE TABLE IF NOT EXISTS public.normativas_destinos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    reserva_linea_obligatoria BOOLEAN DEFAULT FALSE,
    guia_obligatorio BOOLEAN DEFAULT FALSE,
    limite_boletos_transaccion INT DEFAULT 6,
    dia_cierre VARCHAR(50) DEFAULT 'Ninguno',
    horario_ingreso VARCHAR(100) DEFAULT '08:00 AM - 04:00 PM',
    observaciones_especiales TEXT,
    alertas_volcanicas_clima TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_normativas_destination_id ON public.normativas_destinos(destination_id);

-- ==============================================================================
-- 4. FAUNA CR, AVISTAMIENTOS Y ÁLBUM COLABORATIVO
-- ==============================================================================

-- 4.1 TABLA FAUNA_SPECIES (Catálogo de Biodiversidad y Geopuntos de Hábitat)
CREATE TABLE IF NOT EXISTS public.fauna_species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    common_name_es VARCHAR(150) NOT NULL,
    common_name_en VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(200) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('anfibios', 'aves', 'mamiferos', 'marino', 'reptiles', 'insectos')),
    description TEXT,
    habitat TEXT,
    vulnerability_status VARCHAR(50) NOT NULL DEFAULT 'Preocupación Menor (LC)',
    sound_url TEXT,
    sound_name VARCHAR(100),
    image_url TEXT,
    approx_location GEOMETRY(Point, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fauna_location ON public.fauna_species USING GIST(approx_location);
CREATE INDEX IF NOT EXISTS idx_fauna_category ON public.fauna_species(category);

-- 4.2 TABLA FAUNA_PHOTOS (Álbum Comunitario y Fotos de Campo)
CREATE TABLE IF NOT EXISTS public.fauna_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fauna_id UUID NOT NULL REFERENCES public.fauna_species(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    likes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fauna_photos_fauna_id ON public.fauna_photos(fauna_id);
CREATE INDEX IF NOT EXISTS idx_fauna_photos_user_id ON public.fauna_photos(user_id);

-- 4.3 TABLA USER_FAUNA_SIGHTINGS (Registro de Especies Vistas por Exploradores)
CREATE TABLE IF NOT EXISTS public.user_fauna_sightings (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    fauna_id UUID NOT NULL REFERENCES public.fauna_species(id) ON DELETE CASCADE,
    sighting_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    fuzzy_location GEOMETRY(Point, 4326),
    PRIMARY KEY (user_id, fauna_id)
);

CREATE INDEX IF NOT EXISTS idx_user_fauna_sightings_fauna ON public.user_fauna_sightings(fauna_id);

-- ==============================================================================
-- 5. SERVICIOS COMERCIALES, PYMES Y SELLOS CST / ICT
-- ==============================================================================

-- 5.1 TABLA COMMERCIAL_SERVICES (Eco-lodges, Sodas, Guías y Tours)
CREATE TABLE IF NOT EXISTS public.commercial_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    main_category VARCHAR(100) NOT NULL CHECK (main_category IN ('eco_lodge', 'soda_restaurante', 'tour_operador', 'aventura_canopy', 'transporte', 'artesanias')),
    subcategory VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_range VARCHAR(50) DEFAULT '$$',
    avg_price_usd NUMERIC(10, 2) DEFAULT 25.00,
    province VARCHAR(50) NOT NULL DEFAULT 'Puntarenas',
    location GEOMETRY(Point, 4326) NOT NULL,
    phone_whatsapp VARCHAR(50) NOT NULL,
    external_url TEXT,
    accepts_sinpe BOOLEAN NOT NULL DEFAULT TRUE,
    accepts_cards BOOLEAN NOT NULL DEFAULT TRUE,
    pet_friendly BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified_ict BOOLEAN NOT NULL DEFAULT FALSE,
    cst_stars INT NOT NULL DEFAULT 1 CHECK (cst_stars BETWEEN 0 AND 5),
    is_sponsored BOOLEAN NOT NULL DEFAULT FALSE,
    sponsored_tier INT NOT NULL DEFAULT 0,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commercial_services_location ON public.commercial_services USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_commercial_services_cst ON public.commercial_services(cst_stars);
CREATE INDEX IF NOT EXISTS idx_commercial_services_verified ON public.commercial_services(is_verified_ict);
CREATE INDEX IF NOT EXISTS idx_commercial_services_owner ON public.commercial_services(owner_id);

-- ==============================================================================
-- 6. RESEÑAS, LIKES, SEGUIDORES Y NOTIFICACIONES
-- ==============================================================================

-- 6.1 TABLA REVIEWS (Reseñas sobre Destinos o Servicios Comerciales)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('destination', 'service')),
    target_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_target ON public.reviews(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);

-- 6.2 TABLA LIKES (Likes Polimórficos con Unicidad por Usuario)
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('destination', 'service', 'fauna_photo', 'fauna_sighting')),
    target_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_target_like UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_target ON public.likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);

-- 6.3 TABLA USER_FOLLOWS (Seguimiento entre Exploradores / Guías)
CREATE TABLE IF NOT EXISTS public.user_follows (
    follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    followed_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id),
    CONSTRAINT chk_no_self_follow CHECK (follower_id <> followed_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_followed ON public.user_follows(followed_id);

-- 6.4 TABLA NOTIFICATIONS (Centro de Notificaciones en Tiempo Real)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('like', 'review', 'follow', 'system_alert', 'claim_verified')),
    target_id UUID,
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, read_status);

-- ==============================================================================
-- 7. VISTAS SQL (VISTA DE PROMEDIOS DE RATING)
-- ==============================================================================

-- 7.1 VISTA vw_target_ratings
CREATE OR REPLACE VIEW public.vw_target_ratings AS
SELECT 
    target_type,
    target_id,
    ROUND(AVG(rating)::numeric, 2) AS avg_rating,
    COUNT(id)::int AS total_reviews,
    COUNT(CASE WHEN rating = 5 THEN 1 END)::int AS count_5_stars,
    COUNT(CASE WHEN rating = 4 THEN 1 END)::int AS count_4_stars,
    COUNT(CASE WHEN rating = 3 THEN 1 END)::int AS count_3_stars,
    COUNT(CASE WHEN rating = 2 THEN 1 END)::int AS count_2_stars,
    COUNT(CASE WHEN rating = 1 THEN 1 END)::int AS count_1_stars
FROM public.reviews
GROUP BY target_type, target_id;

-- ==============================================================================
-- 8. FUNCIONES Y TRIGGERS AUTOMATIZADOS
-- ==============================================================================

-- 8.1 TRIGGER: Sincronizar nuevo usuario desde auth.users a public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, avatar_url, username, preferred_currency)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Explorador Tico'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id),
        LOWER(SPLIT_PART(COALESCE(NEW.email, 'user_' || SUBSTRING(NEW.id::text FROM 1 FOR 8)), '@', 1)),
        'CRC'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8.2 TRIGGER: Actualizar automáticamente likes_count en fauna_photos
CREATE OR REPLACE FUNCTION public.fn_update_fauna_photo_likes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') AND NEW.target_type = 'fauna_photo' THEN
        UPDATE public.fauna_photos
        SET likes_count = likes_count + 1
        WHERE id = NEW.target_id;
    ELSIF (TG_OP = 'DELETE') AND OLD.target_type = 'fauna_photo' THEN
        UPDATE public.fauna_photos
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = OLD.target_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_fauna_photo_likes ON public.likes;
CREATE TRIGGER trg_update_fauna_photo_likes
    AFTER INSERT OR DELETE ON public.likes
    FOR EACH ROW EXECUTE FUNCTION public.fn_update_fauna_photo_likes();

-- 8.3 TRIGGER: Generar Notificaciones tras Interacciones Sociales
CREATE OR REPLACE FUNCTION public.fn_notify_on_social_interaction()
RETURNS TRIGGER AS $$
DECLARE
    v_recipient_id UUID;
BEGIN
    -- Caso 1: Nuevo Like en Foto de Fauna
    IF (TG_TABLE_NAME = 'likes') AND (NEW.target_type = 'fauna_photo') THEN
        SELECT user_id INTO v_recipient_id FROM public.fauna_photos WHERE id = NEW.target_id;
        IF v_recipient_id IS NOT NULL AND v_recipient_id <> NEW.user_id THEN
            INSERT INTO public.notifications (recipient_id, actor_id, type, target_id)
            VALUES (v_recipient_id, NEW.user_id, 'like', NEW.target_id);
        END IF;

    -- Caso 2: Nuevo Seguidor
    ELSIF (TG_TABLE_NAME = 'user_follows') THEN
        INSERT INTO public.notifications (recipient_id, actor_id, type, target_id)
        VALUES (NEW.followed_id, NEW.follower_id, 'follow', NEW.follower_id);

    -- Caso 3: Nueva Reseña en Servicio Comercial
    ELSIF (TG_TABLE_NAME = 'reviews') AND (NEW.target_type = 'service') THEN
        SELECT owner_id INTO v_recipient_id FROM public.commercial_services WHERE id = NEW.target_id;
        IF v_recipient_id IS NOT NULL AND v_recipient_id <> NEW.user_id THEN
            INSERT INTO public.notifications (recipient_id, actor_id, type, target_id)
            VALUES (v_recipient_id, NEW.user_id, 'review', NEW.id);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_on_like ON public.likes;
CREATE TRIGGER trg_notify_on_like
    AFTER INSERT ON public.likes
    FOR EACH ROW EXECUTE FUNCTION public.fn_notify_on_social_interaction();

DROP TRIGGER IF EXISTS trg_notify_on_follow ON public.user_follows;
CREATE TRIGGER trg_notify_on_follow
    AFTER INSERT ON public.user_follows
    FOR EACH ROW EXECUTE FUNCTION public.fn_notify_on_social_interaction();

DROP TRIGGER IF EXISTS trg_notify_on_review ON public.reviews;
CREATE TRIGGER trg_notify_on_review
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.fn_notify_on_social_interaction();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) - POLÍTICAS DE SEGURIDAD
-- ==============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regiones_ict ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.normativas_destinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fauna_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fauna_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_fauna_sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 9.1 USERS
CREATE POLICY "Lectura pública de perfiles de usuario" 
    ON public.users FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
    ON public.users FOR UPDATE USING (auth.uid() = id);

-- 9.2 SYSTEM_EXCHANGE_RATES (Lectura pública; Inserción por Service Role o Admin)
CREATE POLICY "Lectura pública de tipos de cambio" 
    ON public.system_exchange_rates FOR SELECT USING (true);

CREATE POLICY "Service Role o Admins pueden insertar tipo de cambio" 
    ON public.system_exchange_rates FOR INSERT 
    WITH CHECK (auth.role() = 'service_role' OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- 9.3 REGIONES_ICT (Lectura pública)
CREATE POLICY "Lectura pública de regiones ICT" 
    ON public.regiones_ict FOR SELECT USING (true);

-- 9.4 DESTINATIONS & NORMATIVAS (Lectura pública anónima; Edición por Admins)
CREATE POLICY "Lectura pública de destinos" 
    ON public.destinations FOR SELECT USING (true);

CREATE POLICY "Admins pueden gestionar destinos" 
    ON public.destinations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Lectura pública de normativas SINAC" 
    ON public.normativas_destinos FOR SELECT USING (true);

-- 9.5 FAUNA SPECIES (Lectura pública)
CREATE POLICY "Lectura pública de fauna de Costa Rica" 
    ON public.fauna_species FOR SELECT USING (true);

-- 9.6 FAUNA PHOTOS (Lectura pública; Inserción/Edición por el autor)
CREATE POLICY "Lectura pública del álbum de fotos de fauna" 
    ON public.fauna_photos FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden subir fotos de fauna" 
    ON public.fauna_photos FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias fotos de fauna" 
    ON public.fauna_photos FOR DELETE 
    USING (auth.uid() = user_id);

-- 9.7 USER FAUNA SIGHTINGS
CREATE POLICY "Lectura pública de avistamientos reportados" 
    ON public.user_fauna_sightings FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden registrar sus propios avistamientos" 
    ON public.user_fauna_sightings FOR ALL 
    USING (auth.uid() = user_id);

-- 9.8 COMMERCIAL SERVICES (Directorio B2B / B2C)
CREATE POLICY "Lectura pública de comercios y servicios turísticos" 
    ON public.commercial_services FOR SELECT USING (true);

CREATE POLICY "Comerciantes verificados pueden gestionar sus comercios" 
    ON public.commercial_services FOR ALL 
    USING (auth.uid() = owner_id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Usuarios autenticados pueden registrar comercios pymes" 
    ON public.commercial_services FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

-- 9.9 REVIEWS
CREATE POLICY "Lectura pública de reseñas" 
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden escribir reseñas" 
    ON public.reviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar o borrar sus propias reseñas" 
    ON public.reviews FOR ALL 
    USING (auth.uid() = user_id);

-- 9.10 LIKES
CREATE POLICY "Lectura pública de likes" 
    ON public.likes FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden dar y quitar likes" 
    ON public.likes FOR ALL 
    USING (auth.uid() = user_id);

-- 9.11 USER FOLLOWS
CREATE POLICY "Lectura pública de seguidores" 
    ON public.user_follows FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden seguir o dejar de seguir" 
    ON public.user_follows FOR ALL 
    USING (auth.uid() = follower_id);

-- 9.12 NOTIFICATIONS
CREATE POLICY "Usuarios solo pueden ver sus propias notificaciones" 
    ON public.notifications FOR SELECT 
    USING (auth.uid() = recipient_id);

CREATE POLICY "Usuarios pueden actualizar el estado de sus notificaciones" 
    ON public.notifications FOR UPDATE 
    USING (auth.uid() = recipient_id);

-- ==============================================================================
-- 10. DATOS INICIALES (SEED DATA: REGIONES ICT, DESTINOS Y FAUNA CON POSTGIS)
-- ==============================================================================

-- 10.1 Regiones ICT
INSERT INTO public.regiones_ict (id, nombre_region, provincia, descripcion) VALUES
(1, 'Valle Central', 'San José', 'Corazón cultural, volcanes Poás e Irazú y ciudades coloniales'),
(2, 'Guanacaste', 'Guanacaste', 'Playas doradas del Pacífico Norte, sabanas y Parques Nacionales Rincón de la Vieja y Santa Rosa'),
(3, 'Llanuras del Norte', 'Alajuela', 'Volcán Arenal, aguas termales de La Fortuna y refugios Caño Negro'),
(4, 'Pacífico Central', 'Puntarenas', 'Manuel Antonio, Parque Nacional Carara y avistamiento de lapas rojas'),
(5, 'Pacífico Sur', 'Puntarenas', 'Península de Osa, Parque Nacional Corcovado y Bahía Ballena'),
(6, 'Caribe', 'Limón', 'Tortuguero, Puerto Viejo de Talamanca, arrecifes de Cahuita y cultura afrocaribeña')
ON CONFLICT (id) DO NOTHING;

-- 10.2 Tipo de cambio inicial
INSERT INTO public.system_exchange_rates (rate_buy, rate_sell, source)
VALUES (504.50, 517.80, 'BCCR Oficial')
ON CONFLICT DO NOTHING;

-- 10.3 Destinos y Parques Nacionales con PostGIS (SRID 4326: ST_SetSRID(ST_MakePoint(lng, lat), 4326))
INSERT INTO public.destinations (
    legacy_id, name, region_id, province, region, category, description,
    location, difficulty, price_national_crc, price_foreigner_usd,
    fee_type, sinac_restricted, requires_sinac_booking, sinac_booking_url,
    has_high_tides_risk, waze_url, status, cover_image_url
) VALUES 
(
    1,
    'Parque Nacional Manuel Antonio',
    4,
    'Puntarenas',
    'Pacífico Central',
    'Parque Nacional',
    'El parque más visitado del país con playas de arena blanca, senderos de selva tropical, monos cariblancos y perezosos.',
    ST_SetSRID(ST_MakePoint(-84.1432, 9.3893), 4326),
    'Fácil',
    1800.00,
    18.00,
    'Tarifa SINAC Oficial',
    TRUE,
    TRUE,
    'https://serviciosenlinea.sinac.go.cr/',
    FALSE,
    'https://waze.com/ul?ll=9.3893,-84.1432&navigate=yes',
    'Abierto (Cierra Martes)',
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
),
(
    2,
    'Parque Nacional Volcán Arenal',
    3,
    'Alajuela',
    'Llanuras del Norte',
    'Volcán & Aguas Termales',
    'Imponente cono volcánico perfecto rodeado de coladas de lava de 1968 y 1992, bosque lluvioso y aguas termales.',
    ST_SetSRID(ST_MakePoint(-84.6963, 10.4628), 4326),
    'Moderado',
    1130.00,
    16.95,
    'Tarifa SINAC Oficial',
    FALSE,
    FALSE,
    'https://serviciosenlinea.sinac.go.cr/',
    FALSE,
    'https://waze.com/ul?ll=10.4628,-84.6963&navigate=yes',
    'Abierto Diario',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
),
(
    3,
    'Parque Nacional Corcovado (Estación Sirena)',
    5,
    'Puntarenas',
    'Pacífico Sur',
    'Reserva Biológica Extrema',
    'Considerado por National Geographic como el lugar biológicamente más intenso del planeta, hogar de dantas, jaguares y 4 especies de monos.',
    ST_SetSRID(ST_MakePoint(-83.5900, 8.4800), 4326),
    'Difícil',
    2260.00,
    33.90,
    'SINAC + Guía ICT Obligatorio',
    TRUE,
    TRUE,
    'https://serviciosenlinea.sinac.go.cr/',
    TRUE,
    'https://waze.com/ul?ll=8.4800,-83.5900&navigate=yes',
    'Abierto (Acceso con Guía)',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'
),
(
    4,
    'Parque Nacional Cahuita & Punta Vargas',
    6,
    'Limón',
    'Caribe',
    'Arrecife Coralino & Playa',
    'El arrecife de coral más grande del Caribe costarricense junto a senderos costeros bordeados de palmeras y monos congo.',
    ST_SetSRID(ST_MakePoint(-82.8450, 9.7360), 4326),
    'Fácil',
    0.00,
    5.00,
    'Donación Voluntaria Comunidad',
    FALSE,
    FALSE,
    NULL,
    TRUE,
    'https://waze.com/ul?ll=9.7360,-82.8450&navigate=yes',
    'Abierto Diario',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
)
ON CONFLICT (legacy_id) DO NOTHING;

-- 10.4 Normativas de Destinos
INSERT INTO public.normativas_destinos (
    destination_id, reserva_linea_obligatoria, guia_obligatorio,
    limite_boletos_transaccion, dia_cierre, horario_ingreso,
    observaciones_especiales, alertas_volcanicas_clima
)
SELECT 
    id,
    requires_sinac_booking,
    sinac_restricted,
    6,
    CASE WHEN name LIKE '%Manuel Antonio%' THEN 'Martes' ELSE 'Ninguno' END,
    '07:00 AM - 04:00 PM',
    'Prohibido el ingreso de plásticos de un solo uso y alimentos a áreas de playa.',
    'Verificar pronóstico de lluvias IMN antes de ingresar.'
FROM public.destinations
ON CONFLICT DO NOTHING;

-- 10.5 Fauna de Costa Rica
INSERT INTO public.fauna_species (
    common_name_es, common_name_en, scientific_name, category,
    description, habitat, vulnerability_status, sound_url, sound_name, image_url,
    approx_location
) VALUES
(
    'Rana Calzonuda de Ojos Rojos',
    'Red-eyed Tree Frog',
    'Agalychnis callidryas',
    'anfibios',
    'Emblemática rana nocturna de Costa Rica con vívidos ojos escarlata, flancos azules y patas anaranjadas.',
    'Hojas de árboles cerca de charcas temporales en bosques húmedos tropicales.',
    'Preocupación Menor (LC)',
    'https://assets.mixkit.co/active_storage/sfx/2416/2416-preview.mp3',
    'Choc-choc nocturno tropical',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    ST_SetSRID(ST_MakePoint(-84.0500, 10.3500), 4326)
),
(
    'Perezoso de Tres Dedos',
    'Three-toed Sloth',
    'Bradypus variegatus',
    'mamiferos',
    'Mamífero arbóreo folívoro que pasa el 90% de su vida colgado en las copas de los árboles de Cecropia (guarumo).',
    'Dosel del bosque tropical lluvioso y nuboso desde el nivel del mar hasta 1,800m.',
    'Preocupación Menor (LC)',
    NULL,
    'Resoplido agudo en el dosel',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    ST_SetSRID(ST_MakePoint(-84.1432, 9.3893), 4326)
),
(
    'Lapa Roja / Guacamaya',
    'Scarlet Macaw',
    'Ara macao',
    'aves',
    'Majestuosa ave neotropical monógama con deslumbrante plumaje rojo, amarillo y azul.',
    'Bosques costeros del Pacífico Central y Península de Osa, alimentándose de almendro de playa.',
    'Preocupación Menor (LC)',
    NULL,
    'Grajido estrepitoso en vuelo',
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
    ST_SetSRID(ST_MakePoint(-84.6000, 9.7000), 4326)
),
(
    'Ballena Jorobada',
    'Humpback Whale',
    'Megaptera novaeangliae',
    'marino',
    'Cetáceo migratorio que visita Costa Rica tanto del hemisferio norte como del sur para dar a luz en el Golfo Dulce y Marino Ballena.',
    'Aguas cálidas del Pacífico tropical (Uvita, Golfo de Nicoya y Golfo Dulce).',
    'Preocupación Menor (LC)',
    NULL,
    'Canto submarino de baja frecuencia',
    'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80',
    ST_SetSRID(ST_MakePoint(-83.7500, 9.1500), 4326)
)
ON CONFLICT (scientific_name) DO NOTHING;

-- 10.6 Servicios Comerciales y Eco-Lodges ICT
INSERT INTO public.commercial_services (
    main_category, subcategory, title, description, price_range, avg_price_usd,
    province, location, phone_whatsapp, external_url,
    accepts_sinpe, accepts_cards, pet_friendly, is_verified_ict, cst_stars,
    is_sponsored, sponsored_tier, photos
) VALUES 
(
    'eco_lodge',
    'Lodge Autosostenible',
    'Lapa Rios Rainforest Lodge',
    'Eco-lodge pionero en la Península de Osa con certificación 5 Hojas CST de Sostenibilidad y vistas al Golfo Dulce.',
    '$$$$',
    380.00,
    'Puntarenas',
    ST_SetSRID(ST_MakePoint(-83.5200, 8.4100), 4326),
    '+50670001122',
    'https://laparios.com',
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    5,
    TRUE,
    1,
    ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
),
(
    'soda_restaurante',
    'Gastronomía Costarricense',
    'Soda La Parada - Tradición Guanacasteca',
    'Auténtica comida tica con gallo pinto, casados con picadillos criollos y tortillas de maíz palmeadas a mano.',
    '$',
    8.50,
    'Guanacaste',
    ST_SetSRID(ST_MakePoint(-85.4500, 10.3000), 4326),
    '+50688997766',
    NULL,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    4,
    FALSE,
    0,
    ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80']
)
ON CONFLICT DO NOTHING;
