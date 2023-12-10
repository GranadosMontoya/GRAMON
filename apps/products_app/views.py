#import django 
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url='/')
def listproducts(request):
    return render(request, 'products/listproducts.html')