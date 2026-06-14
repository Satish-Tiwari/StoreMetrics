import React, { useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import api from '@lib/api';

interface ReportsExporterProps {

  startDate: string;
  endDate: string;
}

export const ReportsExporter: React.FC<ReportsExporterProps> = ({
  startDate,
  endDate,
}) => {
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setProgress('Enqueuing report assembly task...');

    try {
      const res = await api.post('/api/reports/generate', {
        format: reportFormat,
        startDate,
        endDate,
      });

      const { jobId } = res.data;

      const interval = setInterval(async () => {
        try {
          const statusRes = await api.get(`/api/reports/status/${jobId}`);
          const { status } = statusRes.data;

          if (status === 'completed') {
            clearInterval(interval);
            setProgress('Downloading report file...');
            const token = localStorage.getItem('ecom_auth_token');
            window.location.href = `/api/reports/download/${jobId}?access_token=${token}`;
            setProgress(null);
            setLoading(false);
          } else if (status === 'failed') {
            clearInterval(interval);
            setProgress(null);
            setLoading(false);
            alert(`Report compilation failed. Verify database records.`);
          } else {
            setProgress(`Assembling report... Status: ${status}`);
          }
        } catch (pollErr) {
          clearInterval(interval);
          setProgress(null);
          setLoading(false);
          alert('Error polling report compile status.');
        }
      }, 2000);
    } catch (err: any) {
      setProgress(null);
      setLoading(false);
      alert(err.response?.data?.message || 'Failed to initiate report compilation.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mt-12">
      <div className="text-center mb-6">
        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="font-extrabold text-slate-900 text-lg">Asynchronous Report Exporter</h3>
        <p className="text-slate-500 text-sm mt-1">
          Compile comprehensive PDFs and spreadsheets. Reports will assemble in background queues.
        </p>
      </div>

      <form onSubmit={handleExport} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition ${
                reportFormat === 'pdf'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="reportFormat"
                className="sr-only"
                value="pdf"
                checked={reportFormat === 'pdf'}
                onChange={() => setReportFormat('pdf')}
              />
              <span className="font-bold text-slate-900">PDF Report</span>
              <span className="text-[10px] text-slate-400 mt-1">Styled layout & KPIs</span>
            </label>

            <label
              className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition ${
                reportFormat === 'excel'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="reportFormat"
                className="sr-only"
                value="excel"
                checked={reportFormat === 'excel'}
                onChange={() => setReportFormat('excel')}
              />
              <span className="font-bold text-slate-900">Excel Sheet</span>
              <span className="text-[10px] text-slate-400 mt-1">
                Multi-tab raw transaction tables
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Queue Compilation'}
        </button>
      </form>

      {progress && (
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Progress Status</span>
            <span className="animate-pulse text-blue-500">Processing...</span>
          </div>
          <p className="text-sm font-bold text-slate-800">{progress}</p>

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_100%] h-full w-2/3 rounded-full"
              style={{ animation: 'shimmer 1.5s infinite linear' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
