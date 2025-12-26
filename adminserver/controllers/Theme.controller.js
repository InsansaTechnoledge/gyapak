import Theme from "../models/Theme.js";

export const GetActiveTheme = async (req,res) => {
    try{
        const theme = await Theme.findOne({ isActive: true }).lean();
        return res.json({ success: true, theme: theme || null });

    } catch (e) {
        return res.status(500).json({message: 'something went wrong' , error: e?.message})
    }
}

export const ListAllThemes = async (req , res) => {
    try{
        const themes = await Theme.find().sort({ updatedAt: -1 }).lean();
        return res.json({ success: true, themes });

    } catch (e) {
        return res.status(500).json({message: 'something went wrong' , error: e?.message})
    }
}

const sanitizeVars = (vars = {}) => {
    const out = {};
    for (const [k, v] of Object.entries(vars || {})) {
      if (!k.startsWith("--")) continue;        
      if (typeof v !== "string") continue;      
      out[k] = v.trim();
    }
    return out;
  };

export const UpsertTheme = async (req,res) => {
    try{
        const slug = String(req.params.slug || "").toLowerCase().trim();
        const { name, vars } = req.body || {};

        if (!slug) return res.status(400).json({ success: false, message: "slug required" });

        const payload = {
            ...(name ? { name: String(name).trim() } : {}),
            ...(vars ? { vars: sanitizeVars(vars) } : {}),
        };

        const theme = await Theme.findOneAndUpdate(
            { slug },
            { $set: payload, $setOnInsert: { slug, isActive: false } },
            { new: true, upsert: true }
        ).lean();

        return res.json({ success: true, theme });

    } catch (e) {
        return res.status(500).json({message: 'something went wrong' , error: e?.message})
    }
}

export const ActivateTheme = async (req,res) => {
    try{
        const { id } = req.params;

        const theme = await Theme.findById(id);
        if (!theme) return res.status(404).json({ success: false, message: "Theme not found" });

        await Theme.updateMany({ isActive: true }, { $set: { isActive: false } });
        theme.isActive = true;
        await theme.save();

        return res.json({ success: true, theme });

    } catch (e) {
        return res.status(500).json({message: 'something went wrong' , error: e?.message})
    }
}

export const DeleteTheme = async (req,res) => {
    try{
        await Theme.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (e) {
        return res.status(500).json({message: 'something went wrong' , error: e?.message})
    }
}

export const PostThemes = async (req,res) => {
    try {
        const { name, slug, isActive = false, vars = {} } = req.body || {};
    
        if (!name || !slug) {
          return res.status(400).json({
            success: false,
            message: "name and slug are required",
          });
        }
    
        // sanitize vars (only allow CSS vars starting with -- and string values)
        const cleanVars = {};
        for (const [k, v] of Object.entries(vars || {})) {
          if (typeof k === "string" && k.startsWith("--") && typeof v === "string") {
            cleanVars[k] = v.trim(); // expects "124 58 237"
          }
        }
    
        // If activating, deactivate others first (only one active theme)
        if (isActive === true) {
          await Theme.updateMany({ isActive: true }, { $set: { isActive: false } });
        }
    
        // Create theme
        const theme = await Theme.create({
          name: String(name).trim(),
          slug: String(slug).toLowerCase().trim(),
          isActive: Boolean(isActive),
          vars: cleanVars,
        });
    
        return res.status(201).json({ success: true, theme });
      } catch (err) {
        // handle duplicate slug
        if (err?.code === 11000) {
          return res.status(409).json({
            success: false,
            message: "slug already exists (must be unique)",
          });
        }
        return res.status(500).json({ success: false, message: err?.message || "Server error" });
      }
}