import React from 'react';
import { Shovel, ShieldCheck, TimerReset, Users } from 'lucide-react';

const KoopCareSlogan = () => {
  return (
    <div className="md:w-1/2 bg-primary text-white flex items-center justify-center p-8 md:p-12">
      <div className="max-w-md w-full">
        {}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 bg-secondary/20 rounded-xl">
            <Shovel className="h-9 w-9 text-secondary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">KoopCare</h1>
        </div>

        {/* Tagline */}
        <p className="text-gray-100 mb-10 leading-relaxed">
          Empowering the Ummah through transparent and fair digital cooperative solutions.
        </p>

        {/* Daftar Fitur (Sesuai Ikon Gambar) */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-secondary mt-0.5" />
            <p className="text-sm">Sharia-compliant financial services</p>
          </div>
          
          <div className="flex items-start gap-4">
            <TimerReset className="h-6 w-6 text-secondary mt-0.5" />
            <p className="text-sm">24/7 secure access to your account</p>
          </div>
          
          <div className="flex items-start gap-4">
            <Users className="h-6 w-6 text-secondary mt-0.5" />
            <p className="text-sm">Join 50,000+ cooperative members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KoopCareSlogan;