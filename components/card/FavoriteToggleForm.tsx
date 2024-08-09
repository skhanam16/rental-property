'use client';

import { usePathname } from "next/navigation";
import FormContainer from "../form/FormContainer";
import { toggleFavoriteAction } from "@/utils/actions";
import { CardSubmitButton } from "../form/Buttons";

type FavoriteToggleFormProps = {
  propertyId: string;
  favoriteId: string | null;
}

const FavoriteToggleForm = ({favoriteId, propertyId} : FavoriteToggleFormProps) => {
  const pathName = usePathname();
  const toggleAction = toggleFavoriteAction.bind(null, {
    propertyId,
    favoriteId,
    pathName,
  } )
  return (
  <FormContainer action={toggleAction}>
    <CardSubmitButton isFavorite={favoriteId? true:false}/>
  </FormContainer>
  )
}

export default FavoriteToggleForm;
