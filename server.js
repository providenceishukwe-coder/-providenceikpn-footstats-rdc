// FootStats RDC - serveur API de démonstration
// Prérequis : Node.js 18+
// Installation : npm init -y && npm install express dotenv
// Démarrage : node server.js
// Gardez FOOTBALL_DATA_TOKEN dans .env, jamais dans le HTML public.

const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.FOOTBALL_DATA_TOKEN;
const API = 'https://api.football-data.org/v4';

app.use(express.static(__dirname));

async function apiGet(endpoint) {
  if (!TOKEN) throw new Error('FOOTBALL_DATA_TOKEN manquant dans .env');
  const response = await fetch(API + endpoint, {
    headers: { 'X-Auth-Token': TOKEN }
  });
  if (!response.ok) throw new Error(`Fournisseur football-data.org : HTTP ${response.status}`);
  return response.json();
}

// Résultats et calendriers de la journée. Le fournisseur ne couvre pas toutes les ligues.
app.get('/api/matches', async (req, res) => {
  try {
    const data = await apiGet('/matches');
    let matches = (data.matches || []).map(m => ({
      id: m.id,
      competition: m.competition?.name || 'Compétition',
      date: m.utcDate,
      status: m.status,
      home: m.homeTeam?.shortName || m.homeTeam?.name,
      away: m.awayTeam?.shortName || m.awayTeam?.name,
      homeScore: m.score?.fullTime?.home ?? m.score?.regularTime?.home ?? null,
      awayScore: m.score?.fullTime?.away ?? m.score?.regularTime?.away ?? null
    }));
    const view = req.query.view || 'today';
    if (view === 'live') matches = matches.filter(m => ['IN_PLAY','LIVE','PAUSED','HALF_TIME'].includes(m.status));
    if (view === 'upcoming') matches = matches.filter(m => ['SCHEDULED','TIMED'].includes(m.status));
    if (view === 'finished') matches = matches.filter(m => m.status === 'FINISHED');
    res.json({ source: 'football-data.org', updatedAt: new Date().toISOString(), matches });
  } catch (e) {
    res.status(502).json({ error: 'Impossible de charger les matchs', detail: e.message });
  }
});

// Classement de la compétition sélectionnée, si le plan API l'autorise.
app.get('/api/standings', async (req, res) => {
  const allowed = new Set(['PL','PD','SA','BL1','FL1','CL']);
  const competition = String(req.query.competition || 'PL').toUpperCase();
  if (!allowed.has(competition)) return res.status(400).json({ error: 'Compétition non autorisée' });
  try {
    const data = await apiGet(`/competitions/${competition}/standings`);
    const standing = (data.standings || []).find(s => s.type === 'TOTAL') || (data.standings || [])[0];
    const table = (standing?.table || []).map(t => ({
      position: t.position, team: t.team?.shortName || t.team?.name || 'Équipe',
      played: t.playedGames, won: t.won, draw: t.draw, lost: t.lost, points: t.points
    }));
    res.json({ source: 'football-data.org', updatedAt: new Date().toISOString(), competition, table });
  } catch (e) {
    res.status(502).json({ error: 'Impossible de charger le classement', detail: e.message });
  }
});

app.get('/api/match/:id', async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Identifiant invalide' });
  try {
    const m = await apiGet(`/matches/${req.params.id}`);
    res.json({
      source: 'football-data.org', updatedAt: new Date().toISOString(),
      id: m.id, competition: m.competition?.name, date: m.utcDate, status: m.status,
      home: m.homeTeam?.name, away: m.awayTeam?.name, score: m.score,
      venue: m.venue || null
    });
  } catch (e) {
    res.status(502).json({ error: 'Impossible de charger la fiche', detail: e.message });
  }
});

app.listen(PORT, () => console.log(`FootStats RDC ouvert sur http://localhost:${PORT}`));
