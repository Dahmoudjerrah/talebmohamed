
'use client';

import { useState } from 'react';
import SubscriptionsTab from '../components/SubscriptionsTab';
import AssistanceTab from '../components/AssistanceTab';
import SummaryTab from '../components/SummaryTab';
import LoginForm from '../components/LoginForm';
import MonthlyIncomeForm from '../components/MonthlyIncomeForm';
import { useAuth } from '../components/AuthProvider';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'assistance' | 'summary' | 'monthly'>('subscriptions');
  const [guestMode, setGuestMode] = useState(false);
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Show login page with option to continue as guest
  if (!user && !guestMode) {
    return <LoginForm onGuestAccess={() => setGuestMode(true)} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with user info */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-900">
                أهل الطالب محمد
              </h1>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-gray-600">
                      {isAdmin ? '🔐 مشرف' : '👁️ مستخدم'}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">{user.email}</p>
                  </div>
                  <button
                    onClick={signOut}
                    className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-gray-600">👁️  الزائر</p>
                    
                  </div>
                  <button
                    onClick={() => setGuestMode(false)}
                    className="px-3 sm:px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-xs sm:text-sm"
                  >
                    تسجيل الدخول
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            نظام إدارة الاشتراكات والمساعدات
          </p>
          {!user && guestMode && (
            <div className="mt-2 text-center">
              <p className="text-xs sm:text-sm text-yellow-700 bg-yellow-50 py-2 px-4 rounded-lg inline-block">
                 أنت في وضع المشاهدة فقط   
              </p>
            </div>
          )}
        </div>

        {/* Navigation Tabs - Mobile Friendly */}
        <div className="bg-white rounded-lg shadow-lg mb-4 sm:mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'subscriptions'
                  ? 'bg-indigo-600 text-white border-b-4 border-indigo-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="inline-block sm:hidden">📊</span>
              <span className="hidden sm:inline">📊 الاشتراكات</span>
              <span className="block sm:hidden text-xs mt-1">الاشتراكات</span>
            </button>
            <button
              onClick={() => setActiveTab('assistance')}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'assistance'
                  ? 'bg-indigo-600 text-white border-b-4 border-indigo-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="inline-block sm:hidden">💰</span>
              <span className="hidden sm:inline">💰 المساعدات</span>
              <span className="block sm:hidden text-xs mt-1">المساعدات</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'summary'
                  ? 'bg-indigo-600 text-white border-b-4 border-indigo-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="inline-block sm:hidden">📈</span>
              <span className="hidden sm:inline">📈 الملخص</span>
              <span className="block sm:hidden text-xs mt-1">الملخص</span>
            </button>
             {isAdmin && (
              <button
                onClick={() => setActiveTab('monthly')}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold transition-colors text-sm sm:text-base ${
                  activeTab === 'monthly'
                    ? 'bg-indigo-600 text-white border-b-4 border-indigo-600'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="inline-block sm:hidden">🖨️</span>
                <span className="hidden sm:inline">🖨️ المداخيل الشهرية</span>
                <span className="block sm:hidden text-xs mt-1">المداخيل</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
          {activeTab === 'subscriptions' && <SubscriptionsTab />}
          {activeTab === 'assistance' && <AssistanceTab />}
          {activeTab === 'summary' && <SummaryTab />}
          {activeTab === 'monthly' && isAdmin && <MonthlyIncomeForm />}
        </div>
      </div>
    </main>
  );
}