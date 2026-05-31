// frontend/src/features/members/MemberListPage.jsx
import React, { useState } from 'react';
import { useMembers } from './hooks/useMembers';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { formatPhoneToWaLink } from '../../utils/formatters';

const roleOptions = [
  { value: '', label: 'Semua' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Anggota' },
];

const MemberListPage = () => {
  const {
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
  } = useMembers();

  const [selectedMember, setSelectedMember] = useState(null);
  const [modalType, setModalType] = useState(null);

  const handleResetPin = (member) => {
    setSelectedMember(member);
    setModalType('reset');
  };

  const handleToggleStatus = (member) => {
    setSelectedMember(member);
    setModalType('toggle');
  };

  const confirmAction = async () => {
    if (modalType === 'reset') {
      await resetPin(selectedMember.id);
    } else if (modalType === 'toggle') {
      await toggleStatus(selectedMember.id);
    }
    setModalType(null);
    setSelectedMember(null);
  };

  const columns = [
    { header: 'NAMA', accessor: 'full_name' },
    { header: 'NIK', accessor: 'nik' },
    { header: 'WHATSAPP', accessor: 'phone' },
    {
      header: 'ROLE',
      accessor: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          row.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {row.role === 'admin' ? 'Admin' : 'Anggota'}
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessor: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status === 'ACTIVE' ? 'AKTIF' : 'NONAKTIF'}
        </span>
      ),
    },
    {
      header: 'AKSI',
      accessor: (row) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleResetPin(row)}>
            Reset PIN
          </Button>
          <Button
            size="sm"
            variant={row.status === 'ACTIVE' ? 'danger' : 'success'}
            onClick={() => handleToggleStatus(row)}
          >
            {row.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
          </Button>
        </div>
      ),
    },
    {
      header: 'WA',
      accessor: (row) => (
        <a
          href={`https://wa.me/${formatPhoneToWaLink(row.phone)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 transition-colors inline-flex"
          title="Chat via WhatsApp"
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
        </a>
      ),
      align: 'text-center',
    },
  ];

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (error) return <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center">{error}</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary-700">Daftar Anggota</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Cari Nama / NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Select
            label=""
            options={roleOptions}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table columns={columns} data={members} />
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-3">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => loadMembers(pagination.page - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-neutral-600">
            Halaman {pagination.page} dari {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => loadMembers(pagination.page + 1)}
          >
            Berikutnya
          </Button>
        </div>
      )}

      <Modal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        title={modalType === 'reset' ? 'Reset PIN Anggota' : 'Ubah Status Anggota'}
        onConfirm={confirmAction}
        confirmText={modalType === 'reset' ? 'Reset PIN' : 'Ya, Ubah Status'}
      >
        <p>
          {modalType === 'reset'
            ? `Reset PIN untuk ${selectedMember?.full_name}? PIN baru akan dihasilkan secara acak.`
            : `Ubah status anggota ${selectedMember?.full_name} menjadi ${
                selectedMember?.status === 'ACTIVE' ? 'NONAKTIF' : 'AKTIF'
              }?`}
        </p>
      </Modal>
    </div>
  );
};

export default MemberListPage;