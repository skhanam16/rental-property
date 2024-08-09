import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectValue,
    SelectItem,
    } from '@/components/ui/select';
    import { Label } from '@/components/ui/label';
    import { categories } from '@/utils/categories';

    const name = 'category';

    const CategoriesInput = ({defaultValue}:{defaultValue?:string}) => {
        return (
    <div className='mb-2'>
    <Label htmlFor={name} className="capitalize">Categories</Label>
    {/* root component select */}
    <Select defaultValue={defaultValue || categories[0].label} 
    name={name} required>
    <SelectTrigger id={name}>
        <SelectValue />
    </SelectTrigger>
    <SelectContent>{categories.map((item) => {
    return <SelectItem key={item.label} value={item.label}>
    <span className='flex items-center gap-2'>
       <item.icon /> {item.label}
        </span>
    </SelectItem>
    })}
    </SelectContent>
    </Select>
    </div>
      )
    }
    
    export default CategoriesInput;