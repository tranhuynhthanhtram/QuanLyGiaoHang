from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.utils.safestring import mark_safe

from . import cloud_path
from .models import User, Post, Order
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget


class UserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'user_type']


class UserAdmin(UserAdmin):
    model = User
    search_fields = ('username', 'first_name', 'last_name')
    list_display = ('pk', 'username', 'auth_provider', 'user_type')
    list_display_links = ('username',)
    list_filter = ('is_staff', 'is_superuser', 'user_type')
    readonly_fields = ('last_login', 'date_joined', 'avatar_view')

    def avatar_view(self, user):
        if (user.avatar):
            return mark_safe(
                "<img src='{cloud_path}{url}' alt='avatar' width='120' />".format(cloud_path=cloud_path, url=user.avatar)
            )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('avatar', 'username', 'password1', 'password2', 'email', 'user_type')}
         ),
    )
    form = UserChangeForm
    add_form = UserCreationForm

    fieldsets = (
        ('Login info', {
            'fields': ('avatar_view','avatar','username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name' ,'email')
        }),
        ('Customer', {
            'fields': (
                'user_type',
            ),
            'description': '<div class="help">%s</div>' % "Designates whether this user is a customer or not",
        }),
        ('Permissions', {
            'fields': (
                'is_staff', 'is_superuser',
                'groups', 'user_permissions'
                )
        }),
        ('Other info', {
            'fields': ('is_active', 'last_login', 'date_joined')
        })
    )


class PostForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Post
        fields = '__all__'


class PostAdmin(admin.ModelAdmin):
    form = PostForm
    list_display = ['id', 'title', 'description', 'created_date', 'updated_date', 'active']


class OrderAdmin(admin.ModelAdmin):
    model = Order
    list_display = ['posts_id', 'created_at', 'customers', 'shippers', 'active']
    search_fields = ['posts__id','customers__username', 'shippers__username']
    list_filter = ('customers', 'shippers', 'posts_id')


admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Order, OrderAdmin)