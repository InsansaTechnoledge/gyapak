import Authority from "../models/AuthorityModel.js";
import Organization from "../models/OrganizationModel.js";
import Category from "../models/categoryModel.js";
import Event from "../models/EventModel.js";

export const getCentralLogos = async (req, res) => {
  try {
    
    const centralAuthority = await Authority.findOne({type: "Central_Government"})

    const centralOrganizationIds = centralAuthority.organizations;

    const centralOrganizations = await Organization.find(
      { _id: { $in: centralOrganizationIds } },
      { _id: 1, abbreviation: 1, logo: 1 } // 1 to include fields, 0 to exclude
    );


    // Return the data to the frontend
    res.status(200).json(centralOrganizations);
  } catch (error) {
    console.error("Error fetching logos:", error);
    res.status(500).json({ error: "An error occurred while fetching logos." });
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
