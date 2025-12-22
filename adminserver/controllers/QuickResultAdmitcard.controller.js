import { QuickResultAdmitCard } from "../models/QuickResultAdmitCard.model.js";

export const AddResultAdmitCard = async (req, res) => {
    try{

        const { kind , title , link , description , resultDate , isTentative } = req.body;

        if(!kind , !title , !link , !description , !resultDate) {
            return res.status(400).json({
                message: 'All fields are required (except Tentative status)'
            })
        }

        const data = new QuickResultAdmitCard({
            kind,
            title,
            link,
            description,
            resultDate,
            isTentative
        })

        await data.save();

        res.status(201).json({
            message: 'Data added successfully',
            data
        })

    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong',
            error: e.message
        })
    }
}

export const GetsultResultsAdmitcards = async (req, res) => {
    try{

        const data = await QuickResultAdmitCard.find().sort({createdAt : -1});

        res.status(200).json({
            message: 'Data fetched successfully',
            data
        })

    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong while fethching the results/admitcards',
            error: e.message
        })
    }
}