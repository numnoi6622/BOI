document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const goalCheckboxes = document.querySelectorAll('input[name="goal"]');
    const maxAllowed = 2;

    // Enforce max 2 selections for goals
    goalCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('input[name="goal"]:checked').length;
            
            if (checkedCount >= maxAllowed) {
                goalCheckboxes.forEach(cb => {
                    if (!cb.checked) {
                        cb.disabled = true;
                        cb.closest('.custom-checkbox').style.opacity = '0.5';
                        cb.closest('.custom-checkbox').style.cursor = 'not-allowed';
                    }
                });
            } else {
                goalCheckboxes.forEach(cb => {
                    cb.disabled = false;
                    cb.closest('.custom-checkbox').style.opacity = '1';
                    cb.closest('.custom-checkbox').style.cursor = 'pointer';
                });
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const goalsChecked = document.querySelectorAll('input[name="goal"]:checked').length;
        if (goalsChecked === 0) {
            alert('กรุณาเลือกเป้าหมายของการอบรมอย่างน้อย 1 ข้อ');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        // Handle multiple checkboxes
        data.goal = Array.from(document.querySelectorAll('input[name="goal"]:checked')).map(cb => cb.value);

        console.log('Form Submitted Data:', data);

        // Show success visual feedback
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>ส่งข้อมูลสำเร็จ</span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            alert('ลงทะเบียนสำเร็จ! ขอบคุณที่เข้าร่วมโครงการ BOI STEM++');
            form.reset();
            // Reset disabled checkboxes
            goalCheckboxes.forEach(cb => {
                cb.disabled = false;
                cb.closest('.custom-checkbox').style.opacity = '1';
                cb.closest('.custom-checkbox').style.cursor = 'pointer';
            });
            // Reset button
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 1500);
    });
});
