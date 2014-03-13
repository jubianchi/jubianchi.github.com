var termwin = {
    init: function($element) {
        this.$window = $element;

        this.cursor = cursor.init($('.cursor', this.$window));

        return this;
    },

    clear: function() {
        $('p', this.$window).remove();

        return this;
    },

    prompt: function(text) {
        var prompt = $('<span/>').addClass('prompt');

        prompt
            .addClass('prompt')
            .html(text)
        ;

        this.output(prompt);

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
        var row = $('<p/>');

        if (text instanceof String) {
            row.text(text);
        } else {
            row.append(text);
        }

        this.cursor.hide();

        this.$window
            .append(row.append(this.cursor.show().$cursor))
            .stop(true, true)
            .animate({ scrollTop: this.$window[0].scrollHeight }, 250)
        ;

        return this;
    }
};
