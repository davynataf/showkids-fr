"use strict";

(function ($) {
  $.fn.yprmHeight = function () {
    return this.length ? this.height() : 0
  };
  $.fn.yprmOuterHeight = function () {
    return this.length ? this.outerHeight() : 0
  };
  $.fn.yprmWidth = function () {
    return this.length ? this.width() : 0
  };
  $.fn.yprmOuterWidth = function () {
    return this.length ? this.outerWidth() : 0
  };
})(jQuery);

function yprmHeaderScroll(scrollTop) {
	if (scrollTop > 50) {
		jQuery('.header-sticky .site-header').addClass('colored');
	} else {
		jQuery('.header-sticky .site-header').removeClass('colored');
	}
}

jQuery(window).on('load scroll', function() {
  yprmHeaderScroll(jQuery(window).scrollTop());
});

jQuery(window).on('load', function () {
  jQuery('body').addClass('loaded');
});

jQuery(window).on('load resize elementor/frontend/init', function() {
  jQuery('.header-space').css('height', jQuery('.site-header:visible').yprmOuterHeight());

  jQuery('.site-menu .has-mega-menu').each(function(e) {
    var leftOffset = jQuery(this).offset().left;
    jQuery(this).find('.pt-mega-menu-wrapper').css('left', -1 * leftOffset);
  });

  var containers = [
    ".site-footer",
    "#wpadminbar"
  ];
  addCssElement('.site-main', containers);
});

jQuery('.right-click-disable-true').on('contextmenu', function () {
  jQuery('.right-click-disable-message').addClass('active');
  return false;
});

jQuery('.right-click-disable-message:not(.lic)').on('click', function () {
  jQuery(this).removeClass('active');
  return false;
});

jQuery('.site-menu .sub-menu li a').on('mouseenter', function() {
  jQuery(this).parent().parent().addClass('is-hovered');
});

jQuery('.site-menu .sub-menu li a').on('mouseleave', function() {
  jQuery('.sub-menu').removeClass('is-hovered');
});

jQuery('.menu-toggle, .mobile-menu-toggle').on('click', function() {
  jQuery('body').toggleClass('menu-toggled');
});

jQuery('.search-toggle').on('click', function() {
  jQuery('body').toggleClass('search-toggled');
});

jQuery('.mobile-menu ul li.menu-item-has-children > a, .mobile-menu ul li.menu-item-has-children > .submenu-toggle, .widget_nav_menu ul li.menu-item-has-children > a, .widget_nav_menu ul li.menu-item-has-children > .submenu-toggle').on('click', function(e) {
  if (jQuery(this).attr('href') && jQuery(this).attr('href').includes('#') && jQuery(this).attr('href').length > 1) {
    jQuery('body').toggleClass('menu-toggled');
  } else {
    e.preventDefault();

    jQuery(this).parent().children('ul').slideToggle();
    jQuery(this).parent().siblings().find('ul').slideUp();

    if (!jQuery(this).parent().hasClass('submenu-open')) {
      jQuery(this).parent().addClass('submenu-open');
    } else {
      jQuery(this).parent().removeClass('submenu-open');
    }

    jQuery(this).parent().siblings().removeClass('submenu-open');

    return false;
  }
});

jQuery('.site-menu .menu-item-has-children, .pt-cart').on('mouseenter', function() {
  let $li = jQuery(this),
  $menu = $li.children('.pt-cart-minicart, .sub-menu');

  if($menu.length && $menu.offset().left+$menu.outerWidth() >= jQuery(window).width() && !$li.hasClass('on-left')) {
    $li.addClass('on-left');
  }
});

function addCssElement( selector, selectors, type = 'min-height' ) {
	var height = jQuery(window).outerHeight();

	for (var i = 0; i < selectors.length; i++) {
		var containerHeight = jQuery(selectors[i]).outerHeight();
		if ( containerHeight ) {
			height -= containerHeight;
		}
	}

	jQuery(selector).css(type, height);
}

jQuery( function( $ ) {

  if ( ! String.prototype.getDecimals ) {
    String.prototype.getDecimals = function() {
      var num = this,
        match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if ( ! match ) {
        return 0;
      }
      return Math.max( 0, ( match[1] ? match[1].length : 0 ) - ( match[2] ? +match[2] : 0 ) );
    }
  }

  function wcqi_refresh_quantity_increments(){
    $( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' ).addClass( 'buttons_added' ).append( '<span class="plus"></span>' ).prepend( '<span class="minus"></span>' );
  }

  $( document ).on( 'updated_wc_div', function() {
    wcqi_refresh_quantity_increments();
  } );

  $( document ).on( 'click', '.plus, .minus', function() {
    // Get values
    var $qty = $( this ).closest( '.quantity' ).find( '.qty'),
      currentVal = parseFloat( $qty.val() ),
      max = parseFloat( $qty.attr( 'max' ) ),
      min = parseFloat( $qty.attr( 'min' ) ),
      step = $qty.attr( 'step' );

    // Format values
    if ( ! currentVal || currentVal === '' || currentVal === 'NaN' ) currentVal = 0;
    if ( max === '' || max === 'NaN' ) max = '';
    if ( min === '' || min === 'NaN' ) min = 0;
    if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) step = 1;

    // Change the value
    if ( $( this ).is( '.plus' ) ) {
      if ( max && ( currentVal >= max ) ) {
        $qty.val( max );
      } else {
        $qty.val( ( currentVal + parseFloat( step )).toFixed( step.getDecimals() ) );
      }
    } else {
      if ( min && ( currentVal <= min ) ) {
        $qty.val( min );
      } else if ( currentVal > 0 ) {
        $qty.val( ( currentVal - parseFloat( step )).toFixed( step.getDecimals() ) );
      }
    }

    // Trigger change event
    $qty.trigger( 'change' );
  });

  wcqi_refresh_quantity_increments();
});

jQuery(document).ready(function () {

  jQuery(
    ".archive .portfolio-type-masonry"
  ).each(function () {
    var wrap = jQuery(this);
    wrap.imagesLoaded(function () {
      var $grid = wrap.isotope({
        itemSelector: "article",
        masonry: {
          //horizontalOrder: true
        },
      });
    });
  });

  const $portfolio_carousel_swiper = new Swiper(
    '.project-single-carousel .swiper',
    {
      spaceBetween: 30,
      autoHeight: true,
      breakpoints: {
        0: {
          slidesPerView: 1
        },
        576: {
          autoHeight: true,
          slidesPerView: 1.7
        },
        1024: {
          slidesPerView: 2.5
        }
      },
    }
  );

  /*------------------------------------------------------------------
	[ Post gallery masonry ]
	*/
  jQuery(".post-gallery-masonry").each(function () {
    var $grid = jQuery(this).isotope({
      itemSelector: "div",
    });
  });

  /*------------------------------------------------------------------
	[ Project slider ]
	*/
  jQuery(".project-slider").each(function () {
    var head_slider = jQuery(this);
    if (head_slider.find(".item").length == 1) {
      head_slider.parent().removeClass("with-carousel-nav");
    }
    if (jQuery(this).find(".item").length > 1) {
      head_slider.addClass("owl-carousel").owlCarousel({
        //loop:true,
        items: 1,
        nav: true,
        dots: false,
        autoplay: false,
        navClass: [
          "owl-prev basic-ui-icon-left-arrow",
          "owl-next basic-ui-icon-right-arrow",
        ],
        navText: false,
        autoHeight: true,
      });

      var child_carousel = head_slider.next(".project-slider-carousel");

      var i = 0;
      var flag = false;
      var c_items = "4";

      if (head_slider.find(".owl-item:not(.cloned)").find(".item").length < 4) {
        c_items = head_slider
          .find(".owl-item:not(.cloned)")
          .find(".item").length;
      }

      var child_carousel_c = child_carousel
        .addClass("owl-carousel")
        .owlCarousel({
          //loop:true,
          items: 1,
          nav: true,
          dots: false,
          autoplay: false,
          navClass: [
            "owl-prev basic-ui-icon-left-arrow",
            "owl-next basic-ui-icon-right-arrow",
          ],
          navText: false,
          margin: 15,
          responsive: {
            0: {
              nav: false,
            },
            480: {},
            768: {
              nav: true,
              items: c_items,
            },
          },
        })
        .on("click initialized.owl.carousel", ".item", function (e) {
          e.preventDefault();
          head_slider.trigger("to.owl.carousel", [
            jQuery(e.target).parents(".owl-item").index(),
            300,
            true,
          ]);
          jQuery(e.target)
            .parents(".owl-item")
            .addClass("active-item")
            .siblings()
            .removeClass("active-item");
        })
        .data("owl.carousel");

      var child_carousel_item = child_carousel.find(".owl-item.active");

      head_slider
        .on("change.owl.carousel", function (e) {
          if (
            e.namespace &&
            e.property.name === "position" &&
            !flag &&
            typeof child_carousel_c !== "undefined"
          ) {
            flag = true;
            child_carousel_c.to(
              e.relatedTarget.relative(e.property.value),
              300,
              true
            );
            head_slider
              .parent()
              .find(".banner-carousel .owl-item.active")
              .first()
              .addClass("active-item")
              .siblings()
              .removeClass("active-item");
            flag = false;
          }
        })
        .data("owl.carousel");
    }
  });

  /*------------------------------------------------------------------
	[ Project horizontal slider ]
	*/
  jQuery(".project-horizontal-slider").each(function () {
    var head_slider = jQuery(this);
    if (head_slider.find(".item").length > 1) {
      head_slider.imagesLoaded(function () {
        head_slider.addClass("owl-carousel").owlCarousel({
          items: 1,
          nav: true,
          dots: false,
          autoplay: false,
          autoWidth: true,
          navClass: [
            "owl-prev basic-ui-icon-left-arrow",
            "owl-next basic-ui-icon-right-arrow",
          ],
          navText: false,
          margin: 30,
          responsive: {
            0: {
              nav: false,
            },
            480: {},
            768: {
              nav: true,
            },
          },
        });
      });
    }
  });

  jQuery(window).on("load resize elementor/frontend/init", function () {
    jQuery(
      ".project-horizontal-slider img, .project-horizontal, .project-horizontal-img"
    ).css(
      "height",
      jQuery(window).outerHeight() -
        jQuery(".header-space:not(.hide)").height() -
        (jQuery(".site-footer").outerHeight() || 0) -
        (jQuery("#wpadminbar").outerHeight() || 0)
    );
    jQuery(".project-horizontal .cell").css(
      "height",
      jQuery(".project-horizontal").outerHeight()
    );
  });

  jQuery(".js-pixproof-gallery").each(function () {
    var $grid = jQuery(this)
      .addClass("isotope")
      .isotope({
        itemSelector: ".proof-photo"
      });
  });

  jQuery(
    ".site-menu-wrap.is-vertical ul li.menu-item-has-children > a, .site-menu-wrap.is-vertical ul li.page_item_has_children > a"
  ).on("click", function () {
    jQuery(this).parents().addClass("active-child");
    jQuery(this).parents().parents().addClass("hidden-items");
    return false;
  });

  jQuery('.site-menu-wrap.is-vertical .sub-menu').prepend(jQuery('<div class="sub-menu-back"></div>'));

  jQuery('.site-menu-wrap.is-vertical').on('click', '.sub-menu-back', function () {
    jQuery(this).parent().parent().removeClass('active-child');
    jQuery(this).parent().parent().parent().removeClass('hidden-items');
    return false;
  });
});
