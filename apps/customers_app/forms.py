#import django
from django import forms

#import local
from .models import Customer

class Validator_label(forms.ModelForm):
    def __init__(self, *args, **kwargs,):
        super().__init__(*args, **kwargs,)
        for field in self.fields:
            self.fields[field].label = field
            self.fields[field].widget.attrs.update({
                'class': 'form-control',
                'id':'floatingInput',
                'placeholder':self.fields[field].label,})
        self.fields['id'].label = 'Identificación'
        self.fields['name'].label = 'Nombre'
        self.fields['last_name'].label = 'Apellido'
        self.fields['email'].label = 'Correo'
        self.fields['adress'].label = 'Dirección'
        self.fields['number'].label = 'Número telefónico'

        
    def is_valid(self):
        result = super().is_valid()
        if not result:
            for field, errors in self.errors.items():
                if field in self.fields:
                    attrs = self.fields[field].widget.attrs
                    attrs.update({'class': attrs.get('class', '') + ' is-invalid '})
        return result


class BaseFormCustomer(Validator_label):
    """Formulario para agregar nuevos usuarios"""
    class Meta:
        model = Customer
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    

