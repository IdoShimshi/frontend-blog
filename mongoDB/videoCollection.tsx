import mongoose from 'mongoose';

const uri = "mongodb+srv://idoShimshi:Ishimshi1@cluster0.t9ihacb.mongodb.net/Blog?retryWrites=true&w=majority";

const videoSchema = new mongoose.Schema({
    postId: Number,
    videoPublicId: String,
    });
const Video = mongoose.models.Video || mongoose.model('Video', videoSchema)

export const addVideoMetadata = async (postId: Number, public_id: string) =>{
    mongoose.set('strictQuery',false);
    await mongoose.connect(uri);

    const video = new Video({
    postId: postId,
    videoPublicId: public_id
    })
    console.log(video);
    video.save().then((result: any) => {
    console.log ("saved");
    mongoose.connection.close()
    })
}

export const getPublicIds = async (postIds: number[]): Promise<{ [key: number]: string }> => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri);
  
    const result: { [key: number]: string } = {};
  
    try {
      const videos = await Video.find({ postId: { $in: postIds } }).exec();
  
      postIds.forEach((postId: number) => {
        const video = videos.find((v: any) => v.postId === postId);
  
        if (video && video.videoPublicId) {
          result[postId] = video.videoPublicId;
        } else {
          result[postId] = ''; // Set empty string if publicId is not found
        }
      });
    } catch (error) {
      // Handle the error appropriately
      console.error('Error retrieving publicIds:', error);
    }
  
    mongoose.connection.close();
    return result;
  };
  