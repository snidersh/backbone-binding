## Backbone Binding

This is a plugin for `Backbone.js` to support automatic binding between model attributes and attributes on html view elements. Both one-way binding, from the model to the view, and two-way binding, from the view to model, is supported.  Straightforward, no bells or whistles, just works.

---

**Requirements**  
jQuery [http://jquery.com](http://jquery.com)  
Underscore.js [http://underscorejs.org](http://underscorejs.org)  
Backbone.js [http://backbonejs.org](http://backbonejs.org)  
Handlebars.js [http://handlebarsjs.com](http://handlebarsjs.com)

**Assumptions**  
Your `Backbone.js` view data is referenced by `this.model`.

---

### Automatic Binding with Templates
Add a bind expression to html elements in your templates to enable binding an html attribute to a model attribute.

    <... {{bind [html attribute]='[model attribute]'}} ..>

When compiled, the `bind` helper will write the following data attributes onto the element which will allow it to be recognized by the binding plugin.*

    <... data-bind-target='[html attribute]' data-bind-attr='[model attribute]' ...>

After you have rendered your template, calling `bindAttributes` in your view's `render` function will automatically create one and two-way bindings, as well as removing the data attributes from the html element.

```
render : function() {
  [render template]
  this.bindAttributes();
}
```

Call `unbindAttributes` to clean up the binding event handlers before removing the view, which will clear all bindings, whether they were created automatically or manually.

```
close : function() {
  this.unbindAttributes();
  [remove view]
}
```

*Note: If you are using a different template engine, or not using a template engine, just write the data attributes to your html or bind the elements manually as described below.*

---

### Manual Bindings

For more control, if you want to define bindings dynamically, call `bindAttribute` from your view, which will return a reference to a `binding` object.

    var binding = this.bindAttribute(this.$('selector'), '[html attribute]', '[model attribute]');

And then call `unbindAttribute` to remove the binding.*

    this.unbindAttribute(binding);

*Note: Manual bindings are also removed when calling `unbindAttributes`.*

---

### Two-way Binding

Two-way binding, writing changes in attributes on elements in the view back to the model, is automatically enabled for bindings on form style elements such as `input`, `textarea`, and `select`.

---

### Examples

Some examples given the following sample model data.  A working page with examples can also be found on the [github](https:github.com/snidersh/backbone-binding) respository for the plugin.

```
this.model.attributes = {
  type: 'Notification',
  body: 'Cead Mile Failte!',
  url: 'http://message.server',
  priority: 'low',
  flagged: false,
  flag: '',
  created: new Date().toString()
}
```

**Content Binding**  
Binding the `type` model attribute to the `html` content of an `span` element.

    <span {{bind html='type'}}></span>

**Attribute Binding**  
Binding the `url` model attribute to the `href` attribute of an `a` element and additionally nesting a bind on the `message` model attribute to the `html` content of a `span` element.

    <a {{bind href='url'}}><span {{bind html='message'}}></span></a>

**Input Binding**  
Binding the `body` model attribute to the `val` property of an `input` element.  Since this is one of the two-way binding types, two-way binding will be automatically enabled.

    <input {{bind val='body'}} />

**Checkbox Binding**  
Binding the `flagged` model attribute to the `checked` property of an `input` element.  Since this is one of the two-way binding types, two-way binding will automatically be enabled.

    <input type="checkbox" {{bind checked='flagged'}} />

**Class Binding**  
Binding the `priority` model attribute to the `class` attribute of a `div` element.  In this example, as `priority` value changes, the original `notification` class will not be altered.

    <div class="notification" {{bind class='priority'}}></div>

**Select Binding**  
Binding the `priority` model attribute to the `val` attribute of a `select` element.  Since this is one of the two-way binding types, two-way binding will be automatically enabled.  In this example, selecting a value would be reflected in the `class` binding above.

```
<select {{bind val='priority'}}>
  <option val='low'>low</option>
  <option val='high'>high</option>
</select>
```

**Manual Binding**  
Manually binding the `created` model attribute to the `html` content of an element of class `.created` and then unbinding it.

    var binding = this.bindAttribute(this.$('.created'), 'html', 'created');
    this.unbindAttribute(binding);

---

### License

Copyright (c) 2013 Shannon A. Snider

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.