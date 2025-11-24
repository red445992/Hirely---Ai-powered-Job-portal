"""
Critical Tests for Resume Scoring System
Priority: HIGH - Core Business Logic
"""
import pytest
import os
import tempfile
from io import BytesIO
from PyPDF2 import PdfWriter
from jobs.utils.resume_scorer import (
    score_resume_against_job,
    calculate_enhanced_score,
    analyze_resume,
    extract_text_from_pdf
)
from jobs.utils.resume_parser import parse_resume, extract_entities_fallback


@pytest.mark.django_db
class TestScoreCalculation:
    """Test resume scoring calculations"""
    
    def test_score_range_valid(self):
        """Test that scores are always between 0 and 5"""
        resume_text = "Python Django developer with 5 years experience in REST APIs"
        job_desc = "Looking for Python Django developer"
        
        score = score_resume_against_job(resume_text, job_desc)
        
        assert 0 <= score <= 5.0
        assert isinstance(score, float)
    
    def test_perfect_match_high_score(self):
        """Test that perfect matches get high scores"""
        resume_text = "Python Django PostgreSQL REST API 5 years experience"
        job_desc = "Python Django PostgreSQL REST API experience"
        
        score = score_resume_against_job(resume_text, job_desc)
        
        assert score >= 2.0  # Should be reasonably high
    
    def test_no_match_low_score(self):
        """Test that non-matching resumes get low scores"""
        resume_text = "Marketing specialist with social media experience"
        job_desc = "Python developer with Django experience"
        
        score = score_resume_against_job(resume_text, job_desc)
        
        assert score < 2.0  # Should be low
    
    def test_empty_resume_zero_score(self):
        """Test that empty resume returns 0 score"""
        score = score_resume_against_job("", "Job description")
        
        assert score == 0.0
    
    def test_empty_job_description_zero_score(self):
        """Test that empty job description returns 0 score"""
        score = score_resume_against_job("Resume text", "")
        
        assert score == 0.0
    
    def test_score_consistency(self):
        """Test that same inputs always produce same score"""
        resume_text = "Python developer with Django experience"
        job_desc = "Looking for Python Django developer"
        
        score1 = score_resume_against_job(resume_text, job_desc)
        score2 = score_resume_against_job(resume_text, job_desc)
        
        assert score1 == score2


@pytest.mark.django_db
class TestEnhancedScoring:
    """Test enhanced scoring with bonuses"""
    
    def test_skills_bonus_applied(self):
        """Test that having skills increases score"""
        resume_with_skills = "Skills: Python, Django, React, PostgreSQL"
        resume_without_skills = "Basic programming knowledge"
        job_desc = "Python Django developer position"
        
        parsed_with = parse_resume(resume_with_skills)
        parsed_without = parse_resume(resume_without_skills)
        
        score_with = calculate_enhanced_score(resume_with_skills, parsed_with, job_desc)
        score_without = calculate_enhanced_score(resume_without_skills, parsed_without, job_desc)
        
        assert score_with > score_without
    
    def test_skill_match_bonus(self):
        """Test that matching skills with job description increases score"""
        resume_matching = "Python, Django, PostgreSQL"
        resume_different = "Java, Spring, MySQL"
        job_desc = "Looking for Python, Django, PostgreSQL developer"
        
        parsed_matching = parse_resume(resume_matching)
        parsed_different = parse_resume(resume_different)
        
        score_matching = calculate_enhanced_score(resume_matching, parsed_matching, job_desc)
        score_different = calculate_enhanced_score(resume_different, parsed_different, job_desc)
        
        assert score_matching > score_different
    
    def test_score_capped_at_five(self):
        """Test that enhanced score never exceeds 5.0"""
        # Create resume with all possible bonuses
        resume_text = """
        Python Django PostgreSQL REST API
        Bachelor Master PhD Degree
        5 years experience
        Software Engineer at Google Inc
        """
        job_desc = "Python Django PostgreSQL REST API"
        
        parsed = parse_resume(resume_text)
        score = calculate_enhanced_score(resume_text, parsed, job_desc)
        
        assert score <= 5.0


@pytest.mark.django_db
class TestResumeParser:
    """Test resume parsing functionality"""
    
    def test_extract_email(self):
        """Test email extraction from resume"""
        text = "Contact me at john.doe@example.com"
        
        entities = extract_entities_fallback(text)
        
        assert 'john.doe@example.com' in entities['email']
    
    def test_extract_phone(self):
        """Test phone number extraction"""
        text = "Phone: +1-234-567-8900 or (555) 123-4567"
        
        entities = extract_entities_fallback(text)
        
        assert len(entities['phone']) > 0
    
    def test_extract_skills(self):
        """Test technical skills extraction"""
        text = "I have experience in Python, Django, React, and PostgreSQL"
        
        entities = extract_entities_fallback(text)
        
        assert 'Python' in entities['skills']
        assert 'Django' in entities['skills']
        assert 'React' in entities['skills']
        assert 'PostgreSQL' in entities['skills']
    
    def test_extract_education(self):
        """Test education extraction"""
        text = "I have a Bachelor degree from University"
        
        entities = extract_entities_fallback(text)
        
        assert len(entities['education']) > 0
        assert any('Bachelor' in edu or 'University' in edu for edu in entities['education'])
    
    def test_extract_experience(self):
        """Test years of experience extraction"""
        text = "5 years of experience in software development"
        
        entities = extract_entities_fallback(text)
        
        assert len(entities['experience']) > 0
    
    def test_parse_empty_text(self):
        """Test parsing empty text returns empty entities"""
        parsed = parse_resume("")
        
        assert 'entities' in parsed
        assert parsed['status'] in ['success', 'fallback', 'empty']


@pytest.mark.django_db
class TestFileExtraction:
    """Test text extraction from PDF and TXT files"""
    
    def test_extract_text_from_txt_file(self):
        """Test extracting text from .txt file"""
        # Create temporary text file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write("This is a test resume content")
            temp_path = f.name
        
        try:
            text = extract_text_from_pdf(temp_path)
            assert "test resume content" in text.lower()
        finally:
            os.unlink(temp_path)
    
    def test_extract_text_from_pdf_file(self):
        """Test extracting text from .pdf file"""
        # Create a simple PDF
        pdf_writer = PdfWriter()
        
        # Create temporary PDF file
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as f:
            pdf_writer.write(f)
            temp_path = f.name
        
        try:
            text = extract_text_from_pdf(temp_path)
            # Should return string (even if empty for blank PDF)
            assert isinstance(text, str)
        finally:
            os.unlink(temp_path)
    
    def test_nonexistent_file_returns_empty(self):
        """Test that non-existent file returns empty string"""
        text = extract_text_from_pdf("/nonexistent/file.pdf")
        
        assert text == ""


@pytest.mark.django_db
class TestAnalyzeResume:
    """Test complete resume analysis pipeline"""
    
    def test_analyze_resume_returns_score_and_parsed(self):
        """Test that analyze_resume returns both score and parsed data"""
        # Create temporary text file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write("Python developer with 5 years experience\nSkills: Django, PostgreSQL")
            temp_path = f.name
        
        try:
            job_desc = "Looking for Python Django developer"
            result = analyze_resume(temp_path, job_desc)
            
            assert 'score' in result
            assert 'parsed' in result
            assert isinstance(result['score'], (int, float))
            assert 'entities' in result['parsed']
        finally:
            os.unlink(temp_path)
    
    def test_analyze_nonexistent_file(self):
        """Test analyzing non-existent file returns zero score"""
        result = analyze_resume("/nonexistent/file.pdf", "Job description")
        
        assert result['score'] == 0.0
        assert 'error' in result['parsed']['status'] or result['parsed']['method'] == 'error'
    
    def test_analyze_resume_with_empty_file(self):
        """Test analyzing empty file returns zero score"""
        # Create empty file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            temp_path = f.name
        
        try:
            result = analyze_resume(temp_path, "Job description")
            
            assert result['score'] == 0.0
        finally:
            os.unlink(temp_path)
    
    def test_analyze_resume_error_handling(self):
        """Test that errors are caught and handled gracefully"""
        # Try to analyze with None inputs
        result = analyze_resume(None, "Job description")
        
        # Should not raise exception, should return error result
        assert 'score' in result
        assert 'parsed' in result


@pytest.mark.django_db
class TestResumeScoringIntegration:
    """Integration tests for complete resume scoring flow"""
    
    def test_realistic_resume_scoring(self):
        """Test scoring with realistic resume content"""
        resume_content = """
        John Doe
        john.doe@email.com
        +1-555-123-4567
        
        SUMMARY
        Senior Python Developer with 7 years of experience
        
        SKILLS
        - Python, Django, FastAPI
        - PostgreSQL, MongoDB
        - Docker, Kubernetes
        - REST APIs, GraphQL
        
        EXPERIENCE
        Senior Developer at Tech Corp (5 years)
        - Developed backend services using Django
        - Managed PostgreSQL databases
        
        EDUCATION
        Bachelor of Science in Computer Science
        Master of Science in Software Engineering
        """
        
        job_description = """
        Senior Python Developer Position
        
        We're looking for an experienced Python developer with strong Django skills.
        Must have experience with PostgreSQL and REST APIs.
        Docker and Kubernetes knowledge is a plus.
        
        Requirements:
        - 5+ years Python development
        - Strong Django framework experience
        - Database management (PostgreSQL)
        - REST API development
        """
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(resume_content)
            temp_path = f.name
        
        try:
            result = analyze_resume(temp_path, job_description)
            
            # Score should be high due to good match
            assert result['score'] >= 2.0
            
            # Parsed data should contain expected information
            entities = result['parsed']['entities']
            assert 'john.doe@email.com' in entities['email']
            assert 'Python' in entities['skills']
            assert 'Django' in entities['skills']
            assert len(entities['experience']) > 0
            assert len(entities['education']) > 0
        finally:
            os.unlink(temp_path)
