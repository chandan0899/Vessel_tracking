from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import logout as django_logout
from django.contrib.auth.models import User
from django.contrib import messages

def home(request):
    return render(request, 'index.html')  # or 'map.html' — use your map page here

def live_map(request):
    return render(request, 'index.html')  # or 'map.html' — use your map page here

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        email = request.POST.get('email')
        phone = request.POST.get('phone')  # Optional: handled separately if you use a profile model
        full_name = request.POST.get('full_name','').strip()  # Not used unless you want to store it

        if password == confirm_password:
            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists.")
            else:
                user = User.objects.create_user(username=username, password=password, email=email)
                user.save()
                messages.success(request, "Registration successful. Please log in.")
                return redirect('login')  # ✅ Use URL name, not 'login.html'
        else:
            messages.error(request, "Passwords do not match.")

    return render(request, 'register.html')


def login(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password')

        if not username or not password:
            messages.error(request, "Both fields are required.")
            return redirect('login')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth.login(request, user)
            messages.success(request, 'Login successful!')
            return redirect('home')  # or 'dashboard'
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'login.html')    


def logout(request):
    django_logout(request)
    return redirect('home')
