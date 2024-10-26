const mongoose = require('mongoose');
// const { modelName } = require('./Like');

const friendshipSchema = new mongoose.Schema({
    from_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type:String,
        require:true,
        enum:['pending', 'accepted', 'rejected']
    }
},
    {
        timestamps: true
    }
);

export default mongoose.models.Friendship ||  mongoose.model('Friendship',friendshipSchema);




