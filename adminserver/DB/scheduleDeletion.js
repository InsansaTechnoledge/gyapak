import cron from 'node-cron';
import Organization from '../models/OrganizationModel.js';
import EventType from '../models/EventTypeModel.js';
import Event from '../models/EventModel.js';

const scheduler=async()=>{
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily deletion task...');
        await watchDeletions();
    }, {
        scheduled: true,
        timezone: 'UTC',
    });
    console.log('Scheduler started...');

};
// Your event with an end_date of April 3rd will be deleted on April 5th at 5:30 AM IST.
const watchDeletions = async () => {
    try{
        console.log("👀 Watching for event deletions...");
        const oneDayAgo=new Date();
        oneDayAgo.setDate(oneDayAgo.getDate()-1);

        const expiredEvents=await Event.find({end_date:{$lt:oneDayAgo}});


        if(expiredEvents.length>0){
            console.log(`⚠️ Found ${expiredEvents.length} expired events. Deleting...`);
            for(const event of expiredEvents){
                await Organization.findOneAndUpdate(
                    { _id: event.organization_id },
                    { $pull: { events: event._id } }
                );
                await EventType.findOneAndUpdate(
                    { type: event.event_type },
                    { $pull: { events: event._id } }
                );
                await Event.deleteOne({ _id: event._id });
                console.log(`✅ Deleted expired event ${event._id} and cleaned up references.`);
        }

    }
}catch (error) {
    console.error(`❌ Error deleting event:`, error);

    }
};

export { watchDeletions,scheduler };
