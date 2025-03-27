import Organization from "../models/organization.model";
import Authority from "../models/authority.models";

export const getCentralLogos = async (req, res) => {
    try {
      
      const centralAuthority = await Authority.findOne({type: "Central_Government"})
  
      if(!centralAuthority){
        return res.status(200).json({'centralOrganizations':[]});
      }
      const centralOrganizationIds = centralAuthority.organizations;
  
      const centralOrganizations = await Organization.find(
        { _id: { $in: centralOrganizationIds } },
        { _id: 1, abbreviation: 1, name: 1} // 1 to include fields, 0 to exclude
      );
  
  
      // Return the data to the frontend
      res.status(200).json(centralOrganizations);
    } catch (error) {
      console.error("Error fetching logos:", error);
      res.status(500).json({ error: "An error occurred while fetching logos." });
    }
  };