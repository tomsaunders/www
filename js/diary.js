var app = {
	init: function(){
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function(){
		app.doPages();
	},
	doPages: function(){
		navbar.init($('div.navbar'));
	}
}
var navbar = {
	init: function(){
		$("ul#nav-tabs a").click(function(e){
			e.preventDefault();
			var a = $(e.currentTarget);
			var tab = a.attr('href');
			switch (tab){
				case '#home': 
					home.init(); break;
				case '#contacts': 
					contacts.init(); break;
				case '#settings':
					settings.init(); break;
			}
			navbar.hideTabs();
			$(tab).show();
		});
		$("ul#nav-tabs a[href=#contacts]").click();
	},
	hideTabs: function(){
		$('div.pages > div').hide();
	}
}
var home = {
	init: function(){
		$("ul#nav-tabs button").click(function(e){
			navbar.hideTabs();
			appointment.init();
			$('#appointment').show();
		});
		$('.brand').text('Calendar');
	}
}
var contacts = {
	init: function(){
		$("ul#nav-tabs button").click(function(e){
			navbar.hideTabs();
			contact.init();
			$('#contact').show();
		});
		$('.brand').text('Contacts');
	}
}
var appointment = {
	init: function(){
		
	}
}
var contact = {
	init: function(){
		$("#add-contact .import").click(function(e){
			navbar.hideTabs();
			contactImport.init();
			$('#contact-import').show();
		});
		$("#add-contact .add").click(function(e){
			
		});
	}
}
var settings = {
	init: function(){
		$('.brand').text('Settings');
	}
}
var contactImport = {
	init: function(){
		options = new ContactFindOptions();
		options.filter = "";
		options.multiple = true;
		var fields = ["*"];
		navigator.contacts.find(fields, contactImport.success, errorHandler, options);
	},
	success: function(contacts){
		var table = $("#contact-import table tbody");
		for (var k in contacts){
			var contact = contacts[k];
			console.log(contact);
			var name = contact.displayName.split(" ");
			var row = $("<tr />")
				.append($("<td />").text(name[0]))
				.append($("<td />").append(name[1], $("<div />").addClass('detail').hide().text(contact.emails ? contact.emails[0].value : '')))
				.click(function(e){
					$(".detail", e.currentTarget).show();
				});
			table.append(row);
			console.log(contact);
		}
	}
	
}
var errorHandler = function(error){
	console.log("An error occurred somewhere", error);
}