# نظام إدارة اللجان والطلبات (React + Vite + Supabase)

## خطوات التشغيل

1. فك ضغط المشروع وادخل المجلد:
   ```
   cd project
   ```

2. ثبّت الحزم:
   ```
   npm install
   ```

3. أنشئ ملف `.env` بناءً على `.env.example` وضع فيه بيانات مشروعك على Supabase:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
   يمكنك إيجاد هذه القيم في: Supabase Dashboard > Project Settings > API

4. اذهب إلى Supabase SQL Editor وشغّل محتوى ملف `supabase_schema.sql` لإنشاء جدولي
   `committees` و `requests` مع سياسات RLS الأساسية وبيانات اللجان المبدئية.

5. شغّل المشروع محلياً:
   ```
   npm run dev
   ```

## هيكل المشروع

```
project/
├── src/
│   ├── lib/
│   │   └── supabaseClient.js   # الاتصال بـ Supabase
│   ├── components/
│   │   └── Navbar.jsx          # شريط التنقل
│   ├── pages/
│   │   ├── CommitteesPage.jsx  # عرض اللجان
│   │   ├── RequestsForm.jsx    # نموذج إرسال الطلبات
│   │   └── AdminDashboard.jsx  # لوحة تحكم الطلبات
│   ├── App.jsx                 # الـ Routing الرئيسي
│   ├── main.jsx
│   └── index.css
├── supabase_schema.sql         # سكريبت إنشاء الجداول
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## ملاحظات أمنية مهمة

- سياسات RLS الموجودة في `supabase_schema.sql` مبسطة لأغراض التطوير فقط
  (تسمح بالقراءة/الإدراج/التحديث للجميع). قبل النشر الفعلي، يُنصح بشدة بـ:
  - تقييد تحديث/قراءة الطلبات على المستخدمين المصرح لهم فقط (الأدمن)
    عبر ربط Supabase Auth وفحص `auth.uid()` أو `auth.role()`.
  - عدم عرض `AdminDashboard` إلا بعد تسجيل دخول أدمن (يمكن إضافة صفحة
    تسجيل دخول باستخدام `supabase.auth.signInWithPassword`).
