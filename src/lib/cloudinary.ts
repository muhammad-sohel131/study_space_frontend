import { useAuthStore } from '@/store/useAuthStore';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const token = useAuthStore.getState().token;
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUDINARY_API_URL}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    }
  );
  console.log('Cloudinary response:', response);
  if (!response.ok) {
    throw new Error('Failed to upload image to backend');
  }

  const data = await response.json();
  return data.url;
};
