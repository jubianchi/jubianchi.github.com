var colors8 = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

/**
 * Hoa
 *
 *
 * @license
 *
 * New BSD License
 *
 * Copyright © 2007-2014, Ivan Enderlin. All rights reserved.
 *
 * https://github.com/jubianchi/Console/blob/master/Cursor.php
 */
var colors256 = [
    '000000', '800000', '008000', '808000', '000080', '800080',
    '008080', 'c0c0c0', '808080', 'ff0000', '00ff00', 'ffff00',
    '0000ff', 'ff00ff', '00ffff', 'ffffff', '000000', '00005f',
    '000087', '0000af', '0000d7', '0000ff', '005f00', '005f5f',
    '005f87', '005faf', '005fd7', '005fff', '008700', '00875f',
    '008787', '0087af', '0087d7', '0087ff', '00af00', '00af5f',
    '00af87', '00afaf', '00afd7', '00afff', '00d700', '00d75f',
    '00d787', '00d7af', '00d7d7', '00d7ff', '00ff00', '00ff5f',
    '00ff87', '00ffaf', '00ffd7', '00ffff', '5f0000', '5f005f',
    '5f0087', '5f00af', '5f00d7', '5f00ff', '5f5f00', '5f5f5f',
    '5f5f87', '5f5faf', '5f5fd7', '5f5fff', '5f8700', '5f875f',
    '5f8787', '5f87af', '5f87d7', '5f87ff', '5faf00', '5faf5f',
    '5faf87', '5fafaf', '5fafd7', '5fafff', '5fd700', '5fd75f',
    '5fd787', '5fd7af', '5fd7d7', '5fd7ff', '5fff00', '5fff5f',
    '5fff87', '5fffaf', '5fffd7', '5fffff', '870000', '87005f',
    '870087', '8700af', '8700d7', '8700ff', '875f00', '875f5f',
    '875f87', '875faf', '875fd7', '875fff', '878700', '87875f',
    '878787', '8787af', '8787d7', '8787ff', '87af00', '87af5f',
    '87af87', '87afaf', '87afd7', '87afff', '87d700', '87d75f',
    '87d787', '87d7af', '87d7d7', '87d7ff', '87ff00', '87ff5f',
    '87ff87', '87ffaf', '87ffd7', '87ffff', 'af0000', 'af005f',
    'af0087', 'af00af', 'af00d7', 'af00ff', 'af5f00', 'af5f5f',
    'af5f87', 'af5faf', 'af5fd7', 'af5fff', 'af8700', 'af875f',
    'af8787', 'af87af', 'af87d7', 'af87ff', 'afaf00', 'afaf5f',
    'afaf87', 'afafaf', 'afafd7', 'afafff', 'afd700', 'afd75f',
    'afd787', 'afd7af', 'afd7d7', 'afd7ff', 'afff00', 'afff5f',
    'afff87', 'afffaf', 'afffd7', 'afffff', 'd70000', 'd7005f',
    'd70087', 'd700af', 'd700d7', 'd700ff', 'd75f00', 'd75f5f',
    'd75f87', 'd75faf', 'd75fd7', 'd75fff', 'd78700', 'd7875f',
    'd78787', 'd787af', 'd787d7', 'd787ff', 'd7af00', 'd7af5f',
    'd7af87', 'd7afaf', 'd7afd7', 'd7afff', 'd7d700', 'd7d75f',
    'd7d787', 'd7d7af', 'd7d7d7', 'd7d7ff', 'd7ff00', 'd7ff5f',
    'd7ff87', 'd7ffaf', 'd7ffd7', 'd7ffff', 'ff0000', 'ff005f',
    'ff0087', 'ff00af', 'ff00d7', 'ff00ff', 'ff5f00', 'ff5f5f',
    'ff5f87', 'ff5faf', 'ff5fd7', 'ff5fff', 'ff8700', 'ff875f',
    'ff8787', 'ff87af', 'ff87d7', 'ff87ff', 'ffaf00', 'ffaf5f',
    'ffaf87', 'ffafaf', 'ffafd7', 'ffafff', 'ffd700', 'ffd75f',
    'ffd787', 'ffd7af', 'ffd7d7', 'ffd7ff', 'ffff00', 'ffff5f',
    'ffff87', 'ffffaf', 'ffffd7', 'ffffff', '080808', '121212',
    '1c1c1c', '262626', '303030', '3a3a3a', '444444', '4e4e4e',
    '585858', '606060', '666666', '767676', '808080', '8a8a8a',
    '949494', '9e9e9e', 'a8a8a8', 'b2b2b2', 'bcbcbc', 'c6c6c6',
    'd0d0d0', 'dadada', 'e4e4e4', 'eeeeee'
];

var reseq = {
    init: function(tsq) {
        this.data = tsq.split('\n');

        this.buffer = '';
        this.styles = {};

        return this;
    },

    execute: function(term) {
        term.stackAction(term.disableInput, [], term);

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
                    term.stackAction(term.output, [this.buffer], term);
                    this.buffer = '';

                    this.resetFgColor();
                    this.resetBgColor();

                    term.stackAction(term.prompt, [], term);
                }
            },
            this
        );

        term.stackAction(term.enableInput, [], term);
    },

    textLine: function(line, term) {
        line = line.replace(/^\|/, '');
        line = line.replace(/\|$/, '');
        line = line.replace(/\|\.$/, '');

        line.split('').forEach(function(c) {
            term.stackAction(term.termwin.type, [c], term.termwin);
        });
    },

    outputLine: function(line, term) {
        line = line.replace(/^>/, '');
        line = line.replace(/>$/, '');
        line = line.replace(/\s{1}/g, '&nbsp;');

        if(line.match(/>\.$/)) {
            line = line.replace(/>\.$/, '<br/>');

            this.resetBold();
            this.resetFgColor();
            this.resetBgColor();
        }

        this.buffer = this.buffer + this.applyStyle(line);
    },

    controlCharLine: function(line, term) {
        var char = line.match(/^\. ((?:[^\/]+\/.*? ?)+)/);

        if(char) {
            char[1].split(' ').forEach(function(c) {
                c = c.match(/([^\/]+)/);

                switch(c[1]) {
                    case 'BS':
                        term.stackAction(term.termwin.backspace, [], term.termwin);
                        break;
                }
            }, this);
        }
    },

    escapeSeqLine: function(line, term) {
        line = line.replace(/^: Esc \[\s*/, '');

        var color = line.match(/((?:\d+\s*;?\s*)+)/);

        if(color !== null) {
            color = color[1].split(' ; ');

            if(color[0] > 0) {
                color.forEach(function(c, i) {
                    c = parseInt(c.replace(/^\s+|\s+$/g,''));

                    if(c == 0) {
                        this.resetBold();
                        this.resetFgColor();
                        this.resetBgColor();

                        return;
                    }

                    if(c == 1) {
                        this.setBold();

                        return;
                    }

                    if(c == 39) {
                        this.resetFgColor();

                        return;
                    }

                    if(c == 49) {
                        this.resetBgColor();

                        return;
                    }

                    if(c == 38) {
                        c = parseInt(color[i + 2].replace(/^\s+|\s+$/g,''));
                        this.setFgColor('#' + colors256[c]);

                        return;
                    }

                    if(c == 48) {
                        c = parseInt(color[i + 2].replace(/^\s+|\s+$/g,''));
                        this.setBgColor('#' + colors256[c]);

                        return;
                    }

                    if(c >= 30 && c <= 37 && (!color[i - 1] || color[i - 1] != 5)) {
                        this.setFgColor(colors8[c - 30]);

                        return;
                    }

                    if(c >= 40 && c <= 47 && (!color[i - 1] || color[i - 1] != 5)) {
                        this.setBgColor(colors8[c - 40]);
                    }
                }, this);
            }
        }
    },

    setBold: function() {
        this.styles['weight'] = 'bold';
    },

    resetBold: function() {
        this.styles['weight'] = 'normal';
    },

    setFgColor: function(color) {
        this.styles['fg'] = color;
    },

    resetFgColor: function() {
        this.styles['fg'] = null;
    },

    setBgColor: function(color) {
        this.styles['bg'] = color;
    },

    resetBgColor: function() {
        this.styles['bg'] = null;
    },

    applyStyle: function(line) {
        return '<span style="background-color: ' + (this.styles['bg'] || 'transparent') + '; color: ' + (this.styles['fg'] || 'white') + '; font-weight: ' + (this.styles['weight'] || 'normal') + '">' + line + '</span>';
    },

    labelLine: function(line, term) {

    },

    descriptionLine: function(line, term) {
        term.stackAction(term.status, [line.replace(/^"/, '')], term);
    },

    delayLine: function(line, term) {

    }
};
