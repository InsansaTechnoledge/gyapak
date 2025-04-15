import { supabase } from "../../config/supabaseClient.js";

export const createExam = async ({ title, description, validity, positive_marks , negative_marks = 0 ,price_learner , price_achiever }) => {
    const { data, error } = await supabase
      .from('exam')
      .insert([{ title, description, validity, positive_marks, negative_marks , price_learner , price_achiever }])
      .select()
      .single();
  
    if (error) throw error;
    return data;
  };

export const getAllExams = async () => {
  const {data , error} = await supabase
  .from('exam')
  .select('*, events(*)')


  if(error) throw error;
  return data;
}
  

export const addSubjectsToExam = async(exam_id , subjects) => {
    const payload = subjects.map((subject) => ({
        exam_id,
        subject_id: subject.subject_id,
        weightage: subject.weightage,
        syllabus: subject.syllabus_id 
      }));

    const {data , error} = await supabase
    .from('exam_subjects')
    .insert(payload)
    .select()

    if(error) throw error;
    return data;
}

export const getExamWithSubjects = async(exam_id) => {
    const {data: exam , error: examError} = await supabase 
    .from('exam')
    .select('*')
    .eq('id', exam_id)
    .single();

    if(examError) throw examError;

    const {data: subjects , error: subjecterror} = await supabase
    .from('exam_subjects')
    .select('weightage , subjects(*)')
    .eq('exam_id', exam_id)

    if(subjecterror) throw subjecterror;
    return {...exam , subjects};
}

export const updateExam = async (id, updates) => {
    const { data, error } = await supabase
      .from('exam')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
  
    if (error) throw error;
    return data;
};

export const deleteExam = async (id) => {
    const { data, error } = await supabase
      .from('exam')
      .delete()
      .eq('id', id)
      .select()
      .single();
  
    if (error) throw error;
    return data;
};

export const fetchExamById=async(id) => {
    const { data, error } = await supabase
      .from('exam')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) throw error;
    return data;
};

