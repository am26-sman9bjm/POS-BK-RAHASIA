// Navigation Elements (Queried when DOM is ready)
let mainContainer;
let adminView;

function initNavElements() {
    mainContainer = document.querySelector('.postbox-container');
    adminView = document.getElementById('admin-view');
}

function showLanding() {
    initNavElements();
    document.getElementById('student-view').classList.add('hidden');
    document.getElementById('login-view').classList.add('hidden');
    if (adminView) adminView.classList.add('hidden');
    if (mainContainer) mainContainer.classList.remove('hidden');
    document.getElementById('landing-view').classList.remove('hidden');
    document.getElementById('letter-content').classList.remove('sending-anim');
    
    const errorBox = document.getElementById('login-error');
    if (errorBox) errorBox.style.display = 'none';
}

function startCurhat() {
    document.getElementById('landing-view').classList.add('hidden');
    document.getElementById('student-view').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('landing-view').classList.add('hidden');
    document.getElementById('login-view').classList.remove('hidden');
}

// Authenticate Guru BK via Supabase
async function checkLogin() {
    initNavElements();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const errorBox = document.getElementById('login-error');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (errorBox) errorBox.style.display = 'none';

    if (!email || !password) {
        if (errorBox) {
            errorBox.textContent = '⚠️ Harap isi Email dan Password.';
            errorBox.style.display = 'block';
        }
        return;
    }

    // Loading state
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.7';
        loginBtn.innerHTML = 'Memeriksa Kunci... ⏳';
    }

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        if (errorBox) {
            errorBox.textContent = '⚠️ Email atau Password salah!';
            errorBox.style.display = 'block';
        }
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.style.opacity = '1';
            loginBtn.innerHTML = 'Buka Kotak Pos 🔓';
        }
        return;
    }

    // Success: Show dashboard & load table data
    if (mainContainer) mainContainer.classList.add('hidden');
    if (adminView) adminView.classList.remove('hidden');
    
    emailInput.value = '';
    passwordInput.value = '';
    if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
        loginBtn.innerHTML = 'Buka Kotak Pos 🔓';
    }

    if (typeof loadDataToTable === 'function') {
        loadDataToTable();
    }
}

// Sign Out
async function logout() {
    await window.supabaseClient.auth.signOut();
    showLanding();
}

// Check active session automatically AFTER all DOM scripts (admin.js) finish loading
async function checkExistingSession() {
    initNavElements();
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    
    if (session) {
        if (mainContainer) mainContainer.classList.add('hidden');
        if (adminView) adminView.classList.remove('hidden');
        
        // Now admin.js is guaranteed to be loaded and ready
        if (typeof loadDataToTable === 'function') {
            loadDataToTable();
        }
    }
}

// Run check once the full document and all external JS files are completely loaded
window.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
});