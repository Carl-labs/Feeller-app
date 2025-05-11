import { history, undo, redo } from 'prosemirror-history';
import { Schema } from "prosemirror-model";
import { toggleMark, chainCommands, newlineInCode, createParagraphNear, liftEmptyBlock, splitBlockKeepMarks, deleteSelection, joinForward, joinBackward } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import placeholderPlugin from './Plugins/placeholderPlugin';


export const mySchema = new Schema({
    nodes: {
        doc: { content: "block+" },
        paragraph: { content: "inline*", group: "block", parseDOM: [{ tag: "p" }], toDOM: () => ["p", 0] },
        text: { group: "inline" }
    },
    marks: {
        bold: { parseDOM: [{ tag: "strong" }], toDOM: () => ["strong", 0] },
        italic: { parseDOM: [{ tag: "i" }], toDOM: () => ["i", 0] },
        underline: { parseDOM: [{ tag: "u" }], toDOM: () => ["u", 0] },
        strikethrough: { parseDOM: [{ tag: "s" }], toDOM: () => ["s", 0] }
    }
});

export function toggleBold(schema) {
    return toggleMark(schema.marks.bold);
}

export function toggleItalic(schema) {
    return toggleMark(schema.marks.italic);
}

export function toggleUnderline(schema) {
    return toggleMark(schema.marks.underline);
}

export function toggleStrikethrough(schema) {
    return toggleMark(schema.marks.strikethrough);
}

// Custom delete function to remove text on selection and carry lower line if cursor is on end 
export const customDelete = chainCommands(deleteSelection, (state, dispatch) => {
    const { $cursor } = state.selection;
    if ($cursor && $cursor.pos === $cursor.end()) {
        return joinForward(state, dispatch);
    }
    return false;
});

// Custom backspace function to go to above line if cursor is on start
export const customBackspace = chainCommands(deleteSelection, (state, dispatch) => {
    const { $cursor } = state.selection;
    if ($cursor) {
        if ($cursor.pos === $cursor.start()) {
            return joinBackward(state, dispatch);
        }
    }
    return false;
});

// Custom tab function
export function insertTab(state, dispatch) {
    if (dispatch) {
        dispatch(state.tr.insertText("\t"));
    }
    return true;
}   

function normalizeKeymap(keymap) {
    const normalizedKeymap = {};
    for (const [key, command] of Object.entries(keymap)) {
        if (key === "Mod-b" || key === "Mod-i" || key === "Mod-u" || key === "Mod-z" || key === "Mod-y") {
            normalizedKeymap[key.toLowerCase()] = command;
            normalizedKeymap[key.toUpperCase()] = command;
        } else {
            normalizedKeymap[key] = command;
        }
    }
    return normalizedKeymap;
}

const myKeymap = normalizeKeymap({
    "Mod-b": toggleBold(mySchema), // Use ⌘-B / Ctrl-B to toggle bold
    "Mod-i": toggleItalic(mySchema), // Use ⌘-I / Ctrl-I to toggle italic
    "Mod-u": toggleUnderline(mySchema), // Use ⌘-U / Ctrl-U to toggle underline
    "Alt-s": toggleStrikethrough(mySchema), // Use Alt-S to toggle strikethrough
    "Mod-z": undo, // Use ⌘-Z / Ctrl-Z to undo
    "Mod-y": redo, // Use ⌘-Y / Ctrl-Y to redo
    "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlockKeepMarks), //Enter key functionality
    "Delete": customDelete, // Delete key functionality
    "Backspace": customBackspace, // Backspace functionality
    "Tab": insertTab //Tab functionality
});

// Feeller plugins
export const feellerPlugins = [
    placeholderPlugin('Write something down...'),
    history(),
    keymap(myKeymap)
];