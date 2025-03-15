import Designation from "../model/designationModel.js";
import mongoose from "mongoose"

const designationControl={
    addDesignation:async(req,res)=>{
        try{
            const { title, description, level}= req.body
            if(!title || !description, !level){
                return res.status(400).json({msg: "please enter valid data"})
            }

            const newDesignation= new Designation({
                title,
                description,
                level
              
            })

            await newDesignation.save()
            res.status(201).json({msg: "new designation created"})
        }catch(err){
            return res.status(500).json({msg: "internal server error"})
        }
    },
    fetchDesignation: async(req,res)=>{
        try{
            const getDesignation= await Designation.find().select('title')
            if(!getDesignation ){
                return res.status(400).json({msg: "no designation created"})
            }
            res.status(200).json({msg: "founded", getDesignation})
        }catch(err){
            return res.status(500).json({msg: "server error "})
        }
    }
}
export default designationControl