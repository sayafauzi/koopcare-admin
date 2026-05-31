// frontend/src/features/members/hooks/useMembers.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMembers, resetMemberPin, toggleMemberStatus } from '../../../services/memberService';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(''); // '', 'admin', 'member'
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef(null);

  // Debounce search
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  const loadMembers = useCallback(async (page = 1, searchTerm = debouncedSearch, role = roleFilter) => {
    setLoading(true);
    try {
      const res = await fetchMembers(page, searchTerm, 10, role);
      setMembers(res.data);
      setPagination({
        page: res.pagination.page,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat anggota');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter]);

  // Saat debouncedSearch atau roleFilter berubah, reset ke halaman 1
  useEffect(() => {
    loadMembers(1);
  }, [debouncedSearch, roleFilter, loadMembers]);

  const resetPin = async (id) => {
    try {
      const res = await resetMemberPin(id);
      alert(`PIN berhasil direset. PIN baru: ${res.newPin}`);
      loadMembers(pagination.page);
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Reset PIN gagal');
      return false;
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await toggleMemberStatus(id);
      alert(res.message);
      loadMembers(pagination.page);
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengubah status');
      return false;
    }
  };

  return {
    members,
    loading,
    error,
    pagination,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    loadMembers,
    resetPin,
    toggleStatus,
  };
};