import Organization from "../models/OrganizationModel.js";
import Authority from "../models/AuthorityModel.js";

export const getCentralOrganization = async (req, res) => {
  try {

    const centralAuthority = await Authority.findOne({ type: "Central_Government" })
    if (!centralAuthority) {
      return res.status(200).json({ 'centralOrganizations': [] });
    }
    const centralOrganizationIds = centralAuthority.organizations;

    const centralOrganizations = await Organization.find(
      { _id: { $in: centralOrganizationIds } },
      { _id: 1, abbreviation: 1, name: 1 } // 1 to include fields, 0 to exclude
    );


    // Return the data to the frontend
    return res.status(200).json(centralOrganizations);
  } catch (error) {
    console.error("Error fetching logos:", error);
    res.status(500).json({ error: "An error occurred while fetching logos." });
  }
};

export const getOrganizationsByState = async (req, res) => {
  try {

    const state_id = req.query.stateId;

    const stateData = await Authority.findById(state_id);


    const organizationIds = stateData.organizations;

    const organizations = await Organization.find({
      _id: { $in: organizationIds }
    }, {
      name: 1,
      abbreviation: 1
    });

    res.status(200).json(organizations);
  }
  catch (err) {
    console.log(err);
  }
};

export const getAllOrganizations = async (req,res) => {
  try{

    const organizations = await Organization.find({},{
      _id: 1,
      name: 1,
      abbreviation: 1
    });


    return res.status(200).json({message: "Organizations fetched", organizations: organizations});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: err.message});
  }
}