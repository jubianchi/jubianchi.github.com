var cursor = {
    init: function($element) {
        this.$cursor = $element;

        return this;
    },

    type: function(char) {
        this.$cursor.hide().before('<span>' + char + '</span>').show();

        return this;
    },

    backspace: function() {
        this.$cursor.prev('span:not(.prompt)').remove();

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
