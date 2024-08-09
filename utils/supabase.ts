import { createClient } from "@supabase/supabase-js";
const bucket = 'bucket-rental-property';
// set up supabase instance. it looking for 2 things URL and KEY. first url then key
// console.log(bucket);
const url = process.env.SUPABASE_URL as string;
const key = process.env.SUPABASE_KEY as string;
// console.log(url, 'and the key',  key);
const supabase = createClient(url, key);
//loking for image
export const uploadImage = async (image) => {
    const timestamp = Date.now();
    // const newName = `/users/${timestamp}-${image.name}`;
    const newName = `${timestamp}-${image.name}`;
  
    const { data } = await supabase.storage
      .from(bucket)
      .upload(newName, image, {
        cacheControl: '3600',
      });
    if (!data) throw new Error('Image upload failed');
    return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
  };
