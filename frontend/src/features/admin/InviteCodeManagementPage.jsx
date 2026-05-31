import React, { useState } from 'react';
import { useInviteCodes } from './hooks/useInviteCodes';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatters';

const InviteCodeManagementPage = () => {
    const { codes, loading, error, pagination, loadCodes, handleCreate, handleRevoke, handleExtend } = useInviteCodes();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [validDays, setValidDays] = useState(30);
    const [maxUses, setMaxUses] = useState(1);
    const [createLoading, setCreateLoading] = useState(false);

    const onCreateSubmit = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        const success = await handleCreate(validDays, maxUses);
        setCreateLoading(false);
        if (success) setIsCreateModalOpen(false);
    };

    const columns = [
        { header: 'Kode', accessor: 'code' },
        { header: 'Dibuat Oleh', accessor: 'creator_name' },
        { header: 'Berlaku Sampai', accessor: (row) => formatDate(row.valid_until) },
        { header: 'Maks Penggunaan', accessor: 'max_uses' },
        { header: 'Digunakan', accessor: 'used_count' },
        {
            header: 'Status',
            accessor: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.status === 'active' ? 'Aktif' : 'Kadaluarsa'}
                </span>
            )
        },
        {
            header: 'Aksi',
            accessor: (row) => (
                <div className="flex gap-2">
                    {row.status === 'active' && (
                        <Button size="sm" variant="danger" onClick={() => handleRevoke(row.id)}>Cabut</Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => {
                        const days = prompt('Tambahkan berapa hari?', '30');
                        if (days && !isNaN(parseInt(days))) handleExtend(row.id, parseInt(days));
                    }}>Perpanjang</Button>
                </div>
            )
        },
    ];

    if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
    if (error) return <div className="bg-red-50 text-red-700 p-4 rounded-xl">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary-700">Manajemen Kode Undangan</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>Buat Kode Baru</Button>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <Table columns={columns} data={codes} />
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" disabled={pagination.page === 1} onClick={() => loadCodes(pagination.page - 1)}>Previous</Button>
                    <span className="py-2 px-3 text-sm">Halaman {pagination.page} / {pagination.totalPages}</span>
                    <Button variant="outline" disabled={pagination.page === pagination.totalPages} onClick={() => loadCodes(pagination.page + 1)}>Next</Button>
                </div>
            )}

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Buat Kode Undangan Baru" onConfirm={onCreateSubmit} confirmText="Buat" loading={createLoading}>
                <div className="space-y-3">
                    <Input type="number" label="Masa berlaku (hari)" value={validDays} onChange={(e) => setValidDays(parseInt(e.target.value))} min={1} required />
                    <Input type="number" label="Maksimal penggunaan" value={maxUses} onChange={(e) => setMaxUses(parseInt(e.target.value))} min={1} required />
                    <p className="text-xs text-neutral-500">Kode akan dibuat secara otomatis dengan format KOD-XXXXXX</p>
                </div>
            </Modal>
        </div>
    );
};

export default InviteCodeManagementPage;