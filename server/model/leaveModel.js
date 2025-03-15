import mongoose, { Schema } from "mongoose"

const leaveSchema = new Schema({
  
type: {
    type: String,
    enum:['Sick', 'Vacation', 'Casual'],
    
},
reason:{
    type: String
},
startDate:{
    type: Date,
    required: true
},
endDate:{
    type: Date,
    required: true
},
status:{
    type: String,
    enum:['pending', 'approved', 'rejected']
},
userId:{
    type: Schema.Types.ObjectId,ref: "employee",
    required: true
}
},{
    timestamps: true,
    versionKey: false
})


leaveSchema.pre('validate', function (next) {
    if (!this.type && !this.reason) {
        this.invalidate('type', 'Either type or reason is required.');
        this.invalidate('reason', 'Either type or reason is required.');
    }
    next();
});


const leave= mongoose.model("leave", leaveSchema);
export default leave;
