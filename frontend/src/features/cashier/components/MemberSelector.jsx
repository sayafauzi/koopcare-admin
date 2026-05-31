// frontend/src/features/cashier/components/MemberSelector.jsx
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import Input from '../../../components/ui/Input';
import { fetchMembers } from '../../../services/memberService';
import { formatCurrency } from '../../../utils/formatters';

const MemberSelector = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length > 2) {
      setLoading(true);
      fetchMembers(1, search, 5)
        .then(res => setMembers(res.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setMembers([]);
    }
  }, [search]);

  return (
    <div className="w-full">
      {/* Input pencarian dengan ikon */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Cari nama atau NIK"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status loading */}
      {loading && (
        <div className="mt-3 text-center text-sm text-neutral-400">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600 mr-2" />
          Mencari...
        </div>
      )}

      {/* Daftar anggota */}
      {!loading && members.length > 0 && (
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => onSelect(member)}
              className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-800 truncate">{member.full_name}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500 mt-0.5">
                    <span>{member.nik}</span>
                    <span>•</span>
                    <span>Saldo {formatCurrency(member.balance)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Tidak ada hasil */}
      {!loading && search.length > 2 && members.length === 0 && (
        <div className="mt-4 text-center text-sm text-neutral-400">
          Tidak ditemukan
        </div>
      )}

      {/* Pesan awal (belum mengetik) */}
      {!loading && search.length === 0 && (
        <div className="mt-4 text-center text-xs text-neutral-400">
          Ketik minimal 3 karakter
        </div>
      )}
    </div>
  );
};

export default MemberSelector;