import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSession } from '../hooks/useSession'
import { checkIsAdmin, signInAdmin, signOutAdmin } from '../services/auth'
import {
  fetchAllRequestsForExport,
  fetchRequests,
  signPrescriptionUrls,
  updateRequestStatus,
} from '../services/requests'
import type { RequestStatus } from '../types'

const REQUEST_TYPE_LABELS: Record<string, string> = {
  prescription: 'روشتة',
  convoy: 'قافلة',
  medical: 'أجهزة طبية',
  tools: 'أجهزة طبية',
  consultation: 'استشارة',
}

const STATUS_LABELS: Record<RequestStatus, { text: string; className: string }> = {
  pending: { text: 'قيد الانتظار', className: 'bg-yellow-100 text-yellow-800' },
  approved: { text: 'مقبول', className: 'bg-green-100 text-green-800' },
  rejected: { text: 'مرفوض', className: 'bg-red-100 text-red-800' },
}

export default function AdminDashboard() {
  const { session, loading: sessionLoading } = useSession()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Server-side enforcement lives in RLS; this check only powers a helpful
  // warning when the account is not in the admins allow-list.
  const { data: isAdmin } = useQuery({
    queryKey: ['is_admin'],
    queryFn: checkIsAdmin,
    enabled: !!session,
  })

  const {
    data: requestsPage,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const page = await fetchRequests({ pageSize: 200 })
      const imageUrls = await signPrescriptionUrls(page.rows, 60 * 60)
      return { ...page, imageUrls }
    },
    enabled: !!session,
  })

  const requests = requestsPage?.rows ?? []
  const imageUrls = requestsPage?.imageUrls ?? {}

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RequestStatus }) =>
      updateRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
      toast.success('تم تحديث حالة الطلب')
    },
    onError: () => toast.error('تعذر تحديث حالة الطلب'),
  })

  const exportToCSV = async () => {
    try {
      const allRequests = await fetchAllRequestsForExport()
      // CSV files get opened later/offline, so sign with a 7-day expiry
      // instead of the 1-hour URLs used on screen.
      const csvUrls = await signPrescriptionUrls(allRequests, 60 * 60 * 24 * 7)
      const headers = ['الاسم', 'الهاتف', 'نوع الطلب', 'السن', 'المدينة', 'الجهاز', 'الأمراض المزمنة', 'الأعراض', 'التفاصيل', 'الحالة', 'رابط الروشتة']
      const rows = allRequests.map((req) => {
        const imgUrl = req.image_url ? csvUrls[req.image_url] || '' : ''
        return [
          `"${req.full_name || ''}"`,
          `"${req.phone || ''}"`,
          `"${REQUEST_TYPE_LABELS[req.request_type] || req.request_type}"`,
          `"${req.age ?? ''}"`,
          `"${req.city || ''}"`,
          `"${req.device || ''}"`,
          `"${req.chronic_diseases || ''}"`,
          `"${req.symptoms || ''}"`,
          `"${req.details || ''}"`,
          `"${STATUS_LABELS[req.status]?.text || req.status}"`,
          imgUrl ? `"=HYPERLINK(""${imgUrl}""; ""عرض الصورة"")"` : '""',
        ]
      })

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
      // UTF-8 BOM so Excel opens the Arabic text correctly.
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', 'AYDA_Requests.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      toast.error('تعذر تصدير الملف، حاول مرة أخرى')
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoggingIn(true)
    try {
      await signInAdmin(email, password)
      toast.success('تم تسجيل الدخول بنجاح')
    } catch {
      toast.error('بيانات الدخول غير صحيحة')
    } finally {
      setLoggingIn(false)
    }
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        <p className="text-gray-500 font-bold">جاري التحميل...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-96">
          <h2 className="text-2xl font-black mb-6 text-blue-900 text-center">دخول لوحة التحكم</h2>
          <label className="sr-only" htmlFor="admin-email">البريد الإلكتروني</label>
          <input id="admin-email" required type="email" placeholder="البريد الإلكتروني" className="w-full p-4 mb-4 border rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="sr-only" htmlFor="admin-password">كلمة المرور</label>
          <input id="admin-password" required type="password" placeholder="كلمة المرور" className="w-full p-4 mb-6 border rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loggingIn} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold disabled:opacity-60">
            {loggingIn ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-blue-900">لوحة تحكم الطلبات</h1>
        <div className="flex gap-3">
          <button onClick={exportToCSV} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold">تصدير CSV</button>
          <button onClick={() => signOutAdmin()} className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold">خروج</button>
        </div>
      </div>

      {isAdmin === false && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-xl text-yellow-800 font-bold" role="alert">
          حسابك غير مسجل ضمن المشرفين، لذلك لن تظهر لك أي طلبات. راجع ملف supabase/README.md لإضافة حسابك.
        </div>
      )}

      {isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl text-red-800 font-bold" role="alert">
          تعذر تحميل الطلبات، حاول تحديث الصفحة
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500 font-bold">جاري تحميل الطلبات...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border">
          <table className="min-w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">الاسم</th>
                <th className="p-4">الهاتف</th>
                <th className="p-4">النوع</th>
                <th className="p-4">بيانات المريض</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-bold">{req.full_name}</td>
                  <td className="p-4">{req.phone}</td>
                  <td className="p-4">{REQUEST_TYPE_LABELS[req.request_type] || req.request_type}</td>
                  <td className="p-4 text-xs text-gray-600">
                    {req.city && <p>المدينة: {req.city}</p>}
                    {req.device && <p>الجهاز: {req.device}</p>}
                    {req.chronic_diseases && <p>أمراض: {req.chronic_diseases}</p>}
                    {req.symptoms && <p>أعراض: {req.symptoms}</p>}
                    {req.image_url && imageUrls[req.image_url] && (
                      <a href={imageUrls[req.image_url]} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">عرض الروشتة</a>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_LABELS[req.status]?.className}`}>{STATUS_LABELS[req.status]?.text}</span>
                  </td>
                  <td className="p-4 space-x-2 space-x-reverse">
                    <button onClick={() => statusMutation.mutate({ id: req.id, status: 'approved' })} disabled={statusMutation.isPending} className="text-green-600 font-bold ml-3">قبول</button>
                    <button onClick={() => statusMutation.mutate({ id: req.id, status: 'rejected' })} disabled={statusMutation.isPending} className="text-red-600 font-bold">رفض</button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !isError && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-bold">لا توجد طلبات حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
