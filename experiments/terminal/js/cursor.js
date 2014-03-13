var cursor = {
    init: function($element) {
        this.$cursor = $element;

        return this;
    },

    type: function(char) {
        this.write('<span>' + char + '</span>');

        return this;
    },

    write: function(text) {
        this.$cursor.hide().before(text).show();

        return this;
    },

    backspace: function() {
        var prev = this.$cursor.prev('span:not(.prompt)');

        if(prev) {
            var text = prev.text();

            if(text.length === 1) {
                prev.remove();
            }

            prev.text(text.substr(0, text.length - 1));
        }

        return this;
    },

    show: function() {
        this.$cursor.show();

        return this;
    },

    hide: function() {
        this.$cursor.hide();

        return this;
    }
};
