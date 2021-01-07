import React, { useState, useEffect, Fragment, useLayoutEffect } from "react"
import { useMediaQuery } from "@material-ui/core"
import { bps } from "@/ui/theme"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import debounce from "lodash/debounce"

const InfiniteScroll = ({ list, onItem, step, Wrapper = Fragment }) => {
  const { mobile = 5, desktop = 10, preload = 5 } = step
  const { i18n } = useTranslation()
  const isMobile = useMediaQuery(bps.down("md"))
  const [itemSize, setItemSize] = useState(preload)
  const [loadMore, setLoadMore] = useState(false)
  const [elements, setElements] = useState([])
  const [internalCount, inc] = useState(0)
  useEffect(() => {
    if (!loadMore) return
    const increment = isMobile ? mobile : desktop
    setItemSize(size => size + increment)
  }, [loadMore, isMobile, mobile, desktop])
  useEffect(() => {
    setElements(elements => {
      for (let i = 0; i < Math.min(elements.length, list.length, itemSize); i++)
        elements[i] = onItem(list[i], i)
      inc(i => i + 1)
      return elements
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, list, setElements, inc, onItem])
  useLayoutEffect(() => {
    setElements(elements => {
      for (let i = elements.length; i < list.length && i < itemSize; i++) {
        elements.push(onItem(list[i], i))
        inc(i => i + 1)
      }
      return elements
    })
  }, [itemSize, list, onItem, setElements])
  useLayoutEffect(() => {
    if (elements.length === itemSize || elements.length === list.length)
      setLoadMore(false)
  }, [elements, internalCount, setLoadMore, itemSize, list])

  useEffect(() => {
    if (!loadMore && list.length > itemSize) {
      const onScroll = debounce(
        () => {
          const scrolledHeight =
            document.scrollingElement || document.documentElement
          const diff =
            document.documentElement.offsetHeight -
            (window.innerHeight + scrolledHeight.scrollTop)
          if (diff > 10) return
          setLoadMore(true)
          window.removeEventListener("scroll", onScroll)
        },
        16,
        { leading: false, trailing: true }
      )
      window.addEventListener("scroll", onScroll)
      return () => {
        window.removeEventListener("scroll", onScroll)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSize, list.length, setLoadMore, loadMore])
  return <Wrapper>{elements}</Wrapper>
}

InfiniteScroll.propTypes = {
  onItem: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
}

export default InfiniteScroll
