class PTSidebarHandler extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        sidebar: '.pt-sidebar',
        button: '.pt-sidebar-toggle',
        close: '.pt-sidebar-close'
      }
    };
  }

  getDefaultElements() {
    var selectors = this.getSettings('selectors');
    return {
      $sidebar: this.$element.find(selectors.sidebar),
      $button: this.$element.find(selectors.button),
      $close: this.$element.find(selectors.close)
    };
  }

  onInit() {
    const elements = this.getDefaultElements();

    jQuery(elements.$button).on('click', function(e) {
      elements.$sidebar.toggleClass('is-active');
    });

    jQuery(elements.$close).on('click', function(e) {
      elements.$sidebar.toggleClass('is-active');
    });
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-sidebar', PTSidebarHandler);
});
