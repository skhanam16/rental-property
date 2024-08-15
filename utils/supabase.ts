import { createClient } from "@supabase/supabase-js";
const bucket = 'bucket-rental-property';

const url = process.env.SUPABASE_URL as string;
const key = process.env.SUPABASE_KEY as string;

const supabase = createClient(url, key);

export const uploadImage = async (image) => {
    const timestamp = Date.now();
  
    const newName = `${timestamp}-${image.name}`;
  
    const { data } = await supabase.storage
      .from(bucket)
      .upload(newName, image, {
        cacheControl: '3600',
      });
    if (!data) throw new Error('Image upload failed');
    return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
  };
