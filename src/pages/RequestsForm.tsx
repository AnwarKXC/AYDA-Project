import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { requestFormSchema, normalizePhone } from '../lib/validation'
import type { RequestFormValues } from '../lib/validation'
import { submitRequest, uploadPrescription, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '../services/requests'

const TABS: { id: RequestFormValues['request_type']; label: string; hint: string }[] = [
  { id: 'prescription', label: 'صرف روشتة', hint: 'صرف أدوية روشتة لا تقدر على تكلفتها' },
  { id: 'convoy', label: 'طلب قافلة', hint: 'طلب نزول قافلة طبية لقريتك أو منطقتك' },
  { id: 'medical', label: 'أجهزة طبية', hint: 'طلب جهاز طبي لا تقدر على شرائه' },
  { id: 'consultation', label: 'استشارة طبية', hint: 'استشارة مجانية من أطباء الفريق' },
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

const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink/35 transition focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20'
const labelClass = 'mb-1.5 block text-sm font-bold text-ink/80'
const errorClass = 'mt-1.5 text-sm font-bold text-red-600'

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
  const activeHint = TABS.find((t) => t.id === activeTab)?.hint

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
      <p className={errorClass} role="alert">
        {errors[name]?.message}
      </p>
    ) : null

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <span
          className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-teal text-3xl font-black text-white shadow-lift"
          aria-hidden="true"
        >
          ✓
        </span>
        <h1 className="text-3xl font-black" role="status">
          تم استلام طلبك
        </h1>
        <p className="mt-3 leading-relaxed text-ink/60">
          فريق AYDA هيراجع الطلب ويتواصل معاك على رقم الموبايل في أقرب وقت
        </p>
        <button
          type="button"
          className="mt-8 rounded-xl bg-teal px-7 py-3.5 font-bold text-white shadow-card transition hover:bg-teal-dark"
          onClick={() => setSubmitted(false)}
        >
          إرسال طلب آخر
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <span className="text-sm font-bold text-amber">نموذج طلب</span>
        <h1 className="mt-1 text-3xl font-black">مركز طلبات AYDA</h1>
        <p className="mt-2 text-ink/60">اختر نوع الطلب واملأ البيانات، وفريقنا هيتواصل معاك في أقرب وقت</p>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="نوع الطلب">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => switchTab(tab.id)}
            className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
              activeTab === tab.id
                ? 'bg-ink text-white shadow-card'
                : 'bg-white text-ink/60 shadow-card hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeHint && <p className="mb-6 text-center text-sm text-ink/50">{activeHint}</p>}

      <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label className={labelClass} htmlFor="full_name">
              الاسم الكريم
            </label>
            <input id="full_name" type="text" className={inputClass} {...register('full_name')} />
            {fieldError('full_name')}
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">
              رقم التليفون للتواصل
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              dir="ltr"
              placeholder="01012345678"
              className={`${inputClass} text-right`}
              {...register('phone')}
            />
            {fieldError('phone')}
          </div>

          {activeTab === 'prescription' && (
            <>
              <div>
                <label className={labelClass} htmlFor="age">
                  السن <span className="font-normal text-ink/40">(اختياري)</span>
                </label>
                <input id="age" type="number" inputMode="numeric" className={inputClass} {...register('age')} />
                {fieldError('age')}
              </div>

              <div>
                <label className={labelClass} htmlFor="details">
                  سبب عدم القدرة على الصرف
                </label>
                <textarea id="details" rows={3} className={inputClass} {...register('details')} />
                {fieldError('details')}
              </div>

              <div>
                <label className={labelClass} htmlFor="prescription-file">
                  صورة الروشتة <span className="font-normal text-ink/40">(اختياري)</span>
                </label>
                <input
                  id="prescription-file"
                  type="file"
                  accept="image/*"
                  className="w-full cursor-pointer rounded-xl border-2 border-dashed border-teal/40 bg-teal-soft/50 px-4 py-3 text-sm text-ink/70 file:ml-3 file:rounded-lg file:border-0 file:bg-teal file:px-4 file:py-2 file:font-bold file:text-white"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
                {file && <p className="mt-1.5 text-sm font-bold text-teal">تم اختيار: {file.name}</p>}
                {fileError && (
                  <p className={errorClass} role="alert">
                    {fileError}
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === 'convoy' && (
            <>
              <div>
                <label className={labelClass} htmlFor="city">
                  اسم البلد
                </label>
                <input id="city" type="text" className={inputClass} {...register('city')} />
                {fieldError('city')}
              </div>

              <div>
                <label className={labelClass} htmlFor="details">
                  أسباب نزول القافلة
                </label>
                <textarea id="details" rows={3} className={inputClass} {...register('details')} />
                {fieldError('details')}
              </div>
            </>
          )}

          {activeTab === 'medical' && (
            <>
              <div>
                <label className={labelClass} htmlFor="device">
                  الجهاز المطلوب
                </label>
                <select
                  id="device"
                  className={inputClass}
                  value={showOther ? 'other' : watch('device')}
                  onChange={(e) => {
                    const isOther = e.target.value === 'other'
                    setShowOther(isOther)
                    setValue('device', isOther ? '' : e.target.value, { shouldValidate: false })
                  }}
                >
                  <option value="">اختر الجهاز المطلوب...</option>
                  {DEVICE_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="other">أخرى</option>
                </select>
                {showOther && (
                  <input
                    type="text"
                    placeholder="اكتب اسم الجهاز..."
                    className={`${inputClass} mt-2`}
                    {...register('device')}
                  />
                )}
                {fieldError('device')}
              </div>

              <div>
                <label className={labelClass} htmlFor="details">
                  أسباب عدم القدرة على الشراء
                </label>
                <textarea id="details" rows={3} className={inputClass} {...register('details')} />
                {fieldError('details')}
              </div>
            </>
          )}

          {activeTab === 'consultation' && (
            <>
              <div>
                <label className={labelClass} htmlFor="age">
                  السن
                </label>
                <input id="age" type="number" inputMode="numeric" className={inputClass} {...register('age')} />
                {fieldError('age')}
              </div>

              <div>
                <label className={labelClass} htmlFor="chronic_diseases">
                  الأمراض المزمنة <span className="font-normal text-ink/40">(إن وجدت)</span>
                </label>
                <input id="chronic_diseases" type="text" className={inputClass} {...register('chronic_diseases')} />
                {fieldError('chronic_diseases')}
              </div>

              <div>
                <label className={labelClass} htmlFor="symptoms">
                  الأعراض التي تشكو منها بالتفصيل
                </label>
                <textarea id="symptoms" rows={4} className={inputClass} {...register('symptoms')} />
                {fieldError('symptoms')}
              </div>
            </>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-xl bg-teal py-4 text-lg font-black text-white shadow-card transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </button>
        </form>
      </div>
    </div>
  )
}
