import React, { useState } from 'react';
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Inbox,
  Reply,
  ShieldCheck
} from 'lucide-react';
import { ContactMessage } from '../../../types/portfolio';
import { StorageService } from '../../../services/storage';

interface ContactMessagesTabProps {
  username: string;
}

export const ContactMessagesTab: React.FC<ContactMessagesTabProps> = ({ username }) => {
  const [messages, setMessages] = useState<ContactMessage[]>(() =>
    StorageService.getContactMessages(username)
  );
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  const handleSelect = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      StorageService.markMessageRead(msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.deleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setTimeout(() => {
      setReplySent(false);
      setReplyText('');
    }, 2500);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-indigo-400" />
            <span>Contact Form Inquiries</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Inquiries received from your public portfolio contact form.
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-md shadow-indigo-600/30">
            {unreadCount} Unread
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <Inbox className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="font-heading text-sm font-bold text-white mb-1">Your Inbox is Clean</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When visitors submit your website contact form, their notes and direct emails will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Messages list */}
          <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-md'
                    : msg.isRead
                    ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    : 'border-indigo-800/80 bg-slate-900 font-semibold shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate">{msg.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(msg.receivedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-indigo-300 font-medium truncate mb-1">
                  {msg.subject || 'Portfolio Inquiry'}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-500 truncate">{msg.email}</span>
                  <button
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete message"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Message Reader / Reply Box */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-base font-bold text-white">
                      {selectedMessage.subject || 'Portfolio Inquiry'}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(selectedMessage.receivedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold text-slate-200">From: {selectedMessage.name}</span>
                    <span className="text-indigo-400">&lt;{selectedMessage.email}&gt;</span>
                  </div>
                </div>

                <div className="py-2 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedMessage.message}
                </div>

                {/* Reply section */}
                <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Reply className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Reply to {selectedMessage.name}</span>
                    </span>
                    {replySent && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Reply dispatched via email
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Write your response to ${selectedMessage.name} (${selectedMessage.email})...`}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Response</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Mail className="h-8 w-8 mb-2 text-slate-600" />
                <p className="text-xs">Select any inquiry from the left to read full details and reply.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
