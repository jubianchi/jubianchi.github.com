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

    backspace: function() {
        this.cursor.backspace();

        return this;
    },

    clearLine: function() {
        this.cursor.clearLeft();

        return this;
    },

    output: function(text, newline, style) {
        var currentRow = this.$window.children('p:last');

        if(currentRow.size() === 0) {
            currentRow = $('<p/>').appendTo(this.$window);
        }

        this.cursor.hide();

        if (typeof text === 'string') {
            this.cursor.write(text, style);
        } else {
            currentRow.append(text).append(this.cursor.show().$cursor);
        }

        if(newline) {
            this.newline();
        }

        return this;
    },

    writeln: function(text) {
        return this.output(text, true);
    },

    newline: function() {
        this.$window
            .append($('<p/>').append(this.cursor.show().$cursor))
            .stop(true, true)
            .animate({ scrollTop: this.$window[0].scrollHeight }, 250)
        ;
    }
};
