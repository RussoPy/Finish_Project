import uuid
import random
from django.core.management.base import BaseCommand
from base.firebase_config import db # Assuming this correctly imports your initialized db client
from firebase_admin import firestore # Import firestore namespace
from faker import Faker
from datetime import datetime

fake = Faker()

class Command(BaseCommand):
    help = 'Populate Firebase Firestore with fake workers, jobs, and swipe data'

    def add_arguments(self, parser):
        # Optional: Add arguments to control the number of items
        parser.add_argument('--workers', type=int, default=10, help='Number of workers to create')
        parser.add_argument('--jobs', type=int, default=20, help='Number of jobs to create') # More jobs than workers makes sense

    def handle(self, *args, **kwargs):
        num_workers = kwargs['workers']
        num_jobs = kwargs['jobs']

        self.stdout.write("Starting population...")
        worker_ids = self.populate_workers(num_workers)
        job_ids = self.populate_jobs(num_jobs)

        if worker_ids and job_ids:
             self.populate_swipes(worker_ids, job_ids)
        else:
            self.stdout.write(self.style.WARNING("Skipping swipe population due to missing worker or job IDs."))

        self.stdout.write(self.style.SUCCESS("✅ Population complete!"))


    def populate_workers(self, count):
        self.stdout.write(f"Creating {count} workers...")
        worker_ids = []
        for _ in range(count):
            worker_id = str(uuid.uuid4())
            worker_ids.append(worker_id) # Collect the ID
            doc = {
                'name': fake.name(),
                'age': random.randint(18, 40),
                'location_lat': round(random.uniform(29.5, 33.3), 6), # Approx Israel Lat
                'location_lng': round(random.uniform(34.2, 35.9), 6), # Approx Israel Lng
                'preferred_tags': random.sample(['food', 'tech', 'construction', 'education', 'retail', 'service', 'office'], random.randint(1, 3)),
                'experience_level': random.choice(['beginner', 'intermediate', 'expert']),
                'skills': random.sample(['communication', 'cooking', 'python', 'javascript', 'sales', 'cleaning', 'driving', 'customer service'], random.randint(2, 4)),
                'profile_photo': fake.image_url(),
                'cv_url': None,
                'availability': random.choice([True, False]),
                'profile_score': random.randint(40, 100),
                'swipe_stats': {'totalSwipes': random.randint(5, 50), 'rightSwipes': random.randint(0, 25)}, # This might be redundant if calculated later
                'created_at': firestore.SERVER_TIMESTAMP # Use server timestamp
            }
            db.collection('workers').document(worker_id).set(doc)
        self.stdout.write(self.style.SUCCESS(f"  -> {count} workers added"))
        return worker_ids # Return the list of IDs

    def populate_jobs(self, count):
        self.stdout.write(f"Creating {count} jobs...")
        job_ids = []
        for _ in range(count):
            job_id = str(uuid.uuid4())
            job_ids.append(job_id) # Collect the ID
            min_sal = random.randint(30, 60) * 100
            max_sal = min_sal + random.randint(10, 50) * 100
            doc = {
                'title': fake.job(),
                'description': fake.paragraph(nb_sentences=5),
                'tags': random.sample(['tech', 'food', 'sales', 'support', 'retail', 'office', 'manual labor'], random.randint(1, 2)),
                'experience_required': random.choice(['beginner', 'intermediate', 'expert', 'any']),
                'skills_needed': random.sample(['python', 'fast typing', 'cooking', 'sales', 'driving license', 'english', 'hebrew'], random.randint(1, 3)),
                'location_lat': round(random.uniform(29.5, 33.3), 6), # Approx Israel Lat
                'location_lng': round(random.uniform(34.2, 35.9), 6), # Approx Israel Lng
                'salary_min': min_sal,
                'salary_max': max_sal,
                'business_id': str(uuid.uuid4()), # Or link to an actual business collection
                'is_active': True,
                'applicants': [], # Keep empty for population
                'matches': [],    # Keep empty for population
                'rejected': {},   # Keep empty for population
                'created_at': firestore.SERVER_TIMESTAMP # Use server timestamp
            }
            db.collection('jobs').document(job_id).set(doc)
        self.stdout.write(self.style.SUCCESS(f"  -> {count} jobs added"))
        return job_ids # Return the list of IDs

    def populate_swipes(self, worker_ids, job_ids):
        self.stdout.write(f"Populating swipes for {len(worker_ids)} workers on {len(job_ids)} jobs...")

        if not job_ids:
             self.stdout.write(self.style.WARNING("  -> No jobs available to swipe on. Skipping swipe population."))
             return

        total_swipes_populated = 0
        for worker_id in worker_ids:
            # Determine how many jobs this worker will swipe on
            # Let's say each worker swipes on 30% to 80% of jobs
            num_jobs_to_swipe = random.randint(int(len(job_ids) * 0.3), int(len(job_ids) * 0.8))
            if num_jobs_to_swipe == 0 and len(job_ids) > 0:
                 num_jobs_to_swipe = 1 # Ensure at least one swipe if jobs exist

            # Sample the jobs the worker will interact with
            swiped_job_ids = random.sample(job_ids, k=min(num_jobs_to_swipe, len(job_ids))) # Ensure k isn't larger than population

            # Decide which of the swiped jobs are liked vs disliked
            # Let's say 20% to 70% are likes
            num_likes = random.randint(int(len(swiped_job_ids) * 0.2), int(len(swiped_job_ids) * 0.7))
            liked_jobs = swiped_job_ids[:num_likes]
            disliked_jobs = swiped_job_ids[num_likes:]

            if not liked_jobs and not disliked_jobs:
                continue # Skip if somehow no jobs ended up selected

            # Get the reference to the worker's swipe data document
            swipe_ref = db.collection('workers').document(worker_id).collection('swipes').document('data')

            try:
                # 1. Ensure the document and base arrays exist using set with merge
                # This prevents errors if the document doesn't exist yet.
                # It will create the doc/fields if missing, or overwrite if they exist
                # - but we only set empty arrays initially.
                swipe_ref.set({'likes': [], 'dislikes': []}, merge=True)

                # 2. Use update with ArrayUnion to add the selected job IDs
                # This mimics the actual swipe action more closely (adding elements)
                update_data = {}
                if liked_jobs:
                    update_data['likes'] = firestore.ArrayUnion(liked_jobs)
                if disliked_jobs:
                    update_data['dislikes'] = firestore.ArrayUnion(disliked_jobs)

                if update_data: # Only update if there's something to add
                    swipe_ref.update(update_data)
                    total_swipes_populated += len(liked_jobs) + len(disliked_jobs)

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  -> Error populating swipes for worker {worker_id}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"  -> Swipe data populated. Added approx {total_swipes_populated} swipe entries."))