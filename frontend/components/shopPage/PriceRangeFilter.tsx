// PriceRangeFilter.tsx
interface PriceRangeFilterProps {
    priceRange: [number, number]
    onChange: (range: [number, number]) => void
}

export default function PriceRangeFilter({
    priceRange,
    onChange,
}: PriceRangeFilterProps) {
    const [min, max] = priceRange

    return (
        <div className='mb-4'>
            <h3 className='text-mutedSand text-sm mb-3 font-generalSans leading-5'>
                Price Range
            </h3>
            <div className='flex items-center'>
                <input
                    type='number'
                    value={min}
                    onChange={(e) =>
                        onChange([parseInt(e.target.value) || 0, max])
                    }
                    className='font-generalSans bg-slightlyLightGrey border border-darkMocha rounded-[4px] px-3 py-2.5 text-mutedSand placeholder-mutedSand w-[100px] h-9'
                    placeholder='Min'
                    aria-label='Minimum price'
                />
                <span className='text-mutedSand mx-2'>to</span>
                <input
                    type='number'
                    value={max}
                    onChange={(e) =>
                        onChange([min, parseInt(e.target.value) || 100])
                    }
                    className='font-generalSans bg-slightlyLightGrey border border-darkMocha rounded-[4px] px-3 py-2.5 text-mutedSand placeholder-mutedSand w-[100px] h-9'
                    placeholder='Max'
                    aria-label='Maximum price'
                />
            </div>
        </div>
    )
}
