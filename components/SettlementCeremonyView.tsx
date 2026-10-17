import React, { useState } from 'react';
import { Course, Enrollment, User, UserRole, TradeCertificate, SettlementPackage } from '../types';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle, 
  Lock, 
  Coins, 
  Wrench, 
  ScrollText, 
  HeartHandshake, 
  ExternalLink, 
  ArrowRight,
  TrendingUp,
  Gift
} from 'lucide-react';
import { DigitalCertificateModal } from './DigitalCertificateModal';

interface SettlementCeremonyViewProps {
  course: Course;
  enrollment: Enrollment;
  user: User;
  certificate?: TradeCertificate | null;
  onAuthorizeSettlement: (
    enrollmentId: string, 
    seedCapital: number, 
    equipment: string, 
    blessing: string
  ) => void;
  onClaimSettlement: (enrollmentId: string) => void;
  onFastTrackMilestones?: (enrollmentId: string) => void;
}

export const SettlementCeremonyView: React.FC<SettlementCeremonyViewProps> = ({
  course,
  enrollment,
  user,
  certificate,
  onAuthorizeSettlement,
  onClaimSettlement,
  onFastTrackMilestones
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seedCapital, setSeedCapital] = useState<number>(course.totalFee * 2.5); // Traditional seed capital multiple
  const [equipmentGrant, setEquipmentGrant] = useState<string>(
    course.skillTags.includes('Tailoring') 
      ? 'Industrial Sewing & Overlock Machine + Professional Fabric Shears'
      : course.skillTags.includes('Automotive') 
      ? 'OBD2 Vehicle Diagnostic Scanner + Professional Socket Ratchet Kit'
      : course.skillTags.includes('Solar') 
      ? 'Digital Solar Multimeter + MC4 Crimping Kit & Inverter Toolset'
      : 'Professional Master Artisan Trade Starter Toolkit'
  );
  
  const [selectedBlessing, setSelectedBlessing] = useState<string>(
    `May the work of your hands prosper across Nigeria and beyond. You have served with integrity, patience, and honor; now go forth and establish your own workshop.`
  );

  const completedCount = enrollment.progress.filter(p => p.status === 'completed').length;
  const totalMilestones = course.milestones.length;
  const isAllMilestonesCompleted = completedCount === totalMilestones;
  const isSettled = enrollment.status === 'completed' || !!enrollment.settlementPackage || !!certificate;

  const trustPoolGrantMatch = Math.round(seedCapital * 0.15); // 15% matching grant from trust pool

  const PRESET_BLESSINGS = [
    `May the work of your hands prosper across Nigeria and beyond. You have served with integrity, patience, and honor; now go forth and establish your own workshop.`,
    `A hands-on master never begs for bread. As you learned the sacred secrets of this craft, may your apprentices in turn honor and elevate your name.`,
    `Igbo proverb says: "Onye na-eme nke ọma, ihe ọma na-eso ya" (Goodness follows the diligent). Your training is complete; conquer the marketplace!`
  ];

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthorizeSettlement(enrollment.id, seedCapital, equipmentGrant, selectedBlessing);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cultural Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 p-6 md:p-8 text-white shadow-xl border border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Sparkles size={16} /> The Ancient Nigerian Apprenticeship Covenant
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-black tracking-wide text-white">
              The Settlement (Igba Boy / Imwa Oru) Ceremony
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              In Nigerian artisan tradition, graduation is marked by **Settlement** — the sacred milestone where a master doesn't just release an apprentice, but empowers them with seed capital, starter equipment, and ancestral blessings to open their own independent workshop.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center flex-shrink-0 w-full md:w-auto">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              Graduation Status
            </span>
            <div className="text-xl font-black mt-0.5 text-white flex items-center justify-center gap-1.5">
              {isSettled ? (
                <>
                  <CheckCircle className="text-emerald-400" size={20} /> Settled & Certified
                </>
              ) : isAllMilestonesCompleted ? (
                <>
                  <Sparkles className="text-amber-400" size={20} /> Ready for Settlement!
                </>
              ) : (
                <>
                  <Lock className="text-slate-400" size={18} /> In Training ({completedCount}/{totalMilestones})
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CASE 1: ALREADY SETTLED & CERTIFIED */}
      {isSettled && certificate && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-emerald-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-md flex-shrink-0">
                <div className="h-full w-full bg-white rounded-2xl flex items-center justify-center text-emerald-800">
                  <Award size={32} />
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Official Trade Credential Conferred
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Certificate of Mastery: {certificate.tradeSkill}
                </h3>
                <p className="text-xs text-slate-500">
                  Conferred on {certificate.issueDate} • Registry ID: <span className="font-mono font-bold text-slate-700">{certificate.id}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Award size={18} /> View Official Certificate & QR Code
            </button>
          </div>

          {/* Settlement Disbursement Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                <Coins size={16} className="text-amber-500" /> Seed Capital Disbursed
              </span>
              <div className="text-xl font-black text-slate-900">
                ₦{certificate.seedCapitalAmount.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                +₦{(enrollment.settlementPackage?.trustPoolGrant || 25000).toLocaleString()} Trust Pool Grant
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                <Wrench size={16} className="text-sky-500" /> Starter Equipment
              </span>
              <div className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                {certificate.equipmentGrant}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Handover complete & verified
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                <ShieldCheck size={16} className="text-emerald-500" /> Trade Honor Rank
              </span>
              <div className="text-base font-bold text-purple-700">
                {certificate.grade}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Seal: {certificate.guildSealNumber}
              </p>
            </div>
          </div>

          {/* Master Blessing Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
            <span className="text-xs font-serif italic text-amber-900 block">
              "{certificate.masterBlessing}"
            </span>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mt-1 block">
              — Master Craftsman {certificate.ogaName}
            </span>
          </div>
        </div>
      )}

      {/* CASE 2: ALL MILESTONES COMPLETED BUT NOT YET SETTLED */}
      {!isSettled && isAllMilestonesCompleted && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-amber-300 space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles size={24} />
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                All Training Milestones Completed!
              </h3>
              <p className="text-xs text-slate-500">
                The apprentice has successfully completed all coursework, safety exams, and practical tasks.
              </p>
            </div>
          </div>

          {/* If current user is OGA (Master) */}
          {user.role === UserRole.OGA ? (
            <form onSubmit={handleAuthorize} className="space-y-5 border-t border-slate-100 pt-6">
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
                As Master Oga, you are now authorized to formalize your apprentice's settlement. Configure their seed capital endowment, gifted trade tools, and confer your traditional blessings.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seed Capital Settlement Amount (NGN)
                  </label>
                  <input
                    type="number"
                    value={seedCapital}
                    onChange={(e) => setSeedCapital(Number(e.target.value))}
                    min={10000}
                    step={5000}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                    +₦{trustPoolGrantMatch.toLocaleString()} Community Trust Pool Grant will automatically be added!
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Starter Equipment & Tooling Grant
                  </label>
                  <input
                    type="text"
                    value={equipmentGrant}
                    onChange={(e) => setEquipmentGrant(e.target.value)}
                    placeholder="e.g. Industrial Sewing Machine, Multimeter, Toolkit"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Traditional Master's Blessing & Endorsement
                </label>
                <div className="space-y-2 mb-2">
                  {PRESET_BLESSINGS.map((blessing, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedBlessing(blessing)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs leading-relaxed transition-all ${
                        selectedBlessing === blessing 
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-medium' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      "{blessing}"
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  value={selectedBlessing}
                  onChange={(e) => setSelectedBlessing(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <HeartHandshake size={18} /> Authorize Settlement & Confer Certificate of Mastery
                </button>
              </div>
            </form>
          ) : (
            /* If current user is Apprentice */
            <div className="border-t border-slate-100 pt-6 text-center space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200">
                <h4 className="font-serif font-bold text-xl text-emerald-950 mb-2">
                  Congratulations! Your Training is Complete.
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your Master Oga has verified all milestones. Awaiting formal settlement authorization and graduation certificate disbursement.
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => onClaimSettlement(enrollment.id)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
                  >
                    <Gift size={16} /> Request Master's Final Settlement & Blessing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CASE 3: IN TRAINING - MILESTONES REMAINING */}
      {!isSettled && !isAllMilestonesCompleted && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Apprenticeship Settlement Pathway
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete all {totalMilestones} curriculum milestones to unlock the formal Settlement Package & Digital Trade Certificate.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Curriculum Progress</span>
              <span className="text-lg font-black text-emerald-600">
                {Math.round((completedCount / totalMilestones) * 100)}% Complete
              </span>
            </div>
          </div>

          {/* Step Progress Checklist */}
          <div className="space-y-3">
            {course.milestones.map((m, idx) => {
              const status = enrollment.progress.find(p => p.milestoneId === m.id)?.status || 'pending';
              const isDone = status === 'completed';

              return (
                <div 
                  key={m.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                    isDone 
                      ? 'bg-emerald-50/50 border-emerald-200' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isDone ? <CheckCircle size={16} /> : idx + 1}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{m.title}</h5>
                      <span className="text-[11px] text-slate-500">{m.durationDays} Days • {m.paymentPercent}% Escrow</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    isDone 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Settlement Preview Teaser */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-sky-50 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Coins className="text-amber-500 flex-shrink-0" size={20} />
              <div>
                <span className="font-bold text-slate-900 block">Estimated Settlement Endowment:</span>
                <span className="text-slate-600">₦{seedCapital.toLocaleString()} Seed Capital + Community Trust Pool Matching Grant</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onFastTrackMilestones && (
                <button
                  type="button"
                  onClick={() => onFastTrackMilestones(enrollment.id)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-all flex items-center gap-1"
                >
                  <Sparkles size={13} /> Complete Milestones (Demo)
                </button>
              )}
              <span className="text-sky-700 font-bold self-end sm:self-auto">
                Unlocks at 100% →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {certificate && (
        <DigitalCertificateModal
          certificate={certificate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
