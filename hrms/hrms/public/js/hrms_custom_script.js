console.log("HRMS script");

frappe.router.on('change', () => {
    console.log("The function works correctly when the HRMS route changes");
    const path = window.location.pathname;
	console.log(path, "HRMS path")
    if (path === "/app/employee") {
        // const breadcrumbs = document.getElementById("navbar-breadcrumbs");
        // if (breadcrumbs) {
        //     breadcrumbs.innerHTML = "";

        //     const items = [
        //         { text: "Back", href: "javascript:history.back()" },
        //         { text: "Home", href: "/hr-apps" },
        //         { text: "All Apps", href: "/applications" }
        //     ];

        //     items.forEach((item, index) => {
        //         const li = document.createElement("li");
        //         li.classList.add("nav-item");

        //         const a = document.createElement("a");
        //         a.classList.add("nav-link");
        //         a.href = item.href;
        //         a.textContent = item.text;

        //         li.appendChild(a);
        //         breadcrumbs.appendChild(li);               
        //     });
        // }
    
		window.location.href = "/app/employee/view/image?status=Active";
	} 
});
