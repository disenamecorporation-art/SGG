import React, { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function SuggestionBoxView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola, mi nombre es ${formData.name}. Sugerencia: ${formData.suggestion}`;
    const url = `https://wa.me/584120129764?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <h3 className="font-poppins font-bold text-slate-800 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-emerald-700" />
        Buzón de Sugerencias
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Nombre y Apellido"
            className="w-full border border-slate-200 p-3 rounded-lg focus:border-emerald-600 outline-none text-sm"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="email"
            required
            placeholder="Correo Electrónico"
            className="w-full border border-slate-200 p-3 rounded-lg focus:border-emerald-600 outline-none text-sm"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <textarea
          required
          placeholder="Escriba aquí su sugerencia..."
          rows={4}
          className="w-full border border-slate-200 p-3 rounded-lg focus:border-emerald-600 outline-none text-sm"
          value={formData.suggestion}
          onChange={(e) => setFormData({...formData, suggestion: e.target.value})}
        />
        <button
          type="submit"
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
        >
          <Send className="w-4 h-4" />
          Enviar Sugerencia por WhatsApp
        </button>
      </form>
    </div>
  );
}
