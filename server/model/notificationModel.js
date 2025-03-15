import mongoose, { Schema } from "mongoose"

const notificationSchema= new Schema({
    message :{
        type: String
    },
    type: {
        type: String,
        enum:["info", "warning"],
        default:"info"
    },
    date: {
        type: Date,
        default: Date.now
    },

    userId:{
        type: Schema.Types.ObjectId,ref: "Users"
        
    }
},{
    timestamps: true,
    versionKey: false
})
const nofication= mongoose.model("notification", notificationSchema)
export default nofication