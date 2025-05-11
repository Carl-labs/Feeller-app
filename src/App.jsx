import { TitleBar } from './components/TitleBar.js';
import './index.css'
import css from "../src/assets/css/note.module.css";
import { feellerPlugins, mySchema } from "./utils/@core-engine.jsx";
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useEffect, useState } from 'react';

export default function App() {
  const [viewState, setViewState] = useState();

  // Create the editor state without initial content
  const state = EditorState.create({
    schema: mySchema,
    plugins: feellerPlugins
  });
  useEffect(() => {
    const view = new EditorView(document.querySelector("#editor"), {
        state: state,
        dispatchTransaction(transaction) {
            const newState = view.state.apply(transaction);
            view.updateState(newState);
        },
        handlePaste(view, event) {
            const text = event.clipboardData.getData('text/plain');
            const lines = text.split("\n").map(line => mySchema.node("paragraph", null, mySchema.text(line)));
            const fragment = mySchema.nodes.doc.create(null, lines);                
            const transaction = view.state.tr.replaceSelectionWith(fragment);
            view.dispatch(transaction);
            return true;
        }
    });

    setViewState(view);

    view.focus();      
    return () => {
        view.destroy();
    };
    }, []);
  return (
    <div>
      <TitleBar />
      <div id="editor" className={css.editor}/>
    </div>
  );
}