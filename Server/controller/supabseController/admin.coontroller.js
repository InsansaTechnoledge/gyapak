import { createExam, addSubjectsToExam } from "../../Utility/SQL-Queries/exam.query.js";
import { createSubjectQuery } from "../../Utility/SQL-Queries/subject.query.js";
import { createEvent, assignSubjectsToEvent } from "../../Utility/SQL-Queries/event.query.js";
import { APIError } from "../../Utility/ApiError.js";
import { APIResponse } from "../../Utility/ApiResponse.js";

export const createFullExamSetup = async (req, res) => {
  const trxLog = [];
  try {
    const { exam, subjects, event } = req.body;
    console.log(event);
    const createdExam = await createExam(exam);
    trxLog.push("Exam created");

    const examId = createdExam.id;

    const createdSubjects = [];
    for (const sub of subjects) {
      const created = await createSubjectQuery(sub.name, sub.description);
      createdSubjects.push({
        subject_id: created.id,
        weightage: sub.weightage,
        syllabus_id: sub.syllabus_id,
      });
    }
    trxLog.push("Subjects created");

    await addSubjectsToExam(examId, createdSubjects);
    trxLog.push("Subjects assigned to exam");

    const eventWithId = event.map(eve => ({
      ...eve,
      exam_id: examId
    }))
    // const eventPayload = {
    //   ...event,
    //   exam_id: examId,
    // };
    const createdEvent = await createEvent(eventWithId);
    trxLog.push("Event created");

    const eventId = createdEvent.id; 

    const subjectIds = event.subject_ids || createdSubjects.map(s => s.subject_id); 
    await assignSubjectsToEvent(eventId, subjectIds);
    trxLog.push("✅ Subjects assigned to event");

    return new APIResponse(
      200,
      {
        exam: createdExam,
        subjects: createdSubjects,
        event: createdEvent,
        log: trxLog,
      },
      "🎉 Full exam setup created successfully"
    ).send(res);
  } catch (e) {
    console.error("Failed full exam setup:", e);
    return new APIError(500, [e.message, "Failed full exam setup"]).send(res);
  }
};
