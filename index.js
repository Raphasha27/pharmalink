document.addEventListener('DOMContentLoaded', () => {
    console.log('GitHub Management System Dashboard Initialized');

    // Add hover sound effect logic (optional/simulated)
    const cards = document.querySelectorAll('.stat-card, .gov-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--accent-purple)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--glass-border)';
        });
    });

    // Handle Workflow Button
    const deployBtn = document.getElementById('btn-deploy');
    if (deployBtn) {
        deployBtn.addEventListener('click', () => {
            deployBtn.innerText = 'Auditing AML Compliance...';
            deployBtn.style.opacity = '0.7';
            setTimeout(() => {
                deployBtn.innerText = 'Audit Passed: 100%';
                deployBtn.style.background = 'var(--accent-green)';
                deployBtn.style.opacity = '1';
                console.log('AML Regulatory Audit Simulation Complete.');
            }, 2000);
        });
    }

    // Simple navigation switching (Tabs)
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            if (!tabId) return;

            // Update Nav Items
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Tab Panes
            tabPanes.forEach(pane => pane.classList.remove('active'));
            const targetPane = document.getElementById(`tab-${tabId}`);
            if (targetPane) targetPane.classList.add('active');

            console.log(`Switched to tab: ${tabId}`);
        });
    });

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');

            // Toggle icon between menu and close
            if (sidebar.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            } else {
                mobileMenuBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            }
        });

        // Close sidebar when clicking a nav item on mobile
        const navItemsList = document.querySelectorAll('.nav-item');
        navItemsList.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
                }
            });
        });
    }
});
