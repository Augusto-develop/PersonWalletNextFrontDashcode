
import { Rabbit } from 'lucide-react';
import React from 'react';


const EmptyLending= () => {
  return (
    <div className="">
      <Rabbit className=" h-[200px]  w-[200px] text-default-400 " strokeWidth={1} />
      <div className=' text-sm text-default-500 text-center'>No Lending</div>
    </div>
  );
};

export default EmptyLending;