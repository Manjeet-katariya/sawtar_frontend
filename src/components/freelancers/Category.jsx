import React from 'react'
import CategoryCards from './CategoryCards'
import Toast from '../Toast'
import { useEffect ,useState } from 'react'
import AIRecommendationModal from './AIRecommendationModal '

const Category = () => {
   const [showModal, setShowModal] = useState(false);
    useEffect(() => {
      setShowModal(true);
    }, []);
  
  return (
<>



<CategoryCards/>

{/* <Toast/> */}
 <AIRecommendationModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
      />

</>  )
}

export default Category