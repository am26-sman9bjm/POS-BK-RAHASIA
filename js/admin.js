let currentReports = [];

async function loadDataToTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 20px;">Memuat data dari database...</td></tr>';

    const { data, error } = await window.supabaseClient
        .from('laporan_siswa')
        .select('id, name, class, content, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Fetch error:', error);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ef4444; padding: 20px;">Gagal memuat surat. Pastikan akun Guru BK sudah terotentikasi.</td></tr>';
        return;
    }

    currentReports = data || [];
    tableBody.innerHTML = '';

    if (currentReports.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 30px;">Kotak Pos kosong. Belum ada surat yang masuk.</td></tr>';
        return;
    }

    currentReports.forEach(row => {
        const dateObj = new Date(row.created_at);

        const tanggal = dateObj.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const jam = dateObj.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="white-space: nowrap; color: #64748b;">${tanggal}</td>
            <td style="white-space: nowrap; color: #64748b;">${jam}</td>
            <td><strong>${escapeHTML(row.name)}</strong></td>
            <td style="white-space: nowrap;">${escapeHTML(row.class)}</td>
            <td>${escapeHTML(row.content)}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Delete all reports
async function clearData() {
    if (!confirm("⚠️ PERHATIAN: Semua surat akan dibakar/dihapus permanen dari database. Lanjutkan?")) {
        return;
    }

    const { error } = await window.supabaseClient
        .from('laporan_siswa')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
        alert("Gagal menghapus data: " + error.message);
    } else {
        alert("Semua surat telah berhasil dibakar.");
        loadDataToTable();
    }
}