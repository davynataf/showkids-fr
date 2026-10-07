"use strict"

function yprmItemsAnimation($container) {
	let type = $container.attr('data-items-animation'),
		delay = +$container.attr('data-items-animation-delay'),
		target = $container.attr('data-items-animation-target'),
		$items = $container.find(target),
		tempTop = 0,
		tempDelay = 0,
		windowHeight = jQuery(window).height() * 1,
		precentFn = (max, precent) => {
			return max * precent / 100
		},
		scrollFn = (scrollTop) => {
			$items.each(function (index) {
				let offsetTop = jQuery(this).parent().offset().top + windowHeight*.2

				if(typeof window.SmoothScroll !== 'undefined') {
					offsetTop = scrollTop + jQuery(this).parent().offset().top - windowHeight*.8
				}

				if (scrollTop > offsetTop) {
					let delay = jQuery(this).attr('data-animation-delay')

					jQuery(this).delay(delay).queue(function () {
						jQuery(this).addClass('animated')
					})
				}
			});
		},
		parallaxFn = (scrollTop) => {

			$items.each(function () {
				let offsetTop = jQuery(this).parent().offset().top - windowHeight*.2,
					percent = (scrollTop - offsetTop) * 100 / windowHeight,
					scale = 1,
					transformOrigin = '50% 50%'

					if(typeof window.SmoothScroll !== 'undefined') {
						offsetTop = scrollTop + jQuery(this).parent().offset().top - windowHeight*.8
					}

				if (percent <= 0 || percent >= 100) return

				if (percent <= 0) {
					percent = 0
				} else if (percent >= 100) {
					percent = 100
				}

				if (type == 'parallax') {
					transformOrigin = '50% ' + percent + '%'
					scale = 1.3
				}

				if (type == 'zoomIn') {
					scale += precentFn(.3, percent)
				}

				if (type == 'zoomOut') {
					scale += precentFn(.3, 100 - percent)
				}

				gsap.to(jQuery(this).find('.img div, .img img'), .3, {
					transformOrigin: transformOrigin,
					scale: scale,
					ease: Power2.easeOut
				})
			})
		},
		animationFn = (scrollTop) => {
			if (
				'parallax' == type ||
				'zoomIn' == type ||
				'zoomOut' == type
			) {
				parallaxFn(scrollTop)
			} else {
				scrollFn(scrollTop)
			}
		}

	$items.each(function () {
		let $el = jQuery(this),
			offsetTop = $el.parent().offset().top

		if (offsetTop >= tempTop && offsetTop <= tempTop+200) {
			tempDelay += delay;
		} else {
			tempTop = offsetTop;
			tempDelay = 0
		}

		$el.attr('data-animation-delay', tempDelay)
	})

	if (typeof window.SmoothScroll !== 'undefined') {
		window.SmoothScroll.addListener(function (status) {
			let scrollTop = status.offset.y + windowHeight

			animationFn(scrollTop)
		})
	} else {
		jQuery(window).on('scroll', function () {
			let scrollTop = jQuery(window).scrollTop() + windowHeight
	
			animationFn(scrollTop)
		})
	}


	jQuery(window).on('load added_items', function () {
		let scrollTop = jQuery(window).scrollTop() + windowHeight

		animationFn(scrollTop)
	})

	let scrollTop = jQuery(window).scrollTop() + windowHeight

	animationFn(scrollTop)

	jQuery(window).on('resize', function () {
		windowHeight = jQuery(window).height() * 1
	})
}