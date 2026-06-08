CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sme_user_id UUID NOT NULL REFERENCES users(id),
    supplier_user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','processing','dispatched','delivered','completed','disputed','cancelled')),
    escrow_amount BIGINT,
    escrow_id UUID,
    delivery_address TEXT,
    delivery_notes TEXT,
    gps_coordinates_lat DECIMAL(10,7),
    gps_coordinates_lng DECIMAL(10,7),
    dispatch_photo_s3_key VARCHAR(500),
    delivery_photo_s3_key VARCHAR(500),
    sme_confirmed_at TIMESTAMPTZ,
    dispatcher_name VARCHAR(200),
    dispatcher_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    unit_price BIGINT NOT NULL,
    total_price BIGINT NOT NULL
);
