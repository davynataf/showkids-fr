class PTProgressBarHandler extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        container: '.pt-progress-bar',
        line: '.pt-progress-bar-line'
      }
    };
  }
  
  getDefaultElements() {
    const selectors = this.getSettings('selectors');
    return {
      $container: this.$element.find(selectors.container),
      $line: this.$element.find(selectors.line)
    };
  }
  
  onInit() {
    super.onInit();

    this.intersectionObserver = elementorModules.utils.Scroll.scrollObserver({
      callback: event => {
        if (event.isInViewport) {
          this.intersectionObserver.unobserve(this.elements.$container[0]);
          const $line = this.elements.$line;

          $line.css('width', $line.data('max') + '%');
        }
      }
    });

    this.intersectionObserver.observe(this.elements.$container[0]);
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-progress-bar', PTProgressBarHandler);
});
