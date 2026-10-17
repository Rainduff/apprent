import React, { useState } from 'react';
import { TradeCertificate } from '../types';
import { 
  Award, 
  CheckCircle, 
  Printer, 
  Share2, 
  Copy, 
  X, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  QrCode,
  Hexagon
} from 'lucide-react';

interface DigitalCertificateModalProps {
  certificate: TradeCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrExpanded, setShowQrExpanded] = useState(false);

  if (!isOpen || !certificate) return null;

  const verificationUrl = `${window.location.origin}/?verify=${certificate.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-300 print:shadow-none print:border-none my-8">
        
        {/* Modal Toolbar (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
              <Award size={18} />
            </span>
            <span className="font-bold text-sm tracking-wide">
              Official Digital Trade Credential • {certificate.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              title="Print or Save PDF"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors"
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Verification URL'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-6 md:p-10 bg-[#faf8f2] relative selection:bg-amber-100">
          {/* Subtle Guilloche / Watermark Pattern Background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          {/* Outer Ornamental Frame */}
          <div className="border-[6px] border-double border-emerald-900 rounded-2xl p-6 md:p-8 relative bg-white/95 shadow-inner">
            
            {/* Corner Decorative Ornaments */}
            <div className="absolute -top-3 -left-3 h-8 w-8 bg-amber-500 rotate-45 rounded-sm flex items-center justify-center text-slate-950 font-black text-xs shadow-md">❖</div>
            <div className="absolute -top-3 -right-3 h-8 w-8 bg-amber-500 rotate-45 rounded-sm flex items-center justify-center text-slate-950 font-black text-xs shadow-md">❖</div>
            <div className="absolute -bottom-3 -left-3 h-8 w-8 bg-amber-500 rotate-45 rounded-sm flex items-center justify-center text-slate-950 font-black text-xs shadow-md">❖</div>
            <div className="absolute -bottom-3 -right-3 h-8 w-8 bg-amber-500 rotate-45 rounded-sm flex items-center justify-center text-slate-950 font-black text-xs shadow-md">❖</div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">🦅</span>
                <span className="text-sm font-black text-emerald-900 tracking-[0.25em] uppercase">
                  Federal Republic of Nigeria
                </span>
                <span className="text-3xl">🌿</span>
              </div>
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                National Apprenticeship & Artisanal Mastery Guild • Igba Boy Council
              </div>
              
              <div className="pt-2">
                <h1 className="text-2xl md:text-3xl font-serif font-black tracking-wide text-slate-900 uppercase">
                  Certificate of Trade Mastery & Settlement
                </h1>
                <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
              </div>
            </div>

            {/* Recipient Statement */}
            <div className="text-center space-y-3 my-6 max-w-2xl mx-auto">
              <p className="text-xs font-serif italic text-slate-600">
                This certifies that following the venerable tradition of ancestral apprenticeship and practical rigor,
              </p>
              
              <div className="py-2">
                <span className="text-2xl md:text-3xl font-serif font-bold text-emerald-950 underline decoration-amber-400 decoration-2 underline-offset-8">
                  {certificate.apprenticeName}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                has successfully fulfilled all required milestones, practical safety evaluations, and trade syllabi in:
              </p>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl py-2 px-4 inline-block">
                <span className="font-bold text-sm md:text-base text-emerald-900">
                  {certificate.tradeSkill}
                </span>
                <span className="text-xs text-emerald-700 block mt-0.5">
                  ({certificate.courseTitle})
                </span>
              </div>

              <p className="text-xs text-slate-600">
                under the direct mentorship and guild oversight of Master Craftsman:
              </p>
              
              <div className="font-serif font-bold text-slate-900 text-lg">
                Chief Oga {certificate.ogaName}
              </div>
            </div>

            {/* Cultural Blessing / Settlement Decree */}
            <div className="my-6 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-center relative max-w-2xl mx-auto">
              <span className="text-amber-800 font-serif italic text-xs leading-relaxed block">
                "{certificate.masterBlessing}"
              </span>
              <span className="text-[10px] text-amber-700/80 font-bold uppercase tracking-widest mt-1 block">
                — Master Craftsman's Traditional Blessing & Settlement Charter
              </span>
            </div>

            {/* Settlement Grant Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-center max-w-2xl mx-auto">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Seed Capital Released</span>
                <span className="text-sm font-black text-emerald-700 font-mono">₦{certificate.seedCapitalAmount.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Starter Tooling Grant</span>
                <span className="text-xs font-bold text-slate-800 line-clamp-1" title={certificate.equipmentGrant}>
                  {certificate.equipmentGrant}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Mastery Honor Grade</span>
                <span className="text-xs font-bold text-purple-700">{certificate.grade}</span>
              </div>
            </div>

            {/* Bottom Row: Seals, Signatures, and Scannable QR Code */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Master Signature Block */}
              <div className="text-center md:text-left space-y-1">
                <div className="font-serif italic text-base text-slate-800 font-semibold border-b border-slate-300 pb-1">
                  Oga {certificate.ogaName}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">
                  Master Artisan Signature
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Conferred: {certificate.issueDate}
                </div>
              </div>

              {/* Golden Wax Seal */}
              <div className="relative flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-lg flex items-center justify-center">
                  <div className="h-full w-full rounded-full border border-amber-700/60 flex flex-col items-center justify-center text-center bg-amber-500/20 backdrop-blur-sm">
                    <ShieldCheck size={24} className="text-amber-900" />
                    <span className="text-[8px] font-black text-amber-950 uppercase tracking-tighter">
                      Guild Seal
                    </span>
                  </div>
                </div>
                <span className="text-[9px] text-amber-900 font-bold mt-1 font-mono">
                  {certificate.guildSealNumber}
                </span>
              </div>

              {/* Scannable Verification QR Code & Hash */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                {/* SVG QR Code Graphic */}
                <div 
                  onClick={() => setShowQrExpanded(!showQrExpanded)}
                  className="h-16 w-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
                  title="Click to inspect verification QR"
                >
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    {/* Stylized QR Code Pattern */}
                    <rect x="0" y="0" width="30" height="30" rx="4" fill="#064e3b" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="#064e3b" />
                    
                    <rect x="70" y="0" width="30" height="30" rx="4" fill="#064e3b" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="#064e3b" />
                    
                    <rect x="0" y="70" width="30" height="30" rx="4" fill="#064e3b" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="#064e3b" />
                    
                    {/* Matrix data cells */}
                    <rect x="40" y="10" width="8" height="8" fill="#0f172a" />
                    <rect x="55" y="15" width="8" height="8" fill="#0f172a" />
                    <rect x="40" y="30" width="8" height="8" fill="#0f172a" />
                    <rect x="20" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="35" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="50" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="65" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="80" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="45" y="60" width="8" height="8" fill="#0f172a" />
                    <rect x="60" y="60" width="8" height="8" fill="#0f172a" />
                    <rect x="40" y="75" width="8" height="8" fill="#0f172a" />
                    <rect x="55" y="80" width="8" height="8" fill="#0f172a" />
                    <rect x="75" y="75" width="15" height="15" fill="#d97706" rx="2" />
                  </svg>
                </div>
                <div className="text-left text-[10px] space-y-0.5">
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle size={10} /> Verified On-Chain
                  </div>
                  <div className="font-mono text-slate-500 truncate max-w-[150px]">
                    Hash: {certificate.verificationHash.slice(0, 16)}...
                  </div>
                  <div className="text-slate-400">
                    Scan for Public Registry
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Footer Text */}
            <div className="mt-6 pt-3 border-t border-slate-100 text-center text-[9px] text-slate-400">
              National Apprenticeship Verification Registry • Immutable record preserved in AquaFlow Community Trust Pool • Verified Authentic
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-medium">Certificate Identifier:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
              {certificate.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Printer size={16} /> Print Official Copy
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
