import frappe
from frappe.utils import now_datetime

def get_context(context):
    logo = None
    user = frappe.session.user
    app_logo = frappe.db.get_value("Website Settings", "Website Settings", "app_logo")
    employee = frappe.get_all("Employee", filters={"user_id": user}, fields=["company"], limit=1)

    if user == "Administrator":
        if app_logo:
            logo = app_logo
    else:
        if employee:
            logo = frappe.db.get_value("Company", employee[0].company, "company_logo")
    context.user = user
    html_template = frappe.render_template("templates/custom_template/logo.html", {"logo": logo})
    context.render_logo_html = html_template
    context.logo = logo
    context.apps = [
        ("HRMS", "/hr-apps", "hrms.png"),
        ("Supply Chain", "/app/home", "supply-chain.png"),
        ("Sales", "/app/selling", "sales.png"),
        ("Operations", "#", "operation.png"),
        ("Manufactures", "#", "manufactures.png"),
        ("Finance", "#", "finance.png"),
        ("Self Service", "#", "self-service.png"),
        ("Help Desk", "#", "help-desk.png"),
        ("Calendar", "#", "calendar.png"),
        ("Documents", "#", "documents.png"),
        ("Observations", "#", "observation.png"),
        ("Notes", "#", "notes.png")
    ]
