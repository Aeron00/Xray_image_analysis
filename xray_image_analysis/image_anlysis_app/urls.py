from django.urls import path
from .views import RegisterUser, LoginUser, LogoutUser, ImageAnalysis, UserProfile

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),
    path('logout/', LogoutUser.as_view(), name='logout'),
    path('user_profile/', UserProfile.as_view(), name='user_profile'),
    path('image_analysis/', ImageAnalysis.as_view(), name='image_analysis'),
]
