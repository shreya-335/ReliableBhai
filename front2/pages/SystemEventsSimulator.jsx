import React, { useState } from 'react';
import { Zap, AlertTriangle, RefreshCcw, StepForward, Send } from 'lucide-react';
import Toast from '../components/Toast';

const SystemEventsSimulator = () => {
  const [activeTab, setActiveTab] = useState('checkout');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const eventConfigs = {
    checkout: {
      title: "Checkout Failure",
      endpoint: "/events/checkout-failed",
      icon: <Zap size={18} />,
      color: "bg-rose-50 text-rose-600",
      payload: {
        event_id: `evt_${Math.floor(Math.random() * 99999)}`,
        occurred_at: new Date().toISOString(),
        merchant_id: "merchant_101",
        error_code: "PAYMENT_SESSION_MISSING",
        checkout_mode: "headless",
        transaction_amount: 120.50,
        currency: "USD",
        request_url: "POST https://api.commerce.com/v2/checkout",
        missing_headers: ["Authorization"]
      }
    },
    api: {
      title: "API Error (Deprecated)",
      endpoint: "/events/api-error",
      icon: <AlertTriangle size={18} />,
      color: "bg-amber-50 text-amber-600",
      payload: {
        event_id: `evt_api_${Math.floor(Math.random() * 999)}`,
        occurred_at: new Date().toISOString(),
        merchant_id: "merchant_104",
        endpoint: "/v1/orders/123",
        method: "GET",
        http_status: 410,
        error_code: "DEPRECATED_ENDPOINT_USAGE"
      }
    },
    webhook: {
      title: "Webhook Failure",
      endpoint: "/events/webhook-failed",
      icon: <RefreshCcw size={18} />,
      color: "bg-blue-50 text-blue-600",
      payload: {
        event_id: `evt_wh_${Math.floor(Math.random() * 999)}`,
        occurred_at: new Date().toISOString(),
        merchant_id: "merchant_102",
        webhook_topic: "order.created",
        error_code: "WEBHOOK_SIGNATURE_MISMATCH",
        attempt_count: 5,
        last_response_code: 401
      }
    },
    migration: {
      title: "Migration Update",
      endpoint: "/events/migration-stage",
      icon: <StepForward size={18} />,
      color: "bg-emerald-50 text-emerald-600",
      payload: {
        event_id: `evt_${Math.floor(Math.random() * 99999)}`,
        merchant_id: "merchant_101",
        occurred_at: new Date().toISOString(),
        new_stage: "headless_live"
      }
    }
  };

  const handleEmit = async () => {
    setLoading(true);
    const config = eventConfigs[activeTab];
    
    try {
      const response = await fetch(`http://YOUR_BACKEND_URL${config.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config.payload)
      });

      if (response.ok) {
        setToast({ message: `${config.title} Event Emitted Successfully`, type: 'success' });
      } else {
        setToast({ message: "Upstream Server Rejected Event", type: 'error' });
      }
    } catch (err) {
      setToast({ message: "Network error: Check backend connection", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tighter italic uppercase text-zinc-900">System Events</h1>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
          Machine-generated signals & Platform Telemetry.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Navigation Tabs */}
        <div className="col-span-4 space-y-2">
          {Object.entries(eventConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left border ${
                activeTab === key 
                  ? 'bg-white border-zinc-900 shadow-md translate-x-2' 
                  : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-100'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === key ? config.color : 'bg-zinc-100'}`}>
                {config.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{config.title}</span>
            </button>
          ))}
        </div>

        {/* JSON Preview & Emit */}
        <div className="col-span-8">
          <div className="sim-card bg-zinc-900 border-zinc-800 shadow-2xl min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              </div>
              <span className="text-[9px] font-mono border-zinc-800 shadow-2xl text-zinc-500 uppercase tracking-widest">Payload Preview</span>
            </div>

            <pre className="flex-1 font-mono text-[11px] text-emerald-400 overflow-auto bg-black/90 p-6 rounded-xl border border-white/5 leading-relaxed">
              {JSON.stringify(eventConfigs[activeTab].payload, null, 2)}
            </pre>

            <button
              disabled={loading}
              onClick={handleEmit}
              className="mt-6 w-full bg-white text-zinc-900 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Transmitting..." : (
                <>
                  <Send size={14} /> Fire Event
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SystemEventsSimulator;