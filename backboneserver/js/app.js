var tispec = {

    views: {},

    models: {},

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (tispec[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    tispec[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

tispec.Router = Backbone.Router.extend({

    routes: {
        "":                 "home",
        "contact":          "contact",
        "employees/:id":    "employeeDetails"
    },

    initialize: function () {
        tispec.shellView = new tispec.ShellView();
        $('body').html(tispec.shellView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
        this.$content = $("#content");
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!tispec.homelView) {
            tispec.homelView = new tispec.HomeView();
            tispec.homelView.render();
        } else {
            console.log('reusing home view');
            tispec.homelView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(tispec.homelView.el);
        tispec.shellView.selectMenuItem('home-menu');
    },

    contact: function () {
        if (!tispec.contactView) {
            tispec.contactView = new tispec.ContactView();
            tispec.contactView.render();
        }
        this.$content.html(tispec.contactView.el);
        tispec.shellView.selectMenuItem('contact-menu');
    },

    employeeDetails: function (id) {
        var employee = new tispec.Employee({id: id});
        var self = this;
        employee.fetch({
            success: function (data) {
                console.log(data);
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                self.$content.html(new tispec.EmployeeView({model: data}).render().el);
            }
        });
        tispec.shellView.selectMenuItem();
    }

});

$(document).on("ready", function () {
    tispec.loadTemplates(["HomeView", "ContactView", "ShellView", "EmployeeView", "EmployeeSummaryView", "EmployeeListItemView"],
        function () {
            tispec.router = new tispec.Router();
            Backbone.history.start();
        });
});
