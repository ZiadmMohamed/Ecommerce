import cloudinary from "../services/cloudinary.js";

const deleteFromCloudinary = async (req, res, next) => {
  if (req.filePath) {
    await cloudinary.api.delete_resources_by_prefix(
      `Ecommerce/categories/${category.customId}`
    );
    await cloudinary.api.delete_folder(
      `Ecommerce/categories/${category.customId}`
    );
  }
};
export default deleteFromCloudinary;
