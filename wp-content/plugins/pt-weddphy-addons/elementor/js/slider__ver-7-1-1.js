class PTSliderHandler extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        swiper: '.swiper',
        cats: '.pt-slider-categories',
        catsSwiper: '.pt-slider-categories .swiper',
        button: '.categories-button',
      }
    };
  }

  getDefaultElements() {
    const selectors = this.getSettings('selectors');

    return {
      $swiperContainer: this.$element.find(selectors.swiper),
      $cats: this.$element.find(selectors.cats),
      $catsSwiper: this.$element.find(selectors.catsSwiper),
      $button: this.$element.find(selectors.button)
    }
  }

  initSwiper() {
    const elementSettings = this.getElementSettings();
    const elements = this.getDefaultElements();

    const swiperOptions = {
      loop: 'yes' === elementSettings.loop,
      autoplay: 'yes' === elementSettings.autoplay,
      mousewheel: 'yes' === elementSettings.mousewheel,
      speed: 1400
    };

    if ( 'fade' == elementSettings.effect || 'zoom-in' == elementSettings.effect || 'zoom-out' == elementSettings.effect ) {
      swiperOptions.effect = 'fade';
      swiperOptions.fadeEffect = {
        crossFade: true
      };
    }

    if ( 'vertical' === elementSettings.direction && window.innerWidth > 768 ) {
      swiperOptions.direction = 'vertical';
    }

    if ( 'yes' === elementSettings.enable_parallax ) {
      swiperOptions.parallax = true;
    }

    if ( 'yes' === elementSettings.arrows ) {
      swiperOptions.navigation = {
        nextEl: `.elementor-element-${this.getID()} .pt-swiper-button-next`,
        prevEl: `.elementor-element-${this.getID()} .pt-swiper-button-prev`
      };
    }

    if ('yes' === elementSettings.dots) {
      if ('default' === elementSettings.navigation_style) {
        swiperOptions.pagination = {
          el: `.elementor-element-${this.getID()} .pt-swiper-pagination`,
          clickable: true
        };
      }

      if ('combined' === elementSettings.navigation_style) {
        swiperOptions.pagination = {
          el: `.elementor-element-${this.getID()} .pt-swiper-pagination`,
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '"><svg class="progress" width="32" height="32" fill="none"><circle class="circle" r="15" cx="16" cy="16"></circle></svg><span class="number">0' + (index + 1) + '</span></span>';
          }
        };
      }

      if ('vertical' === elementSettings.navigation_style) {
        swiperOptions.pagination = {
          el: `.elementor-element-${this.getID()} .pt-swiper-pagination`,
          type: 'fraction'
        };
      }
    }

    if ( '' !== elementSettings.autoplay_delay && 'yes' === elementSettings.autoplay ) {
      swiperOptions.autoplay = {
        delay: elementSettings.autoplay_delay
      }
    }

    const slider = new Swiper(elements.$swiperContainer.get(0), swiperOptions);
  }

  initCategories() {
    const elements = this.getDefaultElements();

    elements.$button.on('click', function() {
      elements.$button.toggleClass('is-active');
      elements.$cats.toggleClass('is-active');
    });

    const swiperOptions = {
      slidesPerView: 1,
      loop: true,
      breakpoints: {
        768: {
          slidesPerView: 2
        },
        980: {
          slidesPerView: 3
        },
        1200: {
          slidesPerView: 4
        }
      },
      navigation: {
        nextEl: `.elementor-element-${this.getID()} .pt-slider-categories-next`,
        prevEl: `.elementor-element-${this.getID()} .pt-slider-categories-prev`
      },
      allowTouchMove: true, // Enable touch move
      //direction: window.innerWidth < 768 ? 'horizontal' : 'vertical' // Allow horizontal swiping on mobile, vertical on larger screens
    };

    const cats = new Swiper(elements.$catsSwiper.get(0), swiperOptions);
}


  onInit() {
    this.initSwiper();
    this.initCategories();
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-slider', PTSliderHandler);
});
