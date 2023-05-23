import mongoose from 'mongoose';

const uri = "mongodb+srv://idoShimshi:Ishimshi1@cluster0.t9ihacb.mongodb.net/VideoMetadata?retryWrites=true&w=majority";

const videoSchema = new mongoose.Schema({
    postId: Number,
    videoPublicId: String,
    authorId: Number,
    uploadTime: Date
    });
const Video = mongoose.models.Video || mongoose.model('Video', videoSchema)

mongoose.set('strictQuery', false);
mongoose.connect(uri);

export const addVideoMetadata = async (postId: Number, public_id: string, authorId: Number) =>{

  const currentTime = new Date();
    const video = new Video({
    postId: postId,
    videoPublicId: public_id,
    authorId: authorId,
    uploadTime: currentTime
    })

    await video.save();

    // .then((result: any) => {
    // })
}

export const getPublicIds = async (postIds: number[]): Promise<{ [key: number]: string }> => {
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
  
    return result;
  };
  

export const deletePostMetadata = async (postId: number): Promise<string | null> => {
  try {
    const deletedVideo = await Video.findOneAndRemove({ postId: postId }).exec();

    if (deletedVideo) {
      return deletedVideo.videoPublicId;
    } else {
      console.log('Video metadata not found for deletion.');
      return null;
    }
  } catch (error) {
    console.error('Error deleting video metadata:', error);
    return null;
  }
};