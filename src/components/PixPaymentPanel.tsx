"use client";

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generatePixPayload } from '@/lib/pix';

export default function PixPaymentPanel({ pixKey, managerName, amount }: { pixKey: string, managerName: string, amount: number }) {
  const [copied, setCopied] = useState(false);
  const payload = generatePixPayload(pixKey, amount);

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-2 border-yellow-500/50 rounded-xl p-4 sm:p-8 mb-8 shadow-[0_0_30px_rgba(234,179,8,0.1)] flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-black text-yellow-500 mb-2 text-center uppercase tracking-wide">⚠️ Palpites Pendentes!</h2>
      <p className="text-slate-300 mb-6 text-center text-sm sm:text-base max-w-lg">
        Para validar sua participação e concorrer aos prêmios, realize o Pix de <strong>R$ {amount.toFixed(2).replace('.', ',')}</strong>.
      </p>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center w-full max-w-3xl bg-slate-900/80 p-6 rounded-2xl border border-slate-700">
        
        {/* QR Code Section */}
        <div className="flex flex-col items-center gap-3 bg-white p-4 rounded-xl">
          <QRCodeSVG value={payload} size={180} level="M" includeMargin={false} />
          <span className="text-black font-bold text-sm">Escaneie para pagar</span>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
          <div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Destinatário (Seu Gerente):</p>
            <p className="text-lg sm:text-xl font-bold text-white">{managerName}</p>
          </div>
          
          <div className="w-full">
            <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Pix Copia e Cola:</p>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input 
                type="text" 
                readOnly 
                value={payload} 
                className="bg-slate-800 text-slate-300 text-xs sm:text-sm p-3 rounded-lg flex-1 border border-slate-700 focus:outline-none cursor-text truncate"
              />
              <button 
                onClick={handleCopy}
                className={`${copied ? 'bg-emerald-500' : 'bg-primary hover:bg-primary-dark'} text-black font-bold px-4 py-3 rounded-lg transition-colors whitespace-nowrap text-sm`}
              >
                {copied ? 'Copiado! ✓' : 'Copiar Código'}
              </button>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-2">
            Após o pagamento, envie o comprovante para seu gerente aprovar seu acesso.
          </p>
        </div>

      </div>
    </div>
  );
}
