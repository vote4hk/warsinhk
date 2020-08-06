import React from "react"
import { useTranslation } from "react-i18next"
import { useMediaQuery } from "react-responsive"
import Carousel from "@components/atoms/Carousel"
import styled from "styled-components"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

import ImageZh1 from "@/images/banner/zh/dummies.png"
// import ImageZh2 from "@/images/banner/zh/searcher.png"
import ImageZh3 from "@/images/banner/zh/apple.png"
import ImageZh4 from "@/images/banner/zh/world.png"
// import ImageEn1 from "@/images/banner/en/searcher.png"
import ImageEn2 from "@/images/banner/en/world.png"

const CarouselContainer = styled.div`
  margin: 16px 0;
`

const CarouselCell = styled.img`
  width: 66%;
  max-width: 220px;
  height: 120px;
  margin-right: 12px;
`

export default props => {
  const { i18n } = useTranslation()

  const isMobile = useMediaQuery({ maxWidth: 960 })

  const bannerImages = {
    zh: [
      { img: ImageZh1, isExternal: true, url: "https://bit.ly/wars1001" },
      // { img: ImageZh2, isExternal: true, url: "http://bit.ly/2x7PctV" },
      { img: ImageZh3, isExternal: true, url: "http://bit.ly/3cLtKeL" },
      { img: ImageZh4, isExternal: false, url: "https://wars.vote4.hk/world" },
    ],
    en: [
      // { img: ImageEn1, isExternal: true, url: "http://bit.ly/2x7PctV" },
      {
        img: ImageEn2,
        isExternal: false,
        url: "https://wars.vote4.hk/en/world",
      },
      {
        img: ImageEn2,
        isExternal: false,
        url: "https://wars.vote4.hk/en/world",
      },
    ],
  }

  const bannerImagesArray =
    bannerImages[i18n.language].length < 4
      ? [...bannerImages[i18n.language], ...bannerImages[i18n.language]]
      : bannerImages[i18n.language]

  return (
    <CarouselContainer>
      <Carousel
        options={{
          autoPlay: false,
          wrapAround: true,
          adaptiveHeight: false,
          prevNextButtons: isMobile ? false : true,
          pageDots: false,
        }}
      >
        {bannerImagesArray.map((b, index) => (
          <CarouselCell
            key={index}
            onClick={() => {
              trackCustomEvent({
                category: "carousel_banner",
                action: "click",
                label: b.url,
              })
              window.open(b.url, b.isExternal ? "_blank" : "_self")
            }}
            src={b.img}
            alt=""
          />
        ))}
      </Carousel>
    </CarouselContainer>
  )
}
