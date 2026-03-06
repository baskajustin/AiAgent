'use client';
import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function Home() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const send = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const newMsg = [...messages, { role: 'user', content: input }];
        setMessages(newMsg);
        setInput('');
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMsg }) });
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let text = '';
        while (reader) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('0:')) {
                    text += line.slice(2).replace(/^"|"$/g, '');
                    setMessages([...newMsg, { role: 'assistant', content: text }]);
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Bot className="w-8 h-8" /> AI Agent</h1>
                    </div>
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-900/50">
                        {messages.length === 0 && <div className="text-center text-blue-200 mt-20"><Bot className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>How can I help you?</p></div>}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'} text-white`}>
                                    {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/20 text-white border border-white/10'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div><div className="bg-white/20 border border-white/10 rounded-2xl px-4 py-3"><Loader2 className="w-5 h-5 animate-spin text-blue-300" /></div></div>}
                    </div>
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <div className="flex gap-2">
                            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message..." />
                            <button onClick={send} disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
