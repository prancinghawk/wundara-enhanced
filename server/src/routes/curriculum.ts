import { Router } from "express";
import { getCurriculumDescription, getCurriculumDetails, getCurriculumBySubject, getCurriculumByYear, getAllSubjects, getAllYearLevels } from "../../../client/src/utils/curriculumLibrary";

export const curriculumRouter = Router();

// Get curriculum description for a specific code
curriculumRouter.get("/code/:code", (req, res) => {
  try {
    const { code } = req.params;
    const description = getCurriculumDescription(code);
    const details = getCurriculumDetails(code);
    
    res.json({
      code,
      description,
      details
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch curriculum data" });
  }
});

// Get all curriculum codes for a subject
curriculumRouter.get("/subject/:subject", (req, res) => {
  try {
    const { subject } = req.params;
    const codes = getCurriculumBySubject(subject);
    
    res.json({
      subject,
      codes
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch curriculum data" });
  }
});

// Get all curriculum codes for a year level
curriculumRouter.get("/year/:year", (req, res) => {
  try {
    const { year } = req.params;
    const codes = getCurriculumByYear(year);
    
    res.json({
      year,
      codes
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch curriculum data" });
  }
});

// Get all available subjects
curriculumRouter.get("/subjects", (req, res) => {
  try {
    const subjects = getAllSubjects();
    res.json({ subjects });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// Get all available year levels
curriculumRouter.get("/years", (req, res) => {
  try {
    const years = getAllYearLevels();
    res.json({ years });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch year levels" });
  }
});

// Batch lookup for multiple codes
curriculumRouter.post("/batch", (req, res) => {
  try {
    const { codes } = req.body;
    
    if (!Array.isArray(codes)) {
      return res.status(400).json({ error: "Codes must be an array" });
    }
    
    const results = codes.map(code => ({
      code,
      description: getCurriculumDescription(code),
      details: getCurriculumDetails(code)
    }));
    
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch curriculum data" });
  }
});
