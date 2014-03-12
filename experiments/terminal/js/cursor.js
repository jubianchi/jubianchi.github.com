var cursor = {
    init: function($element) {
        this.$cursor = $element;
        this.blinker = null;

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

    blink: function() {
        this.$cursor.blinker = setInterval(
            function() {
                this.$cursor.toggleClass('hide');
            }.bind(this),
            500
        );

        return this;
    },

    unblink: function() {
        clearInterval(this.$cursor.blinker);

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
