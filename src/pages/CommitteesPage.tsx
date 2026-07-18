import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Committee } from '../types'
import './CommitteesPage.css'

const Background = () => (
  <div className="ayda-bg">
    <div className="ayda-blob b1" />
    <div className="ayda-blob b2" />
    <div className="ayda-blob b3" />
    <div className="ayda-blob b4" />
    <div className="ayda-blob b5" />
    <div className="ayda-grain" />
  </div>
)

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data } = await supabase.from('committees').select('*').order('id', { ascending: true })
      if (data) setCommittees(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="ayda-page" dir="rtl">
        <Background />
        <div className="ayda-loader">
          <div className="ayda-spinner" />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>جاري التحميل...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="ayda-page" dir="rtl">
      <Background />

      <div className="ayda-content">
        {/* ناف بار */}
        <div className="ayda-nav">
          <div className="ayda-nav-brand">
            <img
              className="ayda-nav-logo"
              src="https://zlzxuujbzksrebgwiros.supabase.co/storage/v1/object/public/images/LOGO.png"
              alt="AYDA Logo"
            />
            <span className="ayda-nav-name">AYDA</span>
          </div>
          <span className="ayda-nav-tag">Association of Young Doctors</span>
        </div>

        {/* الهيرو */}
        <div className="ayda-hero-wrap">
          <div className="ayda-hero">
            <img
              className="ayda-hero-img"
              src="https://zlzxuujbzksrebgwiros.supabase.co/storage/v1/object/public/images/AYDA.jpg"
              alt="AYDA Team"
            />
            <div className="ayda-hero-overlay" />
            <div className="ayda-hero-shine" />
            <div className="ayda-hero-content">
              <span className="ayda-eyebrow">مرحباً بكم</span>
              <h1 className="ayda-hero-title">
                فريق <span className="ayda-gradient-text">AYDA</span>
              </h1>
              <p className="ayda-hero-text">
                نحن فريق من أطباء المستقبل، نسعى لصنع الفارق وتطوير مهاراتنا لخدمة مجتمعنا.
                AYDA هي منصتنا للإبداع، التعلم، والتميز في كل مجالات العمل الطبي والتطوعي.
              </p>
            </div>
          </div>
        </div>

        {/* عنوان القسم */}
        <div className="ayda-section-head">
          <div className="ayda-section-title-row">
            <span className="ayda-line" />
            <h2 className="ayda-section-title">لجان AYDA</h2>
            <span className="ayda-line rev" />
          </div>
          <p className="ayda-section-sub">تعرّف على اللجان التي تشكّل عمل الفريق ومجالات تخصصه</p>
        </div>

        {/* شبكة اللجان */}
        <div className="ayda-grid">
          {committees.map((c, i) => (
            <div
              key={c.id}
              className="ayda-card"
              style={{ animationDelay: `${Math.min(i, 6) * 0.08}s` }}
            >
              <div className="ayda-card-media">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} />
                ) : (
                  <div className="ayda-card-media-empty">لا توجد صورة</div>
                )}
                <div className="ayda-card-fade" />
                <div className="ayda-badge">{c.code}</div>
              </div>

              <div className="ayda-card-body">
                <h3 className="ayda-card-title">{c.name}</h3>
                <p className="ayda-card-desc">{c.description}</p>
                <div className="ayda-card-underline" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}