"""
Demo data script to create additional test applications for resume scoring demonstration
"""

from django.core.management.base import BaseCommand
from applications.models import Application
from jobs.models import Job
from accounts.models import User
from django.core.files.base import ContentFile
import os

class Command(BaseCommand):
    help = 'Create demo applications for resume scoring testing'

    def handle(self, *args, **options):
        # Create sample resume content
        sample_resumes = [
            {
                'name': 'Sarah Johnson',
                'email': 'sarah.johnson@email.com',
                'content': '''Sarah Johnson
Software Engineer

Email: sarah.johnson@email.com
Phone: (555) 123-4567

EDUCATION
Bachelor of Science in Computer Science
Stanford University, 2020

SKILLS
- Python, Java, JavaScript, TypeScript
- React, Node.js, Django, Flask
- PostgreSQL, MongoDB, Redis
- AWS, Docker, Kubernetes
- Git, Jenkins, CI/CD

EXPERIENCE
Senior Software Developer at Google (2022-Present)
- Developed scalable web applications using React and Node.js
- Implemented microservices architecture with Docker and Kubernetes
- Led team of 5 developers on cloud migration project

Software Developer at Microsoft (2020-2022)
- Built REST APIs using Python and Django
- Optimized database queries improving performance by 40%
- Collaborated with cross-functional teams on product development''',
                'username': 'sarahj'
            },
            {
                'name': 'Michael Chen',
                'email': 'michael.chen@email.com', 
                'content': '''Michael Chen
Data Scientist & ML Engineer

Email: michael.chen@email.com
Phone: (555) 987-6543

EDUCATION
Master of Science in Machine Learning
MIT, 2021
Bachelor of Science in Mathematics
UC Berkeley, 2019

SKILLS
- Python, R, SQL, Scala
- TensorFlow, PyTorch, scikit-learn
- Pandas, NumPy, Matplotlib
- AWS, GCP, Azure
- Docker, Kubernetes, MLOps
- Git, Jupyter, Apache Spark

EXPERIENCE
Senior Data Scientist at Netflix (2022-Present)
- Developed recommendation algorithms using deep learning
- Improved user engagement by 25% through ML model optimization
- Built end-to-end ML pipelines for production deployment

Machine Learning Engineer at Uber (2021-2022)
- Created predictive models for demand forecasting
- Implemented A/B testing frameworks for ML experiments
- Optimized model performance reducing inference time by 60%''',
                'username': 'michaelc'
            },
            {
                'name': 'Emily Rodriguez',
                'email': 'emily.rodriguez@email.com',
                'content': '''Emily Rodriguez
Frontend Developer & UX Designer

Email: emily.rodriguez@email.com
Phone: (555) 456-7890

EDUCATION
Bachelor of Fine Arts in Digital Design
Art Institute of California, 2019

SKILLS
- JavaScript, TypeScript, HTML5, CSS3
- React, Vue.js, Angular, Next.js
- Figma, Sketch, Adobe Creative Suite
- Sass, Tailwind CSS, Bootstrap
- Git, Webpack, Vite
- User Research, Prototyping

EXPERIENCE
Senior Frontend Developer at Airbnb (2021-Present)
- Designed and implemented responsive web interfaces
- Collaborated with UX team to improve user experience
- Reduced page load times by 45% through optimization

Frontend Developer at Spotify (2019-2021)
- Built interactive music player components using React
- Implemented accessibility features following WCAG guidelines
- Created design system components used across multiple teams''',
                'username': 'emilyr'
            }
        ]

        # Get the first job for testing
        try:
            job = Job.objects.first()
            if not job:
                self.stdout.write(self.style.ERROR('No jobs found. Please create a job first.'))
                return

            created_count = 0
            
            for resume_data in sample_resumes:
                # Create user if doesn't exist
                user, user_created = User.objects.get_or_create(
                    username=resume_data['username'],
                    defaults={
                        'email': resume_data['email'],
                        'first_name': resume_data['name'].split()[0],
                        'last_name': ' '.join(resume_data['name'].split()[1:]),
                        'user_type': 'candidate'
                    }
                )
                
                if user_created:
                    user.set_password('testpass123')
                    user.save()

                # Check if application already exists
                if Application.objects.filter(job=job, applicant=user).exists():
                    self.stdout.write(f'Application for {resume_data["name"]} already exists')
                    continue

                # Create resume file content
                resume_content = resume_data['content'].encode('utf-8')
                resume_file = ContentFile(resume_content, name=f'{resume_data["username"]}_resume.txt')

                # Create application
                application = Application.objects.create(
                    job=job,
                    applicant=user,
                    full_name=resume_data['name'],
                    email=resume_data['email'],
                    phone='(555) 123-4567',
                    expected_salary='80000',
                    status='pending'
                )
                
                # Save resume file
                application.resume.save(f'{resume_data["username"]}_resume.txt', resume_file)
                created_count += 1

                self.stdout.write(f'✅ Created application for {resume_data["name"]}')

            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {created_count} demo applications!')
            )
            self.stdout.write(
                self.style.SUCCESS(f'Total applications for job "{job.title}": {Application.objects.filter(job=job).count()}')
            )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating demo data: {str(e)}'))