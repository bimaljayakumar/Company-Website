export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export const getCloudinaryConfig = (dataConfig?: Partial<CloudinaryConfig>): CloudinaryConfig => {
  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  return {
    cloudName: (dataConfig?.cloudName || envCloudName).trim(),
    uploadPreset: (dataConfig?.uploadPreset || envUploadPreset).trim(),
  };
};

export const uploadToCloudinary = async (
  file: File,
  config: CloudinaryConfig
): Promise<string> => {
  const { cloudName, uploadPreset } = config;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary Cloud Name or Upload Preset. Please configure them in the Admin Panel settings or .env file.");
  }

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to upload to Cloudinary');
  }

  return data.secure_url;
};
