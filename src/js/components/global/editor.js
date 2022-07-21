import {basicSetup} from "codemirror"
import {EditorView, keymap} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"

var codeArea = document.getElementById("codeToExecute")
export const editor = new EditorView({
    extensions: [basicSetup,keymap.of([indentWithTab])],
    parent: codeArea,
})