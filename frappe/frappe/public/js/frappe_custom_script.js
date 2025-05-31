function handleRouteLogic() {
    const path = window.location.pathname;
    console.log('🔁 Route Check Triggered: ', path);

    const isGuest = frappe.session.user === 'Guest';

    if (!isGuest && path === "/app/home") {
        window.location.href = "/applications";
    }

    // Handle sidebar injection for employee
    // if (path === '/app/employee') {
    //     injectEmployeeSidebar();
    // }
}

// Sidebar Injection Logic
// function injectEmployeeSidebar() {
//     const sidebarContainer = document.querySelector('.sidebar-items');

//     if (sidebarContainer) {
//         // Clear existing items
//         sidebarContainer.innerHTML = '';

//         const customMenu = [
//             { label: 'Employee Dashboard', route: '/app/employee/home' },
//             { label: 'New Joiners', route: '/app/employee/new-joiners' },
//             { label: 'Training Calendar', route: '/app/employee/trainings' }
//         ];

//         customMenu.forEach(item => {
//             const div = document.createElement('div');
//             div.className = 'standard-sidebar-item';

//             div.innerHTML = `
//                 <a class="sidebar-link" href="${item.route}" style="text-decoration: none; display: block; padding: 8px 12px;">
//                     ${item.label}
//                 </a>
//             `;

//             sidebarContainer.appendChild(div);
//         });
//     } else {
//         console.warn("Sidebar container not found");
//     }
// }


// Initial page load
// frappe.after_ajax(() => {
//     handleRouteLogic();
// });

// Route change

frappe.router.on('change', () => {
    console.log("ROuter changes on frapp custom script for sidebar menu");
    const routesToRefresh = [
        '/app/overview',
        '/app/employee',
        '/app/dashboard-view/employee%20lifecycle',
        '/app/dashboard-view/CRM',
        '/app/dashboard-view/recruitment'
    ];

    if (routesToRefresh.includes(window.location.pathname)) {
        frappe.app.sidebar?.make_sidebar?.();
    }
});
