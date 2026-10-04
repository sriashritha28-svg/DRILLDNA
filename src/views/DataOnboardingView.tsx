import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ONBOARDING_SEED_FILES } from '../data/mockData';
import { SyntheticDataBadge } from '../components/common/SyntheticDataBadge';
import { DegradedBanner } from '../components/common/DegradedBanner';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Lock,
  Layers,
  FileCheck,
  RefreshCw,
  Info,
  Server,
  Database,
  ArrowRight,
} from 'lucide-react';

export const DataOnboardingView: React.FC = () => {
  const { currentRole, logAction } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('reports');
  const [adapterMode, setAdapterMode] = useState<'simulator' | 'pilot'>('simulator');
  const [adapterProtocol, setAdapterProtocol] = useState<'WITSML' | 'MQTT' | 'OPC-UA' | 'REST'>('WITSML');
  const [uploadedFiles, setUploadedFiles] = useState(ONBOARDING_SEED_FILES);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const isAdmin = currentRole === 'Administrator';

  const handleSimulatedUpload = (categoryName: string, defaultName: string) => {
    setIsUploading(true);
    setUploadSuccessMsg(null);
    setTimeout(() => {
      setIsUploading(false);
      const newFile = {
        id: `ONB-${Date.now().toString().slice(-4)}`,
        category: categoryName,
        fileName: defaultName,
        recordsCount: Math.floor(Math.random() * 20) + 10,
        uploadDate: new Date().toISOString().slice(0, 10),
        parsedStatus: 'Validated' as const,
        confidence: 97,
        notes: 'Schema parsed and schema verified against Oil India Pilot standards.',
      };
      setUploadedFiles((prev) => [newFile, ...prev]);
      setUploadSuccessMsg(`Successfully uploaded and validated "${defaultName}" (Schema verified).`);
      logAction('DATA_ONBOARDING_UPLOAD', `Uploaded and validated ${defaultName} in category ${categoryName}`);
    }, 800);
  };

  return (
    <div className="space-y-5">
      <DegradedBanner />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#DDE6EA]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold font-display text-[#12324A] tracking-tight">
              Data Onboarding & Integration Portal
            </h1>
            <SyntheticDataBadge />
          </div>
          <p className="text-xs text-[#667B89] mt-0.5">
            Structured ingestion pipeline for historical Daily Drilling Reports, formation tops, survey records, and telemetry adapters
          </p>
        </div>

        <div className="text-xs text-[#1677B8] bg-[#EEF7FB] px-3 py-1.5 rounded-lg border border-[#1677B8]/30 font-medium">
          Sandbox Intake Pipeline Active
        </div>
      </div>

      {/* Onboarding Notice */}
      <div className="p-3.5 bg-[#FFF7E8] border border-[#D38B22]/30 rounded-xl text-xs text-[#193040] leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#D38B22] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#12324A]">Data Governance Isolation:</strong> All records processed in this sandbox portal are validated locally using the Oil India pilot ingestion schema. Official production asset data requires OIL administrative clearance and SME review before promotion into canonical formation memory.
        </div>
      </div>

      {/* Navigation Tabs for Onboarding Modules */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DDE6EA] text-xs font-medium">
        <button
          onClick={() => setActiveCategory('reports')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeCategory === 'reports'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          A. Historical DDR / WCR Reports
        </button>

        <button
          onClick={() => setActiveCategory('formations')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeCategory === 'formations'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          B. Formation Tops & Surveys
        </button>

        <button
          onClick={() => setActiveCategory('events')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeCategory === 'events'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          C. Historical Event Records
        </button>

        <button
          onClick={() => setActiveCategory('construction')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeCategory === 'construction'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          D. Casing & Mud Programs
        </button>

        <button
          onClick={() => setActiveCategory('adapter')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeCategory === 'adapter'
              ? 'border-[#1677B8] text-[#1677B8] font-bold'
              : 'border-transparent text-[#667B89] hover:text-[#193040]'
          }`}
        >
          E. Live Stream Telemetry Adapter
        </button>
      </div>

      {uploadSuccessMsg && (
        <div className="p-3 bg-[#EEF9F2] border border-[#2F8F5B]/30 rounded-lg text-xs text-[#2F8F5B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Module Body Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 5 Cols: Ingestion Action & Schema Form */}
        <div className="lg:col-span-5 bg-white border border-[#DDE6EA] rounded-xl p-4 shadow-xs space-y-4 text-xs">
          {activeCategory === 'reports' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
                Historical DDR & WCR PDF Ingestion
              </h3>
              <p className="text-[#667B89] leading-relaxed text-[11px]">
                Upload Daily Drilling Reports (DDR) and Well Completion Reports (WCR) in PDF format. The OCR pipeline extracts operational tour summaries, mud properties, and depth intervals.
              </p>

              {/* Upload Dropzone */}
              <div
                onClick={() =>
                  handleSimulatedUpload(
                    'Historical Reports',
                    'DDR_OIL_Pilot_Candidate_BRL14.pdf'
                  )
                }
                className="border-2 border-dashed border-[#DDE6EA] hover:border-[#1677B8] rounded-xl p-6 text-center cursor-pointer bg-[#F8FAFC] transition-colors"
              >
                <UploadCloud className="w-8 h-8 text-[#1677B8] mx-auto mb-2" />
                <div className="font-bold text-[#12324A]">Click to Upload DDR/WCR PDF</div>
                <div className="text-[11px] text-[#8FA1AC] mt-1">PDF format · Max 50 MB per batch</div>
                {isUploading && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#1677B8]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running OCR & entity extraction...</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#F5F8FA] rounded-lg border border-[#DDE6EA] text-[11px] space-y-1">
                <div className="font-semibold text-[#12324A]">Automated Extraction Stages:</div>
                <div>1. High-resolution OCR & layout segmentation</div>
                <div>2. Tour narrative extraction & timestamp alignment</div>
                <div>3. Mud loss & precursor incident detection</div>
                <div>4. Page-level bounding box citation generation</div>
              </div>
            </div>
          )}

          {activeCategory === 'formations' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
                Formation Tops & Survey Ingestion
              </h3>
              <p className="text-[#667B89] leading-relaxed text-[11px]">
                Upload CSV or Excel files containing canonical formation boundaries, stratigraphic aliases, and directional survey stations.
              </p>

              {/* Expected Schema Box */}
              <div className="p-3 bg-[#EEF7FB] border border-[#1677B8]/20 rounded-lg text-[11px] space-y-1 font-mono">
                <div className="font-sans font-semibold text-[#12324A]">Expected Schema Fields:</div>
                <div className="text-[#1677B8]">
                  well_id, formation, top_md_m, base_md_m, top_tvd_m, base_tvd_m, datum, inclination, azimuth
                </div>
              </div>

              <button
                disabled={isUploading}
                onClick={() =>
                  handleSimulatedUpload(
                    'Formations & Surveys',
                    'Formation_Tops_Candidate_Barail_South.csv'
                  )
                }
                className="w-full py-2.5 bg-[#12324A] hover:bg-[#1F4E6B] text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-[#118A8A]" />
                <span>Upload Formations CSV/XLSX</span>
              </button>
            </div>
          )}

          {activeCategory === 'events' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
                Historical Event Records Ingestion
              </h3>
              <p className="text-[#667B89] leading-relaxed text-[11px]">
                Upload documented event records for mud losses, tight hole, pack-off, and well control incidents.
              </p>

              <div className="p-3 bg-[#EEF7FB] border border-[#1677B8]/20 rounded-lg text-[11px] space-y-1 font-mono">
                <div className="font-sans font-semibold text-[#12324A]">Expected Schema Fields:</div>
                <div className="text-[#1677B8]">
                  well_id, event_type, severity, start_time, end_time, depth_md_m, depth_tvd_m, source_document, source_page
                </div>
              </div>

              <button
                disabled={isUploading}
                onClick={() =>
                  handleSimulatedUpload(
                    'Event Records',
                    'Historical_Loss_Events_Batch_2026.csv'
                  )
                }
                className="w-full py-2.5 bg-[#12324A] hover:bg-[#1F4E6B] text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-[#118A8A]" />
                <span>Upload Event Records CSV</span>
              </button>
            </div>
          )}

          {activeCategory === 'construction' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
                Casing, Mud & Cement Programs
              </h3>
              <p className="text-[#667B89] leading-relaxed text-[11px]">
                Upload well construction schematics, casing shoe depths, mud weight schedules, and cement evaluation logs.
              </p>

              <button
                disabled={isUploading}
                onClick={() =>
                  handleSimulatedUpload(
                    'Well Construction',
                    'Casing_Mud_Program_Batch_OIL.csv'
                  )
                }
                className="w-full py-2.5 bg-[#12324A] hover:bg-[#1F4E6B] text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-[#118A8A]" />
                <span>Upload Well Construction CSV</span>
              </button>
            </div>
          )}

          {activeCategory === 'adapter' && (
            <div className="space-y-4">
              <h3 className="font-bold text-[#12324A] text-sm pb-2 border-b border-[#DDE6EA]">
                Live Stream Telemetry Adapter
              </h3>

              {/* Adapter Mode Toggle */}
              <div className="space-y-2">
                <label className="font-semibold text-[#12324A] block">Adapter Operating Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAdapterMode('simulator')}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                      adapterMode === 'simulator'
                        ? 'border-[#1677B8] bg-[#EEF7FB] text-[#12324A]'
                        : 'border-[#DDE6EA] bg-white text-[#667B89]'
                    }`}
                  >
                    <div className="font-bold">Simulator Mode</div>
                    <div className="text-[10px] text-[#667B89]">4-second WITS synthetic feed</div>
                  </button>

                  <button
                    onClick={() => setAdapterMode('pilot')}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                      adapterMode === 'pilot'
                        ? 'border-[#1677B8] bg-[#EEF7FB] text-[#12324A]'
                        : 'border-[#DDE6EA] bg-white text-[#667B89]'
                    }`}
                  >
                    <div className="font-bold">Pilot Source Mode</div>
                    <div className="text-[10px] text-[#667B89]">Live eRTMAC endpoint link</div>
                  </button>
                </div>
              </div>

              {/* Protocol selector */}
              <div className="space-y-2">
                <label className="font-semibold text-[#12324A] block">Protocol Option:</label>
                <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
                  {(['WITSML', 'MQTT', 'OPC-UA', 'REST'] as const).map((proto) => (
                    <button
                      key={proto}
                      onClick={() => setAdapterProtocol(proto)}
                      className={`p-2 rounded-lg border font-bold text-center transition-colors ${
                        adapterProtocol === proto
                          ? 'bg-[#12324A] text-white border-[#12324A]'
                          : 'bg-white border-[#DDE6EA] text-[#667B89] hover:bg-slate-50'
                      }`}
                    >
                      {proto}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guarded Production Option */}
              <div className="p-3 bg-[#FFF1F1] border border-[#C93C3C]/30 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-[#C93C3C] font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Connect Production Source</span>
                </div>
                <p className="text-[11px] text-[#667B89] leading-relaxed">
                  Requires Oil India administrator approval, network whitelisting, and signed security clearance.
                </p>
                <button
                  disabled={!isAdmin}
                  className={`w-full py-1.5 rounded text-xs font-semibold ${
                    isAdmin
                      ? 'bg-[#C93C3C] text-white'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                  title={!isAdmin ? 'Administrator role required to enable production adapters' : ''}
                >
                  {isAdmin ? 'Configure Production Endpoint' : 'Requires Administrator Role'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 7 Cols: Uploaded & Indexed Ingestion Records Table */}
        <div className="lg:col-span-7 bg-white border border-[#DDE6EA] rounded-xl overflow-hidden shadow-xs space-y-3">
          <div className="p-4 border-b border-[#DDE6EA] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#12324A] text-sm">Sandbox Ingestion Registry</h3>
              <p className="text-xs text-[#667B89]">Validated datasets and OCR-indexed documentation</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30 font-bold">
              {uploadedFiles.length} Datasets Loaded
            </span>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#DDE6EA] text-[#667B89]">
                  <th className="p-2.5 font-semibold">Dataset / File</th>
                  <th className="p-2.5 font-semibold">Category</th>
                  <th className="p-2.5 font-semibold">Records</th>
                  <th className="p-2.5 font-semibold">Upload Date</th>
                  <th className="p-2.5 font-semibold">Parsed Status</th>
                  <th className="p-2.5 font-semibold">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE6EA]/60 font-mono-tabular">
                {uploadedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-[#F8FAFC]">
                    <td className="p-2.5 font-bold text-[#12324A]">
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#1677B8] shrink-0" />
                        <span className="truncate max-w-xs">{file.fileName}</span>
                      </div>
                      <div className="text-[10px] text-[#8FA1AC] font-sans font-normal mt-0.5 line-clamp-1">
                        {file.notes}
                      </div>
                    </td>

                    <td className="p-2.5 font-sans text-[#667B89] text-[11px] whitespace-nowrap">
                      {file.category}
                    </td>

                    <td className="p-2.5 font-bold text-[#12324A]">
                      {file.recordsCount}
                    </td>

                    <td className="p-2.5 text-[#667B89]">
                      {file.uploadDate}
                    </td>

                    <td className="p-2.5 font-sans">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF9F2] text-[#2F8F5B] border border-[#2F8F5B]/30">
                        {file.parsedStatus}
                      </span>
                    </td>

                    <td className="p-2.5 font-bold text-[#118A8A]">
                      {file.confidence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
