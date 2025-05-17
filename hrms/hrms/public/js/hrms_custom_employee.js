// frappe.listview_settings['Employee'] = {
//     onload: function(listview) {
//         // Add breadcrumb manually
//         const breadcrumb = `
//             <nav style="margin-bottom: 10px;">
//                 <a href="/app/dashboard" style="color: #007bff;">Home</a> 
//                 <span>Employee List</span>
//             </nav>
//             <br>
//         `;
//         const wrapper = listview.page.$title_area || listview.page.wrapper;
//         $(wrapper).prepend(breadcrumb);
//     }
// };

frappe.router.on('change', () => {
    console.log("The function works correctly when the HRMS EMPLOYEE route changes");
    const path = window.location.pathname;
    console.log(path, "HRMS EMPLOYEE path")

    const breadcrumbs = document.getElementById("navbar-breadcrumbs");

    if (path === "/app/employee/view/image") {
        if (breadcrumbs) {
            breadcrumbs.innerHTML = "";

            const items = [
                { text: "Back", href: "javascript:history.back()" },
                { text: "Home", href: "/hr-apps" },
                { text: "All Apps", href: "/applications" },
                { text: "Employee", href: "app/employee/view/image?status=Active" }
            ];

            items.forEach((item, index) => {
                const li = document.createElement("li");
                li.classList.add("nav-item");

                const a = document.createElement("a");
                a.classList.add("nav-link");
                a.href = item.href;
                a.textContent = item.text;

                li.appendChild(a);
                breadcrumbs.appendChild(li);

                // if (index < items.length - 1) {
                //     const separator = document.createElement("li");
                //     separator.classList.add("nav-item");
                //     separator.innerHTML = `<span class="nav-link">/</span>`;
                //     breadcrumbs.appendChild(separator);
                // }
            });
        }
    }
    //  else {
        // Optional: restore default breadcrumb behavior
        // You can trigger Frappe to regenerate its default breadcrumbs like this:
        // if (frappe.breadcrumbs && frappe.breadcrumbs.update) {
        //     frappe.breadcrumbs.update();
        // }
    // }
});


