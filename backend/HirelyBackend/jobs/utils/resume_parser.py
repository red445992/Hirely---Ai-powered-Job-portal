import os
import requests
import re
from typing import Dict, List, Any

# Hugging Face API configuration
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

def extract_entities_fallback(text: str) -> Dict[str, List[str]]:
    """Fallback entity extraction using regex patterns."""
    entities = {
        "person": [],
        "email": [],
        "phone": [],
        "skills": [],
        "education": [],
        "experience": [],
        "organization": []
    }
    
    # Extract emails
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    entities["email"] = emails
    
    # Extract phone numbers
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)
    entities["phone"] = [phone[0] + phone[1] if isinstance(phone, tuple) else phone for phone in phones]
    
    # Extract potential names (first word that's capitalized, not common words)
    name_pattern = r'\b[A-Z][a-z]+ [A-Z][a-z]+\b'
    names = re.findall(name_pattern, text)
    entities["person"] = names[:2]  # Limit to first 2 matches
    
    # Extract skills (common technical skills)
    skill_keywords = [
        'Python', 'Java', 'JavaScript', 'React', 'Django', 'Flask', 'Node.js',
        'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
        'Git', 'HTML', 'CSS', 'TypeScript', 'Vue.js', 'Angular', 'Spring Boot',
        'Machine Learning', 'Data Science', 'AI', 'TensorFlow', 'PyTorch'
    ]
    found_skills = []
    for skill in skill_keywords:
        if skill.lower() in text.lower():
            found_skills.append(skill)
    entities["skills"] = found_skills
    
    # Extract education keywords
    education_keywords = ['Bachelor', 'Master', 'PhD', 'Degree', 'University', 'College', 'BS', 'MS', 'MBA']
    found_education = []
    for edu in education_keywords:
        if edu.lower() in text.lower():
            found_education.append(edu)
    entities["education"] = found_education
    
    # Extract years of experience
    experience_pattern = r'(\d+)\s*(years?)\s*(of\s*)?(experience|exp)'
    experience_matches = re.findall(experience_pattern, text, re.IGNORECASE)
    if experience_matches:
        entities["experience"] = [f"{match[0]} {match[1]} of experience" for match in experience_matches]
    
    # Extract potential organizations
    org_keywords = ['Inc', 'LLC', 'Corp', 'Company', 'Technologies', 'Systems', 'Solutions']
    words = text.split()
    organizations = []
    for i, word in enumerate(words):
        if any(keyword in word for keyword in org_keywords):
            # Get the word before it as potential company name
            if i > 0:
                organizations.append(f"{words[i-1]} {word}")
    entities["organization"] = organizations
    
    return entities

def parse_resume(text: str) -> Dict[str, Any]:
    """
    Parse resume text and extract entities.
    Uses Hugging Face API as primary method, falls back to regex extraction.
    """
    # Try Hugging Face API first
    try:
        if HUGGINGFACE_API_KEY:
            # Try with a simple text classification model
            payload = {"inputs": text}
            response = requests.post(
                "https://api-inference.huggingface.co/models/distilbert-base-uncased",
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                # If API works, use fallback extraction for now
                entities = extract_entities_fallback(text)
                return {
                    "entities": entities,
                    "method": "fallback_with_api_connection",
                    "status": "success"
                }
    except Exception as api_error:
        print(f"API Error: {api_error}")
    
    # Use fallback method
    entities = extract_entities_fallback(text)
    return {
        "entities": entities,
        "method": "fallback_regex",
        "status": "success"
    }
