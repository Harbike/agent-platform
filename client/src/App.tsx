import { useState } from 'react';
import Login from './components/Login';
import Reception from './pages/Reception';
import type { User } from './types/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    console.log('Successfully logged in user:', user);
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    localStorage.removeItem('amp_access_token');
    setCurrentUser(null);
  };
  
  return (
    <main className="min-h-screen bg-slate-950">
      {!currentUser ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
       <Reception currentUser={currentUser} onSignOut={handleSignOut} />
      )}
    </main>
  );
}