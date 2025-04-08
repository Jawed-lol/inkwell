export default function Settings() {
    return (
        <div className='max-w-2xl mx-auto bg-deepGray p-4 rounded-lg shadow-lg'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 text-center md:text-left text-warmBeige'>
                Account Settings
            </h2>
            <form className='space-y-4'>
                <div>
                    <label className='block text-mutedSand text-sm sm:text-base mb-1'>
                        Name
                    </label>
                    <input
                        type='text'
                        className='w-1/2 p-2 bg-slightlyLightGrey border border-darkMocha rounded text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber'
                        placeholder='Your Name'
                    />
                </div>
                <div>
                    <label className='block text-mutedSand text-sm sm:text-base mb-1'>
                        Email
                    </label>
                    <input
                        type='email'
                        className='w-1/2 p-2 bg-slightlyLightGrey border border-darkMocha rounded text-warmBeige focus:outline-none focus:ring-2 focus:ring-burntAmber'
                        placeholder='Your Email'
                    />
                </div>
                <button
                    type='submit'
                    className='w-full sm:w-auto px-4 py-2 bg-burntAmber text-accentText rounded hover:bg-deepCopper transition-colors'>
                    Save Changes
                </button>
            </form>
        </div>
    )
}
