import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

const SupportSimulator = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.target);
    const payload = {
      ticket_id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      system: "support-platform",
      merchant: formData.get('merchant'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('http://YOUR_BACKEND_URL/events/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('success');
        e.target.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tighter italic uppercase">Support Simulator</h1>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
          Generate human-led signals for the AI Brain.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="sim-card space-y-6">
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
          {loading ? "Sending Signal..." : (
            <>
              <Send size={14} /> Emit Event
            </>
          )}
        </button>
      </form>

      {/* Success/Error Feedback */}
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