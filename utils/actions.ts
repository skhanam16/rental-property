'use server';
import { imageSchema, profileSchema, propertySchema, validateWithZodSchema, createReviewSchema } from "./schemas";
import db from './db';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from "./supabase";


// helper function
const getAuthUser = async () => {
  const user = await currentUser();
  if(!user) throw new Error('You must be logged in to access this route');
  if(!user.privateMetadata.hasProfile) redirect('/profile/create');
  return user;
};

// helper function
const renderError = (error:unknown):{message:string} =>{
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
}

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
  if(!user) throw new Error('Please login to create profile ');
    const rawData = Object.fromEntries(formData);
    // const validatedFields = profileSchema.parse(rawData);
    const validatedFields =validateWithZodSchema(profileSchema,rawData);
    const {firstName,lastName,username} = validatedFields;
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        firstName:firstName,
        lastName:lastName,
        username:username,
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
    // console.log(validatedFields);
    // return { message: 'Profile Created' };
  } catch (error) {
    console.log(error);
    return renderError(error);
  }
  redirect('/');
};

export const fetchProfileImage = async() => {
const user = await currentUser();
// console.log(user);
if(!user) return null;
const profile = await db.profile.findUnique({
  where: {
    clerkId:user.id,
  },
  select:{
    profileImage:true,
  },
});
return profile?.profileImage
};


export const fetchProfile = async () => {
 const user = await getAuthUser();
 const profile = await db.profile.findUnique({
  where: {
    clerkId:user.id,
  },
 });
 if(!profile) redirect('/profile/create');
 return profile;
};


export const updateProfileAction =  async (
  prevState:any, 
  formData:FormData
):Promise<{message:string}> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
  const validatedFields =validateWithZodSchema(profileSchema,rawData);
    await db.profile.update({
      where: {
        clerkId:user.id,
      },
      data:validatedFields,
    })
    revalidatePath('/profile');
    return {message: 'Profile updated successfully'};
  } catch (error) {
    console.log(error);
    return renderError(error);
  }

};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const image = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFields.image);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });
    revalidatePath('/profile');
    return { message: 'Profile image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};


export const createPropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get('image') as File;

    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const {name,tagline,price,category, description,country, guests,bedrooms,beds,baths,amenities} = validatedFields;
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image);

    await db.property.create({
      data:{
        name:name,
        tagline:tagline,
        price:price,
        category:category,
        description:description,
        country:country,
        guests:guests,
        bedrooms:bedrooms,
        beds:beds,
        baths:baths,
        amenities:amenities,
        image: fullPath,
        profileId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect('/');
};

export const fetchProperties =async ({search='', category}: {search?:string, category?:string}) => {
  const properties = await db.property.findMany({
    where: {
      category,
      OR: [
        {name: {contains:search, mode: 'insensitive'}},
        {tagline: {contains:search, mode: 'insensitive'}},
      ],
    },
    select: {
      id:true,
      name:true,
      tagline:true,
      country:true,
      price: true,
      image:true,
    },
    orderBy:{
      createdAt: 'desc',
    }
  });
  return properties;
};


export const fetchFavoriteId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};
export const toggleFavoriteAction = async (prevState:{
  propertyId:string;
  favoriteId:string | null;
  pathName:string;
}) => {
  const user = await getAuthUser();
  const {propertyId,favoriteId,pathName} =prevState;
  // console.log(user);
  try {
    if(favoriteId){
      await db.favorite.delete({
      where:{
        id:favoriteId,
      }
      })
    }
    else{
      await db.favorite.create({
        data:{
          propertyId,
          profileId:user.id,
        }
      })
    }
    revalidatePath(pathName);
    return {message:favoriteId ?  'Added to the faves' : 'Added to the faves'};
  } catch (error) {
    return renderError(error);
    
  }
  // console.log(propertyId, 'and ' , favoriteId, ' ', pathName);
  // return { message: 'toggle favorite' };
};

export const fetchFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          price: true,
          country: true,
          image: true,
        },
      },
    },
  });
  return favorites.map((favorite) => favorite.property);
};


export const fetchPropertyDetails = (id:string) => {
return db.property.findUnique({
  where: {
    id:id,
  },
  include: {
    profile: true,
    bookings: {
      select: {
        checkIn: true,
        checkOut: true,
      },
    },
  },
});
};

export async function createReviewAction(prevState: any, formData: FormData) {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(createReviewSchema, rawData);
    const {propertyId, rating, comment} = validatedFields;
    await db.review.create({
      data: {
        propertyId,
        rating,
        comment,
        profileId: user.id,
      },
    });
    revalidatePath(`/properties/${validatedFields.propertyId}`);
    return { message: 'Review submitted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchPropertyReviews = async (propertyId: string) => {
  const reviews = await db.review.findMany({
    where: {
      propertyId,
    },
    select: {
      id:true,
      rating:true,
      comment: true,
      profile: {
        select: {
        firstName:true,
        profileImage:true,
        },
      },
    },

    orderBy:{
      createdAt:'desc',
    }
  });
return reviews;
};

export const fetchPropertyReviewsByUser = async () => {
  const user =  await getAuthUser();
  const reviews = await db.review.findMany({
    where: {
      profileId:user.id,
    },
    select:{
      id:true,
      rating:true,
      comment:true,
      property:{
        select:{
          name:true,
          image:true,
        },
      },
    },
  });
  return reviews;
};

export const deleteReviewAction = async (prevState:{reviewId:string}) => {
  const {reviewId} = prevState;
  const user =  await getAuthUser();
  try {
    await db.review.delete({
      where:{
        id:reviewId,
        profileId:user.id,
      },
    });
    revalidatePath('/reviews');
      return { message: 'Review deleted successfully' };
  } catch (error) {
    return renderError(error);
  }

};


export async function fetchPropertyRating(propertyId:string){
  const result = await db.review.groupBy({
    by:['propertyId'],
    _avg:{
      rating:true
    },
    _count:{
      rating:true
    },
    where:{
     propertyId,
    },
  });

  return {
    // if result exits then we grab the _avg.rating, then check it again if it does exists then go for
    // then if it no the case then we go for 0
    //then we structure the same thing for count
    rating: result[0]?._avg.rating?.toFixed() ?? 0,
    count: result[0]?._count.rating ?? 0,
  }
};

export const findExistingReview = async (
  userId: string,
  propertyId: string
) => {
  return db.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId,
    },
  });
};