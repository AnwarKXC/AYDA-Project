import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { requestFormSchema, normalizePhone } from '../lib/validation'
import type { RequestFormValues } from '../lib/validation'
import { submitRequest, uploadPrescription, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '../services/requests'
import './RequestPage.css'

const TABS: { id: RequestFormValues['request_type']; label: string }[] = [
  { id: 'prescription', label: 'صرف روشتة' },
  { id: 'convoy', label: 'طلب قافلة' },
  { id: 'medical', label: 'أجهزة طبية' },
  { id: 'consultation', label: 'استشارة طبية' },
]

const DEVICE_OPTIONS = ['كرسي متحرك', 'جهاز قياس ضغط', 'جهاز قياس سكر']

const EMPTY_VALUES: RequestFormValues = {
  request_type: 'prescription',
  full_name: '',
  phone: '',
  age: '',
  city: '',
  device: '',
  chronic_diseases: '',
  symptoms: '',
  details: '',
}

export default function RequestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [showOther, setShowOther] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: EMPTY_VALUES,
  })

  const activeTab = watch('request_type')

  const switchTab = (tab: RequestFormValues['request_type']) => {
    setValue('request_type', tab)
    setShowOther(false)
    setFile(null)
    setFileError(null)
    clearErrors()
  }

  const handleFileChange = (selected: File | null) => {
    setFileError(null)
    if (selected) {
      if (!ALLOWED_IMAGE_TYPES.includes(selected.type)) {
        setFileError('يُسمح فقط بصور بصيغة JPG أو PNG أو WEBP أو HEIC')
        setFile(null)
        return
      }
      if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFileError(`حجم الصورة يجب ألا يتجاوز ${MAX_FILE_SIZE_MB} ميجابايت`)
        setFile(null)
        return
      }
    }
    setFile(selected)
  }

  const onSubmit = async (values: RequestFormValues) => {
    try {
      let imagePath: string | null = null
      if (values.request_type === 'prescription' && file) {
        imagePath = await uploadPrescription(file)
      }
      await submitRequest({
        full_name: values.full_name,
        phone: normalizePhone(values.phone),
        request_type: values.request_type,
        age: values.age ? Number(values.age) : null,
        city: values.city || null,
        device: values.device || null,
        chronic_diseases: values.chronic_diseases || null,
        symptoms: values.symptoms || null,
        details: values.details || null,
        image_url: imagePath,
      })
      toast.success('تم إرسال طلبك بنجاح!')
      reset(EMPTY_VALUES)
      setFile(null)
      setSubmitted(true)
    } catch {
      toast.error('حدث خطأ أثناء الإرسال، حاول مرة أخرى')
    }
  }

  const fieldError = (name: keyof RequestFormValues) =>
    errors[name] ? (
      <p className="req-error" role="alert">{errors[name]?.message}</p>
    ) : null

  if (submitted) {
    return (
      <div className="req-page" dir="rtl">
        <div className="req-bg">
          <div className="req-blob b1" />
          <div className="req-blob b2" />
          <div className="req-blob b3" />
        </div>
        <div className="req-content">
          <div className="req-card req-success" role="status">
            <span className="req-success-icon" aria-hidden="true">✓</span>
            <h1 className="req-title">تم استلام طلبك</h1>
            <p className="req-subtitle">فريق AYDA هيراجع الطلب ويتواصل معاك على رقم الموبايل في أقرب وقت</p>
            <button type="button" className="req-submit" onClick={() => setSubmitted(false)}>
              إرسال طلب آخر
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="req-page" dir="rtl">
      <div className="req-bg">
        <div className="req-blob b1" />
        <div className="req-blob b2" />
        <div className="req-blob b3" />
      </div>

      <div className="req-content">
        <div className="req-header">
          <span className="req-eyebrow">نموذج طلب</span>
          <h1 className="req-title">مركز طلبات AYDA</h1>
          <p className="req-subtitle">اختر نوع الطلب واملأ البيانات، وفريقنا هيتواصل معاك في أقرب وقت</p>
        </div>

        <div className="req-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => switchTab(tab.id)}
              className={`req-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="req-card">
          <form onSubmit={handleSubmit(onSubmit)} className="req-form" noValidate>
            <label className="req-label" htmlFor="full_name">الاسم الكريم</label>
            <input id="full_name" type="text" placeholder="الاسم الكريم" className="req-input" {...register('full_name')} />
            {fieldError('full_name')}

            <label className="req-label" htmlFor="phone">رقم التليفون للتواصل</label>
            <input id="phone" type="tel" inputMode="tel" placeholder="01012345678" className="req-input" {...register('phone')} />
            {fieldError('phone')}

            {activeTab === 'prescription' && (
              <>
                <label className="req-label" htmlFor="age">السن (اختياري)</label>
                <input id="age" type="number" inputMode="numeric" placeholder="السن" className="req-input" {...register('age')} />
                {fieldError('age')}

                <label className="req-label" htmlFor="details">سبب عدم القدرة على الصرف</label>
                <textarea id="details" placeholder="سبب عدم القدرة على الصرف" className="req-textarea" {...register('details')} />
                {fieldError('details')}

                <label className="req-label" htmlFor="prescription-file">ارفع صورة الروشتة (اختياري):</label>
                <input
                  id="prescription-file"
                  type="file"
                  accept="image/*"
                  className="req-file"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
                {file && <p className="req-file-name">تم اختيار: {file.name}</p>}
                {fileError && <p className="req-error" role="alert">{fileError}</p>}
              </>
            )}

            {activeTab === 'convoy' && (
              <>
                <label className="req-label" htmlFor="city">اسم البلد</label>
                <input id="city" type="text" placeholder="اسم البلد" className="req-input" {...register('city')} />
                {fieldError('city')}

                <label className="req-label" htmlFor="details">أسباب نزول القافلة</label>
                <textarea id="details" placeholder="أسباب نزول القافلة" className="req-textarea" {...register('details')} />
                {fieldError('details')}
              </>
            )}

            {activeTab === 'medical' && (
              <>
                <label className="req-label" htmlFor="device">الجهاز المطلوب</label>
                <select
                  id="device"
                  className="req-input"
                  value={showOther ? 'other' : watch('device')}
                  onChange={(e) => {
                    const isOther = e.target.value === 'other'
                    setShowOther(isOther)
                    setValue('device', isOther ? '' : e.target.value, { shouldValidate: false })
                  }}
                >
                  <option value="">اختر الجهاز المطلوب...</option>
                  {DEVICE_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                  <option value="other">أخرى</option>
                </select>
                {showOther && (
                  <input type="text" placeholder="اكتب اسم الجهاز..." className="req-input" {...register('device')} />
                )}
                {fieldError('device')}

                <label className="req-label" htmlFor="details">أسباب عدم القدرة على الشراء</label>
                <textarea id="details" placeholder="أسباب عدم القدرة على الشراء" className="req-textarea" {...register('details')} />
                {fieldError('details')}
              </>
            )}

            {activeTab === 'consultation' && (
              <>
                <label className="req-label" htmlFor="age">السن</label>
                <input id="age" type="number" inputMode="numeric" placeholder="السن" className="req-input" {...register('age')} />
                {fieldError('age')}

                <label className="req-label" htmlFor="chronic_diseases">الأمراض المزمنة (إن وجدت)</label>
                <input id="chronic_diseases" type="text" placeholder="الأمراض المزمنة (إن وجدت)" className="req-input" {...register('chronic_diseases')} />
                {fieldError('chronic_diseases')}

                <label className="req-label" htmlFor="symptoms">الأعراض التي تشكو منها بالتفصيل</label>
                <textarea id="symptoms" placeholder="الأعراض التي تشكو منها بالتفصيل" className="req-textarea" {...register('symptoms')} />
                {fieldError('symptoms')}
              </>
            )}

            <button disabled={isSubmitting} type="submit" className="req-submit">
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
