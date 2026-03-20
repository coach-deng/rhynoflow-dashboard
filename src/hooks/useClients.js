import { useState, useEffect } from 'react';
import { CLIENTS } from '../data/config';

const STORAGE_KEY = 'rf_clients';

// Default phases per tier
export const TIER_PHASES = {
  Solo:     ['Discovery', 'Setup', 'Deploy', 'Monitoring'],
  Business: ['Discovery', 'GWS Access', 'Script Deploy', 'Monitoring'],
  Custom:   ['Discovery', 'Scoping', 'Build', 'Deploy', 'Monitoring'],
};

export const TIERS     = Object.keys(TIER_PHASES);
export const STATUSES  = ['Lead', 'Onboarding', 'Active', 'Paused', 'Churned'];

function loadClients() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return CLIENTS; // fallback to config defaults
}

export function useClients() {
  const [clients, setClients] = useState(loadClients);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient = (client) => {
    const newClient = {
      ...client,
      id:           client.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      progress:     0,
      currentPhase: 0,
      phases:       TIER_PHASES[client.tier] ?? TIER_PHASES.Solo,
      createdAt:    new Date().toISOString(),
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id, updates) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const advancePhase = (id) => {
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c;
      const nextPhase = Math.min(c.currentPhase + 1, c.phases.length - 1);
      const progress  = Math.round((nextPhase / (c.phases.length - 1)) * 100);
      return { ...c, currentPhase: nextPhase, progress };
    }));
  };

  return { clients, addClient, updateClient, deleteClient, advancePhase };
}
