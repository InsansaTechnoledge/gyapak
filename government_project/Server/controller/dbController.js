import { createAuthorityFunction } from "./authorityController.js";
import { createCategoryFunction } from "./categoryController.js";
import { addAllEvents, createEventTypeFunction } from "./eventController.js";
import { createOrganizationFunction } from "./organizationController.js";

export const updateFullDb = async () => {
    try{
        
    }catch (error) {
        console.log(`Error in updatedb: ${error.message}`);
        throw new Error(`Error in updatedb: ${error.message}`);
    }
};

export const createDb=async()=>{
    try{
        await createAuthorityFunction();
        console.log("Authorities created successfully");

        await createEventTypeFunction();
        console.log("EventTypes created successfully");

        await createCategoryFunction();
        console.log("Categories created successfully");

        await createOrganizationFunction();
        console.log("Organizations created successfully");

        await addAllEvents();
        console.log("Events created successfully");

    }catch(error){
        console.log(`Error in createDb: ${error.message}`);
        throw new Error(`Error in createDb: ${error.message}`);
    }
};