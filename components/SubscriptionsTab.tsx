
// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from './AuthProvider';

// interface Member {
//   id: string;
//   name: string;
// }

// interface Subscription {
//   id: string;
//   member_id: string;
//   month: number;
//   year: number;
//   paid: boolean;
//   amount_paid: number | null;
// }

// const MONTHS = [
//   'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
//   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
// ];

// const AMOUNT_OPTIONS = [500, 1000, 1500, 2000];

// export default function SubscriptionsTab() {
//   const [members, setMembers] = useState<Member[]>([]);
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [newMemberName, setNewMemberName] = useState('');
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [loading, setLoading] = useState(true);
//   const { isAdmin } = useAuth();

//   // Custom confirmation dialog state
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [confirmMessage, setConfirmMessage] = useState('');
//   const [pendingUpdate, setPendingUpdate] = useState<{
//     memberId: string;
//     month: number;
//     amount: number | null;
//   } | null>(null);

//   // Custom amount input for monthly payment
//   const [showCustomInput, setShowCustomInput] = useState<{[key: string]: boolean}>({});
//   const [customPaymentAmount, setCustomPaymentAmount] = useState<{[key: string]: string}>({});

//   // Edit member name
//   const [showEditNameDialog, setShowEditNameDialog] = useState(false);
//   const [editingMember, setEditingMember] = useState<Member | null>(null);
//   const [newMemberNameEdit, setNewMemberNameEdit] = useState('');

//   // Delete member confirmation
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

//   useEffect(() => {
//     fetchData();
//   }, [selectedYear]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const { data: membersData, error: membersError } = await supabase
//         .from('members')
//         .select('id, name, created_at')
//         .order('created_at', { ascending: true });

//       if (membersError) throw membersError;
//       setMembers(membersData || []);

//       const { data: subscriptionsData, error: subscriptionsError } = await supabase
//         .from('subscriptions')
//         .select('*')
//         .eq('year', selectedYear);

//       if (subscriptionsError) throw subscriptionsError;
//       setSubscriptions(subscriptionsData || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addMember = async () => {
//     if (!newMemberName.trim()) return;

//     try {
//       const { data, error } = await supabase
//         .from('members')
//         .insert([{ name: newMemberName.trim() }])
//         .select();

//       if (error) throw error;

//       if (data) {
//         setMembers([...members, data[0]]);
//         setNewMemberName('');
//       }
//     } catch (error) {
//       console.error('Error adding member:', error);
//       alert('خطأ في إضافة الأسرة');
//     }
//   };

//   const requestConfirmation = (
//     memberId: string,
//     month: number,
//     amountPaid: number | null,
//     previousAmount: number | null
//   ) => {
//     const wasPaid = previousAmount !== null && previousAmount > 0;
//     const willBePaid = amountPaid !== null && amountPaid > 0;

//     const member = members.find(m => m.id === memberId);
//     const memberName = member?.name || 'الأسرة';
//     const monthName = MONTHS[month - 1];

//     let message = '';

//     if (wasPaid && !willBePaid) {
//       message = `⚠️ هل أنت متأكد من تغيير حالة ${memberName} في شهر ${monthName} من "${previousAmount} MRO" إلى "لم تدفع"؟`;
//     } else if (!wasPaid && willBePaid) {
//       message = `✅ هل أنت متأكد من تسجيل دفع ${amountPaid} MRO لـ ${memberName} في شهر ${monthName}؟`;
//     } else if (wasPaid && willBePaid && previousAmount !== amountPaid) {
//       message = `🔄 هل أنت متأكد من تغيير مبلغ ${memberName} في شهر ${monthName} من ${previousAmount} MRO إلى ${amountPaid} MRO؟`;
//     }

//     if (message) {
//       setConfirmMessage(message);
//       setPendingUpdate({ memberId, month, amount: amountPaid });
//       setShowConfirmDialog(true);
//     } else {
//       executeUpdate(memberId, month, amountPaid);
//     }
//   };

//   const executeUpdate = async (memberId: string, month: number, amountPaid: number | null) => {
//     try {
//       const existing = subscriptions.find(
//         s => s.member_id === memberId && s.month === month && s.year === selectedYear
//       );

//       const paid = amountPaid !== null && amountPaid > 0;

//       if (existing) {
//         const { error } = await supabase
//           .from('subscriptions')
//           .update({ paid, amount_paid: amountPaid })
//           .eq('id', existing.id);

//         if (error) throw error;

//         setSubscriptions(subscriptions.map(s =>
//           s.id === existing.id
//             ? { ...s, paid, amount_paid: amountPaid }
//             : s
//         ));
//       } else {
//         const { data, error } = await supabase
//           .from('subscriptions')
//           .insert([{ member_id: memberId, month, year: selectedYear, paid, amount_paid: amountPaid }])
//           .select();

//         if (error) throw error;
//         if (data) setSubscriptions([...subscriptions, data[0]]);
//       }
//     } catch (error) {
//       console.error('Error updating payment:', error);
//       alert('خطأ في تحديث الدفع');
//     }
//   };

//   const handleConfirm = () => {
//     if (pendingUpdate) {
//       executeUpdate(pendingUpdate.memberId, pendingUpdate.month, pendingUpdate.amount);
//     }
//     setShowConfirmDialog(false);
//     setPendingUpdate(null);
//   };

//   const handleCancel = () => {
//     setShowConfirmDialog(false);
//     setPendingUpdate(null);
//   };

//   const getPaymentAmount = (memberId: string, month: number): number | null => {
//     const sub = subscriptions.find(
//       s => s.member_id === memberId && s.month === month && s.year === selectedYear
//     );
//     return sub?.amount_paid ?? null;
//   };

//   const getMemberYearTotal = (memberId: string) => {
//     return subscriptions
//       .filter(s => s.member_id === memberId && s.year === selectedYear && s.paid)
//       .reduce((sum, s) => sum + (s.amount_paid || 0), 0);
//   };

//   const getMemberPaidMonths = (memberId: string) => {
//     return subscriptions.filter(
//       s => s.member_id === memberId && s.year === selectedYear && s.paid
//     ).length;
//   };

//   const hasPaidAnyMonth = (memberId: string): boolean => {
//     return subscriptions.some(s => s.member_id === memberId && s.paid);
//   };

//   const openEditNameDialog = (member: Member) => {
//     setEditingMember(member);
//     setNewMemberNameEdit(member.name);
//     setShowEditNameDialog(true);
//   };

//   const handleEditName = async () => {
//     if (!editingMember || !newMemberNameEdit.trim()) {
//       alert('يرجى إدخال اسم صحيح');
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .from('members')
//         .update({ name: newMemberNameEdit.trim() })
//         .eq('id', editingMember.id);

//       if (error) throw error;

//       setMembers(members.map(m =>
//         m.id === editingMember.id ? { ...m, name: newMemberNameEdit.trim() } : m
//       ));

//       setShowEditNameDialog(false);
//       setEditingMember(null);
//       setNewMemberNameEdit('');
//     } catch (error) {
//       console.error('Error updating member name:', error);
//       alert('خطأ في تعديل الاسم');
//     }
//   };

//   const handleDeleteMember = async (member: Member) => {
//     if (hasPaidAnyMonth(member.id)) {
//       alert('⚠️ لا يمكن حذف أسرة لديها دفعات مسجلة');
//       return;
//     }
//     setMemberToDelete(member);
//     setShowDeleteDialog(true);
//   };

//   const confirmDelete = async () => {
//     if (!memberToDelete) return;

//     try {
//       const { error } = await supabase
//         .from('members')
//         .delete()
//         .eq('id', memberToDelete.id);

//       if (error) throw error;

//       setMembers(members.filter(m => m.id !== memberToDelete.id));
//       setShowDeleteDialog(false);
//       setMemberToDelete(null);
//     } catch (error) {
//       console.error('Error deleting member:', error);
//       alert('خطأ في حذف الأسرة');
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteDialog(false);
//     setMemberToDelete(null);
//   };

//   if (loading) {
//     return <div className="text-center py-8">جاري التحميل...</div>;
//   }

//   return (
//     <div>
//       {/* Year Selector */}
//       <div className="mb-4 sm:mb-6 flex items-center gap-3 flex-wrap">
//         <span className="text-sm font-semibold text-gray-700">📅 السنة:</span>
//         <div className="flex gap-2 flex-wrap">
//           {years.map(year => (
//             <button
//               key={year}
//               onClick={() => setSelectedYear(year)}
//               className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${
//                 selectedYear === year
//                   ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
//                   : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'
//               }`}
//             >
//               {year}
//             </button>
//           ))}
//         </div>
//         <span className="text-xs text-gray-500 bg-indigo-50 px-2 py-1 rounded">
//           عرض بيانات سنة {selectedYear}
//         </span>
//       </div>

//       {/* Add Member Form */}
//       {isAdmin && (
//         <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
//           <h3 className="text-base sm:text-lg font-semibold mb-3 text-indigo-900">➕ إضافة أسرة جديدة</h3>
//           <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//             <input
//               type="text"
//               value={newMemberName}
//               onChange={(e) => setNewMemberName(e.target.value)}
//               placeholder="اسم الأسرة"
//               className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
//               onKeyPress={(e) => e.key === 'Enter' && addMember()}
//             />
//             <button
//               onClick={addMember}
//               className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm sm:text-base"
//             >
//               إضافة الأسرة
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Subscriptions Table */}
//       <div className="overflow-x-auto -mx-3 sm:mx-0">
//         <div className="inline-block min-w-full align-middle">
//           <table className="w-full border-collapse text-xs sm:text-sm">
//             <thead>
//               <tr className="bg-indigo-600 text-white">
//                 <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-right sticky right-0 bg-indigo-600 z-10 min-w-[120px] sm:min-w-[160px]">
//                   الأسرة
//                 </th>
//                 {MONTHS.map((month, index) => (
//                   <th key={index} className="border border-indigo-500 px-1 sm:px-2 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[105px]">
//                     <div className="text-[10px] sm:text-xs font-bold">{month}</div>
//                     <div className="text-[9px] sm:text-[10px] opacity-75">{selectedYear}</div>
//                   </th>
//                 ))}
//                 <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[70px] sm:min-w-[110px]">
//                   <div className="text-[10px] sm:text-xs font-bold">المجموع</div>
//                   <div className="text-[9px] sm:text-[10px] opacity-75">(MRO)</div>
//                 </th>
//                 {isAdmin && (
//                   <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[80px] sm:min-w-[100px]">
//                     <div className="text-[10px] sm:text-xs font-bold">إجراءات</div>
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {members.length === 0 ? (
//                 <tr>
//                   <td colSpan={isAdmin ? 15 : 14} className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
//                     لا توجد أسر. قم بإضافة أسرة جديدة أعلاه.
//                   </td>
//                 </tr>
//               ) : (
//                 members.map((member) => (
//                   <tr key={member.id} className="hover:bg-gray-50">
//                     <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 sticky right-0 bg-white z-10">
//                       <span className="block font-semibold text-[10px] sm:text-sm max-w-[120px] sm:max-w-[160px] break-words leading-tight">
//                         {member.name}
//                       </span>
//                     </td>
//                     {MONTHS.map((_, monthIndex) => {
//                       const amountPaid = getPaymentAmount(member.id, monthIndex + 1);
//                       const cellKey = `${member.id}-${monthIndex + 1}`;
//                       const isCustom = showCustomInput[cellKey];

//                       const predefinedAmounts = [500, 1000, 1500, 2000];
//                       const isCustomAmount = amountPaid && !predefinedAmounts.includes(amountPaid);

//                       return (
//                         <td key={monthIndex} className="border border-gray-300 p-1 text-center">
//                           {isCustom ? (
//                             <div className="flex flex-col gap-1">
//                               <input
//                                 type="number"
//                                 value={customPaymentAmount[cellKey] || ''}
//                                 onChange={(e) => setCustomPaymentAmount({
//                                   ...customPaymentAmount,
//                                   [cellKey]: e.target.value
//                                 })}
//                                 placeholder="المبلغ"
//                                 className="w-full py-1 px-1 rounded-md text-[9px] sm:text-xs border-2 border-orange-400 focus:ring-2 focus:ring-orange-500"
//                                 autoFocus
//                               />
//                               <div className="flex gap-1">
//                                 <button
//                                   onClick={() => {
//                                     const amount = parseFloat(customPaymentAmount[cellKey] || '0');
//                                     if (amount > 0) {
//                                       requestConfirmation(member.id, monthIndex + 1, amount, amountPaid);
//                                       setShowCustomInput({ ...showCustomInput, [cellKey]: false });
//                                       setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
//                                     } else {
//                                       alert('يرجى إدخال مبلغ صحيح');
//                                     }
//                                   }}
//                                   className="flex-1 py-1 px-1 bg-green-500 text-white rounded text-[8px] sm:text-xs font-bold"
//                                 >
//                                   ✓
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setShowCustomInput({ ...showCustomInput, [cellKey]: false });
//                                     setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
//                                   }}
//                                   className="flex-1 py-1 px-1 bg-red-500 text-white rounded text-[8px] sm:text-xs font-bold"
//                                 >
//                                   ✕
//                                 </button>
//                               </div>
//                             </div>
//                           ) : isCustomAmount ? (
//                             <div className="flex flex-col gap-1">
//                               <div className="bg-blue-500 text-white py-1.5 px-2 rounded-md text-[9px] sm:text-xs font-bold">
//                                 {amountPaid}
//                               </div>
//                               {isAdmin && (
//                                 <button
//                                   onClick={() => {
//                                     setShowCustomInput({ ...showCustomInput, [cellKey]: true });
//                                     setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: amountPaid?.toString() || '' });
//                                   }}
//                                   className="text-[8px] sm:text-xs text-blue-600 hover:text-blue-800 font-semibold"
//                                 >
//                                   ✏️ تعديل
//                                 </button>
//                               )}
//                             </div>
//                           ) : (
//                             <select
//                               value={amountPaid ?? ''}
//                               onChange={(e) => {
//                                 const value = e.target.value;
//                                 if (value === 'custom') {
//                                   setShowCustomInput({ ...showCustomInput, [cellKey]: true });
//                                 } else {
//                                   const newAmount = value === '' ? null : parseFloat(value);
//                                   if (isAdmin) {
//                                     requestConfirmation(member.id, monthIndex + 1, newAmount, amountPaid);
//                                   }
//                                 }
//                               }}
//                               disabled={!isAdmin}
//                               className={`w-full py-1.5 px-1 rounded-md text-[9px] sm:text-xs font-bold border-2 transition-all ${
//                                 amountPaid && amountPaid > 0
//                                   ? 'bg-green-50 text-green-800 border-green-400'
//                                   : 'bg-red-50 text-red-700 border-red-300'
//                               } ${!isAdmin ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
//                             >
//                               <option value="">لم تدفع</option>
//                               <option value="500">500</option>
//                               <option value="1000">1000</option>
//                               <option value="1500">1500</option>
//                               <option value="2000">2000</option>
//                               <option value="custom">أكثر...</option>
//                             </select>
//                           )}
//                         </td>
//                       );
//                     })}
//                     <td className="border border-gray-300 px-1 sm:px-4 py-2 sm:py-3 text-center">
//                       <div className="font-bold text-indigo-900 text-[10px] sm:text-sm">
//                         {getMemberYearTotal(member.id).toFixed(0)} MRO
//                       </div>
//                       <div className="text-[9px] sm:text-xs text-gray-600">
//                         ({getMemberPaidMonths(member.id)} أشهر)
//                       </div>
//                     </td>
//                     {isAdmin && (
//                       <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-center">
//                         <div className="flex flex-col gap-1">
//                           <button
//                             onClick={() => openEditNameDialog(member)}
//                             className="w-full py-1.5 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-[9px] sm:text-xs font-bold"
//                           >
//                             ✏️ تعديل
//                           </button>
//                           {!hasPaidAnyMonth(member.id) && (
//                             <button
//                               onClick={() => handleDeleteMember(member)}
//                               className="w-full py-1.5 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-[9px] sm:text-xs font-bold"
//                             >
//                               🗑️ حذف
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Custom Confirmation Dialog */}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-4">❓</div>
//               <p className="text-base sm:text-lg text-gray-800 leading-relaxed">{confirmMessage}</p>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={handleCancel} className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base">
//                 إلغاء
//               </button>
//               <button onClick={handleConfirm} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm sm:text-base">
//                 تأكيد
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Member Name Dialog */}
//       {showEditNameDialog && editingMember && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-4">✏️</div>
//               <h3 className="text-xl font-bold text-gray-800 mb-4">تعديل اسم الأسرة</h3>
//               <div className="text-sm text-gray-600 mb-4">
//                 الاسم الحالي: <span className="font-semibold">{editingMember.name}</span>
//               </div>
//               <input
//                 type="text"
//                 value={newMemberNameEdit}
//                 onChange={(e) => setNewMemberNameEdit(e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
//                 placeholder="الاسم الجديد"
//                 autoFocus
//                 onKeyPress={(e) => e.key === 'Enter' && handleEditName()}
//               />
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => { setShowEditNameDialog(false); setEditingMember(null); setNewMemberNameEdit(''); }}
//                 className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base"
//               >
//                 إلغاء
//               </button>
//               <button onClick={handleEditName} className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm sm:text-base">
//                 حفظ
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Member Confirmation Dialog */}
//       {showDeleteDialog && memberToDelete && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-5xl mb-4">⚠️</div>
//               <h3 className="text-xl font-bold text-red-600 mb-4">تأكيد الحذف</h3>
//               <p className="text-base text-gray-800 leading-relaxed mb-2">هل أنت متأكد من حذف الأسرة</p>
//               <p className="text-lg font-bold text-gray-900 mb-4">"{memberToDelete.name}"؟</p>
//               <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
//                 <p className="text-sm text-red-700 font-semibold">⚠️ هذا الإجراء لا يمكن التراجع عنه</p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={cancelDelete} className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base">
//                 إلغاء
//               </button>
//               <button onClick={confirmDelete} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base">
//                 حذف
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from './AuthProvider';

// interface Member {
//   id: string;
//   name: string;
// }

// interface Subscription {
//   id: string;
//   member_id: string;
//   month: number;
//   year: number;
//   paid: boolean;
//   amount_paid: number | null;
// }

// // جدول مستقل لحفظ الدفعات السنوية المجمّعة
// interface YearlyPayment {
//   id: string;
//   year: number;
//   total_amount: number;
//   created_at: string;
// }

// const MONTHS = [
//   'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
//   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
// ];

// export default function SubscriptionsTab() {
//   const [members, setMembers] = useState<Member[]>([]);
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [newMemberName, setNewMemberName] = useState('');
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [loading, setLoading] = useState(true);
//   const { isAdmin } = useAuth();

//   // دفع سنوي مجمّع
//   const [yearlyAmount, setYearlyAmount] = useState('');
//   const [yearlyPayLoading, setYearlyPayLoading] = useState(false);
//   const [savedYearlyAmount, setSavedYearlyAmount] = useState<number | null>(null);
//   const [editingYearly, setEditingYearly] = useState(false);

//   // Dialogs
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [confirmMessage, setConfirmMessage] = useState('');
//   const [pendingUpdate, setPendingUpdate] = useState<{
//     memberId: string; month: number; amount: number | null;
//   } | null>(null);

//   const [showCustomInput, setShowCustomInput] = useState<{[key: string]: boolean}>({});
//   const [customPaymentAmount, setCustomPaymentAmount] = useState<{[key: string]: string}>({});

//   const [showEditNameDialog, setShowEditNameDialog] = useState(false);
//   const [editingMember, setEditingMember] = useState<Member | null>(null);
//   const [newMemberNameEdit, setNewMemberNameEdit] = useState('');

//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

//   const currentYear = new Date().getFullYear();
//   const isPastYear = selectedYear < currentYear;
//   const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

//   useEffect(() => {
//     fetchData();
//   }, [selectedYear]);

//   const fetchData = async () => {
//     setLoading(true);
//     setSavedYearlyAmount(null);
//     setEditingYearly(false);
//     setYearlyAmount('');

//     try {
//       const { data: membersData } = await supabase
//         .from('members')
//         .select('id, name, created_at')
//         .order('created_at', { ascending: true });
//       setMembers(membersData || []);

//       if (!isPastYear || selectedYear >= currentYear) {
//         // السنة الحالية: نحمّل الاشتراكات الشهرية
//         const { data: subscriptionsData } = await supabase
//           .from('subscriptions')
//           .select('*')
//           .eq('year', selectedYear);
//         setSubscriptions(subscriptionsData || []);
//       } else {
//         // السنة السابقة: نحمّل الدفع السنوي المجمّع
//         const { data: yearlyData } = await supabase
//           .from('yearly_payments')
//           .select('*')
//           .eq('year', selectedYear)
//           .maybeSingle();

//         if (yearlyData) {
//           setSavedYearlyAmount(yearlyData.total_amount);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===== حفظ الدفع السنوي =====
//   const handleSaveYearlyPayment = async () => {
//     const amount = parseFloat(yearlyAmount);
//     if (isNaN(amount) || amount <= 0) {
//       alert('يرجى إدخال مبلغ صحيح');
//       return;
//     }
//     setYearlyPayLoading(true);
//     try {
//       // نتحقق إذا يوجد سجل لهذه السنة
//       const { data: existing } = await supabase
//         .from('yearly_payments')
//         .select('*')
//         .eq('year', selectedYear)
//         .maybeSingle();

//       if (existing) {
//         await supabase
//           .from('yearly_payments')
//           .update({ total_amount: amount })
//           .eq('year', selectedYear);
//       } else {
//         await supabase
//           .from('yearly_payments')
//           .insert([{ year: selectedYear, total_amount: amount }]);
//       }

//       setSavedYearlyAmount(amount);
//       setEditingYearly(false);
//       setYearlyAmount('');
//     } catch (error) {
//       console.error('Error saving yearly payment:', error);
//       alert('خطأ في حفظ الدفع السنوي');
//     } finally {
//       setYearlyPayLoading(false);
//     }
//   };

//   // ===== دفع شهري =====
//   const addMember = async () => {
//     if (!newMemberName.trim()) return;
//     try {
//       const { data, error } = await supabase
//         .from('members')
//         .insert([{ name: newMemberName.trim() }])
//         .select();
//       if (error) throw error;
//       if (data) { setMembers([...members, data[0]]); setNewMemberName(''); }
//     } catch (error) {
//       alert('خطأ في إضافة الأسرة');
//     }
//   };

//   const requestConfirmation = (memberId: string, month: number, amountPaid: number | null, previousAmount: number | null) => {
//     const wasPaid = previousAmount !== null && previousAmount > 0;
//     const willBePaid = amountPaid !== null && amountPaid > 0;
//     const member = members.find(m => m.id === memberId);
//     const monthName = MONTHS[month - 1];
//     let message = '';
//     if (wasPaid && !willBePaid) message = `⚠️ هل أنت متأكد من تغيير حالة ${member?.name} في شهر ${monthName} من "${previousAmount} MRO" إلى "لم تدفع"؟`;
//     else if (!wasPaid && willBePaid) message = `✅ هل أنت متأكد من تسجيل دفع ${amountPaid} MRO لـ ${member?.name} في شهر ${monthName}؟`;
//     else if (wasPaid && willBePaid && previousAmount !== amountPaid) message = `🔄 تغيير مبلغ ${member?.name} في ${monthName} من ${previousAmount} إلى ${amountPaid} MRO؟`;
//     if (message) { setConfirmMessage(message); setPendingUpdate({ memberId, month, amount: amountPaid }); setShowConfirmDialog(true); }
//     else executeUpdate(memberId, month, amountPaid);
//   };

//   const executeUpdate = async (memberId: string, month: number, amountPaid: number | null) => {
//     try {
//       const existing = subscriptions.find(s => s.member_id === memberId && s.month === month && s.year === selectedYear);
//       const paid = amountPaid !== null && amountPaid > 0;
//       if (existing) {
//         const { error } = await supabase.from('subscriptions').update({ paid, amount_paid: amountPaid }).eq('id', existing.id);
//         if (error) throw error;
//         setSubscriptions(subscriptions.map(s => s.id === existing.id ? { ...s, paid, amount_paid: amountPaid } : s));
//       } else {
//         const { data, error } = await supabase.from('subscriptions').insert([{ member_id: memberId, month, year: selectedYear, paid, amount_paid: amountPaid }]).select();
//         if (error) throw error;
//         if (data) setSubscriptions([...subscriptions, data[0]]);
//       }
//     } catch (error) { alert('خطأ في تحديث الدفع'); }
//   };

//   const handleConfirm = () => { if (pendingUpdate) executeUpdate(pendingUpdate.memberId, pendingUpdate.month, pendingUpdate.amount); setShowConfirmDialog(false); setPendingUpdate(null); };

//   const getPaymentAmount = (memberId: string, month: number) => subscriptions.find(s => s.member_id === memberId && s.month === month && s.year === selectedYear)?.amount_paid ?? null;
//   const getMemberYearTotal = (memberId: string) => subscriptions.filter(s => s.member_id === memberId && s.year === selectedYear && s.paid).reduce((sum, s) => sum + (s.amount_paid || 0), 0);
//   const getMemberPaidMonths = (memberId: string) => subscriptions.filter(s => s.member_id === memberId && s.year === selectedYear && s.paid).length;
//   const hasPaidAnyMonth = (memberId: string) => subscriptions.some(s => s.member_id === memberId && s.paid);

//   const openEditNameDialog = (member: Member) => { setEditingMember(member); setNewMemberNameEdit(member.name); setShowEditNameDialog(true); };
//   const handleEditName = async () => {
//     if (!editingMember || !newMemberNameEdit.trim()) return;
//     try {
//       const { error } = await supabase.from('members').update({ name: newMemberNameEdit.trim() }).eq('id', editingMember.id);
//       if (error) throw error;
//       setMembers(members.map(m => m.id === editingMember.id ? { ...m, name: newMemberNameEdit.trim() } : m));
//       setShowEditNameDialog(false); setEditingMember(null); setNewMemberNameEdit('');
//     } catch { alert('خطأ في تعديل الاسم'); }
//   };

//   const handleDeleteMember = (member: Member) => {
//     if (hasPaidAnyMonth(member.id)) { alert('⚠️ لا يمكن حذف أسرة لديها دفعات مسجلة'); return; }
//     setMemberToDelete(member); setShowDeleteDialog(true);
//   };
//   const confirmDelete = async () => {
//     if (!memberToDelete) return;
//     try {
//       const { error } = await supabase.from('members').delete().eq('id', memberToDelete.id);
//       if (error) throw error;
//       setMembers(members.filter(m => m.id !== memberToDelete.id));
//       setShowDeleteDialog(false); setMemberToDelete(null);
//     } catch { alert('خطأ في حذف الأسرة'); }
//   };

//   if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

//   return (
//     <div>
//       {/* Year Selector */}
//       <div className="mb-4 sm:mb-6 flex items-center gap-3 flex-wrap">
//         <span className="text-sm font-semibold text-gray-700">📅 السنة:</span>
//         <div className="flex gap-2 flex-wrap">
//           {years.map(year => (
//             <button key={year} onClick={() => setSelectedYear(year)}
//               className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${selectedYear === year ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'}`}>
//               {year}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ======================================================= */}
//       {/* السنوات السابقة: واجهة مستقلة بدون أشهر ولا أسماء أسر  */}
//       {/* ======================================================= */}
//       {isPastYear ? (
//         <div className="max-w-lg mx-auto">
//           <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 shadow-md">
//             {/* عنوان */}
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-2">📅</div>
//               <h3 className="text-xl font-bold text-amber-800">مجموع اشتراكات سنة {selectedYear}</h3>
//               <p className="text-sm text-amber-600 mt-1">المبلغ الإجمالي الذي تم تحصيله في هذه السنة</p>
//             </div>

//             {/* إذا يوجد مبلغ محفوظ */}
//             {savedYearlyAmount !== null && !editingYearly ? (
//               <div className="text-center">
//                 <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-sm mb-4">
//                   <p className="text-sm text-gray-500 mb-1">المبلغ المسجّل</p>
//                   <p className="text-4xl font-bold text-green-600" dir="ltr">
//                     {savedYearlyAmount.toLocaleString()} MRO
//                   </p>
//                 </div>
//                 {isAdmin && (
//                   <button
//                     onClick={() => { setEditingYearly(true); setYearlyAmount(savedYearlyAmount.toString()); }}
//                     className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold text-sm"
//                   >
//                     ✏️ تعديل المبلغ
//                   </button>
//                 )}
//               </div>
//             ) : isAdmin ? (
//               /* نموذج إدخال المبلغ */
//               <div>
//                 <label className="block text-sm font-bold text-amber-800 mb-2 text-center">
//                   أدخل المبلغ الإجمالي لسنة {selectedYear}
//                 </label>
//                 <input
//                   type="number"
//                   value={yearlyAmount}
//                   onChange={(e) => setYearlyAmount(e.target.value)}
//                   placeholder="مثال: 120000"
//                   className="w-full px-4 py-4 border-2 border-amber-400 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-2xl font-bold text-center mb-4"
//                   autoFocus
//                 />
//                 <div className="flex gap-3">
//                   {editingYearly && (
//                     <button
//                       onClick={() => { setEditingYearly(false); setYearlyAmount(''); }}
//                       className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
//                     >
//                       إلغاء
//                     </button>
//                   )}
//                   <button
//                     onClick={handleSaveYearlyPayment}
//                     disabled={yearlyPayLoading || !yearlyAmount}
//                     className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 text-lg"
//                   >
//                     {yearlyPayLoading ? '⏳ جاري الحفظ...' : '✅ تأكيد وإضافة للرصيد'}
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               /* زائر: لا يوجد مبلغ مسجّل */
//               <div className="text-center py-4 text-gray-500">
//                 لم يتم تسجيل مبلغ لهذه السنة بعد
//               </div>
//             )}
//           </div>
//         </div>

//       ) : (
//         /* ======================================================= */
//         /* السنة الحالية: جدول شهري عادي                           */
//         /* ======================================================= */
//         <>
//           {/* Add Member Form */}
//           {isAdmin && (
//             <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
//               <h3 className="text-base sm:text-lg font-semibold mb-3 text-indigo-900">➕ إضافة أسرة جديدة</h3>
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//                 <input
//                   type="text"
//                   value={newMemberName}
//                   onChange={(e) => setNewMemberName(e.target.value)}
//                   placeholder="اسم الأسرة"
//                   className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
//                   onKeyPress={(e) => e.key === 'Enter' && addMember()}
//                 />
//                 <button onClick={addMember} className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm sm:text-base">
//                   إضافة الأسرة
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Monthly Table */}
//           <div className="overflow-x-auto -mx-3 sm:mx-0">
//             <div className="inline-block min-w-full align-middle">
//               <table className="w-full border-collapse text-xs sm:text-sm">
//                 <thead>
//                   <tr className="bg-indigo-600 text-white">
//                     <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-right sticky right-0 bg-indigo-600 z-10 min-w-[120px] sm:min-w-[160px]">الأسرة</th>
//                     {MONTHS.map((month, index) => (
//                       <th key={index} className="border border-indigo-500 px-1 sm:px-2 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[105px]">
//                         <div className="text-[10px] sm:text-xs font-bold">{month}</div>
//                         <div className="text-[9px] sm:text-[10px] opacity-75">{selectedYear}</div>
//                       </th>
//                     ))}
//                     <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[70px] sm:min-w-[110px]">
//                       <div className="text-[10px] sm:text-xs font-bold">المجموع</div>
//                       <div className="text-[9px] sm:text-[10px] opacity-75">(MRO)</div>
//                     </th>
//                     {isAdmin && <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[80px]">إجراءات</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {members.length === 0 ? (
//                     <tr><td colSpan={isAdmin ? 15 : 14} className="text-center py-8 text-gray-500">لا توجد أسر. قم بإضافة أسرة جديدة أعلاه.</td></tr>
//                   ) : (
//                     members.map((member) => (
//                       <tr key={member.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 sticky right-0 bg-white z-10">
//                           <span className="block font-semibold text-[10px] sm:text-sm break-words">{member.name}</span>
//                         </td>
//                         {MONTHS.map((_, monthIndex) => {
//                           const amountPaid = getPaymentAmount(member.id, monthIndex + 1);
//                           const cellKey = `${member.id}-${monthIndex + 1}`;
//                           const isCustom = showCustomInput[cellKey];
//                           const predefinedAmounts = [500, 1000, 1500, 2000];
//                           const isCustomAmount = amountPaid && !predefinedAmounts.includes(amountPaid);
//                           return (
//                             <td key={monthIndex} className="border border-gray-300 p-1 text-center">
//                               {isCustom ? (
//                                 <div className="flex flex-col gap-1">
//                                   <input type="number" value={customPaymentAmount[cellKey] || ''} onChange={(e) => setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: e.target.value })} placeholder="المبلغ" className="w-full py-1 px-1 rounded-md text-[9px] sm:text-xs border-2 border-orange-400" autoFocus />
//                                   <div className="flex gap-1">
//                                     <button onClick={() => { const amount = parseFloat(customPaymentAmount[cellKey] || '0'); if (amount > 0) { requestConfirmation(member.id, monthIndex + 1, amount, amountPaid); setShowCustomInput({ ...showCustomInput, [cellKey]: false }); setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' }); } }} className="flex-1 py-1 bg-green-500 text-white rounded text-[8px] font-bold">✓</button>
//                                     <button onClick={() => { setShowCustomInput({ ...showCustomInput, [cellKey]: false }); setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' }); }} className="flex-1 py-1 bg-red-500 text-white rounded text-[8px] font-bold">✕</button>
//                                   </div>
//                                 </div>
//                               ) : isCustomAmount ? (
//                                 <div className="flex flex-col gap-1">
//                                   <div className="bg-blue-500 text-white py-1.5 px-2 rounded-md text-[9px] sm:text-xs font-bold">{amountPaid}</div>
//                                   {isAdmin && <button onClick={() => { setShowCustomInput({ ...showCustomInput, [cellKey]: true }); setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: amountPaid?.toString() || '' }); }} className="text-[8px] text-blue-600 font-semibold">✏️ تعديل</button>}
//                                 </div>
//                               ) : (
//                                 <select value={amountPaid ?? ''} onChange={(e) => { const value = e.target.value; if (value === 'custom') { setShowCustomInput({ ...showCustomInput, [cellKey]: true }); } else { const newAmount = value === '' ? null : parseFloat(value); if (isAdmin) requestConfirmation(member.id, monthIndex + 1, newAmount, amountPaid); } }} disabled={!isAdmin}
//                                   className={`w-full py-1.5 px-1 rounded-md text-[9px] sm:text-xs font-bold border-2 transition-all ${amountPaid && amountPaid > 0 ? 'bg-green-50 text-green-800 border-green-400' : 'bg-red-50 text-red-700 border-red-300'} ${!isAdmin ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}>
//                                   <option value="">لم تدفع</option>
//                                   <option value="500">500</option>
//                                   <option value="1000">1000</option>
//                                   <option value="1500">1500</option>
//                                   <option value="2000">2000</option>
//                                   <option value="custom">أكثر...</option>
//                                 </select>
//                               )}
//                             </td>
//                           );
//                         })}
//                         <td className="border border-gray-300 px-1 sm:px-4 py-2 sm:py-3 text-center">
//                           <div className="font-bold text-indigo-900 text-[10px] sm:text-sm">{getMemberYearTotal(member.id).toFixed(0)} MRO</div>
//                           <div className="text-[9px] sm:text-xs text-gray-600">({getMemberPaidMonths(member.id)} أشهر)</div>
//                         </td>
//                         {isAdmin && (
//                           <td className="border border-gray-300 px-2 py-2 text-center">
//                             <div className="flex flex-col gap-1">
//                               <button onClick={() => openEditNameDialog(member)} className="w-full py-1.5 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-[9px] sm:text-xs font-bold">✏️ تعديل</button>
//                               {!hasPaidAnyMonth(member.id) && <button onClick={() => handleDeleteMember(member)} className="w-full py-1.5 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-[9px] sm:text-xs font-bold">🗑️ حذف</button>}
//                             </div>
//                           </td>
//                         )}
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Confirm Dialog */}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6"><div className="text-4xl mb-4">❓</div><p className="text-base text-gray-800">{confirmMessage}</p></div>
//             <div className="flex gap-3">
//               <button onClick={() => { setShowConfirmDialog(false); setPendingUpdate(null); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
//               <button onClick={handleConfirm} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold">تأكيد</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Name Dialog */}
//       {showEditNameDialog && editingMember && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-4">✏️</div>
//               <h3 className="text-xl font-bold mb-4">تعديل اسم الأسرة</h3>
//               <p className="text-sm text-gray-600 mb-4">الاسم الحالي: <span className="font-semibold">{editingMember.name}</span></p>
//               <input type="text" value={newMemberNameEdit} onChange={(e) => setNewMemberNameEdit(e.target.value)} className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg text-base" placeholder="الاسم الجديد" autoFocus onKeyPress={(e) => e.key === 'Enter' && handleEditName()} />
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => { setShowEditNameDialog(false); setEditingMember(null); setNewMemberNameEdit(''); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
//               <button onClick={handleEditName} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold">حفظ</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Dialog */}
//       {showDeleteDialog && memberToDelete && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-5xl mb-4">⚠️</div>
//               <h3 className="text-xl font-bold text-red-600 mb-4">تأكيد الحذف</h3>
//               <p className="text-base text-gray-800 mb-2">هل أنت متأكد من حذف الأسرة</p>
//               <p className="text-lg font-bold mb-4">"{memberToDelete.name}"؟</p>
//               <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3"><p className="text-sm text-red-700 font-semibold">⚠️ هذا الإجراء لا يمكن التراجع عنه</p></div>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => { setShowDeleteDialog(false); setMemberToDelete(null); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
//               <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold">حذف</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from './AuthProvider';

// interface Member {
//   id: string;
//   name: string;
// }

// interface Subscription {
//   id: string;
//   member_id: string;
//   month: number;
//   year: number;
//   paid: boolean;
//   amount_paid: number | null;
// }

// // جدول مستقل لحفظ الدفعات السنوية المجمّعة
// interface YearlyPayment {
//   id: string;
//   year: number;
//   total_amount: number;
//   created_at: string;
// }

// const MONTHS = [
//   'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
//   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
// ];

// export default function SubscriptionsTab() {
//   const [members, setMembers] = useState<Member[]>([]);
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [newMemberName, setNewMemberName] = useState('');
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [loading, setLoading] = useState(true);
//   const { isAdmin } = useAuth();

//   // دفع سنوي مجمّع
//   const [yearlyAmount, setYearlyAmount] = useState('');
//   const [yearlyPayLoading, setYearlyPayLoading] = useState(false);
//   const [savedYearlyAmount, setSavedYearlyAmount] = useState<number | null>(null);
//   const [editingYearly, setEditingYearly] = useState(false);

//   // Dialogs
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [confirmMessage, setConfirmMessage] = useState('');
//   const [pendingUpdate, setPendingUpdate] = useState<{
//     memberId: string; month: number; amount: number | null;
//   } | null>(null);

//   const [showCustomInput, setShowCustomInput] = useState<{[key: string]: boolean}>({});
//   const [customPaymentAmount, setCustomPaymentAmount] = useState<{[key: string]: string}>({});

//   const [showEditNameDialog, setShowEditNameDialog] = useState(false);
//   const [editingMember, setEditingMember] = useState<Member | null>(null);
//   const [newMemberNameEdit, setNewMemberNameEdit] = useState('');

//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

//   const currentYear = new Date().getFullYear();
//   const isPastYear = selectedYear < currentYear;
//   const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

//   useEffect(() => {
//     fetchData();
//   }, [selectedYear]);

//   const fetchData = async () => {
//     setLoading(true);
//     setSavedYearlyAmount(null);
//     setEditingYearly(false);
//     setYearlyAmount('');

//     try {
//       const { data: membersData } = await supabase
//         .from('members')
//         .select('id, name, created_at')
//         .order('created_at', { ascending: true });
//       setMembers(membersData || []);

//       if (!isPastYear || selectedYear >= currentYear) {
//         // السنة الحالية: نحمّل الاشتراكات الشهرية
//         const { data: subscriptionsData } = await supabase
//           .from('subscriptions')
//           .select('*')
//           .eq('year', selectedYear);
//         setSubscriptions(subscriptionsData || []);
//       } else {
//         // السنة السابقة: نحمّل الدفع السنوي المجمّع
//         const { data: yearlyData } = await supabase
//           .from('yearly_payments')
//           .select('*')
//           .eq('year', selectedYear)
//           .maybeSingle();

//         if (yearlyData) {
//           setSavedYearlyAmount(yearlyData.total_amount);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===== حفظ الدفع السنوي =====
//   const handleSaveYearlyPayment = async () => {
//     const amount = parseFloat(yearlyAmount);
//     if (isNaN(amount) || amount <= 0) {
//       alert('يرجى إدخال مبلغ صحيح');
//       return;
//     }
//     setYearlyPayLoading(true);
//     try {
//       // نتحقق إذا يوجد سجل لهذه السنة
//       const { data: existing } = await supabase
//         .from('yearly_payments')
//         .select('*')
//         .eq('year', selectedYear)
//         .maybeSingle();

//       if (existing) {
//         await supabase
//           .from('yearly_payments')
//           .update({ total_amount: amount })
//           .eq('year', selectedYear);
//       } else {
//         await supabase
//           .from('yearly_payments')
//           .insert([{ year: selectedYear, total_amount: amount }]);
//       }

//       setSavedYearlyAmount(amount);
//       setEditingYearly(false);
//       setYearlyAmount('');
//     } catch (error) {
//       console.error('Error saving yearly payment:', error);
//       alert('خطأ في حفظ الدفع السنوي');
//     } finally {
//       setYearlyPayLoading(false);
//     }
//   };

//   // ===== دفع شهري =====
//   const addMember = async () => {
//     if (!newMemberName.trim()) return;
//     try {
//       const { data, error } = await supabase
//         .from('members')
//         .insert([{ name: newMemberName.trim() }])
//         .select();
//       if (error) throw error;
//       if (data) { setMembers([...members, data[0]]); setNewMemberName(''); }
//     } catch (error) {
//       alert('خطأ في إضافة الأسرة');
//     }
//   };

//   const requestConfirmation = (memberId: string, month: number, amountPaid: number | null, previousAmount: number | null) => {
//     const wasPaid = previousAmount !== null && previousAmount > 0;
//     const willBePaid = amountPaid !== null && amountPaid > 0;
//     const member = members.find(m => m.id === memberId);
//     const monthName = MONTHS[month - 1];
//     let message = '';
//     if (wasPaid && !willBePaid) message = `⚠️ هل أنت متأكد من تغيير حالة ${member?.name} في شهر ${monthName} من "${previousAmount} MRO" إلى "لم تدفع"؟`;
//     else if (!wasPaid && willBePaid) message = `✅ هل أنت متأكد من تسجيل دفع ${amountPaid} MRO لـ ${member?.name} في شهر ${monthName}؟`;
//     else if (wasPaid && willBePaid && previousAmount !== amountPaid) message = `🔄 تغيير مبلغ ${member?.name} في ${monthName} من ${previousAmount} إلى ${amountPaid} MRO؟`;
//     if (message) { setConfirmMessage(message); setPendingUpdate({ memberId, month, amount: amountPaid }); setShowConfirmDialog(true); }
//     else executeUpdate(memberId, month, amountPaid);
//   };

//   const executeUpdate = async (memberId: string, month: number, amountPaid: number | null) => {
//     try {
//       const existing = subscriptions.find(s => s.member_id === memberId && s.month === month && s.year === selectedYear);
//       const paid = amountPaid !== null && amountPaid > 0;
//       if (existing) {
//         const { error } = await supabase.from('subscriptions').update({ paid, amount_paid: amountPaid }).eq('id', existing.id);
//         if (error) throw error;
//         setSubscriptions(subscriptions.map(s => s.id === existing.id ? { ...s, paid, amount_paid: amountPaid } : s));
//       } else {
//         const { data, error } = await supabase.from('subscriptions').insert([{ member_id: memberId, month, year: selectedYear, paid, amount_paid: amountPaid }]).select();
//         if (error) throw error;
//         if (data) setSubscriptions([...subscriptions, data[0]]);
//       }
//     } catch (error) { alert('خطأ في تحديث الدفع'); }
//   };

//   const handleConfirm = () => { if (pendingUpdate) executeUpdate(pendingUpdate.memberId, pendingUpdate.month, pendingUpdate.amount); setShowConfirmDialog(false); setPendingUpdate(null); };

//   const getPaymentAmount = (memberId: string, month: number) => subscriptions.find(s => s.member_id === memberId && s.month === month && s.year === selectedYear)?.amount_paid ?? null;
//   const getMemberYearTotal = (memberId: string) => subscriptions.filter(s => s.member_id === memberId && s.year === selectedYear && s.paid).reduce((sum, s) => sum + (s.amount_paid || 0), 0);
//   const getMemberPaidMonths = (memberId: string) => subscriptions.filter(s => s.member_id === memberId && s.year === selectedYear && s.paid).length;
//   const hasPaidAnyMonth = (memberId: string) => subscriptions.some(s => s.member_id === memberId && s.paid);

//   const openEditNameDialog = (member: Member) => { setEditingMember(member); setNewMemberNameEdit(member.name); setShowEditNameDialog(true); };
//   const handleEditName = async () => {
//     if (!editingMember || !newMemberNameEdit.trim()) return;
//     try {
//       const { error } = await supabase.from('members').update({ name: newMemberNameEdit.trim() }).eq('id', editingMember.id);
//       if (error) throw error;
//       setMembers(members.map(m => m.id === editingMember.id ? { ...m, name: newMemberNameEdit.trim() } : m));
//       setShowEditNameDialog(false); setEditingMember(null); setNewMemberNameEdit('');
//     } catch { alert('خطأ في تعديل الاسم'); }
//   };

//   const handleDeleteMember = (member: Member) => {
//     if (hasPaidAnyMonth(member.id)) { alert('⚠️ لا يمكن حذف أسرة لديها دفعات مسجلة'); return; }
//     setMemberToDelete(member); setShowDeleteDialog(true);
//   };
//   const confirmDelete = async () => {
//     if (!memberToDelete) return;
//     try {
//       const { error } = await supabase.from('members').delete().eq('id', memberToDelete.id);
//       if (error) throw error;
//       setMembers(members.filter(m => m.id !== memberToDelete.id));
//       setShowDeleteDialog(false); setMemberToDelete(null);
//     } catch { alert('خطأ في حذف الأسرة'); }
//   };

//   if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

//   return (
//     <div>
//       {/* Year Selector */}
//       <div className="mb-4 sm:mb-6 flex items-center gap-3 flex-wrap">
//         <span className="text-sm font-semibold text-gray-700">📅 السنة:</span>
//         <div className="flex gap-2 flex-wrap">
//           {years.map(year => (
//             <button key={year} onClick={() => setSelectedYear(year)}
//               className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${selectedYear === year ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'}`}>
//               {year}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ======================================================= */}
//       {/* السنوات السابقة: واجهة مستقلة بدون أشهر ولا أسماء أسر  */}
//       {/* ======================================================= */}
//       {isPastYear ? (
//         <div className="max-w-lg mx-auto">
//           <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 shadow-md">
//             {/* عنوان */}
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-2">📅</div>
//               <h3 className="text-xl font-bold text-amber-800">مجموع اشتراكات سنة {selectedYear}</h3>
//               <p className="text-sm text-amber-600 mt-1">المبلغ الإجمالي الذي تم تحصيله في هذه السنة</p>
//             </div>

//             {/* إذا يوجد مبلغ محفوظ */}
//             {savedYearlyAmount !== null && !editingYearly ? (
//               <div className="text-center">
//                 <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-sm mb-4">
//                   <p className="text-sm text-gray-500 mb-1">المبلغ المسجّل</p>
//                   <p className="text-4xl font-bold text-green-600" dir="ltr">
//                     {savedYearlyAmount.toLocaleString()} MRO
//                   </p>
//                 </div>
//                 {isAdmin && (
//                   <button
//                     onClick={() => { setEditingYearly(true); setYearlyAmount(savedYearlyAmount.toString()); }}
//                     className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold text-sm"
//                   >
//                     ✏️ تعديل المبلغ
//                   </button>
//                 )}
//               </div>
//             ) : isAdmin ? (
//               /* نموذج إدخال المبلغ */
//               <div>
//                 <label className="block text-sm font-bold text-amber-800 mb-2 text-center">
//                   أدخل المبلغ الإجمالي لسنة {selectedYear}
//                 </label>
//                 <input
//                   type="number"
//                   value={yearlyAmount}
//                   onChange={(e) => setYearlyAmount(e.target.value)}
//                   placeholder="مثال: 120000"
//                   className="w-full px-4 py-4 border-2 border-amber-400 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-2xl font-bold text-center mb-4"
//                   autoFocus
//                 />
//                 <div className="flex gap-3">
//                   {editingYearly && (
//                     <button
//                       onClick={() => { setEditingYearly(false); setYearlyAmount(''); }}
//                       className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
//                     >
//                       إلغاء
//                     </button>
//                   )}
//                   <button
//                     onClick={handleSaveYearlyPayment}
//                     disabled={yearlyPayLoading || !yearlyAmount}
//                     className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 text-lg"
//                   >
//                     {yearlyPayLoading ? '⏳ جاري الحفظ...' : '✅ تأكيد وإضافة للرصيد'}
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               /* زائر: لا يوجد مبلغ مسجّل */
//               <div className="text-center py-4 text-gray-500">
//                 لم يتم تسجيل مبلغ لهذه السنة بعد
//               </div>
//             )}
//           </div>
//         </div>

//       ) : (
//         /* ======================================================= */
//         /* السنة الحالية: جدول شهري عادي                           */
//         /* ======================================================= */
//         <>
//           {/* Add Member Form */}
//           {isAdmin && (
//             <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
//               <h3 className="text-base sm:text-lg font-semibold mb-3 text-indigo-900">➕ إضافة أسرة جديدة</h3>
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//                 <input
//                   type="text"
//                   value={newMemberName}
//                   onChange={(e) => setNewMemberName(e.target.value)}
//                   placeholder="اسم الأسرة"
//                   className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
//                   onKeyPress={(e) => e.key === 'Enter' && addMember()}
//                 />
//                 <button onClick={addMember} className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm sm:text-base">
//                   إضافة الأسرة
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Monthly Table */}
//           <div className="overflow-x-auto -mx-3 sm:mx-0">
//             <div className="inline-block min-w-full align-middle">
//               <table className="w-full border-collapse text-xs sm:text-sm">
//                 <thead>
//                   <tr className="bg-indigo-600 text-white">
//                     <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-right sticky right-0 bg-indigo-600 z-10 min-w-[120px] sm:min-w-[160px]">الأسرة</th>
//                     {MONTHS.map((month, index) => (
//                       <th key={index} className="border border-indigo-500 px-1 sm:px-2 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[105px]">
//                         <div className="text-[10px] sm:text-xs font-bold">{month}</div>
//                         <div className="text-[9px] sm:text-[10px] opacity-75">{selectedYear}</div>
//                       </th>
//                     ))}
//                     <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[70px] sm:min-w-[110px]">
//                       <div className="text-[10px] sm:text-xs font-bold">المجموع</div>
//                       <div className="text-[9px] sm:text-[10px] opacity-75">(MRO)</div>
//                     </th>
//                     {isAdmin && <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[80px]">إجراءات</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {members.length === 0 ? (
//                     <tr><td colSpan={isAdmin ? 15 : 14} className="text-center py-8 text-gray-500">لا توجد أسر. قم بإضافة أسرة جديدة أعلاه.</td></tr>
//                   ) : (
//                     members.map((member) => (
//                       <tr key={member.id} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 sticky right-0 bg-white z-10">
//                           <span className="block font-semibold text-[10px] sm:text-sm break-words">{member.name}</span>
//                         </td>
//                         {MONTHS.map((_, monthIndex) => {
//                           const amountPaid = getPaymentAmount(member.id, monthIndex + 1);
//                           const cellKey = `${member.id}-${monthIndex + 1}`;
//                           const isEditing = showCustomInput[cellKey];

//                           return (
//                             <td key={monthIndex} className="border border-gray-300 p-1 text-center">
//                               {isEditing ? (
//                                 /* حقل إدخال مع زري تأكيد وإلغاء */
//                                 <div className="flex flex-col gap-1">
//                                   <input
//                                     type="number"
//                                     value={customPaymentAmount[cellKey] ?? (amountPaid?.toString() || '')}
//                                     onChange={(e) => setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: e.target.value })}
//                                     placeholder="0"
//                                     className="w-full py-1 px-1 rounded-md text-[9px] sm:text-xs border-2 border-indigo-400 focus:ring-1 focus:ring-indigo-500 text-center font-bold"
//                                     autoFocus
//                                     onKeyDown={(e) => {
//                                       if (e.key === 'Enter') {
//                                         const val = customPaymentAmount[cellKey];
//                                         const amount = val === '' ? null : parseFloat(val || '0');
//                                         requestConfirmation(member.id, monthIndex + 1, amount, amountPaid);
//                                         setShowCustomInput({ ...showCustomInput, [cellKey]: false });
//                                         setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
//                                       }
//                                       if (e.key === 'Escape') {
//                                         setShowCustomInput({ ...showCustomInput, [cellKey]: false });
//                                         setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
//                                       }
//                                     }}
//                                   />
//                                   <div className="flex gap-1">
//                                     <button
//                                       onClick={() => {
//                                         const val = customPaymentAmount[cellKey];
//                                         const amount = val === '' ? null : parseFloat(val || '0');
//                                         requestConfirmation(member.id, monthIndex + 1, amount, amountPaid);
//                                         setShowCustomInput({ ...showCustomInput, [cellKey]: false });
//                                         setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
//                                       }}
//                                       className="flex-1 py-1 bg-green-500 text-white rounded text-[8px] font-bold hover:bg-green-600"
//                                     >✓</button>
//                                     <button
//                                       onClick={() => {
//                                         setShowCustomInput({ ...showCustomInput, [cellKey]: false });
//                                         setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
//                                       }}
//                                       className="flex-1 py-1 bg-red-400 text-white rounded text-[8px] font-bold hover:bg-red-500"
//                                     >✕</button>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 /* عرض المبلغ أو زر الإدخال */
//                                 <button
//                                   onClick={() => {
//                                     if (!isAdmin) return;
//                                     setShowCustomInput({ ...showCustomInput, [cellKey]: true });
//                                     setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: amountPaid?.toString() || '' });
//                                   }}
//                                   disabled={!isAdmin}
//                                   className={`w-full py-2 px-1 rounded-md text-[9px] sm:text-xs font-bold border-2 transition-all ${
//                                     amountPaid && amountPaid > 0
//                                       ? 'bg-green-50 text-green-800 border-green-400 hover:bg-green-100'
//                                       : 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100'
//                                   } ${!isAdmin ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
//                                 >
//                                   {amountPaid && amountPaid > 0 ? (
//                                     <span dir="ltr">{amountPaid}</span>
//                                   ) : (
//                                     <span>لم تدفع</span>
//                                   )}
//                                 </button>
//                               )}
//                             </td>
//                           );
//                         })}
//                         <td className="border border-gray-300 px-1 sm:px-4 py-2 sm:py-3 text-center">
//                           <div className="font-bold text-indigo-900 text-[10px] sm:text-sm">{getMemberYearTotal(member.id).toFixed(0)} MRO</div>
//                           <div className="text-[9px] sm:text-xs text-gray-600">({getMemberPaidMonths(member.id)} أشهر)</div>
//                         </td>
//                         {isAdmin && (
//                           <td className="border border-gray-300 px-2 py-2 text-center">
//                             <div className="flex flex-col gap-1">
//                               <button onClick={() => openEditNameDialog(member)} className="w-full py-1.5 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-[9px] sm:text-xs font-bold">✏️ تعديل</button>
//                               {!hasPaidAnyMonth(member.id) && <button onClick={() => handleDeleteMember(member)} className="w-full py-1.5 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-[9px] sm:text-xs font-bold">🗑️ حذف</button>}
//                             </div>
//                           </td>
//                         )}
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Confirm Dialog */}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6"><div className="text-4xl mb-4">❓</div><p className="text-base text-gray-800">{confirmMessage}</p></div>
//             <div className="flex gap-3">
//               <button onClick={() => { setShowConfirmDialog(false); setPendingUpdate(null); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
//               <button onClick={handleConfirm} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold">تأكيد</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Name Dialog */}
//       {showEditNameDialog && editingMember && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-4xl mb-4">✏️</div>
//               <h3 className="text-xl font-bold mb-4">تعديل اسم الأسرة</h3>
//               <p className="text-sm text-gray-600 mb-4">الاسم الحالي: <span className="font-semibold">{editingMember.name}</span></p>
//               <input type="text" value={newMemberNameEdit} onChange={(e) => setNewMemberNameEdit(e.target.value)} className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg text-base" placeholder="الاسم الجديد" autoFocus onKeyPress={(e) => e.key === 'Enter' && handleEditName()} />
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => { setShowEditNameDialog(false); setEditingMember(null); setNewMemberNameEdit(''); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
//               <button onClick={handleEditName} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold">حفظ</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Dialog */}
//       {showDeleteDialog && memberToDelete && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
//             <div className="text-center mb-6">
//               <div className="text-5xl mb-4">⚠️</div>
//               <h3 className="text-xl font-bold text-red-600 mb-4">تأكيد الحذف</h3>
//               <p className="text-base text-gray-800 mb-2">هل أنت متأكد من حذف الأسرة</p>
//               <p className="text-lg font-bold mb-4">"{memberToDelete.name}"؟</p>
//               <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3"><p className="text-sm text-red-700 font-semibold">⚠️ هذا الإجراء لا يمكن التراجع عنه</p></div>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => { setShowDeleteDialog(false); setMemberToDelete(null); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
//               <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold">حذف</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

interface Member {
  id: string;
  name: string;
}

interface Subscription {
  id: string;
  member_id: string;
  month: number;
  year: number;
  paid: boolean;
  amount_paid: number | null;
}

// جدول مستقل لحفظ الدفعات السنوية المجمّعة
interface YearlyPayment {
  id: string;
  year: number;
  total_amount: number;
  created_at: string;
}

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function SubscriptionsTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  // دفع سنوي مجمّع
  const [yearlyAmount, setYearlyAmount] = useState('');
  const [yearlyPayLoading, setYearlyPayLoading] = useState(false);
  const [savedYearlyAmount, setSavedYearlyAmount] = useState<number | null>(null);
  const [editingYearly, setEditingYearly] = useState(false);

  // Dialogs
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [pendingUpdate, setPendingUpdate] = useState<{
    memberId: string; month: number; amount: number | null;
  } | null>(null);

  const [showCustomInput, setShowCustomInput] = useState<{[key: string]: boolean}>({});
  const [customPaymentAmount, setCustomPaymentAmount] = useState<{[key: string]: string}>({});

  const [showEditNameDialog, setShowEditNameDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newMemberNameEdit, setNewMemberNameEdit] = useState('');

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const currentYear = new Date().getFullYear();
  const MONTHLY_START_YEAR = 2026;
  const isPastYear = selectedYear < MONTHLY_START_YEAR;
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    setSavedYearlyAmount(null);
    setEditingYearly(false);
    setYearlyAmount('');

    try {
      const { data: membersData } = await supabase
        .from('members')
        .select('id, name, created_at')
        .order('created_at', { ascending: true });
      setMembers(membersData || []);

      if (!isPastYear) {
        // السنة الحالية: نحمّل الاشتراكات الشهرية
        const { data: subscriptionsData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('year', selectedYear);
        setSubscriptions(subscriptionsData || []);
      } else {
        // السنة السابقة: نحمّل الدفع السنوي المجمّع
        const { data: yearlyData } = await supabase
          .from('yearly_payments')
          .select('*')
          .eq('year', selectedYear)
          .maybeSingle();

        if (yearlyData) {
          setSavedYearlyAmount(yearlyData.total_amount);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== حفظ الدفع السنوي =====
  const handleSaveYearlyPayment = async () => {
    const amount = parseFloat(yearlyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }
    setYearlyPayLoading(true);
    try {
      // نتحقق إذا يوجد سجل لهذه السنة
      const { data: existing } = await supabase
        .from('yearly_payments')
        .select('*')
        .eq('year', selectedYear)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('yearly_payments')
          .update({ total_amount: amount })
          .eq('year', selectedYear);
      } else {
        await supabase
          .from('yearly_payments')
          .insert([{ year: selectedYear, total_amount: amount }]);
      }

      setSavedYearlyAmount(amount);
      setEditingYearly(false);
      setYearlyAmount('');
    } catch (error) {
      console.error('Error saving yearly payment:', error);
      alert('خطأ في حفظ الدفع السنوي');
    } finally {
      setYearlyPayLoading(false);
    }
  };

  // ===== دفع شهري =====
  const addMember = async () => {
    if (!newMemberName.trim()) return;
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([{ name: newMemberName.trim() }])
        .select();
      if (error) throw error;
      if (data) { setMembers([...members, data[0]]); setNewMemberName(''); }
    } catch (error) {
      alert('خطأ في إضافة الأسرة');
    }
  };

  const requestConfirmation = (memberId: string, month: number, amountPaid: number | null, previousAmount: number | null) => {
    const wasPaid = previousAmount !== null && previousAmount > 0;
    const willBePaid = amountPaid !== null && amountPaid > 0;
    const member = members.find(m => m.id === memberId);
    const monthName = MONTHS[month - 1];
    let message = '';
    if (wasPaid && !willBePaid) message = `⚠️ هل أنت متأكد من تغيير حالة ${member?.name} في شهر ${monthName} من "${previousAmount} MRO" إلى "لم تدفع"؟`;
    else if (!wasPaid && willBePaid) message = `✅ هل أنت متأكد من تسجيل دفع ${amountPaid} MRO لـ ${member?.name} في شهر ${monthName}؟`;
    else if (wasPaid && willBePaid && previousAmount !== amountPaid) message = `🔄 تغيير مبلغ ${member?.name} في ${monthName} من ${previousAmount} إلى ${amountPaid} MRO؟`;
    if (message) { setConfirmMessage(message); setPendingUpdate({ memberId, month, amount: amountPaid }); setShowConfirmDialog(true); }
    else executeUpdate(memberId, month, amountPaid);
  };

  const executeUpdate = async (memberId: string, month: number, amountPaid: number | null) => {
    try {
      const existing = subscriptions.find(s => s.member_id === memberId && s.month === month && s.year === selectedYear);
      const paid = amountPaid !== null && amountPaid > 0;
      if (existing) {
        const { error } = await supabase.from('subscriptions').update({ paid, amount_paid: amountPaid }).eq('id', existing.id);
        if (error) throw error;
        setSubscriptions(subscriptions.map(s => s.id === existing.id ? { ...s, paid, amount_paid: amountPaid } : s));
      } else {
        const { data, error } = await supabase.from('subscriptions').insert([{ member_id: memberId, month, year: selectedYear, paid, amount_paid: amountPaid }]).select();
        if (error) throw error;
        if (data) setSubscriptions([...subscriptions, data[0]]);
      }
    } catch (error) { alert('خطأ في تحديث الدفع'); }
  };

  const handleConfirm = () => { if (pendingUpdate) executeUpdate(pendingUpdate.memberId, pendingUpdate.month, pendingUpdate.amount); setShowConfirmDialog(false); setPendingUpdate(null); };

  const getPaymentAmount = (memberId: string, month: number) => subscriptions.find(s => s.member_id === memberId && s.month === month && s.year === selectedYear)?.amount_paid ?? null;
  const getMemberYearTotal = (memberId: string) => subscriptions.filter(s => s.member_id === memberId && s.year === selectedYear && s.paid).reduce((sum, s) => sum + (s.amount_paid || 0), 0);
  const getMemberPaidMonths = (memberId: string) => subscriptions.filter(s => s.member_id === memberId && s.year === selectedYear && s.paid).length;
  const hasPaidAnyMonth = (memberId: string) => subscriptions.some(s => s.member_id === memberId && s.paid);

  const openEditNameDialog = (member: Member) => { setEditingMember(member); setNewMemberNameEdit(member.name); setShowEditNameDialog(true); };
  const handleEditName = async () => {
    if (!editingMember || !newMemberNameEdit.trim()) return;
    try {
      const { error } = await supabase.from('members').update({ name: newMemberNameEdit.trim() }).eq('id', editingMember.id);
      if (error) throw error;
      setMembers(members.map(m => m.id === editingMember.id ? { ...m, name: newMemberNameEdit.trim() } : m));
      setShowEditNameDialog(false); setEditingMember(null); setNewMemberNameEdit('');
    } catch { alert('خطأ في تعديل الاسم'); }
  };

  const handleDeleteMember = (member: Member) => {
    if (hasPaidAnyMonth(member.id)) { alert('⚠️ لا يمكن حذف أسرة لديها دفعات مسجلة'); return; }
    setMemberToDelete(member); setShowDeleteDialog(true);
  };
  const confirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      const { error } = await supabase.from('members').delete().eq('id', memberToDelete.id);
      if (error) throw error;
      setMembers(members.filter(m => m.id !== memberToDelete.id));
      setShowDeleteDialog(false); setMemberToDelete(null);
    } catch { alert('خطأ في حذف الأسرة'); }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div>
      {/* Year Selector */}
      <div className="mb-4 sm:mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-gray-700">📅 السنة:</span>
        <div className="flex gap-2 flex-wrap">
          {years.map(year => (
            <button key={year} onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${selectedYear === year ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'}`}>
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================= */}
      {/* السنوات السابقة: واجهة مستقلة بدون أشهر ولا أسماء أسر  */}
      {/* ======================================================= */}
      {isPastYear ? (
        <div className="max-w-lg mx-auto">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 shadow-md">
            {/* عنوان */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📅</div>
              <h3 className="text-xl font-bold text-amber-800">مجموع اشتراكات سنة {selectedYear}</h3>
              <p className="text-sm text-amber-600 mt-1">المبلغ الإجمالي الذي تم تحصيله في هذه السنة</p>
            </div>

            {/* إذا يوجد مبلغ محفوظ */}
            {savedYearlyAmount !== null && !editingYearly ? (
              <div className="text-center">
                <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-sm mb-4">
                  <p className="text-sm text-gray-500 mb-1">المبلغ المسجّل</p>
                  <p className="text-4xl font-bold text-green-600" dir="ltr">
                    {savedYearlyAmount.toLocaleString()} MRO
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => { setEditingYearly(true); setYearlyAmount(savedYearlyAmount.toString()); }}
                    className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold text-sm"
                  >
                    ✏️ تعديل المبلغ
                  </button>
                )}
              </div>
            ) : isAdmin ? (
              /* نموذج إدخال المبلغ */
              <div>
                <label className="block text-sm font-bold text-amber-800 mb-2 text-center">
                  أدخل المبلغ الإجمالي لسنة {selectedYear}
                </label>
                <input
                  type="number"
                  value={yearlyAmount}
                  onChange={(e) => setYearlyAmount(e.target.value)}
                  placeholder="مثال: 120000"
                  className="w-full px-4 py-4 border-2 border-amber-400 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-2xl font-bold text-center mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  {editingYearly && (
                    <button
                      onClick={() => { setEditingYearly(false); setYearlyAmount(''); }}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                  )}
                  <button
                    onClick={handleSaveYearlyPayment}
                    disabled={yearlyPayLoading || !yearlyAmount}
                    className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 text-lg"
                  >
                    {yearlyPayLoading ? '⏳ جاري الحفظ...' : '✅ تأكيد وإضافة للرصيد'}
                  </button>
                </div>
              </div>
            ) : (
              /* زائر: لا يوجد مبلغ مسجّل */
              <div className="text-center py-4 text-gray-500">
                لم يتم تسجيل مبلغ لهذه السنة بعد
              </div>
            )}
          </div>
        </div>

      ) : (
        /* ======================================================= */
        /* السنة الحالية: جدول شهري عادي                           */
        /* ======================================================= */
        <>
          {/* Add Member Form */}
          {isAdmin && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-indigo-900">➕ إضافة أسرة جديدة</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="اسم الأسرة"
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && addMember()}
                />
                <button onClick={addMember} className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm sm:text-base">
                  إضافة الأسرة
                </button>
              </div>
            </div>
          )}

          {/* Monthly Table */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-right sticky right-0 bg-indigo-600 z-10 min-w-[120px] sm:min-w-[160px]">الأسرة</th>
                    {MONTHS.map((month, index) => (
                      <th key={index} className="border border-indigo-500 px-1 sm:px-2 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[105px]">
                        <div className="text-[10px] sm:text-xs font-bold">{month}</div>
                        <div className="text-[9px] sm:text-[10px] opacity-75">{selectedYear}</div>
                      </th>
                    ))}
                    <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[70px] sm:min-w-[110px]">
                      <div className="text-[10px] sm:text-xs font-bold">المجموع</div>
                      <div className="text-[9px] sm:text-[10px] opacity-75">(MRO)</div>
                    </th>
                    {isAdmin && <th className="border border-indigo-500 px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[80px]">إجراءات</th>}
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr><td colSpan={isAdmin ? 15 : 14} className="text-center py-8 text-gray-500">لا توجد أسر. قم بإضافة أسرة جديدة أعلاه.</td></tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 sticky right-0 bg-white z-10">
                          <span className="block font-semibold text-[10px] sm:text-sm break-words">{member.name}</span>
                        </td>
                        {MONTHS.map((_, monthIndex) => {
                          const amountPaid = getPaymentAmount(member.id, monthIndex + 1);
                          const cellKey = `${member.id}-${monthIndex + 1}`;
                          const isEditing = showCustomInput[cellKey];

                          return (
                            <td key={monthIndex} className="border border-gray-300 p-1 text-center">
                              {isEditing ? (
                                /* حقل إدخال مع زري تأكيد وإلغاء */
                                <div className="flex flex-col gap-1">
                                  <input
                                    type="number"
                                    value={customPaymentAmount[cellKey] ?? (amountPaid?.toString() || '')}
                                    onChange={(e) => setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: e.target.value })}
                                    placeholder="0"
                                    className="w-full py-1 px-1 rounded-md text-[9px] sm:text-xs border-2 border-indigo-400 focus:ring-1 focus:ring-indigo-500 text-center font-bold"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        const val = customPaymentAmount[cellKey];
                                        const amount = val === '' ? null : parseFloat(val || '0');
                                        requestConfirmation(member.id, monthIndex + 1, amount, amountPaid);
                                        setShowCustomInput({ ...showCustomInput, [cellKey]: false });
                                        setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
                                      }
                                      if (e.key === 'Escape') {
                                        setShowCustomInput({ ...showCustomInput, [cellKey]: false });
                                        setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
                                      }
                                    }}
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        const val = customPaymentAmount[cellKey];
                                        const amount = val === '' ? null : parseFloat(val || '0');
                                        requestConfirmation(member.id, monthIndex + 1, amount, amountPaid);
                                        setShowCustomInput({ ...showCustomInput, [cellKey]: false });
                                        setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
                                      }}
                                      className="flex-1 py-1 bg-green-500 text-white rounded text-[8px] font-bold hover:bg-green-600"
                                    >✓</button>
                                    <button
                                      onClick={() => {
                                        setShowCustomInput({ ...showCustomInput, [cellKey]: false });
                                        setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: '' });
                                      }}
                                      className="flex-1 py-1 bg-red-400 text-white rounded text-[8px] font-bold hover:bg-red-500"
                                    >✕</button>
                                  </div>
                                </div>
                              ) : (
                                /* عرض المبلغ أو زر الإدخال */
                                <button
                                  onClick={() => {
                                    if (!isAdmin) return;
                                    setShowCustomInput({ ...showCustomInput, [cellKey]: true });
                                    setCustomPaymentAmount({ ...customPaymentAmount, [cellKey]: amountPaid?.toString() || '' });
                                  }}
                                  disabled={!isAdmin}
                                  className={`w-full py-2 px-1 rounded-md text-[9px] sm:text-xs font-bold border-2 transition-all ${
                                    amountPaid && amountPaid > 0
                                      ? 'bg-green-50 text-green-800 border-green-400 hover:bg-green-100'
                                      : 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100'
                                  } ${!isAdmin ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                                >
                                  {amountPaid && amountPaid > 0 ? (
                                    <span dir="ltr">{amountPaid}</span>
                                  ) : (
                                    <span>لم تدفع</span>
                                  )}
                                </button>
                              )}
                            </td>
                          );
                        })}
                        <td className="border border-gray-300 px-1 sm:px-4 py-2 sm:py-3 text-center">
                          <div className="font-bold text-indigo-900 text-[10px] sm:text-sm">{getMemberYearTotal(member.id).toFixed(0)} MRO</div>
                          <div className="text-[9px] sm:text-xs text-gray-600">({getMemberPaidMonths(member.id)} أشهر)</div>
                        </td>
                        {isAdmin && (
                          <td className="border border-gray-300 px-2 py-2 text-center">
                            <div className="flex flex-col gap-1">
                              <button onClick={() => openEditNameDialog(member)} className="w-full py-1.5 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-[9px] sm:text-xs font-bold">✏️ تعديل</button>
                              {!hasPaidAnyMonth(member.id) && <button onClick={() => handleDeleteMember(member)} className="w-full py-1.5 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-[9px] sm:text-xs font-bold">🗑️ حذف</button>}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6"><div className="text-4xl mb-4">❓</div><p className="text-base text-gray-800">{confirmMessage}</p></div>
            <div className="flex gap-3">
              <button onClick={() => { setShowConfirmDialog(false); setPendingUpdate(null); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
              <button onClick={handleConfirm} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold">تأكيد</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Name Dialog */}
      {showEditNameDialog && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-xl font-bold mb-4">تعديل اسم الأسرة</h3>
              <p className="text-sm text-gray-600 mb-4">الاسم الحالي: <span className="font-semibold">{editingMember.name}</span></p>
              <input type="text" value={newMemberNameEdit} onChange={(e) => setNewMemberNameEdit(e.target.value)} className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg text-base" placeholder="الاسم الجديد" autoFocus onKeyPress={(e) => e.key === 'Enter' && handleEditName()} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowEditNameDialog(false); setEditingMember(null); setNewMemberNameEdit(''); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
              <button onClick={handleEditName} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold">حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && memberToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-600 mb-4">تأكيد الحذف</h3>
              <p className="text-base text-gray-800 mb-2">هل أنت متأكد من حذف الأسرة</p>
              <p className="text-lg font-bold mb-4">"{memberToDelete.name}"؟</p>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3"><p className="text-sm text-red-700 font-semibold">⚠️ هذا الإجراء لا يمكن التراجع عنه</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteDialog(false); setMemberToDelete(null); }} className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold">إلغاء</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}