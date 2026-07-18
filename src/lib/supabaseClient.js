// src/lib/supabaseClient.js
// إعداد الاتصال بـ Supabase باستخدام متغيرات البيئة الخاصة بـ Vite

import { createClient } from '@supabase/supabase-js'

// ملاحظة مهمة:
// في مشاريع Vite يجب أن تبدأ متغيرات البيئة بالبادئة VITE_
// حتى يتم كشفها للـ Frontend عبر import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'خطأ: يرجى التأكد من ضبط VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env'
  )
}

// إنشاء عميل Supabase وتصديره لاستخدامه في جميع أنحاء التطبيق
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
