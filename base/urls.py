from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,index, register,selective
from rest_framework_simplejwt.views import TokenObtainPairView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('',index),
    path('', include(router.urls)),
    path('register',register),
    path('login', TokenObtainPairView.as_view()),  
    path('selective',selective)
]
