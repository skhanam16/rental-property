import { fetchPropertyDetails, findExistingReview } from '@/utils/actions';
import { redirect } from 'next/navigation';
import BreadCrumbs from '@/components/properties/BreadCrumbs';
import FavoriteToggleButton from '@/components/card/FavoriteToggleButton';
import ShareButton from '@/components/properties/ShareButton';
import ImageContainer from '@/components/properties/ImageContainer';
import PropertyRating from '@/components/card/PropertyRating';
import PropertyDetails from '@/components/properties/PropertyDetails';
import UserInfo from '@/components/properties/UserInfo';
import { Separator } from '@/components/ui/separator';
import Description from '@/components/properties/Description';
import Amenities from '@/components/properties/Amenities';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import SubmitReview from '@/components/reviews/SubmitReview';
import PropertyReviews from '@/components/reviews/PropertyReviews';
import {auth} from '@clerk/nextjs/server';


const DynamicMap = dynamic(() => import('@/components/properties/PropertyMap'),
{
    ssr: false,
    loading: () => <Skeleton className='h-[400px] w-full' />,
}
);

const DynamicBookingWrapper = dynamic(
  () => import('@/components/booking/BookingWrapper'),
  {
    ssr: false,
    loading: () => <Skeleton className='h-[200px] w-full' />,
  }
);

async function PropertyDetailsPage({ params }: { params: { id: string } }) {
    const property = await fetchPropertyDetails(params.id);
    if(!property) redirect('/');
    const {baths,bedrooms,beds, guests} = property;
    const details = {baths,bedrooms,beds, guests};
    const firstName = property.profile.firstName;
    const profileImage = property.profile.profileImage;


    const { userId } = auth();
    const isNotOwner = property.profile.clerkId !== userId;
    const reviewDoesNotExist =
    userId && isNotOwner && !(await findExistingReview(userId, property.id));

    // console.log(property.bookings);

  return (

   <section>
        <BreadCrumbs name={property.name} />
        <header className='flex justify-between items-center mt-4'>
          <h1 className='text-4xl font-bold capitalize'>{property.tagline}</h1>
          <div className='flex items-center gap-x-4'>
    <ShareButton name={property.name} propertyId={property.id} />
    <FavoriteToggleButton propertyId={property.id} />
  </div>
          </header>
          <ImageContainer mainImage={property.image} name={property.name} />
          <section className='lg:grid lg:grid-cols-12 gap-x-12 mt-12'>
           <div className="lg:col-span-8">
            <div className="flex gap-x-4 items-center">
              <h1 className="text-xl font-bold">{property.name}</h1>
              <PropertyRating inPage propertyId={property.id} />
            </div>
             {/* property details */}
             <PropertyDetails  details={details} />
             {/* User info */}
             <UserInfo profile={{firstName, profileImage}} />
             <Separator className='mt-4'/>
            <Description  description={property.description}/>
            {/* amenities */}
            <Amenities amenities={property.amenities} />
            {/* dynamic map */}
            <DynamicMap countryCode={property.country} />
           </div>
           <div className="lg:col-span-4 flex flex-col items-center">
            {/* calender */}
            <DynamicBookingWrapper
            propertyId={property.id}
            price={property.price}
            bookings={property.bookings}
            />
           </div>
          </section>
           {/* after two column section */}
      {reviewDoesNotExist && <SubmitReview propertyId={property.id} />}
      <PropertyReviews propertyId={property.id} />
    </section>
  );
}

export default PropertyDetailsPage;


