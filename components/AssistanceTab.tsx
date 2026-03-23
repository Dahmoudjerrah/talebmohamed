
// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from './AuthProvider';

// interface Assistance {
//   id: string;
//   date: string;
//   case_name: string;
//   amount: number;
//   notes: string | null;
//   created_at: string;
// }

// export default function AssistanceTab() {
//   const [assistances, setAssistances] = useState<Assistance[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const { isAdmin } = useAuth();
  
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     case_name: '',
//     amount: '',
//     notes: ''
//   });

//   useEffect(() => {
//     fetchAssistances();
//   }, []);

//   const fetchAssistances = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('assistance')
//         .select('*')
//         .order('date', { ascending: false });

//       if (error) throw error;
//       setAssistances(data || []);
//     } catch (error) {
//       console.error('Error fetching assistances:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.case_name.trim() || !formData.amount) {
//       alert('يرجى ملء جميع الحقول المطلوبة');
//       return;
//     }

//     try {
//       const { data, error } = await supabase
//         .from('assistance')
//         .insert([{
//           date: formData.date,
//           case_name: formData.case_name,
//           amount: parseFloat(formData.amount),
//           notes: formData.notes || null
//         }])
//         .select();

//       if (error) throw error;

//       if (data) {
//         setAssistances([data[0], ...assistances]);
//         setFormData({
//           date: new Date().toISOString().split('T')[0],
//           case_name: '',
//           amount: '',
//           notes: ''
//         });
//         setShowForm(false);
//       }
//     } catch (error) {
//       console.error('Error adding assistance:', error);
//       alert('خطأ في إضافة المساعدة');
//     }
//   };

//   const deleteAssistance = async (id: string) => {
//     if (!confirm('هل أنت متأكد من حذف هذه المساعدة؟')) return;

//     try {
//       const { error } = await supabase
//         .from('assistance')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;
//       setAssistances(assistances.filter(a => a.id !== id));
//     } catch (error) {
//       console.error('Error deleting assistance:', error);
//       alert('خطأ في حذف المساعدة');
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">جاري التحميل...</div>;
//   }

//   return (
//     <div>
//       {/* Add Button - Only for Admin */}
//       {isAdmin && (
//         <div className="mb-4 sm:mb-6">
//           <button
//             onClick={() => setShowForm(!showForm)}
//             className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
//           >
//             {showForm ? '❌ إلغاء' : '➕ إضافة مساعدة جديدة'}
//           </button>
//         </div>
//       )}

//       {/* Add Form */}
//       {showForm && (
//         <form onSubmit={handleSubmit} className="mb-4 sm:mb-6 p-4 sm:p-6 bg-green-50 rounded-lg">
//           <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-900">تسجيل مساعدة جديدة</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 التاريخ *
//               </label>
//               <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                 className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 اسم الحالة *
//               </label>
//               <input
//                 type="text"
//                 value={formData.case_name}
//                 onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
//                 placeholder="مثال: عائلة أحمد"
//                 className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 المبلغ (بالأوقية) *
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                 placeholder="0.00"
//                 className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 ملاحظة
//               </label>
//               <input
//                 type="text"
//                 value={formData.notes}
//                 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                 placeholder="ملاحظات إضافية..."
//                 className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="mt-4 w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
//           >
//             حفظ المساعدة
//           </button>
//         </form>
//       )}

//       {/* Assistances Table */}
//       <div className="overflow-x-auto -mx-3 sm:mx-0">
//         <table className="w-full border-collapse text-xs sm:text-sm">
//           <thead>
//             <tr className="bg-green-600 text-white">
//               <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right">التاريخ</th>
//               <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right">اسم الحالة</th>
//               <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-center">المبلغ</th>
//               <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right hidden sm:table-cell">ملاحظة</th>
//               {isAdmin && <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-center">إجراءات</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {assistances.length === 0 ? (
//               <tr>
//                 <td colSpan={isAdmin ? 5 : 4} className="text-center py-6 sm:py-8 text-gray-500">
//                   لا توجد مساعدات مسجلة بعد
//                 </td>
//               </tr>
//             ) : (
//               assistances.map((assistance) => (
//                 <tr key={assistance.id} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3">
//                     <span className="hidden sm:inline">{new Date(assistance.date).toLocaleDateString('ar-MA')}</span>
//                     <span className="inline sm:hidden">{new Date(assistance.date).toLocaleDateString('ar-MA', { day: '2-digit', month: '2-digit' })}</span>
//                   </td>
//                   <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold">
//                     {assistance.case_name}
//                   </td>
//                   <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-green-700">
//                     {assistance.amount.toFixed(2)} MRU
//                   </td>
//                   <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 hidden sm:table-cell">
//                     {assistance.notes || '-'}
//                   </td>
//                   {isAdmin && (
//                     <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center">
//                       <button
//                         onClick={() => deleteAssistance(assistance.id)}
//                         className="px-2 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs sm:text-sm"
//                       >
//                         <span className="hidden sm:inline">🗑️ حذف</span>
//                         <span className="inline sm:hidden">🗑️</span>
//                       </button>
//                     </td>
//                   )}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
'use client';
 
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';
 
interface Assistance {
  id: string;
  date: string;
  case_name: string;
  reason: string | null;
  amount: number;
  notes: string | null;
  created_at: string;
}
 
export default function AssistanceTab() {
  const [assistances, setAssistances] = useState<Assistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { isAdmin } = useAuth();
 
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    case_name: '',
    reason: '',
    amount: '',
    notes: ''
  });
 
  useEffect(() => {
    fetchAssistances();
  }, []);
 
  const fetchAssistances = async () => {
    try {
      const { data, error } = await supabase
        .from('assistance')
        .select('*')
        .order('date', { ascending: false });
 
      if (error) throw error;
      setAssistances(data || []);
    } catch (error) {
      console.error('Error fetching assistances:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!formData.case_name.trim() || !formData.amount) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
 
    try {
      const { data, error } = await supabase
        .from('assistance')
        .insert([{
          date: formData.date,
          case_name: formData.case_name,
          reason: formData.reason || null,
          amount: parseFloat(formData.amount),
          notes: formData.notes || null
        }])
        .select();
 
      if (error) throw error;
 
      if (data) {
        setAssistances([data[0], ...assistances]);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          case_name: '',
          reason: '',
          amount: '',
          notes: ''
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding assistance:', error);
      alert('خطأ في إضافة المساعدة');
    }
  };
 
  const deleteAssistance = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المساعدة؟')) return;
 
    try {
      const { error } = await supabase
        .from('assistance')
        .delete()
        .eq('id', id);
 
      if (error) throw error;
      setAssistances(assistances.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting assistance:', error);
      alert('خطأ في حذف المساعدة');
    }
  };
 
  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }
 
  return (
    <div>
      {/* Add Button - Only for Admin */}
      {isAdmin && (
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
          >
            {showForm ? '❌ إلغاء' : '➕ إضافة مساعدة جديدة'}
          </button>
        </div>
      )}
 
      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 sm:mb-6 p-4 sm:p-6 bg-green-50 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-900">تسجيل مساعدة جديدة</h3>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                التاريخ *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
 
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                المستفيد(ة) *
              </label>
              <input
                type="text"
                value={formData.case_name}
                onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
                placeholder="مثال: أسرة أحمد"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
 
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                السبب *
              </label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="مثال: مرض، وفاة، زواج..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
 
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                المبلغ (بالأوقية) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
 
            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                ملاحظة
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="ملاحظات إضافية..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
 
          <button
            type="submit"
            className="mt-4 w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
          >
            حفظ المساعدة
          </button>
        </form>
      )}
 
      {/* Assistances Table */}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right">التاريخ</th>
              <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right">المستفيد(ة)</th>
              <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right">السبب</th>
              <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-center">المبلغ</th>
              <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right hidden sm:table-cell">ملاحظة</th>
              {isAdmin && <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-center">إجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {assistances.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="text-center py-6 sm:py-8 text-gray-500">
                  لا توجد مساعدات مسجلة بعد
                </td>
              </tr>
            ) : (
              assistances.map((assistance) => (
                <tr key={assistance.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3">
                    <span className="hidden sm:inline">{new Date(assistance.date).toLocaleDateString('ar-MA')}</span>
                    <span className="inline sm:hidden">{new Date(assistance.date).toLocaleDateString('ar-MA', { day: '2-digit', month: '2-digit' })}</span>
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold">
                    {assistance.case_name}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-700">
                    {assistance.reason || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-green-700">
                    {assistance.amount.toFixed(2)} MRO
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 hidden sm:table-cell">
                    {assistance.notes || '-'}
                  </td>
                  {isAdmin && (
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center">
                      <button
                        onClick={() => deleteAssistance(assistance.id)}
                        className="px-2 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">🗑️ حذف</span>
                        <span className="inline sm:hidden">🗑️</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}