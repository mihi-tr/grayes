Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
var data = [];

function update_in_references(container) {
    var newel = {}
    $(container).find('input').each(function() {
        newel[$(this).attr('rel')] = this.value;
        });
    var id = container.data('element');
    if(id == 'new') {
        container.data('element', data.references.length);
        container.removeClass('new');
        data.references.push(newel);
        $('[name=data]').parent().append(build_reference_form({}, 'new'));
    } else {
        data.references[id]=newel;
    }
    var data_el = $('[name="data"]').val(JSON.stringify(data));
}

function data_onblur(event) {
    var el = this;
    var container = $(el).parents('.reference');
    var id = $(container).data('element');
    var allfull = true;
    $(container).find('input').each(function() {
        if(!this.value) {
            allfull = false;
        }
    });
    if(allfull) {
        update_in_references(container);
    }
}

function data_ondelete(event) {
    event.preventDefault();
    var el = this;
    var container = $(el).parents('.reference');
    var id = $(container).data('element');
    $(container).siblings().each(function() {
        var cur_id = $(this).data('element');
        if(cur_id>id) {
            $(this).data('element', cur_id-1);
            console.log(cur_id);
        }
    });
    $(container).remove();
    data.references.remove(id,id);
    var data_el = $('[name="data"]').val(JSON.stringify(data));
}

function build_labeled_input(name, data) {
    var container = document.createElement('div');
    var input = document.createElement('input');
    $(input).attr('rel', name);
    if(data[name]) {
        input.value = data[name];
    }
    var label = document.createElement('label');
    label.innerHTML = name;
    container.appendChild(label);
    container.appendChild(input);
    $(container).css('width', '12em');
    $(container).css('float', 'left');
    return [container, label, input];
}

function build_reference_form(data, id) {
    var container = document.createElement('div');
    var date_field = build_labeled_input('date', data);
    var link_field = build_labeled_input('link', data);
    var title_field = build_labeled_input('title', data);
    var medium_field = build_labeled_input('medium', data);
    var delete_field = document.createElement('button');
    $(delete_field).addClass('delete');
    delete_field.innerHTML = 'delete';
    container.appendChild(date_field[0]);
    container.appendChild(link_field[0]);
    container.appendChild(title_field[0]);
    container.appendChild(medium_field[0]);
    container.appendChild(delete_field);
    $(container).addClass('reference');
    if(id=='new')
        $(container).addClass('new');
    $(container).css('clear', 'left');
    $(container).data('element', id);
    cntnr = container;
    return container;
}

function build_references() {
    var data_el = $('[name="data"]');
    data_el.hide();
    var v = $(data_el).val();
    try {
        data = JSON.parse(v);
    } catch(e) {
        data = {};
    }
    if(!data) {
        data = {};
    }
    if(!data.references) {
        data.references = [];
    }
    var reference_container=data_el.parent().find('.references');
    if(reference_container.length==0) {
        var reference_container = document.createElement('div');
        $(reference_container).append('<h3>References</h3><p style="margin:0;"><span class="help">Will be created automagically when all fields are filled out</span></p>');
        $(reference_container).css('margin-left', '10em');
        data_el.parent().append(reference_container);
    }
    $.each(data.references, function(i,e) {
        $(reference_container).append(build_reference_form(this, i));
    });
    $(reference_container).append(build_reference_form({}, 'new'));
    $('.form-row.data input').live('blur', data_onblur);
    $('.form-row.data .delete').live('click', data_ondelete);
};
$(document).ready(function() {
    build_references();
    $("select").chosen()
});

