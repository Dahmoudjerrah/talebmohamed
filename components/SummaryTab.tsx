

// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';

// interface SummaryData {
//   totalMembers: number;
//   totalIncome: number;
//   totalAssistanceAmount: number;
//   totalAssistanceCases: number;
//   avgMonthlyContribution: number;
//   currentBalance: number;
// }

// export default function SummaryTab() {
//   const [summary, setSummary] = useState<SummaryData>({
//     totalMembers: 0,
//     totalIncome: 0,
//     totalAssistanceAmount: 0,
//     totalAssistanceCases: 0,
//     avgMonthlyContribution: 0,
//     currentBalance: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [notes, setNotes] = useState('');

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   const fetchSummary = async () => {
//     try {
//       // Get all members
//       const { data: membersData, count: membersCount } = await supabase
//         .from('members')
//         .select('*', { count: 'exact' });

//       // Get all paid subscriptions with actual amounts
//       const { data: subscriptions } = await supabase
//         .from('subscriptions')
//         .select('amount_paid')
//         .eq('paid', true);

//       // Calculate TOTAL INCOME from actual payments
//       const totalIncome = subscriptions?.reduce((sum, sub) => {
//         return sum + (sub.amount_paid || 0);
//       }, 0) || 0;

//       // Get assistance data
//       const { data: assistances } = await supabase
//         .from('assistance')
//         .select('amount');

//       const totalAmount = assistances?.reduce((sum, a) => sum + Number(a.amount), 0) || 0;
//       const currentBalance = totalIncome - totalAmount;

//       // Calculate average monthly contribution from all members
//       const avgMonthlyContribution = membersData && membersData.length > 0
//         ? membersData.reduce((sum, m) => sum + (m.monthly_amount || 1000), 0) / membersData.length
//         : 1000;

//       setSummary({
//         totalMembers: membersCount || 0,
//         totalIncome,
//         totalAssistanceAmount: totalAmount,
//         totalAssistanceCases: assistances?.length || 0,
//         avgMonthlyContribution,
//         currentBalance,
//       });
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">جاري التحميل...</div>;
//   }

//   return (
//     <div>
//       <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-4 sm:mb-6">ملخص الصندوق</h2>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
//         {/* Current Balance */}
//         <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">الرصيد الحالي</p>
//               <p className="text-lg sm:text-2xl font-bold">{summary.currentBalance.toFixed(2)}</p>
//               <p className="text-xs opacity-75">MRO</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">💵</div>
//           </div>
//         </div>

//         {/* Total Members */}
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">عدد الأعضاء</p>
//               <p className="text-2xl sm:text-3xl font-bold">{summary.totalMembers}</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">👥</div>
//           </div>
//         </div>

//         {/* Total Assistance Cases */}
//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">عدد الحالات المساعدة</p>
//               <p className="text-2xl sm:text-3xl font-bold">{summary.totalAssistanceCases}</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">🤝</div>
//           </div>
//         </div>

//         {/* Total Amount Spent */}
//         <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">إجمالي المصروفات</p>
//               <p className="text-lg sm:text-2xl font-bold">{summary.totalAssistanceAmount.toFixed(2)} MRO</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">💰</div>
//           </div>
//         </div>
//       </div>

//       {/* Details Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         {/* Financial Overview */}
//         <div className="bg-white border-2 border-indigo-200 rounded-lg p-4 sm:p-6">
//           <h3 className="text-lg sm:text-xl font-bold text-indigo-900 mb-4">📊 النظرة المالية</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">متوسط الاشتراك الشهري:</span>
//               <span className="font-bold text-indigo-900">{summary.avgMonthlyContribution.toFixed(2)} MRO</span>
//             </div>
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">إجمالي الدخل الفعلي:</span>
//               <span className="font-bold text-green-600">
//                 {summary.totalIncome.toFixed(2)} MRO
//               </span>
//             </div>
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">عدد الأعضاء الفعالين:</span>
//               <span className="font-bold text-indigo-900">{summary.totalMembers}</span>
//             </div>
//             <div className="flex justify-between items-center py-2 sm:py-3 bg-indigo-50 rounded px-3 text-sm sm:text-base">
//               <span className="text-gray-900 font-semibold">الرصيد الحالي:</span>
//               <span className="font-bold text-indigo-900 text-lg">
//                 {summary.currentBalance.toFixed(2)} MRO
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Assistance Overview */}
//         <div className="bg-white border-2 border-green-200 rounded-lg p-4 sm:p-6">
//           <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-4">🤝 ملخص المساعدات</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">عدد الحالات المساعدة:</span>
//               <span className="font-bold text-green-900">{summary.totalAssistanceCases}</span>
//             </div>
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">إجمالي المبالغ المصروفة:</span>
//               <span className="font-bold text-red-600">
//                 {summary.totalAssistanceAmount.toFixed(2)} MRO
//               </span>
//             </div>
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">متوسط المساعدة لكل حالة:</span>
//               <span className="font-bold text-purple-600">
//                 {summary.totalAssistanceCases > 0
//                   ? (summary.totalAssistanceAmount / summary.totalAssistanceCases).toFixed(2)
//                   : 0}{' '}
//                 MRO
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notes Section */}
//       <div className="mt-4 sm:mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6">
//         <h3 className="text-lg sm:text-xl font-bold text-yellow-900 mb-4">📝 ملاحظات عامة</h3>
//         <textarea
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           placeholder="اكتب ملاحظاتك هنا..."
//           className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm sm:text-base"
//           rows={5}
//         />
//         <p className="text-xs sm:text-sm text-gray-600 mt-2">
//           💡 يمكنك استخدام هذا المكان لتسجيل ملاحظات عامة حول الصندوق
//         </p>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';

// interface SummaryData {
//   totalMembers: number;
//   totalIncome: number;
//   totalAssistanceAmount: number;
//   totalAssistanceCases: number;
//   currentBalance: number;
// }

// export default function SummaryTab() {
//   const [summary, setSummary] = useState<SummaryData>({
//     totalMembers: 0,
//     totalIncome: 0,
//     totalAssistanceAmount: 0,
//     totalAssistanceCases: 0,
//     currentBalance: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [notes, setNotes] = useState('');

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   const fetchSummary = async () => {
//     try {
//       const { count: membersCount } = await supabase
//         .from('members')
//         .select('*', { count: 'exact' });

//       const { data: subscriptions } = await supabase
//         .from('subscriptions')
//         .select('amount_paid')
//         .eq('paid', true);

//       const totalIncome = subscriptions?.reduce((sum, sub) => sum + (sub.amount_paid || 0), 0) || 0;

//       const { data: assistances } = await supabase
//         .from('assistance')
//         .select('amount');

//       const totalAssistanceAmount = assistances?.reduce((sum, a) => sum + Number(a.amount), 0) || 0;
//       const currentBalance = totalIncome - totalAssistanceAmount;

//       setSummary({
//         totalMembers: membersCount || 0,
//         totalIncome,
//         totalAssistanceAmount,
//         totalAssistanceCases: assistances?.length || 0,
//         currentBalance,
//       });
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">جاري التحميل...</div>;
//   }

//   return (
//     <div>
//       <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-4 sm:mb-6">ملخص الصندوق</h2>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">

//         {/* Current Balance */}
//         <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">الرصيد الحالي</p>
//               <p className="text-lg sm:text-2xl font-bold">{summary.currentBalance.toFixed(2)}</p>
//               <p className="text-xs opacity-75">MRO</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">💵</div>
//           </div>
//         </div>

//         {/* Total Members */}
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">عدد الأسر</p>
//               <p className="text-2xl sm:text-3xl font-bold">{summary.totalMembers}</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">👥</div>
//           </div>
//         </div>

//         {/* Total Income */}
//         <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">إجمالي الدخل الفعلي</p>
//               <p className="text-lg sm:text-2xl font-bold">{summary.totalIncome.toFixed(2)}</p>
//               <p className="text-xs opacity-75">MRO</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">📥</div>
//           </div>
//         </div>
//       </div>

//       {/* Fund Summary & Assistance Summary */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

//         {/* Fund Summary */}
//         <div className="bg-white border-2 border-indigo-200 rounded-lg p-4 sm:p-6">
//           <h3 className="text-lg sm:text-xl font-bold text-indigo-900 mb-4">💵 ملخص الصندوق</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">عدد الأسر الفعالة:</span>
//               <span className="font-bold text-indigo-900">{summary.totalMembers}</span>
//             </div>
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">إجمالي الدخل الفعلي:</span>
//               <span className="font-bold text-green-600">{summary.totalIncome.toFixed(2)} MRO</span>
//             </div>
//             <div className="flex justify-between items-center py-2 sm:py-3 bg-indigo-50 rounded px-3 text-sm sm:text-base">
//               <span className="text-gray-900 font-semibold">الرصيد الحالي:</span>
//               <span className="font-bold text-indigo-900 text-lg">{summary.currentBalance.toFixed(2)} MRO</span>
//             </div>
//           </div>
//         </div>

//         {/* Assistance Summary */}
//         <div className="bg-white border-2 border-green-200 rounded-lg p-4 sm:p-6">
//           <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-4">🤝 ملخص المساعدات</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">عدد الحالات المساعدة:</span>
//               <span className="font-bold text-green-900">{summary.totalAssistanceCases}</span>
//             </div>
//             <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//               <span className="text-gray-700">إجمالي المبالغ المصروفة:</span>
//               <span className="font-bold text-red-600">{summary.totalAssistanceAmount.toFixed(2)} MRO</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notes Section */}
//       <div className="mt-4 sm:mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6">
//         <h3 className="text-lg sm:text-xl font-bold text-yellow-900 mb-4">📝 ملاحظات عامة</h3>
//         <textarea
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           placeholder="اكتب ملاحظاتك هنا..."
//           className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm sm:text-base"
//           rows={5}
//         />
//         <p className="text-xs sm:text-sm text-gray-600 mt-2">
//           💡 يمكنك استخدام هذا المكان لتسجيل ملاحظات عامة حول الصندوق
//         </p>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';

// interface SummaryData {
//   totalMembers: number;
//   totalIncome: number;
//   totalAssistanceAmount: number;
//   totalAssistanceCases: number;
//   currentBalance: number;
// }

// export default function SummaryTab() {
//   const [summary, setSummary] = useState<SummaryData>({
//     totalMembers: 0,
//     totalIncome: 0,
//     totalAssistanceAmount: 0,
//     totalAssistanceCases: 0,
//     currentBalance: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [notes, setNotes] = useState('');

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   const fetchSummary = async () => {
//     try {
//       const { count: membersCount } = await supabase
//         .from('members')
//         .select('*', { count: 'exact' });

//       const { data: subscriptions } = await supabase
//         .from('subscriptions')
//         .select('amount_paid')
//         .eq('paid', true);

//       const totalIncome = subscriptions?.reduce((sum, sub) => sum + (sub.amount_paid || 0), 0) || 0;

//       const { data: assistances } = await supabase
//         .from('assistance')
//         .select('amount');

//       const totalAssistanceAmount = assistances?.reduce((sum, a) => sum + Number(a.amount), 0) || 0;
//       const currentBalance = totalIncome - totalAssistanceAmount;

//       setSummary({
//         totalMembers: membersCount || 0,
//         totalIncome,
//         totalAssistanceAmount,
//         totalAssistanceCases: assistances?.length || 0,
//         currentBalance,
//       });
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">جاري التحميل...</div>;
//   }

//   return (
//     <div>
//       <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-4 sm:mb-6">ملخص الصندوق</h2>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">

//         {/* Current Balance */}
//         <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">الرصيد الحالي</p>
//               <p className="text-lg sm:text-2xl font-bold" dir="ltr">{summary.currentBalance.toFixed(2)} MRO</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">💵</div>
//           </div>
//         </div>

//         {/* Total Members */}
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">عدد الأسر</p>
//               <p className="text-2xl sm:text-3xl font-bold">{summary.totalMembers}</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">👥</div>
//           </div>
//         </div>

//         {/* Total Income */}
//         <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs sm:text-sm opacity-90 mb-1">إجمالي الدخل الفعلي</p>
//               <p className="text-lg sm:text-2xl font-bold" dir="ltr">{summary.totalIncome.toFixed(2)} MRO</p>
//             </div>
//             <div className="text-3xl sm:text-5xl opacity-80">📥</div>
//           </div>
//         </div>
//       </div>

//       {/* Assistance Summary */}
//       <div className="bg-white border-2 border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
//         <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-4">🤝 ملخص المساعدات</h3>
//         <div className="space-y-3">
//           <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
//             <span className="text-gray-700">عدد الحالات المساعدة:</span>
//             <span className="font-bold text-green-900">{summary.totalAssistanceCases}</span>
//           </div>
//           <div className="flex justify-between items-center py-2 sm:py-3 text-sm sm:text-base">
//             <span className="text-gray-700">إجمالي المبالغ المصروفة:</span>
//             <span className="font-bold text-red-600" dir="ltr">{summary.totalAssistanceAmount.toFixed(2)} MRO</span>
//           </div>
//         </div>
//       </div>

//       {/* Notes Section */}
//       <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6">
//         <h3 className="text-lg sm:text-xl font-bold text-yellow-900 mb-4">📝 ملاحظات عامة</h3>
//         <textarea
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           placeholder="اكتب ملاحظاتك هنا..."
//           className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm sm:text-base"
//           rows={5}
//         />
//         <p className="text-xs sm:text-sm text-gray-600 mt-2">
//           💡 يمكنك استخدام هذا المكان لتسجيل ملاحظات عامة
//         </p>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SummaryData {
  totalMembers: number;
  totalIncome: number;
  totalAssistanceAmount: number;
  totalAssistanceCases: number;
  currentBalance: number;
}

export default function SummaryTab() {
  const [summary, setSummary] = useState<SummaryData>({
    totalMembers: 0,
    totalIncome: 0,
    totalAssistanceAmount: 0,
    totalAssistanceCases: 0,
    currentBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      // عدد الأسر
      const { count: membersCount } = await supabase
        .from('members')
        .select('*', { count: 'exact' });

      // الدخل من الاشتراكات الشهرية (السنة الحالية)
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('amount_paid')
        .eq('paid', true);
      const monthlyIncome = subscriptions?.reduce((sum, sub) => sum + (sub.amount_paid || 0), 0) || 0;

      // الدخل من الدفعات السنوية المجمّعة (السنوات السابقة)
      const { data: yearlyPayments } = await supabase
        .from('yearly_payments')
        .select('total_amount');
      const yearlyIncome = yearlyPayments?.reduce((sum, y) => sum + Number(y.total_amount), 0) || 0;

      const totalIncome = monthlyIncome + yearlyIncome;

      // المساعدات
      const { data: assistances } = await supabase
        .from('assistance')
        .select('amount');
      const totalAssistanceAmount = assistances?.reduce((sum, a) => sum + Number(a.amount), 0) || 0;

      const currentBalance = totalIncome - totalAssistanceAmount;

      setSummary({
        totalMembers: membersCount || 0,
        totalIncome,
        totalAssistanceAmount,
        totalAssistanceCases: assistances?.length || 0,
        currentBalance,
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-4 sm:mb-6">ملخص الصندوق</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">

        {/* Current Balance */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm opacity-90 mb-1">الرصيد الحالي</p>
              <p className="text-lg sm:text-2xl font-bold" dir="ltr">{summary.currentBalance.toFixed(2)} MRO</p>
            </div>
            <div className="text-3xl sm:text-5xl opacity-80">💵</div>
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm opacity-90 mb-1">عدد الأسر</p>
              <p className="text-2xl sm:text-3xl font-bold">{summary.totalMembers}</p>
            </div>
            <div className="text-3xl sm:text-5xl opacity-80">👥</div>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm opacity-90 mb-1">إجمالي الدخل الفعلي</p>
              <p className="text-lg sm:text-2xl font-bold" dir="ltr">{summary.totalIncome.toFixed(2)} MRO</p>
            </div>
            <div className="text-3xl sm:text-5xl opacity-80">📥</div>
          </div>
        </div>
      </div>

      {/* Assistance Summary */}
      <div className="bg-white border-2 border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-4">🤝 ملخص المساعدات</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 sm:py-3 border-b text-sm sm:text-base">
            <span className="text-gray-700">عدد الحالات المساعدة:</span>
            <span className="font-bold text-green-900">{summary.totalAssistanceCases}</span>
          </div>
          <div className="flex justify-between items-center py-2 sm:py-3 text-sm sm:text-base">
            <span className="text-gray-700">إجمالي المبالغ المصروفة:</span>
            <span className="font-bold text-red-600" dir="ltr">{summary.totalAssistanceAmount.toFixed(2)} MRO</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-yellow-900 mb-4">📝 ملاحظات عامة</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="اكتب ملاحظاتك هنا..."
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none text-sm sm:text-base"
          rows={5}
        />
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          💡 يمكنك استخدام هذا المكان لتسجيل ملاحظات عامة  
        </p>
      </div>
    </div>
  );
}