import { APIError } from "../../Utility/ApiError.js"
import { APIResponse } from "../../Utility/ApiResponse.js";
import { getAllSubjectsQuerry , createSubjectQuery, updateSubjectQuery, deleteSubjectQuery } from "../../Utility/SQL-Queries/subject.query.js";

export const CreateSubject = async (req , res) => {
    try{

        const {name , description } = req.body;

        const data = await createSubjectQuery(name , description);

        return new APIResponse(200, data , 'successfully created all the subjects').send(res);

    } catch(e) {
        return new APIError(500 , [e.message, 'there was an error creating the subjects']).send(res);
    }
}

export const GetAllSubjects = async (req , res) => {
    try{
        const data = await getAllSubjectsQuerry();
        if(!data || data.lenght === 0) return new APIError(404, ['no subjects found' ]).send(res);

        return new APIResponse(200, data , 'successfully fetched all the subjects').send(res);

    } catch(e) {
        return new APIError(500, [e.message, 'there was an error getting all the subjects']).send(res);
    }
}

export const UpdateSubject = async (req , res) => {
    try{   
        const {id} = req.params;
        const {name , description} = req.body;

        if(!id) return new APIError(400 , ['id is required']).send(res);
        const data = await updateSubjectQuery(id , name , description);
        if(!data) return new APIError(404, [' subject not found']).send(res);

        return new APIResponse(200 , data , 'successfully update the subjects').send(res);
    } catch(e) {
        return new APIError(500, [e.message, 'there was an error updating the subjects']).send(res);
    }
}

export const DeleteSubject = async (req , res) => {
    try{
        const {id} = req.params;
        if(!id) return new APIError(400 , ['id is required']).send(res);
        const data = await deleteSubjectQuery(id);
        if(!data) return new APIError(404, [' subject not found']).send(res);
        
        return new APIResponse(200, 'deleted successfully').send(res);
    } catch(e) {
        return new APIError(500, [e.message, 'there was an error deleting the subject']).send(res);
    }
}