import { supabase } from "../../config/supabaseClient.js";

export const createSubjectQuery = async (name , description) => {
    const {data , error } = await supabase
    .from('subjects')
    .insert([{name, description}])
    .select()
    .single()

    if(error) throw error;
    return data;
}

// export const createSubjectQuery = async (name, description, weightage = null, syllabus_id = null) => {
//   const { data, error } = await supabase
//     .from('subjects')
//     .insert([{ name, description, weightage, syllabus_id }])
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// };


export const getAllSubjectsQuerry = async () => {
    const {data, error} = await supabase
    .from('subjects')
    .select('*')
    .order('created_at', {asscending: false})

    if(error) throw error;
    return data;
}

export const updateSubjectQuery = async (id , name , description) => {
    const {data , error} = await supabase
    .from('subjects')
    .update({name , description , updated_at: new Date()})
    .eq('id' , id)
    .select()
    .single()

    if(error) throw error;
    return data;
}

export const deleteSubjectQuery = async (id) => {
    const {data , error} = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
    .select()
    .single()

    if(error) throw error;
    return data;
}

// export const getSubjectsByEvent = async (event_id) => {
//     const { data, error } = await supabase
//       .from('event_subjects')
//       .select('subject_id, subjects(name, description)')
//       .eq('event_id', event_id);
  
//     if (error) throw error;
//     return data.map(row => ({
//       id: row.subject_id,
//       ...row.subjects
//     }));
//   };

  // export const getSubjectsByEvent = async (event_id) => {
  //   const { data, error } = await supabase
  //     .from('event_subjects')
  //     .select('subject_id, subjects(name, description)')
  //     .eq('event_id', event_id);
  
  //   if (error) {
  //     console.error("❌ Supabase error in getSubjectsByEvent:", error);
  //     throw error;
  //   }
  
  //   console.log("✅ Subjects fetched:", data);
    
  //   return data.map(row => ({
  //     id: row.subject_id,
  //     ...row.subjects
  //   }));
  // };

  export const getSubjectsByEvent = async (event_id) => {
    const { data, error } = await supabase
      .from('event_subjects')
      .select('subject_id, subjects(name, description)')
      .eq('event_id', event_id);
  
    console.log("📦 Raw Supabase data:", data);
    console.log("❌ Supabase error (if any):", error);
  
    if (error) throw error;
  
    // Check for null subject join
    const finalData = data.map(row => {
      if (!row.subjects) {
        console.warn(`⚠️ No subject info for subject_id ${row.subject_id}`);
      }
      return {
        id: row.subject_id,
        ...row.subjects
      };
    });
  
    return finalData;
  };
  
  