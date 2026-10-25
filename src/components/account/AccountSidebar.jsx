import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AccountSidebar = ({ activeTab = 'orders' }) => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return 'TV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navItems = [
    {
      id: 'overview',
      label: 'OVERVIEW',
      icon: 'dashboard',
      to: '/orders'
    },
    {
      id: 'orders',
      label: 'MY ORDERS',
      icon: 'receipt_long',
      to: '/orders'
    },
    {
      id: 'tracking',
      label: 'ORDER TRACKING',
      icon: 'local_shipping',
      to: location.pathname.startsWith('/orders/') ? location.pathname : '/orders'
    },
    {
      id: 'addresses',
      label: 'SAVED ADDRESSES',
      icon: 'location_on',
      to: '/orders'
    },
    {
      id: 'wishlist',
      label: 'WISHLIST',
      icon: 'favorite',
      to: '/collection'
    },
    {
      id: 'settings',
      label: 'PROFILE SETTINGS',
      icon: 'settings',
      to: '/orders'
    }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-5">
      {/* User Identity Card */}
      <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-3.5 flex items-center gap-3">
        <div className="w-11 h-11 bg-[#1769FF] text-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center font-title text-[15px] font-bold shrink-0">
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-title text-[15px] text-[#171717] truncate leading-tight font-bold">
            {user?.name || 'Toyvolt Member'}
          </h2>
          <span className="inline-block mt-0.5 bg-[#FFF3DF] text-[#1769FF] font-label-sm text-[9px] uppercase font-bold px-1.5 py-0.2 border border-[#171717]">
            TOYVOLT EXPLORER
          </span>
        </div>
      </div>

      {/* Account Navigation List */}
      <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-2 sm:p-3">
        <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant tracking-wider px-2 py-1 block mb-1">
          ACCOUNT MENU
        </span>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`flex items-center gap-2.5 px-3 py-2 font-label-sm text-[11px] uppercase font-bold transition-all ${
                  isActive
                    ? 'bg-[#1769FF] text-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] -translate-y-0.5'
                    : 'text-[#171717] hover:bg-[#F0E8DA] border-2 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[17px] shrink-0">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Toyvolt Rewards / Club Card */}
      <div className="bg-[#FFDF90] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3">
        <span className="font-label-sm text-[10px] uppercase font-bold text-[#171717] block">
          TOYVOLT REWARDS
        </span>
        <p className="font-title text-[13px] font-bold text-[#171717] mt-0.5">
          540 PlayPoints Available
        </p>
        <span className="font-body-sm text-[11px] text-[#584400] block mt-1 leading-snug">
          Redeem on replacement parts or exclusive RC upgrades.
        </span>
      </div>

      {/* Sign Out Action */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 font-label-sm text-[11px] uppercase font-bold text-[#b52700] hover:bg-error-container hover:text-on-error-container border-2 border-dashed border-[#b52700]/40 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
};

export default AccountSidebar;
