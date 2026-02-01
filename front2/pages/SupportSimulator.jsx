import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const SupportSimulator = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // 1. Mandatory 30-second timer for the loading screen animation
    const animationTimer = new Promise((resolve) => setTimeout(resolve, 30000));

    // 2. Simulated Frontend-only local processing (mimics a 2s server response)
    const simulateRequest = new Promise((resolve) => {
      setTimeout(() => {
        console.log("Frontend-only simulation triggered successfully");
        resolve({ ok: true });
      }, 2000);
    });

    // 3. 1-minute logic timeout (fails if processing exceeds 60s)
    const timeoutLogic = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request Timeout")), 60000)
    );

    try {
      // Race the simulation against the 1-minute timeout, 
      // but wait for the 30s animation regardless of speed.
      const [response] = await Promise.all([
        Promise.race([simulateRequest, timeoutLogic]),
        animationTimer
      ]);

      if (response.ok) {
        setStatus('success');
        e.target.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      // Ensure the user still sees the loading screen for the full 30s even on error
      await animationTimer;
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-[#f9f6f1]/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="p-8 bg-white rounded-[32px] shadow-2xl border border-black/5 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-zinc-900 animate-spin" />
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 animate-pulse">Normalizing Ticket</span>
              <span className="text-[8px] font-bold text-zinc-400 uppercase mt-1">Establishing context in the AI Brain (30s process)...</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tighter italic uppercase">Support Simulator</h1>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
          Generate human-led signals for the AI Brain.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`sim-card space-y-6 transition-all ${loading ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="sim-label">Merchant ID</label>
            <input name="merchant" placeholder="merchant_102" className="sim-input" required />
          </div>
          <div>
            <label className="sim-label">Category</label>
            <select name="category" className="sim-input">
              <option value="checkout">Checkout</option>
              <option value="payments">Payments</option>
              <option value="migration">Migration</option>
            </select>
          </div>
        </div>

        <div>
          <label className="sim-label">Priority</label>
          <div className="flex gap-4">
            {['low', 'normal', 'high'].map((p) => (
              <label key={p} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="priority" value={p} defaultChecked={p === 'normal'} className="accent-zinc-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{p}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="sim-label">Subject</label>
          <input name="subject" placeholder="Checkout not working" className="sim-input" required />
        </div>

        <div>
          <label className="sim-label">Message</label>
          <textarea name="message" rows="4" placeholder="Full ticket text..." className="sim-input resize-none" required />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
        >
          <Send size={14} /> Emit Event
        </button>
      </form>

      {status === 'success' && (
        <div className="fixed bottom-10 right-10 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10">
          <CheckCircle2 size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Event Normalised & Stored</span>
        </div>
      )}
      {status === 'error' && (
        <div className="fixed bottom-10 right-10 bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10">
          <AlertCircle size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Backend Connection Failed</span>
        </div>
      )}
    </div>
  );
};

export default SupportSimulator;