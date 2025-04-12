import { Slider } from "@/components/ui/slider"

interface PriceRangeFilterProps {
    priceRange: [number, number]
    onChange: (range: [number, number]) => void
}

export default function PriceRangeFilter({
    priceRange,
    onChange,
}: PriceRangeFilterProps) {
    const [min, max] = priceRange

    const handleSliderChange = (value: number[]) => {
        if (value.length === 2) {
            onChange([Math.max(0, value[0]), Math.max(0, value[1])])
        }
    }

    return (
        <div className='mb-4'>
            <h3 className='text-mutedSand text-sm mb-3 font-generalSans leading-5'>
                Price Range
            </h3>
            <div className='space-y-4'>
                <Slider
                    value={[min, max]}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={100}
                    step={1}
                    minStepsBetweenThumbs={1}
                    className='w-full'
                    aria-label='Price range slider'
                />
                <div className='flex justify-between'>
                    <span className='text-mutedSand text-sm font-generalSans'>
                        ${min}
                    </span>
                    <span className='text-mutedSand text-sm font-generalSans'>
                        ${max}
                    </span>
                </div>
            </div>
        </div>
    )
}
