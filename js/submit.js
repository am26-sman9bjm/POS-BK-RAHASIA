document.getElementById('curhatForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('success-msg');
    const letter = document.getElementById('letter-content');

    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value.trim();
    const cerita = document.getElementById('cerita').value.trim();
    
    if (!nama || !kelas || !cerita) {
        alert("Harap isi semua kolom.");
        return;
    }

    // 1. Interactive Loading State
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = 'Mengirim surat... ⏳';

    // 2. Send Data to Supabase
    const { data, error } = await window.supabaseClient
        .from('laporan_siswa')
        .insert([{ name: nama, class: kelas, content: cerita }]);

    if (error) {
        alert("⚠️ Gagal mengirim surat: " + error.message);
        console.error("Submission error:", error);
        
        // Reset button state on failure
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = 'Masukkan ke Kotak Pos 📥';
        return;
    }

    // 3. STEP A: Hide form & show success stamp FIRST so user can read it
    this.classList.add('hidden');
    successMsg.innerHTML = '📮 <strong>Suratmu telah terkirim!</strong><br><span style="font-size: 13px;">Guru BK akan segera membacanya.</span>';
    successMsg.style.display = 'block';

    // 4. STEP B: Wait 2 seconds for user to see the success message
    setTimeout(() => {
        // Slide letter into the mailbox slot
        letter.classList.add('sending-anim');

        // 5. STEP C: After slide animation completes (0.6s), reset view to landing page
        setTimeout(() => { 
            this.reset();
            this.classList.remove('hidden');
            successMsg.style.display = 'none';
            letter.classList.remove('sending-anim');
            
            // Restore submit button state
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = 'Masukkan ke Kotak Pos 📥';
            
            showLanding();
        }, 600); // 600ms matches the 0.5s CSS transition speed
    }, 2000); // 2000ms delay allows the user to read the message
});