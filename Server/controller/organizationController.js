import Authority from "../models/AuthorityModel.js";
import Organization from "../models/OrganizationModel.js";
import Category from "../models/CategoryModel.js";
import Event from "../models/EventModel.js";

// export const getCentralLogos = async (req, res) => {
//   try {
    
//     const centralAuthority = await Authority.findOne({type: "Central_Government"})

//     console.log("check" , centralAuthority);
    
//     if(!centralAuthority){
//       return res.status(200).json({'centralOrganizations':[]});
//     }
//     const centralOrganizationIds = centralAuthority.organizations;

//     const centralOrganizations = await Organization.find(
//       { _id: { $in: centralOrganizationIds } },
//       { _id: 1, abbreviation: 1, logo: 1 } // 1 to include fields, 0 to exclude
//     );


//     // Return the data to the frontend
//     res.status(200).json(centralOrganizations);
//   } catch (error) {
//     console.error("Error fetching logos:", error);
//     res.status(500).json({ error: "An error occurred while fetching logos." });
//   }
// };


// controller
export const getCentralLogos = async (req, res) => {
  try {
    // page & limit from query params, with safe defaults
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limitRaw = parseInt(req.query.limit, 10) || 8;
    const limit = Math.max(Math.min(limitRaw, 50), 1); // cap at 50 per page

    // 1) Get only the organizations array for Central_Government
    const centralAuthority = await Authority.findOne(
      { type: "Central_Government" },
      { organizations: 1, _id: 0 }
    ).lean();

    if (!centralAuthority || !centralAuthority.organizations?.length) {
      return res.status(200).json({
        data: [],
        total: 0,
        page,
        limit,
      });
    }

    const centralOrganizationIds = centralAuthority.organizations;
    const total = centralOrganizationIds.length;

    const start = (page - 1) * limit;
    const end = start + limit;

    // slice the ids for this page
    const pageIds = centralOrganizationIds.slice(start, end);

    // 2) Fetch organizations with logo for this page
    const orgs = await Organization.find(
      { _id: { $in: pageIds } },
      { _id: 1, abbreviation: 1, logo: 1 }
    ).lean();

    // keep order same as in pageIds
    const orgMap = new Map(orgs.map((o) => [o._id.toString(), o]));
    const orderedOrgs = pageIds
      .map((id) => orgMap.get(id.toString()))
      .filter(Boolean);

    return res.status(200).json({
      data: orderedOrgs,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching logos:", error);
    return res.status(500).json({
      error: "An error occurred while fetching central organizations.",
    });
  }
};






export const getOrganization = async (req, res) => {
  try {
    const Authorityname = req.params.name;
    const organization = await Organization.findOne({
      abbreviation: Authorityname,
    });

    if(!organization){
      return res.status(404).json({message: "Organization not found!"})
    }

    const eventIds = organization.events; // Array of event IDs

    // Fetch events using the array of IDs
    const events = await Event.find({
      _id: { $in: eventIds },
    });

    const categoryId = organization.category;
    
    const category = await Category.findOne({ _id: categoryId });

    const organizationIds = category.organizations;
    
    const relatedOrganizations = await Organization.find({
      _id: { $in: organizationIds },
    });

    res.status(201).json({organization,events,relatedOrganizations});
  } catch (err) {
    console.log(err)
  }
}

export const getMoreOrganization = async (req,res) => {
  const categoryId = req.params.category;

  const category = await Category.findOne({_id: categoryId});
  const organizationIds = category.organizations;

  const organizations = await Organization.find({
    _id: { $in: organizationIds}
  });

  res.status(201).json(organizations);

}

export const getCalendar = async (req,res) => {
  try{

    const id = req.params.id
    
    const response = await Organization.findById(id,{calendar : 1});
    return res.status(200).json(response);
  }
  catch(err){
    console.log(err)
    return res.status(400).json(err);
  }
}

export const getAllCalendars = async (req,res) => {
  try{
    const response = await Organization.find({calendar: { $exists: true } });
    if(response){
      return res.status(200).json(response);
    }
    else{
      return res.status(400).json({message: "No data found"})
    }
  }
  catch(err){
    console.log(err);
    return res.status(500).json({message: err.message});
  }
}

// GET /api/organization/all
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({}, { _id: 1, name: 1, abbreviation: 1, logo: 1 });
    res.status(200).json(organizations);
  } catch (err) {
    console.error("Error fetching all organizations:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrganizationByCategoryId = async (req, res)=>{
 try {
   const {categoryId} = req.params;
   const organizations = await Organization.find({category:categoryId});
   return res.status(200).json(organizations);
 } catch (err) {
    console.error("Error fetching organization by categoryID", err.message);
    return res.status(500).json({ message: "Internal server error" });
 }

  

}
