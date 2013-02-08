function AjaxRequest(url, callback) {
	this.url = url;

	this.Send = function() {
		if (window.XMLHttpRequest) {
			var xmlhttp = new XMLHttpRequest();
		}
		else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				callback(xmlhttp.responseText);
			}
		}
		xmlhttp.open("GET", this.url, true);
		xmlhttp.send();
	}
}

var search = {
	engines: [
		{
			name: "Google",
			favicon: "http://www.google.es/favicon.ico",
			url: {
				left: "http://www.google.es/search?q=",
				right: ""
			}
		},
		{
			name: "DuckDuckGo",
			favicon: "http://www.duckduckgo.com/favicon.ico",
			url: {
				left: "http://www.duckduckgo.com/",
				right: ""
			}
		},
		{
			name: "Bing",
			favicon: "http://www.bing.com/favicon.ico",
			url: {
				left: "http://www.bing.com/search?q=",
				right: ""
			}
		},
		{
			name: "WolframAlpha",
			favicon: "http://www.wolframalpha.com/favicon.ico",
			url: {
				left: "http://www.wolframalpha.com/input/?i=",
				right: ""
			}
		}
	],
	Display: function() {
		/*var quantity = search.engines.length;
		for (var i = 0; i < quantity; i++) {
			var op = document.createElement('input');
			op.type = "radio";
			op.name = "search_engine";
			op.id = "search_radio_" + i;
			
			var lb = document.createElement('label');
			lb.setAttribute("for", "search_radio_" + i);
			lb.textContent = search.engines[i].name;
			
			document.querySelector('#select_engine').insertBefore(op, document.querySelector('#add_engine'));
			document.querySelector('#select_engine').insertBefore(lb, document.querySelector('#add_engine'));
			
			if (search.engines[i].Load) {
				search.engines[i].Load();
			}
		}
		if (document.querySelector('#search_radio_0')) {
			document.querySelector('#search_radio_0').checked="checked";
		}*/
		
	},
	Instant: function() {
		var orig_query = document.querySelector('#search_form > input').value;
		var query = document.querySelector('#search_form > input').value.toLowerCase();
		search.best = [];
		var min_relev = -1;
		
		for (var i = 0; i < right_panel.towers.length; i++) {
			for (var j = 0; j < right_panel.towers[i].sections.length; j++) {
				for (var k = 0; k < right_panel.towers[i].sections[j].links.length; k++) {
					var name = right_panel.towers[i].sections[j].links[k].name;
					
					if (document.querySelector('#l'+i+'_'+j+'_'+k)) {
						var relevancia = -1;
						var words = name.toLowerCase().split(' '); // ¿Y si la clave de búsqueda son varias palabras?
						
						for (var w = 0; w < words.length; w++) {
							var n_r = words[w].search(query);
							
							if ((n_r > -1 && n_r < relevancia) || relevancia == -1) {
								relevancia = n_r;  // La mayor relevancia es 0, luego 1, etc.
							}
						}
						
						var coincide = relevancia > -1;
						
						if (coincide) {
							document.querySelector('#l'+i+'_'+j+'_'+k).style.display = 'block';
							
							var obj_encontrado = {
								favicon: right_panel.towers[i].sections[j].links[k].favicon,
								name: right_panel.towers[i].sections[j].links[k].name,
								href: right_panel.towers[i].sections[j].links[k].href,
								in_section: right_panel.towers[i].sections[j].name,
								from: right_panel.towers[i].title
							};
							
							// Por terminar aún...
							if (relevancia < min_relev) {
								search.best.unshift(obj_encontrado);
								
								if (search.best.length > 3) {
									search.best.pop();
								}
							} else if (search.best.length < 3) {
								search.best.push(obj_encontrado);
								
								min_relev = relevancia < min_relev || min_relev == -1 ? relevancia : min_relev;
							}
							
							// Ordenar los resultados más relevantes, eliminar
							// los menos relevantes, dejando solo 3.
						} else {
							document.querySelector('#l'+i+'_'+j+'_'+k).style.display = 'none';
						}
					}
				}
			}
		}
		
		var html_out = "";
		
		// Query a DuckduckGo
		var ddg_rq = new AjaxRequest("http://api.duckduckgo.com/?q=" + encodeURIComponent(orig_query) + "&format=json", search.InsertDDG);
		ddg_rq.Send();
		
		// Mejores resultados de marcadores
		if (query == "") {
			config.ChangeMode(config.modes.user);
		} else {
			config.ChangeMode(config.modes.search);
			
			var mejores = "";
			if (search.best.length > 0) {
				var tope = search.best.length;
				for (var m = 0; m < tope; m++) {
					var enl = search.best[m];
					mejores += '<a href="' + enl.href + '" style="background-image: url(' + enl.favicon + ')">' + enl.name + '<span class="from"> en ' + enl.from + '</span><span class="url">' + enl.href + '</span></a>';
				}
			}
			
			html_out += mejores;
		}
		
		// Buscadores
		var search_html = "";
		
		for (i in search.engines) {
			engine = search.engines[i];
			
			search_html += '<a href="' + engine.url.left + encodeURIComponent(orig_query) + engine.url.right + '" style="background-image: url(' + engine.favicon + ')">Buscar en ' + engine.name + '</a>';
		}
		
		html_out += search_html;
		
		document.querySelector('#search_output').innerHTML = html_out;
	},
	InsertDDG: function(content) {
		
	},
	FormSubmit: function() {
		if (search.best[0]) {
			event.preventDefault();
			document.location.href = search.best[0].href;
		} else {
			return true;
		}
	},
	Load: function() {
		search.Display();
		document.querySelector('#search_form > input').focus();
		document.querySelector('#search_form > input').oninput = function() { search.Instant(); };
		document.querySelector('#search_form > input').onpaste = function() { search.Instant(); };
		document.querySelector('#search_form > input').onkeyup = function() { search.Instant(); };
		document.querySelector('#search_form').onsubmit = function() { search.FormSubmit(); };
	}
};

var widgets = {
	icons: [
		{
			Title: function() {
				var date = new Date();
				var dias = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
				var meses = ["enero", "febrero", "marzo", 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
				
				return dias[date.getDay()] + " " + date.getDate() + " " + meses[date.getMonth()];
			},
			content: {
				Front: function() {
					var date = new Date();
					var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
					var mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
					
					return hour + ":" + mins;
				}
			},
			update: {
				frequency: 4
			}
		},
		{
			Title: function() {
				return "Outlook";
			},
			href: "http://outlook.com",
			content: {
				Front: function() {
					return "2 mensajes";
				}
			}
		},
		{
			Title: function() {
				return "Tuenti";
			},
			href: "http://tuenti.com",
			content: {
				Front: function() {
					return "1 petición";
				},
				Back: function() {
					return "2 privados";
				}
			}
		},
		{
			Title: function() {
				return "Feedly";
			},
			href: "http://www.feedly.com/home#my",
			content: {
				Front: function() {
					return "1000+";
				}
			}
		},
		{
			Title: function() {
				return "Jaén";
			},
			href: "http://accuweather.com",
			content: {
				Front: function() {
					return "11º";
				},
				Back: function() {
					return "despejado";
				}
			}
		},
		{
			Title: function() {
				return "Granada";
			},
			href: "http://accuweather.com",
			content: {
				Front: function() {
					return "9º";
				},
				Back: function() {
					return "nublado";
				}
			}
		}
	],
	Display: function() {
		var a_randomizar = [];
		
		for (var i = 0; i < widgets.icons.length; i++) {
			var icon = widgets.icons[i];
			icon.widget = document.createElement('a');
			icon.widget.id = "widget_" + i;
			
			if (icon.href) {
				icon.widget.href = icon.href;
			}
			if (i % 2 != 0) {
				icon.widget.className += 'r ';
			}
			if (icon.content.Back) {
				a_randomizar.push(i);
				icon.widget.className += 'prelive ';
				icon.widget.innerHTML += '<div class="content"></div>';
			}
			
			icon.widget.innerHTML += '<div class="content"></div><div class="title"></div>';
			
			document.querySelector('#widgets').appendChild(icon.widget);
			
			widgets.UpdateWidget(i);
			if (icon.update) {
				icon.update.interval = setInterval("widgets.UpdateWidget("+i+");", icon.update.frequency * 1000);
			}
		}
		
		widgets.ActivaLiveTiles(a_randomizar);
	},
	UpdateWidget: function(indice) {
		var icon = widgets.icons[indice];
		var my_widget = icon.widget;
		
		var inner = '<div class="content">' + icon.content.Front() + '</div>';
		
		if (icon.content.Back) {
			inner += '<div class="content">' + icon.content.Back() + '</div>';
		}
		inner += '<div class="title">' + icon.Title() + '</div>';	
		my_widget.innerHTML = inner;
	},
	ActivaLiveTiles: function(tiles) {
		var t;
		
		for (indice in tiles) {
			t = Math.floor(Math.random() * 4000);
			
			setTimeout("document.querySelector('#widget_" + tiles[indice] + "').className = document.querySelector('#widget_" + tiles[indice] + "').className.replace('prelive', 'live')", t);
		}
	}
};

var right_panel = {
	default_towers: [
		{
			title: "social",
			sections: [
				{
					/* Enlaces sin categoría */
					links: [
						{
							name: "Tuenti",
							href: "http://tuenti.com",
							favicon: "http://tuenti.com/favicon.ico"
						},
						{
							name: "Twitter",
							href: "http://twitter.com",
							favicon: "http://twitter.com/favicon.ico"
						}
					]
				},
				{
					name: "Imágenes + vídeos",
					links: [
						{
							name: "Youtube",
							href: "http://youtube.com",
							favicon: "http://youtube.com/favicon.ico"
						},
						{
							name: "Flickr",
							href: "http://flickr.com",
							favicon: "http://flickr.com/favicon.ico"
						}
					]
				}
			]
		}
	],
	Load: function() {
		if (localStorage.towersData) {
			right_panel.towers = JSON.parse(localStorage.towersData);
		} else {
			right_panel.towers = right_panel.default_towers;
		}
		
		right_panel.Display();
		window.onresize = function() {right_panel.Display()};
	},
	Display: function() {
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
			var inner = "<h1><span>" + tower.title + "</span><a title='Eliminar torre' class='edit del_tower' href='javascript:right_panel.DeleteTower(" + i + ")'>x</a><a title='Añadir sección' class='edit add_section' href='javascript:right_panel.AddSection(" + i + ")'>+</a></h1>";
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
					inner += "<h3>" + section.name + "<a title='Eliminar sección' class='edit del_section' href='javascript:right_panel.DeleteSection(" + i + ", " + j + ")'>x</a><a title='Añadir enlace' class='edit add_link' href='javascript:right_panel.AddLink(" + i + ", " + j + ")'>+</a></h3>";
					link_counter++;
				}
				
				var quantity = section.links.length;
				for (var k = 0; k < quantity; k++) {
					var link = section.links[k];
					inner += "<a class='bm' id='l" + i + "_" + j + "_" + k + "' href='" + link.href + "' style='background-image: url(" + link.favicon + ");'><span title='Eliminar enlace' class='edit del_link' onclick='event.preventDefault(); right_panel.DeleteLink(" + i + ", " + j + ", " + k + ")'>x</span>" + link.name + "</a>";
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
		document.querySelector('#right').innerHTML += '<div class="tower"><a title="Añadir torre" class="edit add_tower" href="javascript:right_panel.AddTower()">+</a></div>';
	},
	AddTower: function() {
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
	},
	AddSection: function(tower) {
		var new_section = {
			name: "",
			links: [
				
			]
		};
		
		new_section.name = io.Ask("Nombre", "Nueva sección");
		
		right_panel.towers[tower].sections.push(new_section);
		right_panel.Save();
	},
	AddLink: function(tower, section) {
		var new_link = {
			name: "Nombre",
			href: "http://www.example.com",
			favicon: "http://www.example.com/favicon.ico"
		};
		
		new_link.name = io.Ask('Nombre', new_link.name);
		new_link.href = io.Ask('Dirección', "http://" + new_link.name + ".com");
		var guess = new_link.href.split('://')[0] + "://" + new_link.href.split('://')[1].split('/')[0] + "/favicon.ico";
		new_link.favicon = io.Ask('Icono (favicon)', guess);
		
		right_panel.towers[tower].sections[section].links.push(new_link);
		right_panel.Save();
	},
	DeleteTower: function(tower) {
		if (io.Confirm("¿Seguro que deseas borrar esta torre? Todos los enlaces que contiene se perderán")) {
			right_panel.towers.splice(tower, 1);
		}
		right_panel.Save();
	},
	DeleteSection: function(tower, section) {
		if (io.Confirm("¿Seguro que deseas borrar esta sección? Todos los enlaces que contiene se perderán")) {
			right_panel.towers[tower].sections.splice(section, 1);
		}
		right_panel.Save();
	},
	DeleteLink: function(tower, section, link) {
		right_panel.towers[tower].sections[section].links.splice(link, 1);
		right_panel.Save();
	},
	Save: function() {
		localStorage.towersData = JSON.stringify(right_panel.towers);
		right_panel.Display();
	}
};

var io = {
	windows: {
		themes: {
			id: "window_theme",
			width: 400,
			height: 300,
			title: "Temas",
			content: 'Elige uno de los temas disponibles.<p><span id="choose_theme"><input type="radio" name="theme" value="theme/metro_dark.css" id="metro_dark" /><label for="metro_dark">Metro Dark</label><br /><input type="radio" name="theme" value="theme/metro_light.css" id="metro_light" /><label for="metro_light">Metro Light</label><br /></span><p>',
			buttons: [
				["Listo", "config.SetTheme(); io.CloseWindow('#window_theme')"],
				["Cancelar", "io.CloseWindow('#window_theme')"]
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
		elem.className = "window visible";
		
		var innh = "<div style='width: " + win.width + "px; height: " + win.height + "px;'><header>" + win.title + "</header>";
		innh += win.content;
		innh += "<div class='buttons'><a href=\"javascript:" + win.buttons[0][1] + "\" class='accept'>" + win.buttons[0][0];
		if (win.buttons[1]) {
			innh += "</a><a href=\"javascript:" + win.buttons[1][1] + "\" class='cancel'>" + win.buttons[1][0];
		}
		innh += "</a></div></div>";
		elem.innerHTML = innh;
		
		if (document.querySelector(".window.visible")) {
			document.querySelector(".window.visible").className = "window";
		}
		
		document.querySelector("#window_space").appendChild(elem);
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
	ToggleEditMode: function() {
		var current = document.querySelector("body").className;
		if (current == config.modes.user) {
			config.ChangeMode(config.modes.edit);
		} else {
			config.ChangeMode(config.modes.user);
		}
	},
	LoadTheme: function() {
		document.querySelector("#theme").href = localStorage.usertheme ?
			localStorage.usertheme : "theme/metro_dark.css";
	},
	SetTheme: function() {
		var new_theme = document.querySelector('#choose_theme input:checked').value;
		localStorage.usertheme = new_theme;
		document.querySelector("#theme").href = new_theme;
	},
	Load: function() {
		config.LoadTheme();
		config.ChangeMode(config.modes.user);
	}
};

window.onload = function() {
	search.Load();
	widgets.Display();
	right_panel.Load();
	config.Load();
};