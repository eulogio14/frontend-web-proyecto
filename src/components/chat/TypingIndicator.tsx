export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-slate-700/40 bg-whatsapp-bubbleIn px-4 py-3 shadow-md">
        <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.4s]" />
      </div>
    </div>
  );
}