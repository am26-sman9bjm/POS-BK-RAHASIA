const SUPABASE_URL = 'https://kwdzwquwvomelgpefsdp.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Qs1ym_1nnfMR9KDyJ2LO3w_DxqaaUgg';

// Initialize global Supabase client instance
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Shared HTML escaping utility to prevent XSS
function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}