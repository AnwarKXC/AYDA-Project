-- supabase_schema.sql
-- شغّل هذا الملف داخل Supabase SQL Editor لإنشاء الجداول اللازمة

-- جدول اللجان
create table if not exists committees (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,        -- مثال: Marketing, PR, HR, PH, OC, PE
  name text not null,               -- اسم اللجنة بالعربي/الإنجليزي
  description text,
  head_name text,
  created_at timestamp with time zone default now()
);

-- جدول الطلبات
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  request_type text not null check (request_type in ('prescription','convoy','tools','consultation')),
  details text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamp with time zone default now()
);

-- بيانات مبدئية للجان (اختياري)
insert into committees (code, name, description) values
  ('Marketing', 'التسويق', 'لجنة التسويق والإعلان'),
  ('PR', 'العلاقات العامة', 'لجنة العلاقات العامة'),
  ('HR', 'الموارد البشرية', 'لجنة الموارد البشرية'),
  ('PH', 'الصيدلة', 'اللجنة الصيدلية'),
  ('OC', 'التنظيم', 'اللجنة التنظيمية'),
  ('PE', 'الفعاليات العامة', 'لجنة الفعاليات')
on conflict (code) do nothing;

-- تفعيل Row Level Security (موصى به)
alter table committees enable row level security;
alter table requests enable row level security;

-- سياسة قراءة عامة للجان (يمكن للجميع رؤية اللجان)
create policy "Allow public read committees"
  on committees for select
  using (true);

-- سياسة السماح للجميع بإدراج طلب جديد
create policy "Allow public insert requests"
  on requests for insert
  with check (true);

-- سياسة قراءة الطلبات (يفضل تقييدها لاحقاً بمستخدمين مصرح لهم فقط)
create policy "Allow public read requests"
  on requests for select
  using (true);

-- سياسة تحديث حالة الطلب (يفضل تقييدها بالأدمن فقط عبر auth.role())
create policy "Allow public update requests"
  on requests for update
  using (true);
