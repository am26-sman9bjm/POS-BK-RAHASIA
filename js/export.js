function exportToExcel() {
    if (!currentReports || currentReports.length === 0) {
        alert("Kotak pos masih kosong.");
        return;
    }

    const exportData = currentReports.map(item => {
        const dateObj = new Date(item.created_at);

        return {
            "Tanggal": dateObj.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            "Jam": dateObj.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }),
            "Nama Siswa": item.name,
            "Kelas": item.class,
            "Isi Surat": item.content
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Siswa");

    XLSX.writeFile(workbook, `Surat_Kotak_Pos_SMAN9_${new Date().toISOString().slice(0, 10)}.xlsx`);
}