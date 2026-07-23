import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const ADMIN_PASSWORD = "admin"; // Using a simple password for demonstration

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');
    const refreshBtn = document.getElementById('refresh-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const tableBody = document.getElementById('table-body');
    const loadingSpinner = document.getElementById('loading-spinner');
    const totalCount = document.getElementById('total-count');

    // Check login state (simple sessionStorage)
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        showDashboard();
    }

    // Login Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = document.getElementById('admin-password').value;
        if (pwd === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            showDashboard();
        } else {
            errorMsg.textContent = "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่";
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        dashboardScreen.style.display = 'none';
        loginScreen.style.display = 'flex';
        document.getElementById('admin-password').value = '';
        errorMsg.textContent = '';
    });

    // Refresh Data
    refreshBtn.addEventListener('click', () => {
        fetchData();
    });

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'flex';
        fetchData();
    }

    // Fetch Data from Supabase
    async function fetchData() {
        loadingSpinner.style.display = 'flex';
        tableBody.innerHTML = '';

        try {
            const { data, error, count } = await supabase
                .from('registrations')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });

            if (error) throw error;

            totalCount.textContent = count || 0;

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">ไม่พบข้อมูลการลงทะเบียน</td></tr>';
            } else {
                renderTable(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    // Render Table Rows
    function renderTable(data) {
        data.forEach((item, index) => {
            const tr = document.createElement('tr');
            
            // Format Date
            const date = new Date(item.created_at);
            const formattedDate = `${date.toLocaleDateString('th-TH')} ${date.toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}`;

            // Determine Course Name
            let courseName = "";
            if (item.course === "1") courseName = "EMC & EMI Troubleshooting";
            else if (item.course === "2") courseName = "PCB Design";
            else if (item.course === "3") courseName = "Semiconductor Fabrication";
            else courseName = item.course;

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${formattedDate}</td>
                <td style="font-weight: 500;">${item.fullname}</td>
                <td class="contact-info">
                    <span>✉️ ${item.email}</span>
                    <span>📞 ${item.phone}</span>
                </td>
                <td>${item.company}</td>
                <td>${item.education}</td>
                <td><span style="background: #e0f2fe; color: #0284c7; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.85rem;">${courseName}</span></td>
                <td>${item.location}</td>
            `;
            tableBody.appendChild(tr);
        });
    }
});
