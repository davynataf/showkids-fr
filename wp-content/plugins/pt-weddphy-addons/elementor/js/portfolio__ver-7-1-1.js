class PortfolioHandler extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      type: this.getElementSettings('type'),
      arrows: this.getElementSettings('swiper_arrows'),
      loop: this.getElementSettings('swiper_loop'),
      slider_thumbs: this.getElementSettings('slider_thumbs'),
      slider_thumbs_position: this.getElementSettings('slider_thumbs_position'),
      slider_thumbs_max_width: this.getElementSettings('slider_thumbs_max_width'),
      stairs: this.getElementSettings('stairs'),
      cols: {
        xs: this.getElementSettings('cols_xs'),
        sm: this.getElementSettings('cols_sm'),
        md: this.getElementSettings('cols_md'),
        lg: this.getElementSettings('cols_lg'),
        xl: this.getElementSettings('cols_xl'),
      },
      selectors: {
        block: '.portfolio-block',
        items: '.portfolio-item',
        swiper: '.swiper',
        slider: '.slider .swiper',
        thumbs: '.thumbs .swiper'
      },
    };
  }

  getDefaultElements() {
    const selectors = this.getSettings('selectors');

    return {
      $block: this.$element.find(selectors.block),
      $items: this.$element.find(selectors.items),
      $swiperContainer: this.$element.find(selectors.swiper),
      $slider: this.$element.find(selectors.slider),
      $thumbs: this.$element.find(selectors.thumbs)
    }
  }

  getBreakpoints() {
    const settings = this.getSettings();

    let breakpoints = {
      0: {
        slidesPerView: 1
      }
    }

    if (settings.cols.xs) {
      if(typeof breakpoints[0] === 'undefined') breakpoints[0] = {}
			breakpoints[0].slidesPerView = settings.cols.xs
		}
		if (settings.cols.sm) {
      if(typeof breakpoints[576] === 'undefined') breakpoints[576] = {}
			breakpoints[576].slidesPerView = settings.cols.sm
		}
		if (settings.cols.md) {
      if(typeof breakpoints[768] === 'undefined') breakpoints[768] = {}
			breakpoints[768].slidesPerView = settings.cols.md
		}
		if (settings.cols.lg) {
      if(typeof breakpoints[992] === 'undefined') breakpoints[992] = {}
			breakpoints[992].slidesPerView = settings.cols.lg
		}
		if (settings.cols.xl) {
      if(typeof breakpoints[1200] === 'undefined') breakpoints[1200] = {}
			breakpoints[1200].slidesPerView = settings.cols.xl
		}

    return breakpoints
  }

  initCarousel() {
    const elementSettings = this.getElementSettings();
    const elements = this.getDefaultElements();

    if (!elements.$swiperContainer.length || elementSettings.type != 'carousel') return

    const swiperOptions = {
      spaceBetween: elementSettings.gap ? elementSettings.gap : 30,
      loop: 'yes' === elementSettings.swiper_loop,
      breakpoints: this.getBreakpoints()
    };

    if ('yes' === elementSettings.swiper_arrows) {
      swiperOptions.navigation = {
        nextEl: `.elementor-element-${this.getID()} .pt-swiper-button-next`,
        prevEl: `.elementor-element-${this.getID()} .pt-swiper-button-prev`
      };
    }

    if ( 'yes' === elementSettings.swiper_pagination ) {
      swiperOptions.pagination = {
        el: `.elementor-element-${this.getID()} .pt-swiper-pagination`,
        type: 'bullets',
        clickable: true
      };
    }

    const Swiper = elementorFrontend.utils.swiper;

    this.swiper = new Swiper(elements.$swiperContainer, swiperOptions);
  }

  initCarouselFilter() {
    const settings = this.getSettings()
    const elements = this.getDefaultElements()
    let _this = this;

    if (!elements.$swiperContainer.length || settings.type != 'carousel') return

    elements.$block.on('click', '.filter-buttons .filter-button', function () {
      let $block = jQuery(this).parents('.portfolio-type-carousel'),
        filter_val = jQuery(this).attr('data-filter'),
        $swiper_container = $block.find('.swiper-container'),
        swiper = $swiper_container.swiper,
        filteredSlides = [];
  
      jQuery(this).addClass('current').siblings().removeClass('current');
  
      $swiper_container.addClass('loading').queue(function (next) {
        setTimeout(() => {
  
          if (typeof swiper.initSlides === 'undefined') {
            swiper.initSlides = $swiper_container.find('.swiper-slide:not(.swiper-slide-duplicate)')
          }
  

          swiper.removeAllSlides();
  
          if (filter_val != '*') {
            swiper.initSlides.each(function () {
              if (jQuery(this).hasClass(filter_val.replace('.', ''))) {
                filteredSlides.push(jQuery(this))
              }
            });
          } else {
            swiper.initSlides.each(function () {
              filteredSlides.push(jQuery(this))
            });
          }
  
          swiper.addSlide(1, filteredSlides);
  
          swiper.update();
          swiper.slideTo(0, 0);
          _this.initHoverEffect()
          jQuery(window).trigger('resize');
  
  
          $swiper_container.removeClass('loading')
        }, 400);
  
        next()
      });
  
    });
  }

  initStairs() {
    const settings = this.getSettings()
    const elements = this.getDefaultElements()

    if(settings.stairs != 'yes') return false;
    
    let index = 0,
    tempTop = 0,
    coef = 30

    if(elements.$block.find('.grid-sizer').length) {
      index = -1
    }

    elements.$items.each(function() {
      index++
      let top = jQuery(this).offset().top

      if(index > 0 && tempTop == top) {
        jQuery(this).css({
          marginTop: index*coef
        })
      } else if(tempTop == 0) {
        tempTop = top
      } else if(jQuery(this).offset().top >= top) {
        return false;
      }
    });
  }

  async initSlider() {
    const settings = this.getSettings()
    const elements = this.getDefaultElements()

    if (!elements.$slider.length || settings.type != 'slider') return

    const Swiper = elementorFrontend.utils.swiper;

    this.thumbs = await new Swiper(elements.$thumbs, {
      spaceBetween: 5,
      slideToClickedSlide: true,
      breakpoints: {
        0: {
          slidesPerView: 3,
        },
        480: {
          slidesPerView: 4,
        },
        640: {
          slidesPerView: 5,
        },
        768: {
          slidesPerView: 7,
        },
        998: {
          slidesPerView: 8,
        },
        1200: {
          slidesPerView: 9,
        }
      }
    });

    this.slider = await new Swiper(elements.$slider, {
      speed: 800,
      navigation: {
        nextEl: `.elementor-element-${this.getID()} .pt-swiper-button-next`,
        prevEl: `.elementor-element-${this.getID()} .pt-swiper-button-prev`
      },
      loop: settings.loop == 'yes' ? true : false,
      loopedSlides: 4,
      thumbs: {
        swiper: this.thumbs
      }
    });
  }

  initIsotope() {
    const settings = this.getSettings()

    let $isotopeEl = this.$element.find('.isotope'),
      layoutMode = 'masonry'

    if (settings.type == 'combined-masonry') {
      layoutMode = 'fitRows'
    }

    if ($isotopeEl.length) {
      $isotopeEl.isotope({
        itemSelector: '.istp-item',
        layoutMode,
        masonry: {
          columnWidth: '.grid-sizer',
        }
      })

      $isotopeEl.imagesLoaded().progress(function () {
        $isotopeEl.isotope('layout');
      });
    }
  }

  initLoadMore() {
    if (this.$element.find('.filter-block').length) {
      this.$element.find('.filter-block').yprmLoadMore();
    }
  }

  initHoverEffect() {
    jQuery('.portfolio-item .wrap').each(function () {
      if (typeof jQuery(this).data('hover-effect') !== 'undefined') return;

      let $el = jQuery(this),
        $catEl = $el.find('.categories'),
        $titleEl = $el.find('.title'),
        $buttonEl = $el.find('.button-block'),
        tl = gsap.timeline({
          onStart: () => {
            $el.parent().addClass('hovered')
          }
        }),
        delayFn = () => {
          tl.play(0)
        },
        timeout = null

      tl.pause(0)

      $el.data('hover-effect', true)

      if ($catEl.length) {
        tl.fromTo($catEl, .6, {
          y: 30,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          ease: Power2.easeOut,
        })
      }

      if ($titleEl.length) {
        if (!$titleEl.find('.line').length) {
          yprmWrapLines($titleEl)
        }

        tl.fromTo($titleEl.find('.line'), .6, {
          y: 30,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          stagger: .3,
          ease: Power2.easeOut,
        }, "-=.3")
      }

      if ($buttonEl.length) {
        tl.fromTo($buttonEl, .6, {
          opacity: 0
        }, {
          opacity: 1,
          ease: Power2.easeOut,
        }, "-=.6")
      }

      $el.on('mouseenter', function () {
        timeout = setTimeout(delayFn, 150)
      })

      $el.on('mouseleave', function () {
        clearTimeout(timeout)
        tl.pause()

        $el.parent().removeClass('hovered')

        if ($catEl.length) {
          gsap.to($catEl, .6, {
            opacity: 0
          })
        }
        if ($titleEl.length) {
          gsap.to($titleEl.find('.line'), .6, {
            opacity: 0
          })
        }
        if ($buttonEl.length) {
          gsap.to($buttonEl, .6, {
            opacity: 0
          })
        }
      })
    });
  }

  initCombinedMasonry() {
    const settings = this.getSettings()
    const elements = this.getDefaultElements()

    if (settings.type != 'combined-masonry') return

    let $rowEls = [],
      blockWidth = elements.$block.width(),
      index = 0

    elements.$block.find('.portfolio-item').each(function () {
      let $el = jQuery(this)

      if (blockWidth < $el.outerWidth()) {
        index++

        return
      }

      if (typeof $rowEls[index] === 'undefined') {
        $rowEls[index] = {
          els: [],
          heights: []
        }
      }

      $rowEls[index].els.push($el)
      $rowEls[index].heights.push($el.height())
    });

    if ($rowEls.length > 0) {
      jQuery.each($rowEls, function () {
        if (typeof this.heights === 'undefined') return

        let height = Math.max.apply(null, this.heights)

        jQuery.each(this.els, function () {
          jQuery(this).height(height)
        })
      })
    }

  }

  // initVerticalWithThumbs() {
  //   const settings = this.getSettings()
  //   const elements = this.getDefaultElements()

  //   if (settings.type != 'vertical-with-thumbs') return

  //   this.verticalCurrentTempIndex = -1

  //   this.$thumbsObject = new Swiper(elements.$thumbs.find('.swiper-container'), {
  //     direction: 'vertical',
  //     spaceBetween: 30,
  //     slidesPerView: 'auto',
  //     watchOverflow: true,
  //     watchSlidesProgress: true,
  //     watchSlidesProgress: true,
  //     loop: false,
  //     loopedSlides: 4,
  //     freeMode: true
  //   })

  //   elements.$thumbs.on('click', '.swiper-slide', (e) => {;
  //     let $currentEl = elements.$items.eq(jQuery(e.currentTarget).index()),
  //     y = $currentEl.offset().top - jQuery('.site-header').yprmHeight()

  //     if (typeof window.SmoothScroll !== 'undefined') {
  //       y = window.SmoothScroll.offset.y + $currentEl.offset().top - jQuery('.site-header').yprmHeight()

  //       jQuery({ top: window.SmoothScroll.offset.y }).animate({ top: y }, {
  //         duration: 1000,
  //         easing: 'swing',
  //         step(value) {
  //           window.SmoothScroll.setPosition(0, value);
  //         }
  //       });
  //     } else {
  //       jQuery('body, html').animate({
  //         scrollTop: y
  //       }, 1100);
  //     }
  //   })
    
  //   jQuery(window).on('load resize', () => {
  //     elements.$thumbs.css({
  //       height: jQuery(window).height()-jQuery('.site-header').yprmHeight(),
  //       maxHeight: (elements.$thumbs.find('.swiper-slide').length*elements.$thumbs.find('.swiper-slide:eq(0)').outerHeight(true))+(parseInt(elements.$thumbs.css('padding-top'))*2)-parseInt(elements.$thumbs.find('.swiper-slide:eq(0)').css('margin-bottom'))
  //     })
  //   })

  //   let scrollTop = jQuery(window).scrollTop()

  //   if (typeof window.SmoothScroll !== 'undefined') {
  //     scrollTop = window.SmoothScroll.offset.y
      
  //     window.SmoothScroll.addListener((status) => {
  //       let scrollTop = status.offset.y
  
  //       this.stickVerticalThumbs(scrollTop)
  //       this.getCurrentVerticalThumbs(scrollTop)
  //       this.setCurrentVerticalThumbs()
  //     })
  //   } else {
  //     jQuery(window).on('scroll', () => {
  //       scrollTop = jQuery(window).scrollTop()
    
  //       this.stickVerticalThumbs(scrollTop)
  //       this.getCurrentVerticalThumbs(scrollTop)
  //       this.setCurrentVerticalThumbs()
  //     })
  //   }

  //   this.stickVerticalThumbs(scrollTop)
  //   this.getCurrentVerticalThumbs(scrollTop)
  //   this.setCurrentVerticalThumbs()
  // }

  // stickVerticalThumbs(scrollTop) {
  //   const settings = this.getSettings()
  //   const elements = this.getDefaultElements()

  //   let pos_top = elements.$block.offset().top,
  //   end_point = elements.$block.offset().top+elements.$block.height()

  //   if (typeof window.SmoothScroll !== 'undefined') {
  //     pos_top += scrollTop,
  //     end_point += scrollTop
  //   }
    
  //   scrollTop += jQuery('.site-header:visible').yprmHeight()

  //   if (scrollTop > pos_top && scrollTop+jQuery(window).height()-jQuery('.site-header:visible').yprmHeight() < end_point) {
  //     pos_top = scrollTop-pos_top
  //   } else if(scrollTop+jQuery(window).height()-jQuery('.site-header:visible').yprmHeight() >= end_point) {
  //     pos_top = elements.$block.height() - elements.$thumbs.yprmOuterHeight()
  //   } else {
  //     pos_top = 0
  //   }

  //   gsap.set(elements.$thumbs, {
  //     y: pos_top < 0 ? 0 : pos_top
  //   })
  // }

  // getCurrentVerticalThumbs(scrollTop) {
  //   const settings = this.getSettings()
  //   const elements = this.getDefaultElements()

  //   let currentIndex = 0

  //   elements.$items.each((index, el) => {
  //     let $el = jQuery(el),
  //     pos_top = $el.offset().top

  //     if (typeof window.SmoothScroll !== 'undefined') {
  //       pos_top += scrollTop
  //     }

  //     if(pos_top > scrollTop) {
  //       currentIndex = $el.index()

  //       return false
  //     }
  //   });

  //   this.verticalCurrentIndex = currentIndex
  // }

  // setCurrentVerticalThumbs() {
  //   const elements = this.getDefaultElements()

  //   if(this.verticalCurrentTempIndex != this.verticalCurrentIndex) {
  //     this.$thumbsObject.slideTo(this.verticalCurrentIndex)
      
  //     elements.$thumbs.find('.swiper-container .swiper-slide').eq(this.verticalCurrentIndex).addClass('active-slide').siblings().removeClass('active-slide')

  //     this.verticalCurrentTempIndex = this.verticalCurrentIndex
  //   }
  // }

  onResize() {
    const settings = this.getSettings()
    const elements = this.getDefaultElements()

    // this.sliderThumbsWidth()
  }

  onInit() {
    const elements = this.getDefaultElements()

    this.initStairs()
    this.initIsotope()
    this.initHoverEffect()
    this.initLoadMore()
    this.initCarousel()
    this.initSlider()
    this.initCombinedMasonry()
    // this.initVerticalWithThumbs()

    this.onResize()

    yprmItemsAnimation(elements.$block)

    jQuery(window).on('added_items', () => {
      this.initHoverEffect()
      this.initCombinedMasonry()

      yprmItemsAnimation(elements.$block)
    });

    jQuery(window).on('resize', () => {
      this.initCombinedMasonry()
      this.onResize()
    })
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  const addHandler = ($element) => {
    elementorFrontend.elementsHandler.addHandler(PortfolioHandler, {
      $element,
    });
  };

  elementorFrontend.hooks.addAction('frontend/element_ready/pt-portfolio.default', addHandler);
  elementorFrontend.hooks.addAction('frontend/element_ready/pt-gallery.default', addHandler);
});
