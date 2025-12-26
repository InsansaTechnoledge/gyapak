import { APIError } from "../../Server/Utility/ApiError.js";
import { APIResponse } from "../../Server/Utility/ApiResponse.js";
import userActivity from "../models/activity.model.js";
import FAQ from "../models/FAQ.model.js";

export const getAllFAQs = async (req, res) => {
  try {
    // Fetch all FAQs without any filters
    const faqs = await FAQ.find({}).sort({ createdAt: -1 });

    return new APIResponse(200, faqs, "Fetched all FAQs successfully").send(
      res
    );
  } catch (e) {
    return new APIError(500, "Something went wrong").send(res);
  }
};

export const getFaqFromQuestion = async (req, res) => {
  try {
    const { question } = req.params;
    console.log(question);
    const faq = await FAQ.findOne({ question: question });
    return new APIResponse(200, faq, "fetched").send(res);
  } catch (err) {
    console.log(err);
    return new APIError(500, ["unable to fetch FAQ"]).send(res);
  }
};

export const getFAQsFromOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { state, category, seoTag } = req.query;

    const query = {
      organizationId: orgId,
    };

    if (state && state !== "All") {
      query.state = state;
    }

    if (category) {
      query.categories = category;
    }

    if (seoTag) {
      query.seoTags = seoTag;
    }

    const faqs = await FAQ.find(query).sort({ createdAt: -1 });

    console.log(faqs);

    return new APIResponse(200, faqs, "fetched successfully").send(res);
  } catch (e) {
    return new APIError(500, "something went wrong").send(res);
  }
};

export const postFAQ = async (req, res) => {
  try {
    const {
      question,
      answer,
      categories,
      state,
      seoTags,
      organizationId,
      totalTime,
    } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required." });
    }
    const newFAQ = new FAQ({
      question,
      answer,
      categories,
      state,
      seoTags,
      organizationId,
    });

    await newFAQ.save();

    const newUserActivity = new userActivity({
      userId: req.user.id,
      event: {
        eventType: "FAQ",
        eventId: newFAQ._id,
        eventStamp: {
          title: newFAQ.question ? newFAQ.question : " ",
        },
        action: "created",
        totalTime: Number(totalTime),
      },
    });
    await newUserActivity.save();
    new APIResponse(200, newFAQ, "FAQ created successfully").send(res);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    new APIError(500, "Internal server error").send(res);
  }
};

export const deleteFAQ = async (req, res) => {
  const { id } = req.params;
  const { time } = req.query;
  try {
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) {
      new APIError(404, "FAQ not found").send(res);
    }
    const newUserActivity = userActivity({
      userId: req.user.id,
      event: {
        eventType: "FAQ",
        eventId: faq._id,
        action: "deleted",
        eventStamp: {
          title: faq.question,
        },
        totalTime: Number(time),
      },
    });
    await newUserActivity.save();
    new APIResponse(200, faq, "FAQ deleted successfully").send(res);
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    new APIError(500, "Internal server error").send(res);
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { time } = req.query;
    const { question, answer, categories, state, seoTags, organizationId } =
      req.body;

    // Find and update the FAQ
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      {
        question,
        answer,
        categories,
        state,
        seoTags,
        organizationId,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedFAQ) {
      return new APIError(404, "FAQ not found").send(res);
    }
    const newUserActivity = new userActivity({
      userId: req.user.id,
      event: {
        eventType: "FAQ",
        eventId: updatedFAQ._id,
        eventStamp: {
          title: updateFAQ.question ?? " ",
        },
        action: "updated",
        totalTime: Number(time),
      },
    });
    await newUserActivity.save();

    return new APIResponse(200, updatedFAQ, "FAQ updated successfully").send(
      res
    );
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return new APIError(500, "Internal server error").send(res);
  }
};

export const getStateEnums = async (req, res) => {
  try {
    const stateEnums = FAQ.schema.path("state").enumValues;
    return new APIResponse(
      200,
      stateEnums,
      "State options fetched successfully"
    ).send(res);
  } catch (error) {
    console.error("Error fetching state enums:", error);
    return new APIError(500, "Unable to fetch state options").send(res);
  }
};
