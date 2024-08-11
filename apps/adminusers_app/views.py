#import django
from django.views.generic import CreateView, ListView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy


#import local
from .forms import UserCreateForm,UserUpdateForm
from .models import User
from .mixing_admin import MixingAdmin
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

class UserCreateView(LoginRequiredMixin,CreateView):
    """Clase para crear usuarios"""
    form_class = UserCreateForm
    template_name = "users/create_user.html"
    success_url = reverse_lazy('admin_app:list_user')
    login_url = reverse_lazy('user_app:login')

    
class UserListView(LoginRequiredMixin,MixingAdmin,ListView):
    model = User
    template_name = "users/list_user.html"
    context_object_name = 'users'
    paginate_by = 7
    login_url = reverse_lazy('user_app:login')

    def get_queryset(self):
        palabra_clave = self.request.GET.get('usuario','')
        return User.objects.listar_usuario(palabra_clave)


class UserUpdateView(LoginRequiredMixin,MixingAdmin,UpdateView):
    model = User
    form_class = UserUpdateForm
    context_object_name = 'user'
    template_name = "users/update_user.html"
    success_url = reverse_lazy('admin_app:list_user')
    login_url = reverse_lazy('user_app:login')

class UserDeleteView(LoginRequiredMixin,DeleteView):
    model = User
    success_url = reverse_lazy('admin_app:list_user')
    login_url = reverse_lazy('user_app:login')