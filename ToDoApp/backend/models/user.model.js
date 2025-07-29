import {model, Schema} from 'mongoose';

const userSchema = new Schema(
    {
    firstName: { 
        type: String, 
        required: true 
        },

    lastName: { 
        type: String, 
        required: true 
        },
    email: { 
        type: String, 
        required: true, unique: true 
        },
    password: { 
        type: String, required: true 
    },
}, 
{ timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model("User", userSchema);

export default User 