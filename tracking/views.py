from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import Booking, Vessel  # You will create these models
from django.contrib.auth.decorators import login_required
from .models import Vessel, Booking, Notification
from django.utils import timezone
from django.db.models.functions import TruncMonth
from django.db.models import Count
import json

# Create your views here.

def index(request):
    return render(request, 'index.html')

def register(request):
    return render(request, 'register.html')

def login(request):
    return render(request, 'login.html')

def ports(request):
    return render(request, 'ports.html')

def lighthouse(request):
    return render(request, 'lighthouse.html')

def vessels_list(request):
    return render(request, 'vessels_list.html')

def home(request):
    return render(request, 'home.html')

@login_required
def dashboard(request):
    vessels = Vessel.objects.all()
    bookings = Booking.objects.filter(user=request.user)
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:5]

    monthly_data = bookings.annotate(month=TruncMonth('booking_date')) \
        .values('month') \
        .annotate(total=Count('id')).order_by('month')
    months = [entry['month'].strftime('%b') for entry in monthly_data]
    totals = [entry['total'] for entry in monthly_data]

    container_data = bookings.values('container_type') \
        .annotate(count=Count('id'))
    container_labels = [entry['container_type'] for entry in container_data]
    container_counts = [entry['count'] for entry in container_data]

    return render(request, 'dashboard.html', {
        'vessels': vessels,
        'bookings': bookings,
        'months': json.dumps(months),
        'totals': json.dumps(totals),
        'container_labels': json.dumps(container_labels),
        'container_counts': json.dumps(container_counts),
        'notifications': notifications,  # <- Pass to template
    })

@login_required
def book_container(request):
    vessels = Vessel.objects.all()

    if request.method == 'POST':
        vessel_id = request.POST.get('vessel')
        source_port = request.POST.get('source_port')
        destination_port = request.POST.get('destination_port')
        container_type = request.POST.get('container_type')
        number_of_containers = int(request.POST.get('num_containers'))

        # Dummy cost logic — update with real pricing logic later
        cost_per_container = 2500
        cost = cost_per_container * number_of_containers

        # Create booking
        booking = Booking.objects.create(
        user=request.user,
        vessel_id=vessel_id,
        source_port=source_port,
        destination_port=destination_port,
        container_type=container_type,
        number_of_containers=number_of_containers,
        cost=cost,
        booking_date=timezone.now(),
        status="Booked"
        )

        Notification.objects.create(
            user=request.user,
            message=f"Booking confirmed for vessel {booking.vessel.name} from {booking.source_port} to {booking.destination_port}."
        )

        return redirect('dashboard')

    return render(request, 'partials/container_booking.html', {
        'vessels': vessels
    })

def cancel_booking(request, id):
    booking = get_object_or_404(Booking, id=id)
    booking.status = "Cancelled"
    booking.save()
    Notification.objects.create(
        user=request.user,
        message=f"You cancelled booking for vessel {booking.vessel.name} from {booking.source_port} to {booking.destination_port}."
    )
    return redirect('dashboard') 