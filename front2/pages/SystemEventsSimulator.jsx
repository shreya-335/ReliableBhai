import React, { useState } from 'react';
import { Zap, AlertTriangle, RefreshCcw, StepForward, Send, Loader2 } from 'lucide-react';
import Toast from '../components/Toast';

const SystemEventsSimulator = () => {
  const [activeTab, setActiveTab] = useState('checkout');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const eventConfigs = {
    checkout: {
      title: "Checkout Failure",
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

    // 1. Mandatory 30-second timer for the loading screen animation
    const animationTimer = new Promise((resolve) => setTimeout(resolve, 30000));
    
    // 2. Simulated Frontend-only local processing (mimics a 2s server response)
    const simulateRequest = new Promise((resolve) => {
      setTimeout(() => {
        console.log("Frontend-only simulation triggered successfully");
        resolve({ ok: true });
      }, 2000);
    });

    // 3. 1-minute logic timeout
    const timeoutLogic = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request Timeout")), 60000)
    );

    try {
      const [response] = await Promise.all([
        Promise.race([simulateRequest, timeoutLogic]),
        animationTimer
      ]);

      if (response.ok) {
        setToast({ message: `${config.title} Event Emitted Successfully`, type: 'success' });
      } else {
        setToast({ message: "Upstream Server Rejected Event", type: 'error' });
      }
    } catch (err) {
      await animationTimer;
      setToast({ message: "System error: Local event loop failed", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="p-8 bg-zinc-900 rounded-[32px] shadow-2xl border border-white/5 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 animate-pulse">Firing Machine Event</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase mt-1 italic font-mono">Transmitting to system event bus (30s)...</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tighter italic uppercase text-zinc-900">System Events</h1>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
          Machine-generated signals & Platform Telemetry.
        </p>
      </div>

      <div className={`grid grid-cols-12 gap-8 transition-all ${loading ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'}`}>
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
              <Send size={14} /> Fire Event
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SystemEventsSimulator;