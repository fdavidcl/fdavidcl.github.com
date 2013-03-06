/*
 * Estructura de una torre: { title: "", sections: [] }
 * Estructura de una sección: { name: "", links: [] }
 * Estructura de un enlace: { name: "", href: "" }
 */

/*right_panel.Display = function() {
	var lim = right_panel.towers.length;
	var height = window.innerHeight;
	var link_height = 46;
	var margin = 60;
	var linkspercol = Math.floor((height - margin) / link_height);
	
	document.querySelector('#right').innerHTML = "";
	
	for (var i = 0; i < lim; i++) {
		var tower = right_panel.towers[i];
		var elem_t = document.createElement("div");
		elem_t.className = "tower";
		var inner = "<h1><span>" + tower.title + "</span><a title='Eliminar torre' class='edit del_tower'  id='del_tower_" + i + "'>x</a><a title='Añadir sección' class='edit add_section'  id='add_section_" + i + "'>+</a></h1>";
		inner += "<div class='col'>";
		
		var link_counter = 0;
		var lim_sec = tower.sections.length;
		for (var j = 0; j < lim_sec; j++) {
			var section = tower.sections[j];
			
			if (link_counter + 1 >= linkspercol) {
				inner += "</div><div class='col'>";
				link_counter = 0;
			}
			
			if (section.name) {
				inner += "<h3>" + section.name + "<a title='Eliminar sección' class='edit del_section' id='del_section_" + i + "_" + j + "'>x</a><a title='Añadir enlace' class='edit add_link' id='add_link_" + i + "_" + j + "'>+</a></h3>";
				link_counter++;
			}
			
			var quantity = section.links.length;
			for (var k = 0; k < quantity; k++) {
				var link = section.links[k];
				var l_elem = document.createElement('a');
				l_elem.className = 'bm';
				l_elem.id = "l" + i + "_" + j + "_" + k;
				l_elem.href = link.href;
				l_elem.style.backgroundImage = "url(chrome://favicon/" + link.href + ")";
				l_elem.innerHTML = "<span title='Eliminar enlace' class='edit del_link' id='del_link_" + i + "_" + j + "_" + k + "'>x</span>" + link.name;
				var dummy = document.createElement('div');
				dummy.appendChild(l_elem);
				
				inner += dummy.innerHTML;
				
				link_counter++;
				
				if (link_counter >= linkspercol) {
					inner += "</div><div class='col'>";
					link_counter = 0;
				}
			}
		}
			
		inner += "</div>";
		
		elem_t.innerHTML = inner;
		
		document.querySelector('#right').appendChild(elem_t);
		
	}
	
	//if (location.hash == "#config/edit") {
		var lim_tow = right_panel.towers.length;
		for (var i = 0; i < lim_tow; i++) {
			document.querySelector('#del_tower_' + i).onclick = function() { right_panel.DeleteTower(i); };
			document.querySelector('#add_section_' + i).onclick = "right_panel.AddSection(" + i + ");";
			
			var lim_col = right_panel.towers[i].sections.length;
			for (var j = 0; j < lim_col; j++) {
				if (document.querySelector('#del_section_' + i + '_' + j)) {
					document.querySelector('#del_section_' + i + '_' + j).onclick = "right_panel.DeleteSection(" + i + ", " + j + ");";
					document.querySelector('#add_link_' + i + '_' + j).onclick = "right_panel.AddLink(" + i + ", " + j + ");";
				}
				
				var lim_lnk = right_panel.towers[i].sections[j].links.length;
				for (var k = 0; k < lim_lnk; k++) {
					document.querySelector('#del_link_' + i + "_" + j + "_" + k).onclick = "right_panel.DeleteTower(" + i + "," + j + "," + k + ");";
				}
			}
		}
	//}
	
	document.querySelector('#right').innerHTML += '<div class="tower"><a title="Añadir torre" class="edit add_tower" href="javascript:right_panel.AddTower()">+</a></div>';
};*/

right_panel.AddTower = function() {
	var new_tower = {
		title: "",
		sections: [
			{
				links: [
					
				]
			}
		]
	}
	
	new_tower.title = io.Ask("Título", "Nueva torre");
	
	right_panel.towers.push(new_tower);
	right_panel.Save();
};

right_panel.AddSection = function(tower) {
	var new_section = {
		name: "",
		links: [
			
		]
	};
	
	new_section.name = io.Ask("Nombre", "Nueva sección");
	
	right_panel.towers[tower].sections.push(new_section);
	right_panel.Save();
};
right_panel.AddLink = function(tower, section) {
	var new_link = {};
	
	new_link.name = io.Ask('Nombre', new_link.name);
	new_link.href = io.Ask('Dirección', "http://" + new_link.name.toLowerCase() + ".com");
	
	right_panel.towers[tower].sections[section].links.push(new_link);
	right_panel.Save();
};
right_panel.DeleteTower = function(tower) {
	if (io.Confirm("¿Seguro que deseas borrar esta torre? Todos los enlaces que contiene se perderán")) {
		right_panel.towers.splice(tower, 1);
	}
	right_panel.Save();
};
right_panel.DeleteSection = function(tower, section) {
	if (io.Confirm("¿Seguro que deseas borrar esta sección? Todos los enlaces que contiene se perderán")) {
		right_panel.towers[tower].sections.splice(section, 1);
	}
	right_panel.Save();
};
right_panel.DeleteLink = function(tower, section, link) {
	right_panel.towers[tower].sections[section].links.splice(link, 1);
	right_panel.Save();
};
right_panel.Save = function() {
	localStorage.towersData = JSON.stringify(right_panel.towers);
	right_panel.Display();
};

var io = {
	windows: {
		general_conf: {
			id: "window_config",
			width: 400,
			height: 400,
			title: "Configuración",
			content: '<span class="options"><a href="#config/edit">Editar enlaces</a><a href="#config/themes">Apariencia</a><a href="#config/export">Exportar configuración</a><a href="#config/import">Importar configuración</a><a href="#config/bookmarks">Importar marcadores</a></span>',
			buttons: [
				["Cerrar", function() {
					io.CloseWindow('#window_config');
					document.querySelector('#search_input').focus();
					location.hash = "";
				}]
			]
		},
		themes: {
			id: "window_theme",
			width: 400,
			height: 300,
			title: "Temas",
			content: 'Elige uno de los temas disponibles.<p><span id="choose_theme"><input type="radio" name="theme" value="theme/metro_dark.css" id="metro_dark" /><label for="metro_dark">Metro Dark</label><br /><input type="radio" name="theme" value="theme/metro_light.css" id="metro_light" /><label for="metro_light">Metro Light</label><br /><input type="radio" name="theme" value="theme/neon_dark.css" id="neon_dark" /><label for="neon_dark">Neon Dark</label><br /></span><p>',
			buttons: [
				["Listo", function() { config.SetTheme(); io.CloseWindow('#window_theme')}],
				["Cancelar", function() { location.hash = "#config"; }]
			]
		},
		export_conf: {
			id: "window_export",
			width: 500,
			height: 500,
			title: "Exportar configuración",
			content: 'Exportando tu configuración podrás transferir los enlaces y los ajustes de tu página a otros dispositivos. Pulsa <b>Exportar</b> para comenzar.<p></p>',
			buttons: [
				["Exportar", function() {
					var ex = document.createElement('textarea');
					ex.value = JSON.stringify(localStorage);
					ex.style.width = "500px";
					ex.style.height = "180px";
					ex.style.marginTop = "20px";
					document.querySelector('#window_export > div').appendChild(ex);
					document.querySelector('#window_export > div > textarea').select();
				}],
				["Cerrar", function() { location.hash = "#config"; }]
			]
		},
		import_conf: {
			id: "window_import",
			width: 500,
			height: 500,
			title: "Importar configuración",
			content: 'Copia aquí el código que obtuviste al exportar tu configuración. Pulsa <b>Importar</b> para sustituir tu configuración actual por la importada.<p></p><textarea id="import_code" style="width: 500px; height: 180px;"></textarea>',
			buttons: [
				["Importar", function() {
					try {
						var nc = JSON.parse(document.querySelector('#import_code').value);
						
						localStorage.clear();
						for (key in nc) {
							localStorage[key] = nc[key];
						}
						
						io.CloseWindow('#window_import');
						io.Inform("Importación completada", "Tu configuración ha sido importada con éxito.");
						location.reload(true);
					} catch(err) {
						io.Alert("Error", "No se ha podido llevar a cabo la importación. Mensaje de error:\n" + err.message);
					}
				}],
				["Cancelar", function() { location.hash = "#config"; }]
			]
		},
		import_bookmarks: {
			id: "window_bookmarks",
			width: 400,
			height: 300,
			title: "Importar marcadores",
			content: 'Al importar tus marcadores se crearán nuevas torres de enlaces que sustituirán a las actuales. Si deseas continuar, pulsa <strong>Comenzar</strong>.',
			buttons: [
				["Comenzar", function() {
					try {
						bookmarks.LoadImport();
						
						io.Inform("Importación completada", "Tus marcadores han sido importados con éxito.");
						location.hash = "";
						location.reload(true);
					} catch(err) {
						io.Alert("Error", "No se ha podido llevar a cabo la importación. Mensaje de error:\n" + err.message);
					}
				}],
				["Cancelar", function() { location.hash = "#config"; }]
			]
		}
	},
	Alert: function(title, message) {
		alert(title + "\n" + message);
	},
	Inform: function(title, message) {
		alert(title + "\n" + message);
	},
	Ask: function(message, default_val) {
		return prompt(message, default_val);
	},
	Confirm: function (message) {
		return confirm(message);
	},
	ShowWindow: function(win) {
		var elem = document.createElement('div');
		elem.id = win.id;
		elem.className = "window";
		
		var innh = "<div style='width: " + win.width + "px; height: " + win.height + "px;'><header>" + win.title + "</header>";
		innh += win.content;
		innh += "<div class='buttons'><a id=\"" + win.id + "_but0\" class='accept'>" + win.buttons[0][0];
		
		for (var i = 1; i < win.buttons.length; i++) {
			innh += "</a><a id=\"" + win.id + "_but" + i +"\">" + win.buttons[i][0];
		}
		
		innh += "</a></div></div>";
		elem.innerHTML = innh;
		
		if (document.querySelector(".window")) {
			document.querySelector(".window").parentNode.removeChild(document.querySelector(".window"));
		}
		
		document.querySelector("#window_space").appendChild(elem);
		
		for (var i = 0; i < win.buttons.length; i++) {
			document.querySelector('#' + win.id + '_but' + i).onclick = win.buttons[i][1];
		}
	},
	CloseWindow: function(winsel) {
		document.querySelector("#window_space").removeChild(document.querySelector(winsel));
	}
};



var config = {
	modes: {
		user: "user_mode",
		edit: "edit_mode",
		search: "search_mode"
	},
	ChangeMode: function(mode) {
		document.querySelector("body").className = mode;
	},
	LoadTheme: function() {
		document.querySelector("#theme").href = localStorage.usertheme ?
			localStorage.usertheme : "theme/metro_dark.css";
	},
	Load: function() {
		config.LoadTheme();
		config.GetMode();
	},
	GetMode: function() {
		switch (location.hash) {
			case "#config":
				io.ShowWindow(io.windows.general_conf);
			break;
			case "#config/edit":
				config.ChangeMode(config.modes.edit);
			break;
			case "#config/themes":
				io.ShowWindow(io.windows.themes);
			break;
			case "#config/export":
				io.ShowWindow(io.windows.export_conf);
			break;
			case "#config/import":
				io.ShowWindow(io.windows.import_conf);
			break;
			case "#config/bookmarks":
				io.ShowWindow(io.windows.import_bookmarks);
			break;
		}
	},
	ToggleEditMode: function() {
		var current = document.querySelector("body").className;
		if (current == config.modes.user) {
			config.ChangeMode(config.modes.edit);
		} else {
			config.ChangeMode(config.modes.user);
		}
	},
	SetTheme: function() {
		var new_theme = document.querySelector('#choose_theme input:checked').value;
		localStorage.usertheme = new_theme;
		location.hash = "#config";
		location.reload(true);
	}
};
