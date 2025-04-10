import {supabase} from '../../config/supabaseClient.js';

export const createEvent = async ({ name, exam_id, status = 'pending', weeks, event_date, duration }) => {
    console.log("🚀 Supabase Insert Payload:", { name, exam_id, status, weeks, event_date, duration });
  
    const { data, error } = await supabase
      .from('events') // make sure the table name is exactly 'events'
      .insert([{ name, exam_id, status, weeks, event_date, duration }])
      .select()
      .single();
  
    if (error) {
      console.error("❌ Supabase Insert Error:", error); // 👈 log exact error
      throw error;
    }
  
    return data;
  };
  


  export const assignSubjectsToEvent = async (event_id, subject_ids) => {
    const subjectInsertPayload = subject_ids.map(subject_id => ({
      event_id,
      subject_id
    }));
  
    // Step 1: Insert subjects to event_subjects
    const { data: subjectInsertData, error: subjectInsertError } = await supabase
      .from('event_subjects')
      .insert(subjectInsertPayload)
      .select();
  
    if (subjectInsertError) throw subjectInsertError;
  
    // Step 2: Fetch all questions for given subjects
    const { data: questions, error: questionFetchError } = await supabase
      .from('questions')
      .select('id')
      .in('subject_id', subject_ids);
  
    if (questionFetchError) throw questionFetchError;
  
    // Step 3: Map questions to event_id
    const questionInsertPayload = questions.map(q => ({
      event_id,
      question_id: q.id
    }));
  
    if (questionInsertPayload.length > 0) {
      const { error: questionInsertError } = await supabase
        .from('event_questions')
        .insert(questionInsertPayload);
  
      if (questionInsertError) throw questionInsertError;
    }
  
    return {
      subjects_added: subjectInsertData.length,
      questions_auto_mapped: questionInsertPayload.length
    };
  };
  

export const assignQuestionsToEvent = async (event_id, questions) => {
  const dataToInsert = questions.map(q => ({
    event_id,
    question_id: q.question_id,

  }));

  const { data, error } = await supabase
    .from('event_questions')
    .insert(dataToInsert)
    .select();

  if (error) throw error;
  return data;
};

export const getFullEventDetails = async (event_id) => {
    // Step 1: Get Event + Exam Info
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*, exam(*)')
      .eq('id', event_id)
      .single();
  
    if (eventError) throw eventError;
  
    // Step 2: Get subjects linked to event
    const { data: subjects, error: subjectError } = await supabase
      .from('event_subjects')
      .select('subject_id, subjects(name, description)')
      .eq('event_id', event_id);
  
    if (subjectError) throw subjectError;
  
    const subjectIds = subjects.map(s => s.subject_id);
  
    // Step 3: Get questions linked to those subjects
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('id, question, options, correct, explanation, difficulty, subject_id')
      .in('subject_id', subjectIds);
  
    if (questionError) throw questionError;
  
    return {
      ...event,
      subjects: subjects.map(s => s.subjects),
      questions
    };
  };
  
  

export const updateEventStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('events')
    .update({ status, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (id) => {
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
