import uuid
import random
from django.core.management.base import BaseCommand
from base.firebase_config import db
from faker import Faker
from datetime import datetime

fake = Faker()

class Command(BaseCommand):
    help = 'Populate Firebase Firestore with fake workers and jobs'

    def handle(self, *args, **kwargs):
        self.populate_workers(10)
        self.populate_jobs(10)

    def populate_workers(self, count):
        for _ in range(count):
            worker_id = str(uuid.uuid4())
            doc = {
                'name': fake.name(),
                'age': random.randint(18, 40),
                'location_lat': round(random.uniform(29.5, 33.3), 6),
                'location_lng': round(random.uniform(34.2, 35.9), 6),
                'preferred_tags': random.sample(['food', 'tech', 'construction', 'education', 'retail'], 2),
                'experience_level': random.choice(['beginner', 'intermediate', 'expert']),
                'skills': random.sample(['communication', 'cooking', 'python', 'javascript', 'sales', 'cleaning'], 3),
                'profile_photo': fake.image_url(),
                'cv_url': None,
                'availability': random.choice([True, False]),
                'profile_score': random.randint(40, 100),
                'swipe_stats': {'totalSwipes': random.randint(5, 50), 'rightSwipes': random.randint(0, 25)},
                'created_at': datetime.utcnow()
            }
            db.collection('workers').document(worker_id).set(doc)
        self.stdout.write(self.style.SUCCESS(f"✅ {count} workers added"))

    def populate_jobs(self, count):
        for _ in range(count):
            job_id = str(uuid.uuid4())
            doc = {
                'title': fake.job(),
                'description': fake.paragraph(),
                'tags': random.sample(['tech', 'food', 'sales', 'support', 'retail'], 2),
                'experience_required': random.choice(['beginner', 'intermediate', 'expert']),
                'skills_needed': random.sample(['python', 'fast typing', 'cooking', 'sales'], 2),
                'location_lat': round(random.uniform(29.5, 33.3), 6),
                'location_lng': round(random.uniform(34.2, 35.9), 6),
                'salary_min': random.randint(30, 60) * 100,
                'salary_max': random.randint(70, 120) * 100,
                'business_id': str(uuid.uuid4()),
                'is_active': True,
                'applicants': [],
                'matches': [],
                'rejected': {},
                'created_at': datetime.utcnow()
            }
            db.collection('jobs').document(job_id).set(doc)
        self.stdout.write(self.style.SUCCESS(f"✅ {count} jobs added"))
