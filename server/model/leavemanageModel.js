import mongoose from "mongoose"


const manageLeaveSchema= new mongoose.Schema({
    manageleave:[{
        type: mongoose.Schema.Types.ObjectId, ref: "leave"
    }],

    managedby: [
        {type: mongoose.Schema.Types.ObjectId, ref: "admin"
    }]
},{
    timestamps: true,
    versionKey: false
})


const leavemanagement= mongoose.model('leavemanagement', manageLeaveSchema)

export default leavemanagement