"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

type CarouselContextValue = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used inside <Carousel />");
  return context;
}

type CarouselProps = React.ComponentProps<"div"> & {
  opts?: CarouselOptions;
  setApi?: (api: CarouselApi) => void;
};

function Carousel({ opts, setApi, className = "", children, ...props }: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(opts);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const syncControls = React.useCallback((carouselApi: NonNullable<CarouselApi>) => {
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!api) return;
    setApi?.(api);
    const frame = window.requestAnimationFrame(() => syncControls(api));
    api.on("reInit", syncControls).on("select", syncControls);
    return () => {
      window.cancelAnimationFrame(frame);
      api.off("reInit", syncControls).off("select", syncControls);
    };
  }, [api, setApi, syncControls]);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  const onKeyDownCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  };

  return (
    <CarouselContext.Provider value={{ carouselRef, api, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
      <div
        className={`carousel ${className}`.trim()}
        role="region"
        aria-roledescription="carousel"
        onKeyDownCapture={onKeyDownCapture}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className = "", ...props }: React.ComponentProps<"div">) {
  const { carouselRef } = useCarousel();
  return (
    <div className="carousel-viewport" ref={carouselRef}>
      <div className={`carousel-content ${className}`.trim()} {...props} />
    </div>
  );
}

function CarouselItem({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={`carousel-item ${className}`.trim()}
      {...props}
    />
  );
}

function CarouselPrevious({ className = "", children, ...props }: React.ComponentProps<"button">) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button type="button" className={className} onClick={scrollPrev} disabled={!canScrollPrev} {...props}>
      {children}
    </button>
  );
}

function CarouselNext({ className = "", children, ...props }: React.ComponentProps<"button">) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <button type="button" className={className} onClick={scrollNext} disabled={!canScrollNext} {...props}>
      {children}
    </button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
};
