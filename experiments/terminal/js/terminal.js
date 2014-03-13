var terminal = {
    init: function($element) {
        this.$term = $element;

        this.termwin = termwin.init($('.window', this.$term));
        this.readonly = false;
        this.motd = false;

        this.$term.click(function(ev) {
            ev.stopPropagation();

            this.focus();
        }.bind(this));

        $(document).click(function() {
            this.blur();
        }.bind(this));

        $(document).on('keydown', function(ev) {
            if(ev.keyCode === 8 && this.focused()) {
                ev.preventDefault();

                this.termwin.backspace();
            }
        }.bind(this));

        $(document).on('keypress', function(ev) {
            if(this.focused()) {
                ev.preventDefault();

                if(ev.keyCode != 13 && this.readonly === false) {
                    this.termwin.type(String.fromCharCode(ev.which));
                }
            }
        }.bind(this));

        return this;
    },

    prompt: function() {
        this.termwin.prompt(this.$term.attr('data-prompt') || '$');

        return this;
    },

    disableInput: function() {
        this.readonly = true;

        return this;
    },

    enableInput: function() {
        this.readonly = false;

        return this;
    },

    output: function(text, newline) {
        this.termwin.output(text, newline);

        return this;
    },

    focus: function() {
        this.$term.addClass('focus');

        if(this.motd === false) {
            (window[this.$term.attr('data-motd')] || function() {})(this.output);
            this.prompt();
            this.status('Type <code>help</code> to get some help')

            this.motd = true;
        }

        return this;
    },

    blur: function() {
        this.$term.removeClass('focus');

        return this;
    },

    focused: function() {
        return $(this.$term).is('.focus');
    },

    clear: function() {
        this.window.clear();

        return this;
    },

    status: function(text) {
        $('footer', this.$term).html(text);

        return this;
    }
};
