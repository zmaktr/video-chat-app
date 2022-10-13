from django.shortcuts import render

def lobby(request):
    return render(request, 'lobby.html')

def room(request):
    return render(request, 'room.html')
