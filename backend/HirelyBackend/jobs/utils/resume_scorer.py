import re
import os
import requests
from .resume_parser import parse_resume
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path):
    """Extract text from PDF or text file"""
    try:
        # Check file extension
        _, ext = os.path.splitext(file_path.lower())
        
        if ext == '.txt':
            # Handle text files
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        elif ext == '.pdf':
            # Handle PDF files
            text = ""
            with open(file_path, 'rb') as f:
                reader = PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() or ""
            return text
        else:
            # Try to read as text file as fallback
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            except UnicodeDecodeError:
                # If text reading fails, try as binary (PDF)
                with open(file_path, 'rb') as f:
                    reader = PdfReader(f)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text() or ""
                    return text
    except Exception as e:
        print(f"Error extracting text from {file_path}: {str(e)}")
        return ""

def score_resume_against_job(resume_text, job_description):
    """Compute similarity between resume text and job description."""
    if not resume_text.strip() or not job_description.strip():
        return 0.0
    
    try:
        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        # Return score on 0-5 scale with better distribution
        return round(score * 5.0, 2)
    except Exception as e:
        print(f"Error scoring resume: {str(e)}")
        return 0.0

def calculate_enhanced_score(resume_text, parsed_data, job_description):
    """Calculate enhanced score with multiple factors."""
    base_score = score_resume_against_job(resume_text, job_description)
    
    # Bonus points for having key sections
    bonus = 0.0
    if parsed_data.get('entities', {}).get('skills'):
        bonus += 0.3  # Has skills listed
    if parsed_data.get('entities', {}).get('experience'):
        bonus += 0.3  # Has experience listed
    if parsed_data.get('entities', {}).get('education'):
        bonus += 0.2  # Has education listed
    
    # Calculate skill match bonus
    job_desc_lower = job_description.lower()
    skills = parsed_data.get('entities', {}).get('skills', [])
    skill_matches = sum(1 for skill in skills if skill.lower() in job_desc_lower)
    if skills:
        skill_match_ratio = skill_matches / len(skills)
        bonus += skill_match_ratio * 0.5
    
    final_score = min(5.0, base_score + bonus)
    return round(final_score, 2)

def analyze_resume(file_path, job_description):
    """Full pipeline: extract text → parse entities → score."""
    try:
        if not os.path.exists(file_path):
            return {
                "parsed": {"entities": {}, "method": "error", "status": "file_not_found"},
                "score": 0.0
            }
        
        resume_text = extract_text_from_pdf(file_path)
        if not resume_text.strip():
            return {
                "parsed": {"entities": {}, "method": "error", "status": "empty_file"},
                "score": 0.0
            }
        
        parsed_data = parse_resume(resume_text)
        score = calculate_enhanced_score(resume_text, parsed_data, job_description)
        
        return {
            "parsed": parsed_data,
            "score": score
        }
    except Exception as e:
        print(f"Error analyzing resume {file_path}: {str(e)}")
        return {
            "parsed": {"entities": {}, "method": "error", "status": f"error: {str(e)}"},
            "score": 0.0
        }
