// controllers/examController.js
import {
  createExam,
  addSubjectsToExam,
  getExamWithSubjects,
  updateExam,
  deleteExam,
  getAllExams
} from '../../Utility/SQL-Queries/exam.query.js';
import { APIError } from '../../Utility/ApiError.js';
import { APIResponse } from '../../Utility/ApiResponse.js';
import { Institute } from '../../models/Institutions.model.js';

export const createExamController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await createExam({ ...req.body, created_by: id });
    return new APIResponse(201, data, "Exam created successfully").send(res);
  } catch (error) {
    console.error("❌ Error creating exam:", error);
    return new APIError(500, [error?.message || 'Unknown error', "Failed to create exam"]).send(res);
  }
};

export const getAllExamTogether = async (req, res) => {
  try {
    const data = await getAllExams();
    
    const finalData = await Promise.all(
      data.map(async (exam) => ({
        ...exam,
        institute: await Institute.findById(exam.created_by).select('name'),
      }))
    );

    if (!data) return new APIError(404, ['exam not found']).send(res);
    // console.log(data);
    return new APIResponse(200, finalData, 'exam fetched successsfully').send(res);
  } catch (e) {
    console.log(e);
    return new APIError(500, [e.message, 'there is an error fetching exams ']).send(res);
  }
}

export const addSubjectsToExamController = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { subjects } = req.body; //  [{ subject_id, weightage, syllabus_id }, ...]
    const data = await addSubjectsToExam(exam_id, subjects);
    return new APIResponse(200, data, "Subjects added to exam successfully").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to add subjects"]).send(res);
  }
};

export const getExamWithSubjectsController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getExamWithSubjects(id);
    return new APIResponse(200, data, "Fetched exam with subjects").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to fetch exam"]).send(res);
  }
};

export const updateExamController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await updateExam(id, req.body);
    return new APIResponse(200, data, "Exam updated successfully").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to update exam"]).send(res);
  }
};

export const deleteExamController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await deleteExam(id);
    return new APIResponse(200, data, "Exam deleted successfully").send(res);
  } catch (error) {
    return new APIError(500, [error.message, "Failed to delete exam"]).send(res);
  }
};
