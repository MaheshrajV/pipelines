/**
 * frappe.views.ImageView
 */
frappe.provide("frappe.views");

var path = window.location.pathname; 

frappe.views.ImageView = class ImageView extends frappe.views.ListView {
	get view_name() {
		return "Image";
	}

	setup_defaults() {
		return super.setup_defaults().then(() => {
			this.page_title = this.page_title + " " + __("Images");
		});
	}

	setup_view() {
		this.setup_columns();
		this.setup_check_events();
		this.setup_like();
	}

	set_fields() {
		// Customization on employee card view
		if (path === '/app/employee/view/image') {
			this.fields = [
				"name",
				"employment_type",
				"current_address",
				"department",
				"cell_number",
				"personal_email",
				"company_email",
				...this.get_fields_in_list_view().map((el) => el.fieldname),
				this.meta.title_field,
				this.meta.image_field,
				"_liked_by",
			];
		} else if (path === '/app/customer/view/image') {
			this.fields = [
				"name",
				"email_id",
				"custom_linked_company",
				"mobile_no",
				// "custom_requirements",
				...this.get_fields_in_list_view().map((el) => el.fieldname),
				this.meta.title_field,
				this.meta.image_field,
				"_liked_by",
			];
		} else {
			this.fields = [
				"name",
				...this.get_fields_in_list_view().map((el) => el.fieldname),
				this.meta.title_field,
				this.meta.image_field,
				"_liked_by",
			];
		}
		
	}

	prepare_data(data) {
		super.prepare_data(data);
		this.items = this.data.map((d) => {
			// absolute url if cordova, else relative
			d._image_url = this.get_image_url(d);
			return d;
		});
	}

	render() {
		this.load_lib.then(() => {
			this.get_attached_images().then(() => {
				this.render_image_view();

				if (!this.gallery) {
					this.setup_gallery();
				} else {
					this.gallery.prepare_pswp_items(this.items, this.images_map);
				}
			});
		});
	}

	render_image_view() {
		var html = this.items.map(this.item_html.bind(this)).join("");

		this.$page.find(".layout-main-section-wrapper").addClass("image-view");

		this.$result.html(`
			<div class="image-view-container" style="grid-template-columns: repeat(auto-fill, minmax(265px, 1fr)) !important;">
				${html}
			</div>
		`);		

		this.render_count();
		// Breadcrub customization for employee
		setTimeout(() => {
			const breadcrumbs = document.getElementById("navbar-breadcrumbs");
			
			if (path === "/app/employee/view/image") {
				if (breadcrumbs) {
					breadcrumbs.innerHTML = "";
					const items = [
						{ text: "Back", href: "javascript:history.back()" },
						{ text: "Home", href: "/hr-apps" },
						{ text: "All Apps", href: "/applications" }
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
		}, 50); 
	}

	item_details_html(item) {
		// TODO: Image view field in DocType
		let info_fields = this.get_fields_in_list_view().map((el) => el.fieldname) || [];
		// console.log(info_fields, 'info_fields');
		const title_field = this.meta.title_field || "name";
		info_fields = info_fields.filter((field) => field !== title_field);
		let info_html = `<div><ul class="list-unstyled image-view-info" style="font-size: .62rem;">`;
		let set = false;
		info_fields.forEach((field, index) => {
			if (item[field] && !set) {
				if (index == 0) info_html += `<li>${__(item[field])}</li>`;
				else info_html += `<li class="text-muted">${__(item[field])}</li>`;
				set = true;
			}
		});
		info_html += `</ul></div>`;
		return info_html;
	}

	// item_html(item) {
	// 	// console.log(this.items, 'employee details')
	// 	item._name = encodeURI(item.name);
	// 	const encoded_name = item._name;
	// 	const title = strip_html(item[this.meta.title_field || "name"]);
	// 	const escaped_title = frappe.utils.escape_html(title);
		
	// 	let designation = '', 
	// 		employment_type = '',
	// 		department = '',
	// 		cell_number = '',
	// 		personal_email = '';

	// 	if (path === '/app/employee/view/image') {
	// 		// Our hrms custom adding fields 
	// 		item.designation || "Designation Not Available";
	// 		item.employment_type || "Employment Type Not Available";
	// 		item.current_address || "Address Not Available";
	// 		item.department || "Department Not Available";
	// 		item.cell_number || "Mobile Number Not Available";
	// 		item.personal_email || "Email Not Available";
	// 	} 
		
	// 	const _class = !item._image_url ? "no-image" : "";
	// 	const _html = item._image_url
	// 		? `<img data-name="${encoded_name}" src="${item._image_url}" alt="${title}" style="width: 175px;height: 237px;">`
	// 		: `<span class="placeholder-text">
	// 			${frappe.get_abbr(title)}
	// 		</span>`;

	// 	let details = this.item_details_html(item);

	// 	const expand_button_html = item._image_url
	// 		? `<div class="zoom-view" data-name="${encoded_name}" style="left: 150px !important; bottom: 150px !important;">
	// 			${frappe.utils.icon("expand", "xs")}
	// 		</div>`
	// 		: "";

	// 	return `
	// 		<div class="image-view-item ellipsis card-zoomin">
	// 			<div class="image-view-header">
	// 				<div>
	// 					<input class="level-item list-row-checkbox hidden-xs"
	// 						type="checkbox" data-name="${escape(item.name)}">
	// 						${this.get_like_html(item)}
	// 				</div>
	// 			</div>
	// 			<div class="image-view-body ${_class}" style="display: flex !important; align-items: flex-start !important;">
	// 				<div style="flex: 0 0 auto !important;">
	// 					<a data-name="${encoded_name}" title="${encoded_name}" href="${this.get_form_link(item)}">
	// 						<div data-name="${encoded_name}">
	// 							${_html}
	// 						</div>
	// 					</a>
	// 					${expand_button_html}
	// 				</div>

	// 				<div class="employee-details" style="flex: 1 !important; line-height: 1.6 !important;padding: 0px 10px 10px !important;">
	// 					<div class="image-title">
	// 						<span class="ellipsis" title="${escaped_title}">
	// 							<a class="ellipsis" href="${this.get_form_link(item)}"
	// 								title="${escaped_title}" data-doctype="${this.doctype}" data-name="${item.name}">
	// 								${title}
	// 							</a>
	// 						</span>
	// 					</div>
	// 					if (path === '/app/employee/view/image') {
	// 						${designation}<br>
	// 						${employment_type}<br>
	// 						${department}<br>
	// 						${cell_number}<br>
	// 						${personal_email}<br>
	// 						${details}
	// 					} else {
	// 					 	${customer_type}<br>
	// 					}
						
	// 				</div>
	// 			</div>
	// 		</div>
	// 	`;
	// }
	item_html(item) {
		item._name = encodeURI(item.name);
		const encoded_name = item._name;
		const title = strip_html(item[this.meta.title_field || "name"]);
		const escaped_title = frappe.utils.escape_html(title);

		let designation = '', 
			employment_type = '',
			department = '',
			cell_number = '',
			personal_email = '',
			company_email = '',
			customer_email_id = '',
			customer_company_name = '',
			customer_type = '',
			customer_mobile_no,
			employeeDetails = '';

		if (path === '/app/employee/view/image') {
			designation = item.designation || "Designation Not Available";
			employment_type = item.employment_type || "Employment Type Not Available";
			department = item.department || "Department Not Available";
			cell_number = item.cell_number || "Mobile Number Not Available";
			company_email = item.company_email || "Company Email Not Available";

			employeeDetails = `
				${designation}<br>
				${employment_type}<br>
				${department}<br>
				${cell_number}<br>
				${company_email}<br>
				${this.item_details_html(item)}
			`;
		} else {
			customer_email_id = item.email_id || "Email Not Available";
			customer_company_name = item.custom_linked_company || "Company not Available"
			customer_type = item.customer_type || "Customer Type Not Available";
			customer_mobile_no = item.mobile_no || "Mobile No Not Available";
			employeeDetails = `
				${customer_email_id}<br>
				${customer_company_name}<br>
				${customer_type}<br>
				${customer_mobile_no}<br>
			`;
		}

		const _class = !item._image_url ? "no-image" : "";
		const _html = item._image_url
			? `<img data-name="${encoded_name}" src="${item._image_url}" alt="${title}" style="width: 100px;height: 140px;">`
			: `<span class="placeholder-text">${frappe.get_abbr(title)}</span>`;

		const expand_button_html = item._image_url
			? `<div class="zoom-view" data-name="${encoded_name}" style="left: 71px !important; bottom: 122px !important;">
				${frappe.utils.icon("expand", "xs")}
			</div>`
			: "";

		return `
			<div class="image-view-item ellipsis card-zoomin">
				<div class="image-view-header">
					<div>
						<input class="level-item list-row-checkbox hidden-xs"
							type="checkbox" data-name="${escape(item.name)}">
						${this.get_like_html(item)}
					</div>
				</div>
				<div class="image-view-body ${_class}" style="display: flex !important; align-items: flex-start !important;">
					<div style="flex: 0 0 auto !important;">
						<a data-name="${encoded_name}" title="${encoded_name}" href="${this.get_form_link(item)}">
							<div data-name="${encoded_name}">
								${_html}
							</div>
						</a>
						${expand_button_html}
					</div>

					<div class="employee-details" style="flex: 1 !important; line-height: 1.6 !important;padding: 0px 10px 10px !important;font-size: .62rem !important;">
						<div class="image-title">
							<span class="ellipsis" title="${escaped_title}">
								<a class="ellipsis" href="${this.get_form_link(item)}"
									title="${escaped_title}" data-doctype="${this.doctype}" data-name="${item.name}">
									${title}
								</a>
							</span>
						</div>
						${employeeDetails}
					</div>
				</div>
			</div>
		`;
	}



	get_attached_images() {
		return frappe
			.call({
				method: "frappe.core.api.file.get_attached_images",
				args: {
					doctype: this.doctype,
					names: this.items.map((i) => i.name),
				},
			})
			.then((r) => {
				this.images_map = Object.assign(this.images_map || {}, r.message);
			});
	}

	setup_gallery() {
		var me = this;
		this.gallery = new frappe.views.GalleryView({
			doctype: this.doctype,
			items: this.items,
			wrapper: this.$result,
			images_map: this.images_map,
		});
		this.$result.on("click", ".zoom-view", function (e) {
			e.preventDefault();
			e.stopPropagation();
			var name = $(this).data().name;
			name = decodeURIComponent(name);
			me.gallery.show(name);
			return false;
		});
	}

	get required_libs() {
		return [
			"assets/frappe/node_modules/photoswipe/src/photoswipe.css",
			"photoswipe.bundle.js",
		];
	}
};

frappe.views.GalleryView = class GalleryView {
	constructor(opts) {
		$.extend(this, opts);
		var me = this;
		me.prepare();
	}
	prepare() {
		// keep only one pswp dom element
		this.pswp_root = $("body > .pswp");
		if (this.pswp_root.length === 0) {
			var pswp = frappe.render_template("photoswipe_dom");
			this.pswp_root = $(pswp).appendTo("body");
		}
	}
	prepare_pswp_items(_items, _images_map) {
		var me = this;

		if (_items) {
			// passed when more button clicked
			this.items = this.items.concat(_items);
			this.images_map = _images_map;
		}

		return new Promise((resolve) => {
			const items = this.items
				.filter((i) => i.image !== null)
				.map(function (i) {
					const query = 'img[data-name="' + i._name + '"]';
					let el = me.wrapper.find(query).get(0);

					let width, height;
					if (el) {
						width = el.naturalWidth;
						height = el.naturalHeight;
					}

					if (!el) {
						el = me.wrapper.find('.image-field[data-name="' + i._name + '"]').get(0);
						width = el.getBoundingClientRect().width;
						height = el.getBoundingClientRect().height;
					}

					return {
						src: i._image_url,
						name: i.name,
						width: width,
						height: height,
					};
				});
			this.pswp_items = items;
			resolve();
		});
	}
	show(docname) {
		this.prepare_pswp_items().then(() => this._show(docname));
	}
	_show(docname) {
		const items = this.pswp_items;
		const item_index = items.findIndex((item) => item.name === docname);

		var options = {
			index: item_index,
			history: false,
			shareEl: false,
			dataSource: items,
		};

		// init
		this.pswp = new frappe.PhotoSwipe(options);
		this.pswp.init();
	}
};
