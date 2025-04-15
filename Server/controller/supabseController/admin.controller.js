// import { createExam, addSubjectsToExam } from "../../Utility/SQL-Queries/exam.query.js";
// import { createSubjectQuery } from "../../Utility/SQL-Queries/subject.query.js";
// import { createEvent, assignSubjectsToEvent } from "../../Utility/SQL-Queries/event.query.js";
// import { APIError } from "../../Utility/ApiError.js";
// import { APIResponse } from "../../Utility/ApiResponse.js";

// export const createFullExamSetup = async (req, res) => {
//   const trxLog = [];

//   try {
//     const { exam, subjects, events } = req.body;

//     // Step 1: Create Exam
//     const createdExam = await createExam(exam);
//     trxLog.push("Exam created");
//     const examId = createdExam.id;

//     // Step 2: Create Subjects and preserve frontend_id
//     const createdSubjects = [];

//     for (const sub of subjects) {
//       const created = await createSubjectQuery(sub.name, sub.description);
//       // const created = await createSubjectQuery(sub.name, sub.description, sub.weightage, sub.syllabus_id);

//       createdSubjects.push({
//         subject_id: created.id,
//         frontend_id: sub.frontend_id,     
//         weightage: sub.weightage,
//         syllabus_id: sub.syllabus_id
//       });
//     }

//     trxLog.push("Subjects created"); 

//     // Step 3: Assign Subjects to Exam
//     await addSubjectsToExam(examId, createdSubjects);
//     trxLog.push("Subjects assigned to exam");

//     // Step 4: Create Events and assign mapped subjects
//     const eventResults = [];

//     for (const event of events) {
//       const { subjects: frontendSubjectIds = [], ...eventPayload } = event;

//       const createdEvent = await createEvent({
//         ...eventPayload,
//         exam_id: examId
//       });

//       trxLog.push(`Event created: ${createdEvent.name}`);


//       const subjectsToAssign = frontendSubjectIds.length > 0
//         ? createdSubjects
//             .filter(s => frontendSubjectIds.includes(s.frontend_id))
//             .map(s => s.subject_id)
//         : createdSubjects.map(s => s.subject_id); 

//       await assignSubjectsToEvent(createdEvent.id, subjectsToAssign);
//       trxLog.push(`Subjects assigned to event ${createdEvent.name}`);

//       eventResults.push(createdEvent);
//     }

//     // Final Response
//     return new APIResponse(
//       200,
//       {
//         exam: createdExam,
//         subjects: createdSubjects,
//         events: eventResults,
//         log: trxLog
//       },
//       "Full exam setup created successfully"
//     ).send(res);

//   } catch (e) {
//     console.error("Failed full exam setup:", e);
//     return new APIError(500, [e.message, "Failed full exam setup"]).send(res);
//   }
// };


import { createExam, addSubjectsToExam } from "../../Utility/SQL-Queries/exam.query.js";
import { createSubjectQuery } from "../../Utility/SQL-Queries/subject.query.js";
import { createEvent, assignSubjectsToEvent } from "../../Utility/SQL-Queries/event.query.js";
import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";

export const createFullExamSetup = async (req, res) => {
  const trxLog = [];

  try {
    const { exam, subjects, events } = req.body;

    console.log("📥 Received Exam Payload:", exam);
    console.log("📥 Received Subjects Payload:", subjects);
    console.log("📥 Received Events Payload:", events);

    // Step 1: Create Exam
    const createdExam = await createExam(exam);
    const examId = createdExam.id;
    trxLog.push("Exam created");
    console.log("✅ Exam Created:", createdExam);

    // Step 2: Create Subjects and preserve frontend_id
    const createdSubjects = [];

    for (const sub of subjects) {
      const created = await createSubjectQuery(sub.name, sub.description);
      createdSubjects.push({
        subject_id: created.id,
        frontend_id: sub.frontend_id
      });
      console.log(`✅ Created Subject [${sub.name}] => ID: ${created.id}`);
    }

    trxLog.push("Subjects created");
    console.log("📦 All Subjects Created:", createdSubjects);

    
    // Step 3: Map frontend_id to prepare exam_subjects
    const subjectsToAssign = createdSubjects.map(cs => {
      const frontendSub = subjects.find(s => s.frontend_id === cs.frontend_id);
      return {
        subject_id: cs.subject_id,
        weightage: frontendSub.weightage,
        syllabus: frontendSub.syllabus_id || ''
      };
    });

    await addSubjectsToExam(examId, subjectsToAssign);
    trxLog.push("Subjects assigned to exam");
    console.log("📌 Subjects Assigned to Exam:", subjectsToAssign);

    // Step 4: Create Events and assign mapped subjects
    const eventResults = [];

    for (const event of events) {
      const { subjects: frontendSubjectIds = [], ...eventPayload } = event;

      const createdEvent = await createEvent({
        ...eventPayload,
        exam_id: examId
      });

      trxLog.push(`Event created: ${createdEvent.name}`);
      console.log("✅ Created Event:", createdEvent);

      console.log("✌🏻 frontendId" , frontendSubjectIds)
      const subjectsToLink = frontendSubjectIds.length > 0
        ? createdSubjects
            .filter(s => frontendSubjectIds.includes(s.frontend_id))
            .map(s => s.subject_id)
        : createdSubjects.map(s => s.subject_id);

      console.log(`🔗 Subjects to assign to event "${createdEvent.name}":`, subjectsToLink);

      await assignSubjectsToEvent(createdEvent.id, subjectsToLink);
      trxLog.push(`Subjects assigned to event ${createdEvent.name}`);
      console.log(`✅ Subjects assigned to event "${createdEvent.name}"`);

      eventResults.push(createdEvent);
    }

    // Final Response
    console.log("✅ Exam Setup Completed Successfully");
    return new APIResponse(
      200,
      {
        exam: createdExam,
        subjects: subjectsToAssign,
        events: eventResults,
        log: trxLog
      },
      "Full exam setup created successfully"
    ).send(res);

  } catch (e) {
    console.error("❌ Failed full exam setup:", e);
    return new APIError(500, [e.message, "Failed full exam setup"]).send(res);
  }
};
