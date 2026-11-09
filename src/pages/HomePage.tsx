import ChatWindow from '../components/chat/ChatWindow';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700">
        <ChatWindow />
      </div>
    </main>
  );
}