import {Schema , model} from 'mongoose'

const AuthorSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Author name is required'],
      default: 'Insansa Techknowledge',
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      index: true
    },
    social: {
      twitter: String,
      linkedin: String,
      github: String
    }
  }, { _id: false });


const BlogSchema = new Schema ({
    title :{
        type: String,
        minlength: [3 , 'minimum length of the title shall be 3'],
        maxlength: [100 , 'maximum length of the title shall be 100'],
        required: [true, 'Title is required'],
        trim: true,
        index: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase:true,
        index: true
    },
    excerpt:{
        type: String,
        required: [true, 'Excerpt is required'],
        trim: true,
        maxlength: [500 , 'excerpt cannot be more that 500 characters']
    },
    content:{
        type: String,
        required: [true , 'content is required'],
        minlength:[100 , 'content shall be of minimum 100 character']
    },
    imageUrl:{
        type:String,
        default:''
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: AuthorSchema,
        required: true
    },
    readTime: {
        type: Number,
        min: 1,
        default: 5
    },
    featuredPost: {
        type: Boolean,
        default: false,
        index: true
    },

},
{ 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


BlogSchema.pre('validate', function(next) {
    // If slug is not provided, generate it from title
    if (!this.slug && this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
    }
    next();
  });
  
BlogSchema.virtual('formattedDate').get(function() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = this.createdAt;
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
});

BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ 'author.name': 1 });
BlogSchema.index({ status: 1, createdAt: -1 });

export const Blog = model('Blog' , BlogSchema);