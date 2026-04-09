'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Member {
  id: string;
  name: string;
}

interface MemberEntry {
  memberId: string;
  name: string;
  amount: string;
  day: string;
  month: number; // شهر خاص بكل أسرة
}

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function MonthlyIncomeForm() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState<MemberEntry[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    fetchMembers();
  }, []);

  // quand le mois global change → mettre à jour le mois de chaque entrée
  useEffect(() => {
    setEntries(prev => prev.map(e => ({ ...e, month: selectedMonth })));
  }, [selectedMonth]);

  const fetchMembers = async () => {
    try {
      const { data } = await supabase
        .from('members')
        .select('id, name')
        .order('created_at', { ascending: true });
      const members = data || [];
      setMembers(members);
      setEntries(members.map(m => ({
        memberId: m.id,
        name: m.name,
        amount: '',
        day: new Date().getDate().toString(),
        month: new Date().getMonth() + 1
      })));
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = (memberId: string, field: 'amount' | 'day' | 'month', value: string | number) => {
    setEntries(entries.map(e =>
      e.memberId === memberId ? { ...e, [field]: value } : e
    ));
  };

  const filledEntries = entries.filter(e => e.amount && parseFloat(e.amount) > 0);
  const totalAmount = filledEntries.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);

  const handleGenerate = () => {
    if (filledEntries.length === 0) {
      alert('يرجى إدخال مبلغ لأسرة واحدة على الأقل');
      return;
    }
    setShowTable(true);
    setTimeout(() => {
      document.getElementById('print-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;

    const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>المداخيل الشهرية - ${MONTHS[selectedMonth - 1]} ${selectedYear}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; direction: rtl; padding: 20px; }
          .print-header { text-align: center; margin-bottom: 24px; border-bottom: 3px solid #16a34a; padding-bottom: 16px; }
          .print-header img { width: 80px; height: 80px; object-fit: contain; margin-bottom: 8px; }
          .print-header h1 { font-size: 22px; font-weight: bold; color: #166534; }
          .print-header h2 { font-size: 16px; color: #15803d; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background-color: #16a34a; color: white; padding: 10px 14px; text-align: right; font-size: 14px; }
          td { padding: 9px 14px; border-bottom: 1px solid #d1fae5; font-size: 13px; }
          tr:nth-child(even) { background-color: #f0fdf4; }
          .total-row { background-color: #166534 !important; color: white; font-weight: bold; font-size: 14px; }
          .total-row td { border: none; }
          .footer { margin-top: 32px; display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 12px; }
        </style>
      </head>
      <body>${printContents}</body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `مداخيل-${MONTHS[selectedMonth - 1]}-${selectedYear}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setShowTable(false);
    setEntries(members.map(m => ({
      memberId: m.id,
      name: m.name,
      amount: '',
      day: new Date().getDate().toString(),
      month: selectedMonth
    })));
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-section, #print-section * { visibility: visible !important; }
          #print-section { position: fixed; top: 0; left: 0; right: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-6">📋 المداخيل الشهرية</h2>

      {/* Form */}
      {!showTable && (
        <div className="bg-white border-2 border-indigo-200 rounded-xl p-4 sm:p-6 shadow-sm">

          {/* Month & Year selector global */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📅 الشهر الافتراضي</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📆 السنة</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Members table */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-600 mb-3">
              💡 أدخل المبلغ فقط للأسر التي دفعت — يمكنك تغيير الشهر لكل أسرة على حدة
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-3 text-right">اسم الأسرة</th>
                    <th className="px-4 py-3 text-center w-36">المبلغ (MRO)</th>
                    <th className="px-4 py-3 text-center w-24">اليوم</th>
                    <th className="px-4 py-3 text-center w-36">الشهر</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={entry.memberId} className={idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
                      <td className="px-4 py-2.5 font-semibold text-gray-800">{entry.name}</td>

                      {/* المبلغ */}
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={(e) => updateEntry(entry.memberId, 'amount', e.target.value)}
                          placeholder="0"
                          min="0"
                          className={`w-full px-3 py-1.5 rounded-lg border-2 text-center font-bold text-sm transition-colors ${
                            entry.amount && parseFloat(entry.amount) > 0
                              ? 'border-green-400 bg-green-50 text-green-800'
                              : 'border-gray-300 bg-white text-gray-700'
                          }`}
                        />
                      </td>

                      {/* اليوم */}
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={entry.day}
                          onChange={(e) => updateEntry(entry.memberId, 'day', e.target.value)}
                          min="1"
                          max="31"
                          className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-300 text-center text-sm"
                        />
                      </td>

                      {/* الشهر — خاص بكل أسرة */}
                      <td className="px-2 py-2">
                        <select
                          value={entry.month}
                          onChange={(e) => updateEntry(entry.memberId, 'month', parseInt(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg border-2 border-indigo-300 text-center text-sm font-semibold bg-white"
                        >
                          {MONTHS.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          {filledEntries.length > 0 && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center text-sm">
              <span className="text-green-700 font-semibold">المجموع الكلي</span>
              <span className="font-bold text-green-800" dir="ltr">{totalAmount.toLocaleString()} MRO</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors shadow-md"
          >
            📊 إنشاء جدول الطباعة
          </button>
        </div>
      )}

      {/* Print Section */}
      {showTable && (
        <div>
          <div className="flex gap-3 mb-6 no-print flex-wrap">
            <button onClick={handlePrint} className="flex-1 sm:flex-none px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md">
              🖨️ طباعة
            </button>
            <button onClick={handleDownload} className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">
              ⬇️ تنزيل
            </button>
            <button onClick={handleReset} className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">
              🔄 إعادة تعيين
            </button>
          </div>

          {/* Printable content */}
          <div id="print-section" ref={printRef} className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-sm">

            {/* Header */}
            <div className="print-header text-center mb-6 pb-4 border-b-4 border-green-600">
              <img src="/talebmed.svg" alt="الطالب محمد" className="w-20 h-20 object-contain mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-green-800">صندوق أهل الطالب محمد</h1>
              <h2 className="text-lg font-semibold text-green-600 mt-1">
                المداخيل الشهرية — {selectedYear}
              </h2>
              <p className="text-sm text-gray-500 mt-1">تاريخ الإصدار: {new Date().toLocaleDateString('ar-MA')}</p>
            </div>

            {/* Table */}
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="px-4 py-3 text-right border border-green-500">#</th>
                  <th className="px-4 py-3 text-right border border-green-500">اسم الأسرة</th>
                  <th className="px-4 py-3 text-center border border-green-500">التاريخ</th>
                  <th className="px-4 py-3 text-center border border-green-500">الشهر</th>
                  <th className="px-4 py-3 text-center border border-green-500">المبلغ (MRO)</th>
                </tr>
              </thead>
              <tbody>
                {filledEntries.map((entry, idx) => (
                  <tr key={entry.memberId} className={idx % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                    <td className="px-4 py-3 border border-gray-200 text-gray-500 text-center">{idx + 1}</td>
                    <td className="px-4 py-3 border border-gray-200 font-semibold text-gray-800">{entry.name}</td>
                    <td className="px-4 py-3 border border-gray-200 text-center text-gray-600">
                      {entry.day}/{entry.month}/{selectedYear}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center text-gray-700 font-semibold">
                      {MONTHS[entry.month - 1]}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center font-bold text-green-700" dir="ltr">
                      {parseFloat(entry.amount).toLocaleString()} MRO
                    </td>
                  </tr>
                ))}
                <tr className="bg-green-700 text-white font-bold">
                  <td colSpan={4} className="px-4 py-3 border border-green-600 text-right text-base">
                    المجموع الكلي 
                  </td>
                  <td className="px-4 py-3 border border-green-600 text-center text-base" dir="ltr">
                    {totalAmount.toLocaleString()} MRO
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div className="mt-8 flex justify-between items-end text-xs text-gray-400 border-t pt-4">
              <span>صندوق أهل الطالب محمد</span>
              <span>المشرف العام: الخليل محمد الجراح</span>
              <span dir="ltr">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}