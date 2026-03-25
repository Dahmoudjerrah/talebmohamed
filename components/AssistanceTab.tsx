
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
// 'use client';
 
// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from './AuthProvider';
 
// interface Assistance {
//   id: string;
//   date: string;
//   case_name: string;
//   reason: string | null;
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
//     reason: '',
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
//           reason: formData.reason || null,
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
//           reason: '',
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
//             {showForm ? '❌ إلغاء' : '➕ إضافة   مستفيد(ة)   جديدة'}
//           </button>
//         </div>
//       )}
 
//       {/* Add Form */}
//       {showForm && (
//         <form onSubmit={handleSubmit} className="mb-4 sm:mb-6 p-4 sm:p-6 bg-green-50 rounded-lg">
//           <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-900">تسجيل  مستفيد(ة) جديدة</h3>
 
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
//                 المستفيد(ة) *
//               </label>
//               <input
//                 type="text"
//                 value={formData.case_name}
//                 onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
//                 placeholder="مثال:  أحمد"
//                 className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
//                 required
//               />
//             </div>
 
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 السبب *
//               </label>
//               <input
//                 type="text"
//                 value={formData.reason}
//                 onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                 placeholder="مثال: مرض،  ..."
//                 className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
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
 
//             <div className="md:col-span-2">
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
//               <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right">المستفيد(ة)</th>
//               <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right">السبب</th>
//               <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-center">المبلغ</th>
//               <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-right hidden sm:table-cell">ملاحظة</th>
//               {isAdmin && <th className="border border-green-500 px-2 sm:px-4 py-2 sm:py-3 text-center">إجراءات</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {assistances.length === 0 ? (
//               <tr>
//                 <td colSpan={isAdmin ? 6 : 5} className="text-center py-6 sm:py-8 text-gray-500">
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
//                   <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-700">
//                     {assistance.reason || '-'}
//                   </td>
//                   <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-green-700">
//                     {assistance.amount.toFixed(2)} MRO
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

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  case_name: '',
  reason: '',
  amount: '',
  notes: ''
};

export default function AssistanceTab() {
  const [assistances, setAssistances] = useState<Assistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { isAdmin } = useAuth();

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

  // ===== ouvrir formulaire ajout =====
  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  // ===== ouvrir formulaire modification =====
  const openEditForm = (assistance: Assistance) => {
    setEditingId(assistance.id);
    setFormData({
      date: assistance.date,
      case_name: assistance.case_name,
      reason: assistance.reason || '',
      amount: assistance.amount.toString(),
      notes: assistance.notes || ''
    });
    setShowForm(true);
    // scroll vers le formulaire
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // ===== submit: ajout ou modification =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.case_name.trim() || !formData.amount) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const payload = {
      date: formData.date,
      case_name: formData.case_name,
      reason: formData.reason || null,
      amount: parseFloat(formData.amount),
      notes: formData.notes || null
    };

    try {
      if (editingId) {
        // --- UPDATE ---
        const { error } = await supabase
          .from('assistance')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        setAssistances(assistances.map(a =>
          a.id === editingId ? { ...a, ...payload } : a
        ));
      } else {
        // --- INSERT ---
        const { data, error } = await supabase
          .from('assistance')
          .insert([payload])
          .select();
        if (error) throw error;
        if (data) setAssistances([data[0], ...assistances]);
      }
      closeForm();
    } catch (error) {
      console.error('Error saving assistance:', error);
      alert('خطأ في حفظ المساعدة');
    }
  };

  // ===== suppression =====
  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const { error } = await supabase.from('assistance').delete().eq('id', deletingId);
      if (error) throw error;
      setAssistances(assistances.filter(a => a.id !== deletingId));
    } catch (error) {
      console.error('Error deleting assistance:', error);
      alert('خطأ في حذف المساعدة');
    } finally {
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div>
      {/* Add Button */}
      {isAdmin && (
        <div className="mb-4 sm:mb-6">
          <button
            onClick={showForm && !editingId ? closeForm : openAddForm}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
          >
            {showForm && !editingId ? '❌ إلغاء' : '➕ إضافة مستفيد(ة) جديدة'}
          </button>
        </div>
      )}

      {/* Form: Add or Edit */}
      {showForm && (
        <form onSubmit={handleSubmit} className={`mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg border-2 ${editingId ? 'bg-blue-50 border-blue-300' : 'bg-green-50 border-green-200'}`}>
          <h3 className={`text-base sm:text-lg font-semibold mb-4 ${editingId ? 'text-blue-900' : 'text-green-900'}`}>
            {editingId ? '✏️ تعديل المساعدة' : '➕ تسجيل  مستفيد(ة) جديد(ة)'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">التاريخ *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">المستفيد(ة) *</label>
              <input
                type="text"
                value={formData.case_name}
                onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
                placeholder="مثال: أسرة أحمد"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">السبب</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="مثال: مرض، وفاة، زواج..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">المبلغ (بالأوقية) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">ملاحظة</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="ملاحظات إضافية..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`px-4 sm:px-6 py-2 text-white rounded-lg transition-colors font-semibold text-sm sm:text-base ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {editingId ? '💾 حفظ التعديلات' : '✅ حفظ المساعدة'}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
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
                <tr
                  key={assistance.id}
                  className={`hover:bg-gray-50 ${editingId === assistance.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''}`}
                >
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
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-green-700" dir="ltr">
                    {assistance.amount.toFixed(2)} MRO
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-600 hidden sm:table-cell">
                    {assistance.notes || '-'}
                  </td>
                  {isAdmin && (
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        {/* Bouton Modifier */}
                        <button
                          onClick={() => openEditForm(assistance)}
                          className="px-2 sm:px-3 py-1 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs sm:text-sm font-semibold"
                        >
                          <span className="hidden sm:inline">✏️ تعديل</span>
                          <span className="inline sm:hidden">✏️</span>
                        </button>
                        {/* Bouton Supprimer */}
                        <button
                          onClick={() => { setDeletingId(assistance.id); setShowDeleteDialog(true); }}
                          className="px-2 sm:px-3 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs sm:text-sm font-semibold"
                        >
                          <span className="hidden sm:inline">🗑️ حذف</span>
                          <span className="inline sm:hidden">🗑️</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-600 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-700">هل أنت متأكد من حذف هذه المساعدة؟</p>
              <p className="text-sm text-red-600 mt-2 font-semibold">هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteDialog(false); setDeletingId(null); }}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                🗑️ حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}