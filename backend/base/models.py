from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_worker = models.BooleanField(default=False)
    is_business = models.BooleanField(default=False)
    # Add other common fields here

class WorkerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='worker_profile')
    age = models.PositiveIntegerField()
    location_lat = models.FloatField()
    location_lng = models.FloatField()
    preferred_tags = models.JSONField()  # List of strings
    experience_level = models.CharField(max_length=20, choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('expert', 'Expert')])
    skills = models.JSONField()  # List of strings
    profile_photo = models.URLField()
    cv_url = models.URLField(null=True, blank=True)
    availability = models.BooleanField(default=True)
    profile_score = models.PositiveIntegerField(default=0)
    swipe_stats = models.JSONField(default=dict)  # Dictionary to store swipe statistics
    created_at = models.DateTimeField(auto_now_add=True)
