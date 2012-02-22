/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Kevin Dangoor (kdangoor@mozilla.com)
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


define(function(require, exports, module) {

require("ace/lib/fixoldbrowsers");
var env = {};
    
var net = require("ace/lib/net");
var event = require("ace/lib/event");
var theme = require("ace/theme/textmate");
var EditSession = require("ace/edit_session").EditSession;
var UndoManager = require("ace/undomanager").UndoManager;

var vim = require("ace/keyboard/keybinding/vim").Vim;
var emacs = require("ace/keyboard/keybinding/emacs").Emacs;
var HashHandler = require("ace/keyboard/hash_handler").HashHandler;


var modesByName;

var Doc = function(name, desc, file) {
    this.name = name;
    this.desc = desc;
    this.doc = new EditSession(file);
    this.doc.setMode(modesByName[name].mode);
    this.doc.setUndoManager(new UndoManager());
};

var WrappedDoc = function(name, desc, file) {
    Doc.apply(this, arguments);
    
    this.doc.setUseWrapMode(true);
    this.doc.setWrapLimitRange(80, 80);
};

var Mode = function(name, desc, clazz, extensions) {
    this.name = name;
    this.desc = desc;
    this.clazz = clazz;
    this.mode = new clazz();
    this.mode.name = name;
    
    this.extRe = new RegExp("^.*\\.(" + extensions.join("|") + ")$", "g");
};

Mode.prototype.supportsFile = function(filename) {
    return filename.match(this.extRe);
};

var themes = {};
function loadTheme(name, callback) {
    if (themes[name])
        return callback();
        
    themes[name] = 1;
    var base = name.split("/").pop();
    var fileName = "demo/kitchen-sink/theme-" + base + "-uncompressed.js";
    net.loadScript(fileName, callback);
}

var modes = [
    new Mode("c_cpp", "C/C++", require("ace/mode/c_cpp").Mode, ["c", "cpp", "cxx", "h", "hpp"]),
    new Mode("clojure", "Clojure", require("ace/mode/clojure").Mode, ["clj"]),
    new Mode("coffee", "CoffeeScript", require("ace/mode/coffee").Mode, ["coffee"]),
    new Mode("coldfusion", "ColdFusion", require("ace/mode/coldfusion").Mode, ["cfm"]),
    new Mode("csharp", "C#", require("ace/mode/csharp").Mode, ["cs"]),
    new Mode("css", "CSS", require("ace/mode/css").Mode, ["css"]),
    new Mode("groovy", "Groovy", require("ace/mode/groovy").Mode, ["groovy"]),
    new Mode("haxe", "haXe", require("ace/mode/haxe").Mode, ["hx"]),
    new Mode("html", "HTML", require("ace/mode/html").Mode, ["html", "htm"]),
    new Mode("java", "Java", require("ace/mode/java").Mode, ["java"]),
    new Mode("javascript", "JavaScript", require("ace/mode/javascript").Mode, ["js"]),
    new Mode("json", "JSON", require("ace/mode/json").Mode, ["json"]),
    new Mode("latex", "LaTeX", require("ace/mode/latex").Mode, ["tex"]),
    new Mode("lua", "Lua", require("ace/mode/lua").Mode, ["lua"]),
    new Mode("markdown", "Markdown", require("ace/mode/markdown").Mode, ["md", "markdown"]),
    new Mode("ocaml", "OCaml", require("ace/mode/ocaml").Mode, ["ml", "mli"]),
    new Mode("perl", "Perl", require("ace/mode/perl").Mode, ["pl", "pm"]),
    new Mode("pgsql", "pgSQL",require("ace/mode/pgsql").Mode, ["pgsql", "sql"]),
    new Mode("php", "PHP",require("ace/mode/php").Mode, ["php"]),
    new Mode("powershell", "Powershell", require("ace/mode/powershell").Mode, ["ps1"]),
    new Mode("python", "Python", require("ace/mode/python").Mode, ["py"]),
    new Mode("scala", "Scala", require("ace/mode/scala").Mode, ["scala"]),
    new Mode("scss", "SCSS", require("ace/mode/scss").Mode, ["scss"]),
    new Mode("ruby", "Ruby", require("ace/mode/ruby").Mode, ["rb"]),
    new Mode("sql", "SQL", require("ace/mode/sql").Mode, ["sql"]),
    new Mode("svg", "SVG", require("ace/mode/SVG").Mode, ["svg"]),
    new Mode("text", "Text", require("ace/mode/text").Mode, ["txt"]),
    new Mode("textile", "Textile", require("ace/mode/textile").Mode, ["textile"]),
    new Mode("xml", "XML", require("ace/mode/xml").Mode, ["xml"])
];

modesByName = {};
modes.forEach(function(m) {
    modesByName[m.name] = m;
});

var loreIpsum = require("ace/requirejs/text!./docs/plaintext.txt");
for (var i = 0; i < 5; i++) {
    loreIpsum += loreIpsum;
}

var docs = [
    new Doc(
        "javascript", "JavaScript",
        require("ace/requirejs/text!./docs/javascript.js")
    ),
    new WrappedDoc("text", "Plain Text", loreIpsum),
    new Doc(
        "coffee", "Coffeescript",
        require("ace/requirejs/text!./docs/coffeescript.coffee")
    ),
    new Doc(
        "json", "JSON",
        require("ace/requirejs/text!./docs/json.json")
    ),
    new Doc(
        "css", "CSS",
        require("ace/requirejs/text!./docs/css.css")
    ),
    new Doc(
        "scss", "SCSS",
        require("ace/requirejs/text!./docs/scss.scss")
    ),
    new Doc(
        "html", "HTML",
        require("ace/requirejs/text!./docs/html.html")
    ),
    new Doc(
        "xml", "XML",
        require("ace/requirejs/text!./docs/xml.xml")
    ),
    new Doc(
        "svg", "SVG",
        require("ace/requirejs/text!./docs/svg.svg")
    ),
    new Doc(
        "php", "PHP",
        require("ace/requirejs/text!./docs/php.php")
    ),
    new Doc(
        "coldfusion", "ColdFusion",
        require("ace/requirejs/text!./docs/coldfusion.cfm")
    ),
    new Doc(
        "python", "Python",
        require("ace/requirejs/text!./docs/python.py")
    ),
    new Doc(
        "ruby", "Ruby",
        require("ace/requirejs/text!./docs/ruby.rb")
    ),
    new Doc(
        "perl", "Perl",
        require("ace/requirejs/text!./docs/perl.pl")
    ),
    new Doc(
        "ocaml", "OCaml",
        require("ace/requirejs/text!./docs/ocaml.ml")
    ),
    new Doc(
        "lua", "Lua",
        require("ace/requirejs/text!./docs/lua.lua")
    ),
    new Doc(
        "java", "Java",
        require("ace/requirejs/text!./docs/java.java")
    ),
    new Doc(
        "clojure", "Clojure",
        require("ace/requirejs/text!./docs/clojure.clj")
    ),
    new Doc(
        "groovy", "Groovy",
        require("ace/requirejs/text!./docs/groovy.groovy")
    ),
    new Doc(
        "scala", "Scala",
        require("ace/requirejs/text!./docs/scala.scala")
    ),
    new Doc(
        "csharp", "C#",
        require("ace/requirejs/text!./docs/csharp.cs")
    ),
    new Doc(
        "powershell", "Powershell",
        require("ace/requirejs/text!./docs/powershell.ps1")
    ),
    new Doc(
        "c_cpp", "C/C++",
        require("ace/requirejs/text!./docs/cpp.cpp")
    ),
    new Doc(
        "haxe", "haXe",
        require("ace/requirejs/text!./docs/Haxe.hx")
    ),
    new WrappedDoc(
        "markdown", "Markdown",
        require("ace/requirejs/text!./docs/markdown.md")
    ),
    new WrappedDoc(
        "textile", "Textile",
        require("ace/requirejs/text!./docs/textile.textile")
    ),
    new WrappedDoc(
        "latex", "LaTeX",
        require("ace/requirejs/text!./docs/latex.tex")
    ),
    new WrappedDoc(
        "sql", "SQL",
        require("ace/requirejs/text!./docs/sql.sql")
    ),
    new WrappedDoc(
        "pgsql", "pgSQL",
        require("ace/requirejs/text!./docs/pgsql.pgsql")
    )
];

var docsByName = {};
docs.forEach(function(d) {
    docsByName[d.name] = d;
});

var keybindings = {
    // Null = use "default" keymapping
    ace: null,
    vim: vim,
    emacs: emacs,
    // This is a way to define simple keyboard remappings
    custom: new HashHandler({
        "gotoright":      "Tab",
        "indent":         "]",
        "outdent":        "[",
        "gotolinestart":  "^",
        "gotolineend":    "$"
     })
};

var container = document.getElementById("editor");

// Splitting.
var Split = require("ace/split").Split;
var split = new Split(container, theme, 1);
env.editor = split.getEditor(0);
split.on("focus", function(editor) {
    env.editor = editor;
    updateUIEditorOptions();
});
env.split = split;
window.env = env;
window.ace = env.editor;

function updateUIEditorOptions() {
    var editor = env.editor;
    var session = editor.session;
}


/**
 * This demonstrates how you can define commands and bind shortcuts to them.
 */

// Fake-Save, works from the editor and the command line.
var commands = env.editor.commands;

commands.addCommand({
    name: "save",
    bindKey: {
        win: "Ctrl-S",
        mac: "Command-S",
        sender: "editor"
    },
    exec: function() {
        alert("Fake Save File");
    }
});

// Fake-Print with custom lookup-sender-match function.
commands.addCommand({
    name: "print",
    bindKey: {
        win: "Ctrl-P",
        mac: "Command-P",
        sender: function(env, sender, hashId, keyString) {
            if (sender == "editor") {
                return true;
            } else {
                alert("Sorry, can only print from the editor");
            }
        }
    },
    exec: function() {
        alert("Fake Print File");
    }
});

});

