from django.urls import path, include
from . import views
from rest_framework import routers

r = routers.DefaultRouter()
r.register('users', views.UserViewSet)
r.register('posts', views.PostViewSet)
r.register('order', views.OrderViewSet)

urlpatterns = [
    path('', include(r.urls)),
    # path('send_mail/', views.SendMailAPIView.as_view(), name='send_mail'),
    path('oauth2_info/', views.AuthInfo.as_view(), name='oauth2-info'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('upload_image/', views.upload_image, name='upload_image'),
    path('social_auth/google/', views.GoogleSocialAuthView.as_view(), name="google_auth"),
    path('social_auth/facebook/', views.FacebookSocialAuthView.as_view(), name="facebook_auth"),
]