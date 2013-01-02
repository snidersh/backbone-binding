/*
 * Backbone.js Binding v0.1
 * https://github.com/snidersh/backbone-binding
 * Copyright 2013 Shannon A. Snider.
 * MIT License.
 */

!function($, window, undefined) {

  // jQuery custom binding selector.
  $.expr[':'].binding = function(elem, i, match, array) {
    return ($(elem).prop('binding') == match[3]);
  };

  // Handlebars helper to translate binding expressions.
  if (typeof Handlebars != 'undefined') {
    Handlebars.registerHelper('bind', function(data) {
      var binding = _.pairs(data.hash)[0];
      return new Handlebars.SafeString('data-bind-attr="' + binding[1] + '" data-bind-target="' + binding[0] + '"');
    });
  }

  _.extend(Backbone.View.prototype, {

    // Bind and unbind all attributes.
    bindAttributes : function() {
      var _this = this;
      this._bindings = [];
      for (var attr in this.model.attributes) {
        $.each(this.$('[data-bind-attr="' + attr + '"]'), function() {
          _this.bindAttribute($(this), $(this).data('bind-target'), attr);
          $(this).removeAttr('data-bind-attr data-bind-target');
        });
      }
    },
    unbindAttributes : function() {
      for (var attr in this.model.attributes) {
        var binding = this._bindings[attr];
        if (typeof binding != 'undefined') {
          this.unbindAttribute(binding);
        }
      }
    },

    // Bind and unbind single attribute.
    bindAttribute : function(el, target, attr) {
      var binding = {
        index: this._bindings.length,
        attr: attr,
        target: target,
        value: this.model.get(attr),
        previous: undefined
      }
      this._bindings.push(binding);
      el.prop('binding', binding.index);
      this.listenTo(this.model, 'change:' + binding.attr, function() { this._updateBoundView(binding.index) });
      if (_.contains(['input', 'textarea', 'select'], el.prop('tagName').toLowerCase())) {
        el.on('change', $.proxy(this._updateBoundModel, this));
      }
      this._setBoundViewValue(el, binding);
      return binding;
    },
    unbindAttribute : function(binding) {
      this.stopListening(this.model, 'change:' + binding.attr);
      this.$(':binding(' + binding.index + ')').off('change');
      this._bindings.remove(binding);
    },

    // Handles updating view.
    _updateBoundView : function(index) {
      var binding = this._bindings[index];
      if (typeof binding != 'undefined') {
        var val = this._getBoundViewValue(binding);
        if (binding.value != val) {
          binding.previous = binding.value;
          binding.value = val;
        }
        var el = this.$(':binding(' + binding.index + ')');
        this._setBoundViewValue(el, binding);
      }
    },
    _getBoundViewValue : function(binding) {
      return this.model.get(binding.attr);
    },
    _setBoundViewValue : function(el, binding) {
      switch (binding.target) {
        case 'html':
          el.html(binding.value);
          break;
        case 'text':
          el.text(binding.value);
          break;
        case 'val':
          el.val(binding.value);
          break;
        case 'class':
          if (binding.previous) { el.removeClass(binding.previous) }
          el.addClass(binding.value);
          break;
        case 'checked':
          el.prop('checked', binding.value);
          break;
        default:
          el.attr(binding.target, binding.value);
      }
    },

    // Handles updating model.
    _updateBoundModel : function(e) {
      var el = $(e.target);
      var index = el.prop('binding');
      var binding = this._bindings[index];
      if (typeof binding != 'undefined') {
        var val = this._getBoundModelValue(el, binding);
        if (binding.value != val) {
          binding.previous = binding.value;
          binding.value = val;
          this._setBoundModelValue(binding);
        }
      }
    },
    _getBoundModelValue : function(el, binding) {
      switch (binding.target) {
        case 'val':
          return el.val();
        case 'text':
          return el.text();
        case 'checked':
          return el.prop('checked');
        default:
          return null;
      }
    },
    _setBoundModelValue : function(binding) {
      this.model.set(binding.attr, binding.value);
    }
  });

}(jQuery, this);
