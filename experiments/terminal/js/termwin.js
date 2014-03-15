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

    output: function(text, newline) {
        var currentRow = this.$window.children('p:last');

        if(currentRow.size() === 0) {
            currentRow = $('<p/>').appendTo(this.$window);
        }

        this.cursor.hide();

        if (text instanceof String) {
            currentRow.html(currentRow.html() + text);
        } else {
            currentRow.append(text);
        }

        if(newline) {
            this.newline();
        } else {
            currentRow.append(this.cursor.show().$cursor);
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
