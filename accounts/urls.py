from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('', views.live_map, name='live_map'), 
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
]