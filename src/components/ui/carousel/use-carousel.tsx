
import * as React from "react"

type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement> | null
  api: any
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation?: "horizontal" | "vertical"
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

export { CarouselContext }
