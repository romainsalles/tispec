tispec.TestSuiteView = Backbone.View.extend({

    tagName:'div',

    className:'span12 specs_container',

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.suites.on("add", function (suite) {
            self.$el.append(new tispec.SuiteItemView({model:suite}).render().el);
        });
    },

    render:function () {
        this.$el.empty();
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        this.$el.html(this.template(data));
        this.model.suites.each(function (suite) {
            $('#testSuiteTBody', this.el).append(new tispec.SuiteItemView({model:suite}).render().el);
        }, this);
        return this;
    }
});

tispec.SuiteItemView = Backbone.View.extend({

    tagName:"div",

    className:'span12 specs_container',

    initialize: function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
        this.model.specs.on("add", this.render, this);
    },

    render: function () {
        // The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
        // layers, you can directly pass model.attributes to the template function
        this.$el.empty();
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        this.$el.html(this.template(data));
        this.model.specs.each(function (spec) {
            $('.specs', this.el).append(new tispec.SpecItemView({model:spec}).render().el);
        }, this);

        return this;
    }

});

tispec.SpecItemView = Backbone.View.extend({

    tagName:"div",

    className:'span12 specs_container',

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
        this.model.subSpecs.on("add", this.render, this);
    },

    render:function () {
        // The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
        // layers, you can directly pass model.attributes to the template function
        this.$el.empty();
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        data.state = (data.errorType === tispec.Spec.SUCCESS) ? 'success' : 'important';
        //this.$el.append('<td>' + this.model.description + '</td>');
        this.$el.html(this.template(data));
        this.model.subSpecs.each(function (subSpec) {
            $('.subspecs', this.el).append(new tispec.SubSpecItemView({model:subSpec}).render().el);
        }, this);
        return this;
    }

});

tispec.SubSpecItemView = Backbone.View.extend({

    tagName:"div",

    className:'span12 subspecs_container',

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        // The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
        // layers, you can directly pass model.attributes to the template function
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        this.$el.html(this.template(data));
        return this;
    }

});
