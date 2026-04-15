import React from 'react'
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from 'react-icons/lu'
import { addThousandSeperator } from '../../utils/helper';



const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete }) => {
  return (
    <div className="group relative flex items-center gap-4 mt-2 p-1 md:p-3 rounded-lg hover:bg-gray-100/60">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
            {icon ? (
                <img src={icon} alt={title} className='w-6 h-6' />
            ) : (
                <LuUtensils />
            )}
        </div>

        <div className="flex-1 flex items-center  justify-between">
            <div className="">
                <p className="text-gray-700 text-[10px] md:text-sm font-medium">{title}</p>
                <p className="text-[10px] md:text-xs text-gray-400 mt-1">{date}</p>
            </div>

            <div className="flex item-center gap-2">
                {!hideDeleteBtn && (
                    <button className='text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer' onClick={onDelete}>
                        <LuTrash2 size={18} />
                    </button>
                )}

                <div className={`flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-md ${type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"}`}>
                    <h6 className='text-[10px] md:text-xs font-medium'>
                        {type === 'income' ? "+" : "-"} ₦{addThousandSeperator(amount)}
                    </h6>
                    {type === 'income' ? <LuTrendingUp /> : <LuTrendingDown /> }
                </div>
            </div>
        </div>
    </div>
    
  );
};

export default TransactionInfoCard