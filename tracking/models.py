from django.db import models
from django.contrib.auth.models import User

class Vessel(models.Model):
    name = models.CharField(max_length=100)
    current_location = models.CharField(max_length=100, default="Unknown")  # <- Add default here
    speed = models.FloatField(default=0.0)                                   # <- Optional default
    eta = models.DateTimeField(null=True, blank=True) 

    def __str__(self):
        return self.name

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE)
    source_port = models.CharField(max_length=100)
    destination_port = models.CharField(max_length=100)
    container_type = models.CharField(max_length=50)
    number_of_containers = models.IntegerField()
    cost = models.FloatField()
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Booked")  # Booked, Shipped, Delivered

    def __str__(self):
        return f"{self.vessel.name} - {self.status}"


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username}: {self.message[:30]}..."
