from django import forms
from models import Relation


class RelationForm(forms.models.ModelForm):
    class Meta:
        model = Relation

    def template(self):
        return 'graph/relation_form_template.html'

    def get_fields(self):
        _priority_fields = ('source','title','target',)
        def sort_fields(x,y):
            if (x in _priority_fields) == (y in _priority_fields):
                if x in _priority_fields:
                    return _priority_fields.index(y) - _priority_fields.index(x)
                return 0
            if x in _priority_fields:
                return -1
            return 1

        fields = self._fields
        fields.keyOrder.sort(cmp=sort_fields)
        return fields
    def set_fields(self, value):
        self._fields = value
    def del_fields(self):
        del self._fields

    fields = property(get_fields, set_fields, del_fields)
    _fields = None
