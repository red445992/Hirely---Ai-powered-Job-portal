import requests
import json

# Test the resume parser API endpoint
url = 'http://127.0.0.1:8001/jobs/parse-resume/'  # Updated to port 8001
test_data = {
    'resume_text': '''
    John Doe
    Software Engineer
    Email: john.doe@example.com
    Phone: +1-555-123-4567
    
    EXPERIENCE:
    Software Engineer at Google Inc (5 years of experience)
    - Developed web applications using Python, Django, React
    
    EDUCATION:
    Bachelor of Science in Computer Science
    
    SKILLS:
    Python, Django, React, JavaScript, SQL, AWS, Docker
    '''
}

try:
    response = requests.post(url, json=test_data, headers={'Content-Type': 'application/json'})
    print(f'Status Code: {response.status_code}')
    if response.status_code == 200:
        result = response.json()
        print('SUCCESS! Extracted entities:')
        for key, value in result.get('entities', {}).items():
            print(f'  {key}: {value}')
        print(f'Method: {result.get("method", "unknown")}')
        print(f'Status: {result.get("status", "unknown")}')
    else:
        print(f'Error Response: {response.text}')
except Exception as e:
    print(f'Error: {e}')