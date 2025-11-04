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
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return round(score * 100, 2)  # percentage score

def analyze_resume(file_path, job_description):
    """Full pipeline: extract text → parse entities → score."""
    resume_text = extract_text_from_pdf(file_path)
    parsed_data = parse_resume(resume_text)
    score = score_resume_against_job(resume_text, job_description)
    return {
        "parsed": parsed_data,
        "score": score
    }
