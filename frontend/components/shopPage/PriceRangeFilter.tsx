import { Slider } from "@/components/ui/slider"
import { useId } from "react"

interface PriceRangeFilterProps {
    priceRange: [number, number]
    onChange: (range: [number, number]) => void
    minPrice?: number
    maxPrice?: number
}

export default function PriceRangeFilter({
    priceRange,
    onChange,
    minPrice = 0,
    maxPrice = 100
}: PriceRangeFilterProps) {
    const [min, max] = priceRange
    const priceRangeId = useId()

    


    const handleSliderChange = (value: number[]) => {
        if (value.length === 2) {
            onChange([Math.max(minPrice, value[0]), Math.max(minPrice, value[1])])
        }
    }

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 
                    id={priceRangeId}
                    className="text-mutedSand text-sm font-generalSans leading-5">
                    Price Range
                </h3>
                <span className="text-mutedSand text-xs font-generalSans">
                    ${min} - ${max}
                </span>
            </div>
            <div className="space-y-4">
                <div className="relative pt-1 pb-3">
                    <Slider
                        value={[min, max]}
                        onValueChange={handleSliderChange}
                        min={minPrice}
                        max={maxPrice}
                        step={1}
                        minStepsBetweenThumbs={1}
                        className="w-full"
                        aria-labelledby={priceRangeId}
                        aria-valuemin={minPrice}
                        aria-valuemax={maxPrice}
                        aria-valuetext={`Price range from $${min} to $${max}`}
                    />
                    <div className="flex justify-between mt-1 px-1">
                        <span className="text-xs text-mutedSand">${minPrice}</span>
                        <span className="text-xs text-mutedSand">${maxPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
