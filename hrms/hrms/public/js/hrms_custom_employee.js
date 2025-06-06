var pagePath = window.location.pathname;

// Function visibility for right side profile image
function toggleSideSection() {
    const hash = window.location.hash;
    // console.log(hash, 'hash details');
    if (hash === '#custom_documents') {
        document.querySelectorAll('.layout-side-section.right').forEach(el => el.style.display = 'none');
    } else {
        document.querySelectorAll('.layout-side-section.right').forEach(el => el.style.display = '');
    }
}

// Employee Breadcrumb
function updateBreadcrumbAndTab() {
    console.log("Running updateBreadcrumbsAndUI function");

    const path = window.location.pathname;
    console.log(path, "HRMS EMPLOYEE path");

    const breadcrumbs = document.getElementById("navbar-breadcrumbs");
    setInterval(() => {
        if (path === "/app/employee/view/image") {
            if (breadcrumbs) {
                breadcrumbs.innerHTML = "";

                const items = [
                    { text: "Back", href: "javascript:history.back()" },
                    { text: "Home", href: "/hr-apps" },
                    { text: "All Apps", href: "/applications" },
                ];

                items.forEach((item) => {
                    const li = document.createElement("li");
                    li.classList.add("nav-item");

                    const a = document.createElement("a");
                    a.classList.add("nav-link");
                    a.href = item.href;
                    a.textContent = item.text;

                    li.appendChild(a);
                    breadcrumbs.appendChild(li);
                });
            }
        } 
    }, 50)
    
    // else {
    //     console.log(path, "TTTTTTTTTTTTTTTTTTTTTTTAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBB");
    //     const segments = path.split('/');
    //     if (segments.length === 4 && segments[1] === 'app' && segments[2] === 'employee') {
    //         console.log('Condition working fine');

    //         const listIdNames = [
    //             'employee-basic_details_tab-tab',
    //             'employee-employment_details-tab',
    //             'employee-contact_details-tab',
    //             'employee-attendance_and_leave_details-tab',
    //             'employee-salary_information-tab',
    //             'employee-personal_details-tab',
    //             'employee-profile_tab-tab',
    //             'employee-exit-tab',
    //             'employee-connections_tab-tab'
    //         ];

    //         listIdNames.forEach(listId => {
    //             const element = document.getElementById(listId);
    //             if (element) {
    //                 element.style.display = 'none';
    //             }
    //         });

    //     }
    // }
}

// Get employee attachments
function load_employee_attachments(frm = null, name = null) {
    frappe.db.get_list('File', {
        filters: {
            attached_to_doctype: 'Employee',
            attached_to_name: frm.doc.name ?? name,
        },
        fields: ['file_name', 'file_url']
    }).then(files => {
        if (!files || files.length === 0) {
            frm.fields_dict.custom_document_list.$wrapper.html("<p>No attachments found.</p>");
            return;
        }

        let html = `
            <style>
                .attachment-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 10px;
                }
                .attachment-item {
                    text-align: center;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 10px;
                }
                .attachment-item img,
                .attachment-item iframe {
                    width: 100%;
                    height: auto;
                    border-radius: 4px;
                }
                .attachment-item p {
                    font-size: 12px;
                    word-break: break-word;
                    margin-top: 5px;
                }
            </style>
            <div class="attachment-grid">`;

        files.forEach(file => {
            const extension = file.file_url.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                html += `
                    <div class="attachment-item">
                        <a href="${file.file_url}" target="_blank">
                            <img src="${file.file_url}" alt="${file.file_name}" style="height: 300px;width: 100%;"/>
                        </a>                            
                        <p>${file.file_name}</p>
                    </div>`;
            } else if (extension === 'pdf') {
                html += `
                    <div class="attachment-item">
                        <a href="${file.file_url}" target="_blank">
                            <iframe src="${file.file_url}#toolbar=0" style="height: 300px;width: 100%;"></iframe>
                        </a>                            
                        <p>${file.file_name}</p>
                    </div>`;
            }
        });

        html += `</div>`;

        if (frm.fields_dict.custom_document_list) {
            frm.fields_dict.custom_document_list.$wrapper.html(html);
        }
    });
}

// DOM ready function
$(document).ready(function () {
    console.log("CALL BY READY FUNCTION")
    toggleSideSection();
    // Employee Card Reload
    if (pagePath === "/app/employee/view/image") {
        const hasReloaded = sessionStorage.getItem("image_view_loaded");

        if (!hasReloaded) {
            sessionStorage.setItem("image_view_loaded", "true");
            window.location.reload(); 
        } else {
            sessionStorage.removeItem("image_view_loaded"); 
        }
    }
    // updateBreadcrumbAndTab();
    setTimeout(() => {
        frappe.breadcrumbs.update();
    }, 100);
});

// Router changes
frappe.router.on('change', () => {
    console.log("CALL BY ROUTER")
    toggleSideSection();
    // updateBreadcrumbAndTab();
    setTimeout(() => {
        frappe.breadcrumbs.update();
    }, 100);
});

// Document information list rerendering the page

let currentHash = window.location.hash;

setInterval(() => {
    if (window.location.hash !== currentHash) {
        currentHash = window.location.hash;
        toggleSideSection();
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);

        if (segments[0] === 'app' && segments[1] === 'employee' && segments.length === 3) {
            const employeeId = segments[2];

            const currentForm = frappe?.container?.page?.frm;

            // If a valid Employee form is open, refresh it
            if (currentForm && currentForm.doctype === 'Employee' && currentForm.doc.name === employeeId) {
                currentForm.refresh(); 
            } 
        }
    }
}, 100);


// Fields set to work information 
frappe.ui.form.on('Employee', {
    onload: function(frm) {
        toggleSideSection();
        load_employee_attachments(frm);
        // Add field in work information
        if (frm.doc.employee_name) {
            frm.set_value('custom_name', frm.doc.employee_name);
        }
    },
    refresh: function(frm) {
        toggleSideSection();
        load_employee_attachments(frm);
        // Add field in work information
        if (frm.doc.employee_name) {
            frm.set_value('custom_name', frm.doc.employee_name);
        }
    },
    employee_name: function(frm) {
        if (frm.doc.employee_name) {
            frm.set_value('custom_name', frm.doc.employee_name);
        }
    }
});
















