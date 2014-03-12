var terminal = {
    init: function($element) {
        this.$term = $element;

        this.termwin = termwin.init($('.window', this.$term));
        this.motd = false;

        return this;
    },

    prompt: function() {
        this.termwin.prompt(this.$term.attr('data-prompt') || '$');

        return this;
    },

    output: function(text) {
        this.termwin.output(text);

        return this;
    },

    focus: function() {
        this.$term.addClass('focus');

        if(this.motd === false) {
            (window[this.$term.attr('data-motd')] || function() {})(this.output);
            this.prompt();

            this.motd = true;
        }

        this.termwin.focus();

        return this;
    },

    blur: function() {
        this.$term.removeClass('focus');
        this.termwin.blur();

        return this;
    },

    focused: function() {
        return $(this.$term).is('.focus');
    },

    clear: function() {
        this.window.clear();

        return this;
    }
};
