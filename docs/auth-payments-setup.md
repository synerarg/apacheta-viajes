# Auth y Pagos: configuración externa pendiente

## Supabase Auth

### Google OAuth

1. En Supabase, ir a `Authentication > Providers > Google`.
2. Activar Google y completar `Client ID` y `Client Secret`.
3. En Google Cloud, registrar:
   - `http://localhost:3000`
   - tu dominio de producción
4. Agregar como redirect URI el callback que muestra Supabase para tu proyecto.

Referencia oficial:
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/server-side/nextjs

### Email OTP

1. En Supabase, ir a `Authentication > Templates`.
2. En el template de email OTP, usar `{{ .Token }}` para enviar código de 6 dígitos.
3. Si usás magic link en vez de OTP, el template debe usar `{{ .ConfirmationURL }}`.

Referencia oficial:
- https://supabase.com/docs/guides/auth/auth-email-passwordless

## Mercado Pago

1. Cargar `MERCADOPAGO_ACCESS_TOKEN` en tu entorno.
2. Configurar en Mercado Pago la `notification_url` pública hacia:
   - `/api/webhooks/mercadopago`
3. Configurar el secret de webhook en:
   - `MERCADOPAGO_WEBHOOK_SECRET`
4. Verificar en producción que `NEXT_PUBLIC_APP_URL` sea `https://...` para habilitar `auto_return`.

Referencia oficial:
- https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/overview
- https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks

## Transferencia bancaria

Variables requeridas:

- `BANK_TRANSFER_BANK_NAME`
- `BANK_TRANSFER_ACCOUNT_HOLDER`
- `BANK_TRANSFER_ACCOUNT_TAX_ID`
- `BANK_TRANSFER_ALIAS`
- `BANK_TRANSFER_CBU`
- `BANK_TRANSFER_RECEIPT_EMAIL`
- `BANK_TRANSFER_PAYMENT_WINDOW_HOURS`
- `BANK_TRANSFER_RECEIPT_BUCKET`
- `BANK_TRANSFER_RECEIPT_MAX_BYTES`
- `BANK_TRANSFER_RECEIPT_SIGNED_URL_TTL_SECONDS`

Además, crear en Supabase Storage un bucket llamado `payment-receipts` o el nombre que definas en `BANK_TRANSFER_RECEIPT_BUCKET`.
Ese bucket debe ser privado. Los comprobantes se sirven con signed URLs temporales desde backend.

## Migración nueva

Antes de probar el checkout multi-item y los pagos auditables, aplicar:

- `supabase/migrations/20260317121500_checkout_orders_payments.sql`

Esa migración crea:

- `ordenes`
- `ordenes_items`
- `pagos`
- `pagos_eventos`
