var reseq = {
    init: function(tsq) {
        this.data = tsq.split('\n');

        this.promise = null;
        this.delay = null;

        return this;
    },

    stackAction: function(callback, args, thisObj, delay) {
        var time = (delay === undefined ? this.delay : delay) * 1000,
            promiseFactory = function() {
                return new Promise(function(resolve) {
                    setTimeout(
                        function() {
                            callback.apply(thisObj, args);

                            resolve();
                        },
                        time
                    );
                });
            };

        this.delay = null;

        if(this.promise) {
            this.promise = this.promise.then(promiseFactory);
        } else {
            this.promise = promiseFactory();
        }
    },

    execute: function(term) {
        this.stackAction(term.disableInput, [], term);

        this.data.forEach(
            function(line) {
                if(line.match(/^\|/)) this.textLine(line, term);
                if(line.match(/^>/)) this.outputLine(line, term);
                if(line.match(/^\./)) this.controlCharLine(line, term);
                if(line.match(/^:/)) this.escapeSeqLine(line, term);
                if(line.match(/^&/)) this.labelLine(line, term);
                if(line.match(/^"/)) this.descriptionLine(line, term);
                if(line.match(/^@/)) this.delayLine(line, term);
                if(line.match(/^!/)) {
                    this.stackAction(term.prompt, [], term);
                }
            },
            this
        );

        this.stackAction(term.enableInput, [], term);
    },

    textLine: function(line, term) {
        var newline = false;

        line = line.replace(/^\|/, '');
        line = line.replace(/\|$/, '');

        if(line.match(/\|\.$/)) {
            line = line.replace(/\|\.$/, '');
            newline = true;
        }

        line.split('').forEach(function(c) {
            this.stackAction(term.termwin.cursor.type, [c, $.extend(true, {}, term.termwin.cursor.styles)], term.termwin.cursor);
        }, this);

        if(newline) {
            this.stackAction(term.termwin.newline, [], term.termwin);
        }
    },

    outputLine: function(line, term) {
        var newline = false;

        line = line.replace(/^>/, '');
        line = line.replace(/>$/, '');

        var cleaned;
        while(line !== (cleaned = line.replace(/\s{2}/g, '&nbsp; '))) {
            line = cleaned;
        }

        if(line.match(/>\.$/)) {
            line = line.replace(/>\.$/, '');
            if(line.replace(/\s/g, '') === '') {
                line = '&nbsp;';
            }

            newline = true;
        }

        this.stackAction(term.output, [line, newline, $.extend(true, {}, term.termwin.cursor.styles)], term, this.delay || 0);
    },

    controlCharLine: function(line, term) {
        var char = line.match(/^\. ((?:[^\/]+\/.*? ?)+)/);

        if(char) {
            var last = null,
                repeat = 1;

            char[1].split(' ').forEach(function(c) {
                c = c.match(/([^\/]+)/);

                if(c[1] !== last && last !== null) {
                    this.stackAction(
                        function() {
                            this['controlChar' + last](term, repeat);
                        }.bind(this),
                        [],
                        this,
                        this.delay || 0
                    );

                    repeat = 1;
                    last = null;
                }

                if(last === c[1]) {
                    repeat += 1;
                } else {
                    last = c[1];
                }
            }, this);

            if(last) {
                this.stackAction(
                    function() {
                        this['controlChar' + last](term, repeat);
                    }.bind(this),
                    [],
                    this,
                    this.delay || 0
                );
            }
        }
    },

    controlCharBS: function(term, repeat) {
        var span = $('span:not(.cursor):last', term.termwin.$window);

        for(var i = 0; i < (repeat || 1); i++) {
            term.termwin.backspace();
        }
    },

    controlCharLF: function(term, repeat) {
        for(var i = 0; i < (repeat || 1); i++) {
            if (i > 0) {
                term.termwin.output('&nbsp;', true);
            } else {
                term.termwin.newline();
            }
        }
    },

    escapeSeqLine: function(line, term) {
        line = line.replace(/^: Esc \[?\s*/, '');

        var color = line.match(/((?:\d+\s*;?\s*)+)/);

        if(color !== null) {
            color = color[1].split(' ; ');

            color.forEach(function(c, i) {
                c = parseInt(c.replace(/^\s+|\s+$/g,''));

                switch(c) {
                    case 0:
                        term.termwin.cursor.reset();
                        break;

                    case 1:
                        term.termwin.cursor.setBold();
                        break;

                    case 39:
                        term.termwin.cursor.resetFgColor();
                        break;

                    case 49:
                        term.termwin.cursor.resetBgColor();
                        break;

                    case 38:
                        c = parseInt(color[i + 2].replace(/^\s+|\s+$/g,''));
                        term.termwin.cursor.setFgColor(c, true);
                        break;

                    case 48:
                        c = parseInt(color[i + 2].replace(/^\s+|\s+$/g,''));
                        term.termwin.cursor.setBgColor(c, true);
                        break;

                    default:
                        if(c >= 30 && c <= 37 && (!color[i - 1] || color[i - 1] != 5)) {
                            term.termwin.cursor.setFgColor(c - 30);
                            break;
                        }

                        if(c >= 40 && c <= 47 && (!color[i - 1] || color[i - 1] != 5)) {
                            term.termwin.cursor.setBgColor(c - 40);
                        }
                }
            }, this);
        } else {
            if(line === 'k') {
                this.stackAction(term.termwin.clearLine, [], term.termwin);
            }
        }
    },

    labelLine: function(line, term) {

    },

    descriptionLine: function(line, term) {
        this.stackAction(term.status, [line.replace(/^"/, '')], term);
    },

    delayLine: function(line, term) {
        this.delay = parseFloat(line.replace(/[^\d\.]/g, ''));
    }
};
