'use client';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';


const NavSearch = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  // console.log(pathName);
  const {replace} = useRouter();
  const [search, setSearch] = useState(searchParams.get('search')?.toString() || '');

  const handleSearch = useDebouncedCallback((value:string) =>{
const params = new URLSearchParams(searchParams);
  if(value){
    params.set('search', value);
    // here we have the value in the search
  }
  else{
  params.delete('search');
  }
  replace(`${pathName}?${params.toString()}`);
  },500);

  useEffect(() => {
    if(!searchParams.get('search')){
      setSearch('');
    }
  }, [searchParams.get('search')]);
  return (
   <Input 
   type='search' 
   placeholder="find a property..." 
   className='max-w-xs dark:bg-muted'
   value={search}
   onChange={(e) => {
    setSearch(e.target.value);
     handleSearch(e.target.value);
   }}
    />
  )
}

export default NavSearch;
