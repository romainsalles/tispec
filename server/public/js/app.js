var tispec = {

    views: {},

    models: {},

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (tispec[view]) {
                deferreds.push($.get('tpl/' + view, function(data) {
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
        "":                 "testSuite",
        "contact":          "contact",
        "employees/:id":    "employeeDetails"
    },

    initialize: function () {
        /*tispec.testSuiteView = new tispec.TestSuiteView({model: new tispec.TestSuite()});
        $('#specs_suites').html(tispec.testSuiteView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });*/
        this.$content = $("#specs_suites");
    },

    testSuite: function () {
        /*
        var testSuite = new tispec.TestSuite({idAttribute: 'id', appName: 'Tispec', appVersion: '1.0', deviceName: 'Romain\'s Simulator', deviceModel: 'Simulator'});
        var suite = new tispec.Suite({idAttribute:'suiteId1', description:'#isValid function with a very long name to test table tr', totalCount:1, passedCount:0});
        var suite2 = new tispec.Suite({idAttribute:'suiteId2', description:'#isValid function with a very long name to test table tr', totalCount:1, passedCount:0});
        var spec = new tispec.Spec({idAttribute:'specId', suiteName:'#isValid function', description:'it should return true if valid'});
        var subSpec1 = new tispec.SubSpec({expected:1, actual:2, passed:false});
        var subSpec2 = new tispec.SubSpec({expected:true, actual:true, passed:true});
        var subSpec3 = new tispec.SubSpec({expected:'yo', actual:'yo', passed:true});

        spec.subSpecs.add(subSpec1);
        spec.subSpecs.add(subSpec2);
        spec.subSpecs.add(subSpec3);
        suite.specs.add(spec);
        suite2.specs.add(spec);
        testSuite.suites.add(suite);
        testSuite.suites.add(suite2);

        // Since the home view never changes, we instantiate it and render it only once
        if (!tispec.testSuiteView) {
            tispec.testSuiteView = new tispec.TestSuiteView({model: testSuite});
            tispec.testSuiteView.render();
        } else {
            console.log('reusing testSuite view');
            tispec.testSuiteView.delegateEvents(); // delegate events when the view is recycled
        }
        console.log('render ?');
        this.$content.html(tispec.testSuiteView.el);
        console.log('yes !');
        //tispec.shellView.selectMenuItem('home-menu');
        */
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
    tispec.loadTemplates(['TestSuiteView', 'SuiteItemView', 'SpecItemView', 'SubSpecItemView'],
        function () {
            tispec.router = new tispec.Router();
            Backbone.history.start();
        });
});
