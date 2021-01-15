import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Modal extends React.Component {
  render(){
  const { handleClose, show, children } = this.props;
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h2 className="notes-editor-title">
          Edit Note
        </h2>
        {children}
        <button type="button" className="modal-close" onClick={handleClose}>
          X
        </button>
      </section>
    </div>
  );
}
};

class Note extends React.Component{

  state = {
        show: false,
        title: this.props.title,
        text: this.props.text
      };

    showModal = () => {
      this.setState({ show: true });
    };

    hideModal = () => {
      if(this.state.title !== this.props.title || this.state.text !== this.props.text){
        const notes = JSON.parse(localStorage.getItem('notes'));
        const notesNew = [{id: Date.now(), title: this.state.title, text: this.state.text}, ...notes.filter((_note) => _note.id !== this.props.id)];
        const updatedNotes = JSON.stringify(notesNew);
        localStorage.setItem('notes', updatedNotes);
        this.props.onEdit();
      }
      this.setState({ show: false });
    };

    updateTitle = (e) => {
      this.setState({ title: e.target.value });
    }

    updateText = (e) => {
      this.setState({ text: e.target.value });
    }

  render(){
    const {title, text, onDelete} = this.props;
    return (
      <div>
        <div
          className="note" onClick={this.showModal}>
          <button
            className="note__delete-button"
            type="button"
            onClick={onDelete}>
             x
          </button>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>

        <Modal handleClose={this.hideModal} show={this.state.show}>
            <div>
              <input
                type="text"
                className="note-editor__title" 
                placeholder="Title..."
                value={this.state.title}
                onChange={this.updateTitle}/>
              <textarea
                className="note-editor__text-input"
                placeholder="Enter your note here..."
                onChange={this.updateText}>
                {text}
              </textarea>
            </div>
        </Modal>
      </div>);
  }
}

class NoteEditor extends React.Component{
  state = {title: '', text: ''};

  handleChangeTitle = (e) => {
    this.setState({title: e.target.value});
  }
  handleChangeText = (e) => {
    this.setState({text: e.target.value});
  }

  render(){
    const {title, text} = this.state;
    return (
      <div>
        <input
          type="text"
          className="note-editor__title" 
          placeholder="Title..."
          value={title}
          onChange={this.handleChangeTitle}/>
        <textarea
          className="note-editor__text-input"
          placeholder="Enter your note here..."
          onChange={this.handleChangeText}
          value = {text}>
        </textarea>
        <button
          className="note-editor__add-button"
          type="button"
          onClick={() => this.props.onNoteAdd(title, text)}>
          Add
        </button>
      </div>);
  }
}

class NotesGrid extends React.Component{
  render(){
    const {notes, onNoteDelete, onNoteEdit} = this.props;
    return (
      <div>
        {notes.map((note) => (
          <Note 
            key={note.id} id={note.id} title={note.title} text={note.text} 
            onDelete={() => onNoteDelete(note)} onEdit={() => onNoteEdit()}>
          </Note>))}
      </div>);
  }
}

class NotesApp extends React.Component{
    state = {notes:[
      {id:'', title:'',  text:''}
    ]}
 
  componentDidMount(){
    const localNotes = JSON.parse(localStorage.getItem('notes'));
    if(localNotes){
      this.setState({notes: localNotes});
    }
  }
  
  componentDidUpdate(){
    this.updateLocalStorage();
  }

  updateLocalStorage(){
    const notes = JSON.stringify(this.state.notes);
    localStorage.setItem('notes', notes);
  }

  onNoteAdd = (noteTitle, noteText) => {
    const notesNew = [{id: Date.now(), title: noteTitle, text: noteText}, ...this.state.notes];
    this.setState({notes: notesNew});
  }

  onNoteEdit = () => {
    const localNotes = JSON.parse(localStorage.getItem('notes'));
    if(localNotes){
      this.setState({notes: localNotes});
    }
  }
  
  onNoteDelete = (note) => {
    const notesNew = this.state.notes.filter((_note) => _note.id !== note.id);
    this.setState({notes: notesNew});
  }

  render(){
    return (
      <div className="notes-app">
        <h1 className="app-title">Notes Application</h1>
        <div className="flex-container">
            <div className="notes-grid">
              <h2 className="notes-grid-title">
                Notes
              </h2>
              <NotesGrid notes={this.state.notes} onNoteDelete={this.onNoteDelete} onNoteEdit={this.onNoteEdit}/>
            </div>
            <div className="note-editor">
              <h2 className="notes-editor-title">
                Create Note
              </h2>
              <NoteEditor onNoteAdd={this.onNoteAdd}/>
            </div>
        </div>
    </div>);
  }
}

ReactDOM.render(<NotesApp/>, document.getElementById('root'));