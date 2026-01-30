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
            deployBtn.innerText = 'Workflow Running...';
            deployBtn.style.opacity = '0.7';
            deployBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                alert('CI Workflow triggered successfully using GMS_TOKEN!');
                deployBtn.innerText = 'Run Workflow';
                deployBtn.style.opacity = '1';
                deployBtn.style.pointerEvents = 'auto';
            }, 2000);
        });
    }

    // Simple navigation switching
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const page = item.id.replace('nav-', '');
            console.log(`Navigating to ${page}`);
            // In a real app, this would change the content
        });
    });
});
