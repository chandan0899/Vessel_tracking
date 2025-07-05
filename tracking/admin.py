from django.contrib import admin
from .models import Vessel, Booking, Notification

admin.site.register(Vessel)
admin.site.register(Booking)


class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'timestamp']
    list_filter = ['user']
    search_fields = ['message']
    fields = ['user', 'message']  # Show 'user' field in form

admin.site.register(Notification, NotificationAdmin)