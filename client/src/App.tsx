import { useState } from 'react';
import Login from './components/Login';
import type { User } from './types/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    console.log('Successfully logged in user:', user);
    setCurrentUser(user);
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {!currentUser ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="p-8 text-white font-sans">
          <h1 className="text-2xl font-bold">Welcome, {currentUser.email || 'User'}!</h1>
          <p className="text-slate-400 mt-2">Authentication successful. Ready for directory dashboard.</p>
        </div>
      )}
    </main>
  );
}