import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Symulowane dane
let db = {
  users: [
    { id: '1', name: 'Alex Turner', email: 'alex@cityhomes.com', role: 'Agent', companyId: 'ch', isPremium: false },
    { id: '2', name: 'Diana Price', email: 'diana@elite.com', role: 'Agent', companyId: 'erg', isPremium: true },
    { id: '3', name: 'Admin Sam', email: 'admin@feed.com', role: 'Admin', isPremium: true }
  ],
  companies: [
    { id: 'ch', name: 'City Homes Inc', logoUrl: 'https://via.placeholder.com/80?text=CHI', address: '456 Downtown Ave, Austin, TX', description: 'Local expertise you can trust.', subscriptionTier: 'Free' },
    { id: 'erg', name: 'Elite Realty Group', logoUrl: 'https://via.placeholder.com/80?text=ERG', address: '123 Ocean View Dr, Malibu, CA', description: 'Serving luxury clients since 2005.', subscriptionTier: 'Pro' }
  ],
  articles: [
    { id: '1', title: 'Austin Sees 15% Home Price Surge', lead: 'Demand outpaces inventory in central Texas market.', tags: ['Market Trends'], isPremium: false, source: 'City Homes', companyLogo: 'https://via.placeholder.com/40?text=CH' },
    { id: '2', title: 'Malibu Luxury Estates Break $30M', lead: 'Ultra-high-net-worth buyers drive record sales.', tags: ['Luxury', 'Investment'], isPremium: true, source: 'Elite Realty', companyLogo: 'https://via.placeholder.com/40?text=ERG' }
  ],
  preferences: {}
};

// Feed artykułów
app.get('/api/v1/articles', (req, res) => {
  const user = db.users.find(u => u.email === req.headers.email) || { isPremium: false };
  const filtered = db.articles.map(a => ({
    ...a,
    isLocked: a.isPremium && !user.isPremium
  }));
  res.json(filtered);
});

// Ustawienia użytkownika
app.get('/api/v1/user/preferences/:userId', (req, res) => {
  res.json(db.preferences[req.params.userId] || { region: ['CA'], tags: ['Market Trends'] });
});

app.post('/api/v1/user/preferences', (req, res) => {
  const { userId, region, tags } = req.body;
  db.preferences[userId] = { region, tags };
  res.json({ success: true });
});

// CMS – artykuły (tylko Admin/Partner)
app.get('/api/v1/cms/articles', (req, res) => {
  const email = req.headers.email;
  const user = db.users.find(u => u.email === email);
  if (!['Admin', 'Partner'].includes(user?.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json(db.articles);
});

app.post('/api/v1/cms/articles', (req, res) => {
  const email = req.headers.email;
  const user = db.users.find(u => u.email === email);
  if (!['Admin', 'Partner'].includes(user?.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const newArticle = { id: Date.now().toString(), ...req.body };
  db.articles.push(newArticle);
  res.status(201).json(newArticle);
});

// Logowanie
app.post('/api/v1/auth/login', (req, res) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email === email);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend uruchomiony na http://localhost:${PORT}`);
});
