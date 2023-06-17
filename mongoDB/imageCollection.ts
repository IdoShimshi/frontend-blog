import mongoose from 'mongoose';

const uri = "mongodb+srv://idoShimshi:Ishimshi1@cluster0.t9ihacb.mongodb.net/Blog?retryWrites=true&w=majority";

const imageSchema = new mongoose.Schema({
  userId: Number,
  imagePublicId: String,
});

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

mongoose.set('strictQuery', false);
mongoose.connect(uri);

export const addImageMetadata = async (userId, publicId) => {
  const image = new Image({
    userId,
    imagePublicId: publicId,
  });
  console.log(image)

  try {
    const savedImage = await image.save();
    console.log('Image metadata added:', savedImage);
  } catch (error) {
    console.error('Error adding image metadata:', error);
  }
};

export const getImagePublicIds = async (userIds) => {
  const result = {};

  try {
    const images = await Image.find({ userId: { $in: userIds } }).exec();

    userIds.forEach((userId) => {
      const image = images.find((img) => img.userId === userId);

      if (image && image.imagePublicId) {
        result[userId] = image.imagePublicId;
      } else {
        result[userId] = ''; // Set empty string if publicId is not found
      }
    });
  } catch (error) {
    console.error('Error retrieving image publicIds:', error);
  }

  return result;
};

export const deleteImageMetadata = async (userId) => {
  try {
    const deletedImage = await Image.findOneAndRemove({ userId }).exec();

    if (deletedImage) {
      console.log('Image metadata deleted:', deletedImage);
      return deletedImage.imagePublicId;
    } else {
      console.log('Image metadata not found for deletion.');
      return null;
    }
  } catch (error) {
    console.error('Error deleting image metadata:', error);
    return null;
  }
};