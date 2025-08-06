import React, { useState, useEffect } from 'react';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      const defaultUser = { email: 'alex@cityhomes.com', isPremium: false };
      localStorage.setItem('user', JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch('/api/v1/articles', {
      headers: { email: user.email }
    })
      .then(r => r.json())
      .then(data => setArticles(data));
  }, [user]);

  const upgradeToPro = () => {
    const upgraded = { ...user, isPremium: true };
    localStorage.setItem('user', JSON.stringify(upgraded));
    setUser(upgraded);
    alert('🎉 Gratulacje! Teraz masz dostęp do treści premium!');
  };

  const loginAsAdmin = () => {
    const admin = { email: 'admin@feed.com', role: 'Admin', isPremium: true };
    localStorage.setItem('user', JSON.stringify(admin));
    setUser(admin);
    alert('Zalogowano jako Admin');
  };

  return (
    <div className="app">
      <header>
        <h1>🏡 RealEstateFeed</h1>
        <p>
          Witaj, <strong>{user?.email}</strong> | Status: <strong>{user?.isPremium ? '✅ Pro' : '🆓 Free'}</strong>
        </p>
      </header>

      <main className="feed">
        {articles.map(a => (
          <div
            key={a.id}
            className={`feed-card ${a.isLocked ? 'locked' : ''}`}
            onClick={a.isLocked ? upgradeToPro : null}
          >
            {a.isLocked && (
              <div className="overlay">
                <span>🔒 Premium – kliknij, by odblokować</span>
              </div>
            )}
            <div className="header">
              <img src={a.companyLogo} alt={a.source} width="40" />
              <span className="tag">{a.tags[0]}</span>
            </div>
            <h3>{a.title}</h3>
            <p className="lead">{a.lead}</p>
          </div>
        ))}
      </main>

      <aside className="sidebar">
        <h3>🛠️ Panel deweloperski</h3>
        <p>Do celów testowych:</p>
        <button onClick={upgradeToPro} disabled={user?.isPremium}>
          {user?.isPremium ? 'Jesteś Pro ✅' : '🔓 Odblokuj wersję Pro'}
        </button>
        <button onClick={loginAsAdmin}>🔐 Zaloguj jako Admin</button>
      </aside>
    </div>
  );
};

export default App;
