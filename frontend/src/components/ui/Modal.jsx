import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = 'Simpan', cancelText = 'Batal', showConfirm = true }) => {
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : 'unset'; return () => { document.body.style.overflow = 'unset'; }; }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10">
          <div className="px-6 py-4 border-b"><h3 className="text-lg font-semibold">{title}</h3></div>
          <div className="px-6 py-4">{children}</div>
          <div className="px-6 py-4 border-t flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>{cancelText}</Button>
            {showConfirm && <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;