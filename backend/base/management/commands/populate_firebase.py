import uuid
import random
from django.core.management.base import BaseCommand
# Import Firestore Client and Timestamp
from google.cloud import firestore # Assuming you use google-cloud-firestore
from faker import Faker
from datetime import datetime, timedelta

# Initialize Firestore client (ensure credentials are set up in your environment)
# Adjust initialization if needed based on base.firebase_config
# from base.firebase_config import db # If db is already an initialized client
try:
    # Attempt standard initialization if 'db' is not already imported/configured
    db = firestore.Client()
except Exception as e:
    print(f"Firestore client might already be initialized or config error: {e}")
    # Make sure 'db' is correctly assigned from your base.firebase_config if needed
    from base.firebase_config import db


fake = Faker()

# Define some sample data for consistency
SAMPLE_SKILLS = ['Communication', 'Customer Service', 'Sales', 'Problem Solving', 'Python', 'JavaScript', 'React', 'Node.js', 'Data Entry', 'Project Management', 'Cooking', 'Cleaning', 'Driving', 'Cash Handling']
SAMPLE_TAGS = ['Retail', 'Hospitality', 'Technology', 'Food Service', 'Customer Support', 'Office Admin', 'Warehouse', 'Construction', 'Education', 'Healthcare']
SAMPLE_INDUSTRIES = ['Technology', 'Retail', 'Hospitality', 'Healthcare', 'Finance', 'Education', 'Construction', 'Food & Beverage']
EXPERIENCE_LEVELS = ['Entry-level', 'Intermediate', 'Senior', 'Expert'] # Match worker model
AVAILABILITY_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']
BENEFITS_LIST = ['Health Insurance', 'Paid Time Off (PTO)', 'Dental Insurance', 'Vision Insurance', '401(k)', 'Flexible Schedule', 'Remote Work Options', 'Paid Sick Leave', 'Employee Discount']


class Command(BaseCommand):
    help = 'Populate Firebase Firestore with fake workers and jobs matching the defined interfaces'

    def add_arguments(self, parser):
        parser.add_argument('--workers', type=int, help='Number of fake workers to create', default=10)
        parser.add_argument('--jobs', type=int, help='Number of fake jobs to create', default=10)
        parser.add_argument('--business_count', type=int, help='Number of unique fake businesses to create job references for', default=3)

    def handle(self, *args, **kwargs):
        worker_count = kwargs['workers']
        job_count = kwargs['jobs']
        business_count = kwargs['business_count']

        # Generate some fake business IDs and names to link jobs to
        business_data = [{
            'id': str(uuid.uuid4()),
            'name': fake.company(),
            'logo_url': fake.image_url() # Generate a fake logo URL per business
        } for _ in range(business_count)]

        if worker_count > 0:
            self.populate_workers(worker_count)
        if job_count > 0:
            self.populate_jobs(job_count, business_data) # Pass business data to jobs

    def populate_workers(self, count):
        self.stdout.write(f"Populating {count} workers...")
        batch = db.batch()
        for i in range(count):
            worker_id = str(uuid.uuid4()) # Use UUID as the document ID
            worker_ref = db.collection('workers').document(worker_id)

            first_name = fake.first_name()
            last_name = fake.last_name()
            # Generate birth_date between 18 and 60 years ago
            birth_dt = fake.date_of_birth(minimum_age=18, maximum_age=60)
            # Convert python date to datetime for timestamp conversion
            birth_datetime = datetime.combine(birth_dt, datetime.min.time())

            doc = {
                # --- Core Identification & Personal Info ---
                'id': worker_id,
                'email': fake.unique.email(),
                'firstName': first_name,
                'lastName': last_name,
                'username': fake.unique.user_name(),
                'phone': fake.phone_number(), # Optional field
                'birth_date': firestore.Timestamp.from_datetime(birth_datetime), # Use Timestamp
                'profilePictureUrl': fake.image_url(), # Optional field

                # --- Professional Profile ---
                'headline': fake.catch_phrase(), # Optional field
                'summary': fake.paragraph(nb_sentences=3), # Optional field
                'experience_level': random.choice(EXPERIENCE_LEVELS),
                'skills': random.sample(SAMPLE_SKILLS, k=random.randint(3, 6)),
                'preferred_tags': random.sample(SAMPLE_TAGS, k=random.randint(1, 3)),
                'industry_preference': random.choice(SAMPLE_INDUSTRIES), # Optional field
                'resumeUrl': None, # Optional field
                'portfolioUrl': None, # Optional field

                # --- Job Preferences ---
                # Generate location within Israel approx bounds
                'location_lat': round(random.uniform(29.5, 33.3), 6), # Optional field
                'location_lng': round(random.uniform(34.2, 35.9), 6), # Optional field
                'job_search_radius': random.choice([10, 25, 50, 100]),
                'salary_min': round(random.randint(5000, 15000) / 100) * 100, # Example range
                'salary_max': round(random.randint(15000, 40000) / 100) * 100, # Example range
                'availability': random.choice(AVAILABILITY_TYPES),
                'willing_to_relocate': fake.boolean(chance_of_getting_true=25), # Optional field

                # --- Application State & Matching ---
                'liked_jobs': [], # Initialize as empty
                'matched_jobs': [], # Initialize as empty
                'disliked_jobs': {}, # Initialize as empty

                # --- System Information ---
                'profileComplete': fake.boolean(chance_of_getting_true=75),
                'created_at': firestore.Timestamp.from_datetime(datetime.utcnow()), # Use Timestamp
                # 'last_updated_at': firestore.Timestamp.from_datetime(datetime.utcnow()) # Optional on creation
            }
            batch.set(worker_ref, doc)
             # Commit every 500 writes (Firestore batch limit)
            if (i + 1) % 500 == 0:
                batch.commit()
                batch = db.batch()
                self.stdout.write(f"Committed batch {i+1}/{count}")

        batch.commit() # Commit any remaining writes
        self.stdout.write(self.style.SUCCESS(f"✅ Successfully added/updated {count} workers"))

    def populate_jobs(self, count, business_data):
        if not business_data:
             self.stdout.write(self.style.ERROR("❌ No business data provided. Cannot create jobs."))
             return

        self.stdout.write(f"Populating {count} jobs...")
        batch = db.batch()
        for i in range(count):
            job_id = str(uuid.uuid4()) # Use UUID as the document ID
            job_ref = db.collection('jobs').document(job_id)

            # Assign job to a random fake business
            assigned_business = random.choice(business_data)
            min_salary = round(random.randint(6000, 20000) / 100) * 100
            max_salary = min_salary + round(random.randint(1000, 10000) / 100) * 100

            doc = {
                'id': job_id,
                'business_id': assigned_business['id'], # Link to a fake business

                # --- Core Job Details ---
                'title': fake.job(),
                'industry': random.choice(SAMPLE_INDUSTRIES),
                'description': fake.paragraph(nb_sentences=5),
                'tags': random.sample(SAMPLE_TAGS, k=random.randint(1, 4)),
                'experience_required': random.choice(EXPERIENCE_LEVELS), # Match worker levels
                'skills_needed': random.sample(SAMPLE_SKILLS, k=random.randint(2, 5)),
                'availability': random.choice(AVAILABILITY_TYPES),

                # --- Location ---
                # Generate location within Israel approx bounds
                'location_lat': round(random.uniform(29.5, 33.3), 6), # Optional if remote
                'location_lng': round(random.uniform(34.2, 35.9), 6), # Optional if remote
                'location_address': fake.address(), # Optional field
                'is_remote': fake.boolean(chance_of_getting_true=15), # Optional field

                # --- Compensation & Requirements ---
                'salary_min': min_salary,             # Optional field
                'salary_max': max_salary,             # Optional field
                'minimum_age': random.choice([None, 16, 18, 21]), # Optional field
                'benefits': random.sample(BENEFITS_LIST, k=random.randint(0, 4)), # Optional field

                # --- Business Context (denormalized) ---
                'business_name': assigned_business['name'], # Denormalized from Business profile
                'logo_url': assigned_business['logo_url'], # Denormalized from Business profile
                'imageUrls': [fake.image_url() for _ in range(random.randint(0, 3))], # Optional field

                # --- Application State & Matching ---
                'is_active': True,
                'applicants': [], # Initialize as empty
                'matches': [], # Initialize as empty
                'rejected': {}, # Initialize as empty

                # --- System Information ---
                'created_at': firestore.Timestamp.from_datetime(datetime.utcnow()), # Use Timestamp
                'updated_at': firestore.Timestamp.from_datetime(datetime.utcnow()), # Optional field
                'posted_by_user_id': str(uuid.uuid4()), # Fake user ID within the business
            }
            # Make location null if remote
            if doc['is_remote']:
                doc['location_lat'] = None
                doc['location_lng'] = None
                # Optionally clear address too, or set to "Remote"
                doc['location_address'] = "Remote"

            batch.set(job_ref, doc)
            # Commit every 500 writes (Firestore batch limit)
            if (i + 1) % 500 == 0:
                batch.commit()
                batch = db.batch()
                self.stdout.write(f"Committed batch {i+1}/{count}")

        batch.commit() # Commit any remaining writes
        self.stdout.write(self.style.SUCCESS(f"✅ Successfully added/updated {count} jobs"))