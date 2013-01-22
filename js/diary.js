var app = {
    init: function(){
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function(){
        app.doPages();
    },
    doPages: function(){
        navbar.init();
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
                    calendar.active(); break;
                case '#contacts': 
                    contacts.init(); break;
                case '#settings':
                    settings.init(); break;
            }
            navbar.hideTabs();
            $(tab).show();
        });
        $("ul#nav-tabs a[href=#home]").click();
    },
    hideTabs: function(){
        $('div.page').hide();
    }
}

Handlebars.registerHelper('shortName', function(month){
    return month.substr(0,3).toUpperCase();
})

var calendar = {
    created:    false,
    months:     ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days:       ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    views:      {},
    templates:  {},
    current:    new Date(),
    
    init:       function(){
        this.page = $("#home");
        var cal = this;
        
        //init top nav
//        this.nav = this.page.find('.btn-group.nav');
//        this.nav.find('button').click(function(e){
//            e.preventDefault();
//            var a = $(e.currentTarget);
//            var tab = a.attr('name');
//            switch (tab){
//                case 'calendar': 
//                    this.calendar();
//                case 'upcoming':
//                    this.upcoming();
//            }
//            this.page.find('.subpage').hide();
//            this.page.find('.' + tab).show();
//        });
        
        //init year view
        this.views.year = this.page.find('.subpage.year');
        this.templates.year = Handlebars.compile(this.page.find('#calendar-year').html());
        var source = this.templates.year(this);
        this.views.year.prepend(source);
        this.views.year.delegate('.month', 'click', function(){
            cal.current.setMonth($(this).index(), 1);
            cal.updateMonthView();
        });
        this.updateYearView();
        
        //init year paging
        this.pager = this.views.year.find('.pagination ul');
        var year = this.current.getFullYear();
        for (var y = 0; y < 3; y++){
            var button = $("<li>").append($("<a>").prop('href', '#').click(function(e){
                var now = new Date().getFullYear();
                cal.pager.find('.active').removeClass('active');
                $(this).parent().addClass('active');
                cal.current.setFullYear($(this).text());
                cal.updateYearView();
            }).text(year));
            if (y == 0) button.addClass('active');
            
            this.pager.append(button);
            year++;
        }
        
        
        //init month view
        this.views.month = this.page.find('.subpage.month');
        for (var d=0; d < this.days.length; d++){
            this.views.month.append($("<div>").addClass("day header").text(this.days[d]));
        }
        this.views.month.find('.pagination .prev').click(function(){
           cal.current.setMonth(cal.current.getMonth()-1);
           cal.updateMonthView();
        });
        this.views.month.find('.pagination .next').click(function(){
           cal.current.setMonth(cal.current.getMonth()+1);
           cal.updateMonthView();
        });
        
        this.created = true;
    },
    active:     function(){
        if (!this.created) this.init();
        
        $("ul#nav-tabs button").click(function(e){
            navbar.hideTabs();
            appointment.init();
            $('#appointment').show();
        });
        $('.title').text('Calendar');
        $('#sync').click(function(e){
            $.ajax({
                url: 'http://tsaunders.net/diarysync/appointments/sync.json',
                dataType: 'json',
                success: home.syncOK
            });
        });
        this.page.find('.subpage').hide();
        this.page.find('.subpage.year').show();
    },
    updateYearView: function(){
        this.views.year.find('.alert').removeClass('alert');
        var now = new Date();
        if (this.current.getFullYear() == now.getFullYear()){
            var thisMonth = this.months[now.getMonth()];
            this.views.year.find("."+thisMonth).addClass("alert");
        }
    },
    updateMonthView: function(){
        this.views.month.find('.name a').text(
            this.months[this.current.getMonth()] + ", " + this.current.getFullYear()
        );
        this.views.month.remove('.date');
        this.views.month.find('.day.date').remove();
        console.log(this.views.month.html());
        this.current.setMonth(this.current.getMonth()+1, 0);
        var daysInMonth = this.current.getDate();
        this.current.setDate(1);    //reset back to the first
        var firstIndex = this.current.getDay();
        for (var f=0; f < firstIndex; f++){
            this.views.month.append($("<div>").addClass("day date").html("&nbsp;"));
        }
        for (var d=1; d <= daysInMonth; d++){
            this.views.month.append($("<div>").addClass("day date").text(d));
        }
        
        this.page.find('.subpage').hide();
        this.views.month.show();
    },
    calendar:   function(){
        this.views.year.show();
    },
    upcoming:   function(){
        this.views.upcoming.show();
    },
    syncOK: function(data, status, xhr){
        var tbody = $("#home tbody");
        tbody.empty();
        for (var i=0; i<data.appointments.length;i++){
            var appt = data.appointments[i];
            var rowData = [appt.Appointment.time, appt.Contact.name];
            tableController.addRow(tbody, rowData);
        }
    }
}
var contacts = {
    init: function(){
        $("ul#nav-tabs button").click(function(e){
            navbar.hideTabs();
            contact.init();
            $('#contact').show();
        });
        $('.title').text('Contacts');
    }
}
var appointment = {
    init: function(){
        $('.title').text('Add');
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
        $('.title').text('Settings');
    }
}

var tableController = {
    addRow: function(tbody, data){
        var row = $("<tr />");
        for (var i = 0; i < data.length; i++){
            row.append($("<td />").text(data[i]));
        }
        tbody.append(row);
    }
}