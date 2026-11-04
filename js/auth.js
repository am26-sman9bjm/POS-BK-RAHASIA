const mainContainer = document.querySelector('.postbox-container');
const adminView = document.getElementById('admin-view');

function showLanding() {
    document.getElementById('student-view').classList.add('hidden');
    document.getElementById('login-view').classList.add('hidden');
    adminView.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    document.getElementById('landing-view').classList.remove('hidden');
    document.getElementById('letter-content').classList.remove('sending-anim');
}

function startCurhat() {
    document.getElementById('landing-view').classList.add('hidden');
    document.getElementById('student-view').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('landing-view').classList.add('hidden');
    document.getElementById('login-view').classList.remove('hidden');
}

// Login BK using Supabase Authentication
async function checkLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('⚠️ Harap masukkan Email dan Password.');
        return;
    }

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert('⚠️ Kunci/Password Salah! ' + error.message);
        return;
    }

    mainContainer.classList.add('hidden');
    adminView.classList.remove('hidden');
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    loadDataToTable();
}

async function logout() {
    await window.supabaseClient.auth.signOut();
    showLanding();
}

// Auto-check session on page load
async function checkExistingSession() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
        mainContainer.classList.add('hidden');
        adminView.classList.remove('hidden');
        loadDataToTable();
    }
}

checkExistingSession();