-- ==============================================================================
-- DESCUBRIENDO CR - SUPABASE DATABASE SCHEMA & POSTGIS (SRID 4326)
-- Base de Datos Oficial para Descubriendo CR
-- Compatible con Supabase PostgreSQL 15+ / PostGIS 3+
-- ==============================================================================

-- 1. HABILITAR EXTENSIONES POSTGRESQL & POSTGIS EN SCHEMA extensions
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Otorgar permisos y configurar search_path
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
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
    location extensions.geometry(Point, 4326) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Moderado' CHECK (difficulty IN ('Fácil', 'Moderado', 'Difícil', 'Extremo')),
    price_national_crc NUMERIC(12, 2) DEFAULT 0.00,
    price_foreigner_usd NUMERIC(10, 2) DEFAULT 0.00,
    fee_type VARCHAR(100) DEFAULT 'Tarifa SINAC Oficial',
    sinac_restricted BOOLEAN DEFAULT FALSE,
    requires_sinac_booking BOOLEAN DEFAULT FALSE,
    sinac_booking_url TEXT,
    has_high_tides_risk BOOLEAN DEFAULT FALSE,
    waze_url TEXT,
    status VARCHAR(100) DEFAULT 'Abierto',
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice Espacial GIST para consultas geográficas ultrarrápidas
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_normativas_destination UNIQUE (destination_id)
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
    approx_location extensions.geometry(Point, 4326),
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
    fuzzy_location extensions.geometry(Point, 4326),
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
    location extensions.geometry(Point, 4326) NOT NULL,
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
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    INSERT INTO public.users (id, full_name, avatar_url, username, preferred_currency)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Explorador Tico'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id),
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            LOWER(REGEXP_REPLACE(SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1), '[^a-zA-Z0-9_]', '', 'g')) || '_' || SUBSTRING(REPLACE(NEW.id::text, '-', '') FROM 1 FOR 6)
        ),
        'CRC'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$;

-- Sincronizar trigger con auth.users si existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- 8.2 TRIGGER: Actualizar automáticamente likes_count en fauna_photos
CREATE OR REPLACE FUNCTION public.fn_update_fauna_photo_likes()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, extensions, pg_temp
AS $$
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
$$;

DROP TRIGGER IF EXISTS trg_update_fauna_photo_likes ON public.likes;
CREATE TRIGGER trg_update_fauna_photo_likes
    AFTER INSERT OR DELETE ON public.likes
    FOR EACH ROW EXECUTE FUNCTION public.fn_update_fauna_photo_likes();

-- 8.3 TRIGGER: Generar Notificaciones tras Interacciones Sociales
CREATE OR REPLACE FUNCTION public.fn_notify_on_social_interaction()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, extensions, pg_temp
AS $$
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
$$;

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
DROP POLICY IF EXISTS "Lectura pública de perfiles de usuario" ON public.users;
CREATE POLICY "Lectura pública de perfiles de usuario" 
    ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.users;
CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
    ON public.users FOR UPDATE USING (auth.uid() = id);

-- 9.2 SYSTEM_EXCHANGE_RATES
DROP POLICY IF EXISTS "Lectura pública de tipos de cambio" ON public.system_exchange_rates;
CREATE POLICY "Lectura pública de tipos de cambio" 
    ON public.system_exchange_rates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service Role o Admins pueden insertar tipo de cambio" ON public.system_exchange_rates;
CREATE POLICY "Service Role o Admins pueden insertar tipo de cambio" 
    ON public.system_exchange_rates FOR INSERT 
    WITH CHECK (auth.role() = 'service_role' OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- 9.3 REGIONES_ICT
DROP POLICY IF EXISTS "Lectura pública de regiones ICT" ON public.regiones_ict;
CREATE POLICY "Lectura pública de regiones ICT" 
    ON public.regiones_ict FOR SELECT USING (true);

-- 9.4 DESTINATIONS & NORMATIVAS
DROP POLICY IF EXISTS "Lectura pública de destinos" ON public.destinations;
CREATE POLICY "Lectura pública de destinos" 
    ON public.destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins pueden gestionar destinos" ON public.destinations;
CREATE POLICY "Admins pueden gestionar destinos" 
    ON public.destinations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Lectura pública de normativas SINAC" ON public.normativas_destinos;
CREATE POLICY "Lectura pública de normativas SINAC" 
    ON public.normativas_destinos FOR SELECT USING (true);

-- 9.5 FAUNA SPECIES
DROP POLICY IF EXISTS "Lectura pública de fauna de Costa Rica" ON public.fauna_species;
CREATE POLICY "Lectura pública de fauna de Costa Rica" 
    ON public.fauna_species FOR SELECT USING (true);

-- 9.6 FAUNA PHOTOS
DROP POLICY IF EXISTS "Lectura pública del álbum de fotos de fauna" ON public.fauna_photos;
CREATE POLICY "Lectura pública del álbum de fotos de fauna" 
    ON public.fauna_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden subir fotos de fauna" ON public.fauna_photos;
CREATE POLICY "Usuarios autenticados pueden subir fotos de fauna" 
    ON public.fauna_photos FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias fotos de fauna" ON public.fauna_photos;
CREATE POLICY "Usuarios pueden eliminar sus propias fotos de fauna" 
    ON public.fauna_photos FOR DELETE 
    USING (auth.uid() = user_id);

-- 9.7 USER FAUNA SIGHTINGS
DROP POLICY IF EXISTS "Lectura pública de avistamientos reportados" ON public.user_fauna_sightings;
CREATE POLICY "Lectura pública de avistamientos reportados" 
    ON public.user_fauna_sightings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios pueden registrar sus propios avistamientos" ON public.user_fauna_sightings;
CREATE POLICY "Usuarios pueden registrar sus propios avistamientos" 
    ON public.user_fauna_sightings FOR ALL 
    USING (auth.uid() = user_id);

-- 9.8 COMMERCIAL SERVICES
DROP POLICY IF EXISTS "Lectura pública de comercios y servicios turísticos" ON public.commercial_services;
CREATE POLICY "Lectura pública de comercios y servicios turísticos" 
    ON public.commercial_services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Comerciantes verificados pueden gestionar sus comercios" ON public.commercial_services;
CREATE POLICY "Comerciantes verificados pueden gestionar sus comercios" 
    ON public.commercial_services FOR ALL 
    USING (auth.uid() = owner_id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

DROP POLICY IF EXISTS "Usuarios autenticados pueden registrar comercios pymes" ON public.commercial_services;
CREATE POLICY "Usuarios autenticados pueden registrar comercios pymes" 
    ON public.commercial_services FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

-- 9.9 REVIEWS
DROP POLICY IF EXISTS "Lectura pública de reseñas" ON public.reviews;
CREATE POLICY "Lectura pública de reseñas" 
    ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden escribir reseñas" ON public.reviews;
CREATE POLICY "Usuarios autenticados pueden escribir reseñas" 
    ON public.reviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden editar o borrar sus propias reseñas" ON public.reviews;
CREATE POLICY "Usuarios pueden editar o borrar sus propias reseñas" 
    ON public.reviews FOR ALL 
    USING (auth.uid() = user_id);

-- 9.10 LIKES
DROP POLICY IF EXISTS "Lectura pública de likes" ON public.likes;
CREATE POLICY "Lectura pública de likes" 
    ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden dar y quitar likes" ON public.likes;
CREATE POLICY "Usuarios autenticados pueden dar y quitar likes" 
    ON public.likes FOR ALL 
    USING (auth.uid() = user_id);

-- 9.11 USER FOLLOWS
DROP POLICY IF EXISTS "Lectura pública de seguidores" ON public.user_follows;
CREATE POLICY "Lectura pública de seguidores" 
    ON public.user_follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden seguir o dejar de seguir" ON public.user_follows;
CREATE POLICY "Usuarios autenticados pueden seguir o dejar de seguir" 
    ON public.user_follows FOR ALL 
    USING (auth.uid() = follower_id);

-- 9.12 NOTIFICATIONS
DROP POLICY IF EXISTS "Usuarios solo pueden ver sus propias notificaciones" ON public.notifications;
CREATE POLICY "Usuarios solo pueden ver sus propias notificaciones" 
    ON public.notifications FOR SELECT 
    USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar el estado de sus notificaciones" ON public.notifications;
CREATE POLICY "Usuarios pueden actualizar el estado de sus notificaciones" 
    ON public.notifications FOR UPDATE 
    USING (auth.uid() = recipient_id);

-- ==============================================================================
-- 10. DATOS BÁSICOS DEL SISTEMA (Regiones ICT y Tipo de Cambio)
-- Para poblar los 128 destinos y catálogo de fauna completo, ejecute 'supabase/seed.sql'
-- ==============================================================================

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

INSERT INTO public.system_exchange_rates (rate_buy, rate_sell, source)
VALUES (505.00, 512.00, 'BCCR Oficial / Inicial')
ON CONFLICT DO NOTHING;
