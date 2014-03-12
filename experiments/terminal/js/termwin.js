var termwin = {
    init: function($element) {
        this.$window = $element;

        this.cursor = cursor.init($('.cursor', this.$window));

        return this;
    },

    clear: function() {
        $('pre', this.$window).remove();

        return this;
    },

    focus: function() {
        this.cursor.blink();

        return this;
    },

    blur: function() {
        this.cursor.unblink();

        return this;
    },

    prompt: function(text) {
        var prompt = $('<span/>').addClass('prompt');

        prompt
            .addClass('prompt')
            .text(text)
        ;

        this.cursor.hide();
        this.output(prompt.after(this.cursor.show().$cursor));

        return this;
    },

    type: function(char) {
        this.cursor.type(char);

        return this;
    },

    backspace: function() {
        this.cursor.backspace();

        return this;
    },

    output: function(text) {
        var row = $('<pre/>');

        if (text instanceof String) {
            row.text(text);
        } else {
            row.append(text);
        }

        this.$window
            .append(row)
            .stop(true, true)
            .animate({ scrollTop: this.$window[0].scrollHeight }, 250)
        ;

        return this;
    }
};
