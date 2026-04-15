import React from 'react'
import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const Input = ({ value, onChange, placeholder, label, type }) => {
    const [showPassword, setshowPassword] = useState(false)

    const toggleShowPassword = () => {
        setshowPassword(!showPassword)
    }
  return (
    <div>
        <label className="text-[13px] text-slate-600">{label}</label>

        <div className="input-box">
            <input 
                type={type == 'password' ? showPassword ? 'text' : 'password' : type} 
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e)}
                className='w-full bg-transparent outline-none'
            />

            {type == 'password' && (
                <>
                    {showPassword ? (
                        <FaRegEyeSlash 
                            size={18}
                            className="text-slate-400 cursor-pointer"
                            onClick={() => toggleShowPassword()}
                        />
                    ) : (
                        <FaRegEye 
                            size={18}
                            className="text-slate-400 cursor-pointer"
                            onClick={() => toggleShowPassword()}
                        />
                    )}

                </>
            )}
        </div>
    </div>
  )
}

export default Input