
import * as React from "react"
import type { UseEmblaCarouselType } from "embla-carousel-react"

type CarouselApi = UseEmblaCarouselType[1]

// Define a more generic type that can work with both embla carousel and React refs
type EmblaViewportRefType = React.RefObject<HTMLElement | null> | ((instance: HTMLElement | null) => void) | null

type CarouselContextProps = {
  carouselRef: EmblaViewportRefType
  api: CarouselApi | null
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation?: "horizontal" | "vertical"
  opts?: any // Add the opts property to match what's being passed in index.tsx
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

export { CarouselContext, type CarouselApi, type EmblaViewportRefType }
