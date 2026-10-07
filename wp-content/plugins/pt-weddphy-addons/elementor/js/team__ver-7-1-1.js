class PTTeamHandler extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        swiper: '.swiper'
      }
    };
  }

  getDefaultElements() {
    const selectors = this.getSettings('selectors');

    return {
      $swiperContainer: this.$element.find(selectors.swiper)
    }
  }

  initSwiper() {
    const elementSettings = this.getElementSettings();
    const elements = this.getDefaultElements();
    const elementorBreakpoints = elementorFrontend.config.responsive.activeBreakpoints;

    if ('carousel' != elementSettings.layout) {
      return;
    }

    let slidesCount = 0;

    const swiperOptions = {
      slidesPerView: elementSettings.cols,
      spaceBetween: 30,
      loop: 'yes' === elementSettings.loop,
      autoplay: 'yes' === elementSettings.autoplay,
      handleElementorBreakpoints: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      on: {
        slideChangeTransitionStart: function() {
          slidesCount = this.visibleSlidesIndexes.length;
        },
        setTranslate: function(e) {
          var _this = this;

          if(!slidesCount) {
            slidesCount = this.visibleSlidesIndexes.length;
          }
    
          jQuery(this.slides).each(function(index) {
            var left = _this.slidesGrid[index],
                x = -_this.translate - left,
                k = 1 - x / jQuery(this).outerWidth(true),
                o = k < 0 ? 0 : k;

            x = x <= 0 ? 0 : x;

            if (o > slidesCount) {
              o = slidesCount - k + 1;
            }

            jQuery(this).css({
              opacity: o,
              transition: jQuery(_this.$wrapperEl).css('transition-duration')
            });
          })
        },
      }
    };

    swiperOptions.breakpoints = {};

    Object.keys(elementorBreakpoints).reverse().forEach((breakpointName) => {
      swiperOptions.breakpoints[elementorBreakpoints[breakpointName].value] = {
        slidesPerView: +elementSettings['cols_' + breakpointName]
      };
    });

    if ('yes' === elementSettings.arrows) {
      swiperOptions.navigation = {
        nextEl: `.elementor-element-${this.getID()} .pt-swiper-button-next`,
        prevEl: `.elementor-element-${this.getID()} .pt-swiper-button-prev`
      };
    }

    if ('yes' === elementSettings.dots) {
      swiperOptions.pagination = {
        el: `.elementor-element-${this.getID()} .pt-swiper-pagination`,
        type: 'bullets',
        clickable: true
      };
    }

    const Swiper = elementorFrontend.utils.swiper;

    this.swiper = new Swiper(elements.$swiperContainer, swiperOptions);
  }

  onInit() {
    this.initSwiper();
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-team', PTTeamHandler);
});
