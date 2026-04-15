const AuthLayout = ({ children }) => {
  return (
    <div className='flex'>
        <div className="w-screen bg-[#0B1516] h-screen md:w-[40vw] px-12 pt-8 pb-12">
            <h2 className="text-lg text-primary font-semibold">Isinmi Hotel</h2>
            {children}
        </div>


        <div className="hidden md:block w-[60vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
            
        </div>
    </div>
  )
}

export default AuthLayout