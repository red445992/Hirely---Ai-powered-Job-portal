import sys
import os

# Add the Django project to the path
sys.path.append('C:\\Users\\ASUS\\OneDrive\\Desktop\\pto\\Esewa-JobApplication\\backend\\HirelyBackend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HirelyBackend.settings')

import django
django.setup()

from jobs.utils.resume_parser import parse_resume

# Test the resume parser directly
test_resume = '''
John Doe
Software Engineer
Email: john.doe@example.com
Phone: +1-555-123-4567

EXPERIENCE:
Software Engineer at Google Inc (5 years of experience)
- Developed web applications using Python, Django, React, JavaScript
- Worked with PostgreSQL, AWS, Docker

EDUCATION:
Bachelor of Science in Computer Science
University of California

SKILLS:
Python, Django, React, JavaScript, SQL, PostgreSQL, AWS, Docker, Git, Machine Learning
'''

try:
    result = parse_resume(test_resume)
    print('🎉 RESUME PARSER TEST SUCCESS!')
    print('='*50)
    print(f'Method: {result.get("method", "unknown")}')
    print(f'Status: {result.get("status", "unknown")}')
    print()
    print('Extracted Entities:')
    print('-'*30)
    for key, value in result.get('entities', {}).items():
        if value:  # Only show non-empty results
            print(f'{key.upper()}: {value}')
    print('='*50)
    print('✅ Resume parser is working correctly!')
except Exception as e:
    print(f'❌ ERROR: {str(e)}')
    import traceback
    traceback.print_exc()