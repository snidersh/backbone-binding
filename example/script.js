!function($, window, undefined) {

  window.Message = Backbone.Model.extend({
    defaults : {
      type: 'Notification',
      body: 'Cead Mile Failte!',
      url: 'javascript: void 0',
      priority: 'low',
      flagged: false,
      flag: ''
    },
    initialize : function() {
      this.set('created', new Date().toString());
      this.on('change:flagged', this.setFlag, this);
    },
    setFlag : function() {
      this.set('flag', this.get('flagged') ? 'flag!' : '');
    }
  });

  window.MessageCollection = Backbone.Collection.extend({
    model : window.Message
  });

  window.MessageCollectionView = Backbone.View.extend({
    el : '#messages',
    events : {
      'click .create-one' : 'create',
      'click .destroy-all' : 'destroy'
    },
    initialize : function() {
      this.collection = new window.MessageCollection()
      this.listenTo(this.collection, 'add', this.add);
      this.list = this.$('ul');
    },
    create : function() {
      this.collection.add(new window.Message());
    },
    destroy : function() {
      this.collection.each(function(model) { model.trigger('destroy') });
    },
    add : function(model) {
      this.list.append(new window.MessageView({ model: model }).render().el);
    }
  });

  window.MessageView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click .reset' : 'reset',
      'click .destroy' : 'destroy'
    },
    initialize : function() {
      this.listenTo(this.model, 'destroy', this.close);
      this.template = Handlebars.compile($('#message-template').html());
    },
    render : function() {
      this.$el.addClass('message').html(this.template(this.model.toJSON()));
      this.bindAttributes();
      var binding = this.bindAttribute(this.$('.created'), 'html', 'created');
      return this;
    },
    close : function() {
      this.unbindAttributes();
      this.remove();
    },
    reset : function() {
      this.model.set(this.model.defaults);
    },
    destroy : function() {
      this.model.destroy();
    }
  });

  $(function() {
    new window.MessageCollectionView();
  });

}(jQuery, this);