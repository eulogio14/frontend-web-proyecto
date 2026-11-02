import React from 'react';
import { Hammer, ArrowLeft } from 'lucide-react';

export default function EnConstruccion({ titulo = 'Esta sección', onVolver }) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0b141a]">
      <div className="text-center px-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1f2c33] flex items-center justify-center">
          <Hammer className="w-7 h-7 text-[#8696a0]" />
        </div>
        <h2 className="text-lg font-medium text-white mb-2">Esta sección está en construcción</h2>
        <p className="text-sm text-[#8696a0] mb-6">{titulo}</p>
        {onVolver && (
          <button
            onClick={onVolver}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a884] text-black hover:opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Mensajes
          </button>
        )}
      </div>
    </div>
  );
}
