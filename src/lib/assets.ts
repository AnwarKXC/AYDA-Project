// Public site assets live in the public 'images' storage bucket.
// Built from the env URL instead of hardcoding the project domain.
const PUBLIC_BUCKET_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images`

export const LOGO_URL = `${PUBLIC_BUCKET_URL}/LOGO.png`
export const HERO_IMAGE_URL = `${PUBLIC_BUCKET_URL}/AYDA.jpg`
