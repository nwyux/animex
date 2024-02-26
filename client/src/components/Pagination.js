import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination(props) {
    const { currentPage, setCurrentPage, totalPages } = props;
    const handleNextPage = () => {
        setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
    };
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
  return (
    <div className="flex justify-center items-center mt-4 p-2 my-4 text-xl">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className={`bg-gray-300 bg-opacity-50 backdrop-blur-lg rounded-full p-1 hover:bg-opacity-25`}>
          <ChevronLeft />
          </button>
          <label className="text-blanc mx-4">Page</label>
            <select className="bg-gray-300 bg-opacity-50 backdrop-blur-lg rounded-full p-1 hover:bg-opacity-25 mx-4 flex items-center justify-center" value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
                {[...Array(totalPages).keys()].map((x) => (
                    <option key={x + 1} value={x + 1} className=''>
                        {x + 1}
                    </option>
                ))}
            </select>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className='bg-gray-300 bg-opacity-50 backdrop-blur-lg rounded-full p-1 hover:bg-opacity-25'>
            <ChevronRight />
          </button>
        </div>
  )
}