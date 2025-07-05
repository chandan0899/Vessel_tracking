from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/', include('accounts.urls')),
    path('ports/', views.ports, name='ports'),
    path('lighthouse/', views.lighthouse, name='lighthouse'),
    path('vessels_list/', views.vessels_list, name='vessels_list'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('home/', views.home, name='home'),
    path('book/', views.book_container, name='book_container'),
    path('bookings/cancel/<int:id>/', views.cancel_booking, name='cancel_booking'),
]

urlpatterns = urlpatterns + static(settings.STATIC_URL, document_root=settings.MEDIA_ROOT)

