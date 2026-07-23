import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    form.addEventListener('submit', async (e) => {
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

        // Disable button during submission
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>กำลังบันทึกข้อมูล...</span>';
        btn.disabled = true;

        try {
            // Insert into Supabase
            const { error } = await supabase
                .from('registrations')
                .insert([
                    {
                        education: data.education,
                        fullname: data.fullname,
                        company: data.company,
                        email: data.email,
                        phone: data.phone,
                        goals: data.goal,
                        course: data.course,
                        location: data.location,
                        consent: true
                    }
                ]);

            if (error) throw error;

            // Show success visual feedback
            btn.innerHTML = '<span>ส่งข้อมูลสำเร็จ</span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                alert('ลงทะเบียนสำเร็จ! ข้อมูลของคุณถูกบันทึกในระบบแล้ว');
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
                btn.disabled = false;
            }, 1500);

        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
});
