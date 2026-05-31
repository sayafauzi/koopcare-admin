import React, { useState, useEffect } from 'react';
import { fetchInviteCodes, createInviteCode } from '../../../services/inviteCodeService';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/formatters';

const InviteCodeWidget = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadCodes = async () => {
    setLoading(true);
    try {
      const res = await fetchInviteCodes();
      setCodes(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadCodes(); }, []);
  const handleCreate = async () => {
    await createInviteCode(30, 1);
    loadCodes();
  };
  const latestCode = codes[0];
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
      <h3 className="text-md font-semibold text-neutral-800 mb-3">Kode Undangan</h3>
      {loading && <p>Memuat...</p>}
      {!loading && latestCode && (
        <div className="bg-neutral-100 p-3 rounded-lg text-center">
          <code className="text-sm font-mono text-primary-700">{latestCode.code}</code>
          <p className="text-xs text-neutral-500 mt-1">
            {latestCode.used_count}/{latestCode.max_uses} digunakan
          </p>
          <p className="text-xs text-neutral-500">
            Berlaku hingga {formatDate(latestCode.valid_until)}
          </p>
        </div>
      )}
      {!loading && !latestCode && <p className="text-sm text-neutral-500">Belum ada kode undangan</p>}
      <Button onClick={handleCreate} className="mt-3 w-full">Buat Kode Baru</Button>
    </div>
  );
};
export default InviteCodeWidget;