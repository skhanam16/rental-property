import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type PriceInputProps = {
    defaultValue?: number;
  
}

const PriceInput = ({defaultValue}:PriceInputProps) => {
    // const {defaultValue} = props;
    const name = 'price';
  return (
    <div className='mb-2'>
    <Label htmlFor={name} className="capitalize">Price ($)</Label>
    <Input 
     id={name} 
     name={name} 
     type='number'
     min={0}
     defaultValue={defaultValue || 100} 
     required
     />
    </div>
  )
}

export default PriceInput;
