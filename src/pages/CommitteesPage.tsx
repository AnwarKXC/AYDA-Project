import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCommittees } from '../services/committees'
import { HERO_IMAGE_URL } from '../lib/assets'

function CommitteeSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="h-44 animate-pulse bg-sand-deep" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-sand-deep" />
        <div className="h-4 w-full animate-pulse rounded bg-sand-deep" />
      </div>
    </div>
  )
}

export default function CommitteesPage() {
  const {
    data: committees = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ['committees'], queryFn: fetchCommittees })

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <img
          src={HERO_IMAGE_URL}
          alt="فريق AYDA"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/80 to-ink/40" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-2xl animate-fade-up">
            <span className="mb-4 inline-block rounded-full bg-amber-soft px-4 py-1 text-sm font-bold text-amber">
              Association of Young Doctors
            </span>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
              الصحة{' '}
              <span className="relative inline-block">
                حق للجميع
                <svg
                  className="absolute -bottom-2 right-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path d="M4 8 C60 2, 140 2, 196 7" stroke="#E9A13B" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              فريق من أطباء المستقبل يعمل على توصيل الدواء والأجهزة الطبية والاستشارات لمن يحتاجها،
              مجاناً وبكرامة كاملة.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/request"
                className="rounded-xl bg-amber px-7 py-3.5 font-black text-ink shadow-lift transition hover:brightness-110"
              >
                اطلب مساعدة طبية
              </Link>
              <a
                href="#committees"
                className="rounded-xl border border-white/30 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                تعرّف على اللجان
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Committees */}
      <section id="committees" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-sm font-bold text-amber">فرق العمل</span>
          <h2 className="mt-1 text-3xl font-black">لجان AYDA</h2>
          <p className="mt-2 text-ink/60">تعرّف على اللجان التي تشكّل عمل الفريق ومجالات تخصصه</p>
        </div>

        {isError && (
          <p className="rounded-xl bg-red-50 p-4 text-center font-bold text-red-700" role="alert">
            تعذر تحميل اللجان، حاول تحديث الصفحة
          </p>
        )}

        {!isError && !isLoading && committees.length === 0 && (
          <p className="text-center text-ink/50">لا توجد لجان مضافة حالياً</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CommitteeSkeleton key={i} />)
            : committees.map((c) => (
                <article
                  key={c.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative h-44 bg-teal-soft">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl font-black text-teal/30">
                        {c.code}
                      </div>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold text-white">
                      {c.code}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-black">{c.name}</h3>
                    {c.description && <p className="mt-1 text-sm leading-relaxed text-ink/60">{c.description}</p>}
                  </div>
                </article>
              ))}
        </div>
      </section>
    </div>
  )
}
