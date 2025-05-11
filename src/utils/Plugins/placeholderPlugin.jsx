import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import css from "../../assets/css/note.module.css";

export default function placeholderPlugin(placeholderText) {
    return new Plugin({
        props: {
            decorations(state) {
                const decorations = [];
                const { doc } = state;
                const isEmpty = doc.childCount === 1 && doc.firstChild.isTextblock && doc.firstChild.content.size === 0;
                if (isEmpty) {
                    const placeholder = document.createElement('span');
                    placeholder.className = css.placeholder;
                    placeholder.textContent = placeholderText;
                    decorations.push(Decoration.widget(1, placeholder));
                }
                return DecorationSet.create(doc, decorations);
            }
        }
    });
}