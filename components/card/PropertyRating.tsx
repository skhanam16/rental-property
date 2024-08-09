import {FaStar} from 'react-icons/fa';

const PropertyRating = ({
  propertyId, 
  inPage
}: {
  propertyId:string;
  inPage:boolean;
}) => {

  //temporay later we will add some logic
  const rating = 4.7;
  const count = 100;
  const classNmae = `flex gap-1 items-center ${inPage? 'text-md' : 'text-xm'}`;
  const countText = count > 1 ? 'reviews' : 'review';
  const countValue = `(${count}) ${inPage ? countText : ''}`

  return (
   <span className={classNmae}>
   <FaStar className='w-3 h-3' />
   {rating} {countValue}
   </span>
  )
}

export default PropertyRating;
