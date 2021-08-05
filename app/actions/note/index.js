import { createAction } from 'redux-actions'
import logger from 'electron-log'
import { ACTIONS } from '../../constants/actions'
import { addNote, removeNote } from '../../utils/db'
import { getDefaultstartupNoteId, getDefaultStartupMode } from '../../utils/api.electron'
import { fetchNotes, cacher, toutAfficher, searchNote } from '../../utils/db2'

/** Used for adding a new note. */
const addNewNote = createAction(ACTIONS.ADD_NOTE)

/** Used for updating notes with fetched notes from database. */
const updateNotesList = createAction(ACTIONS.NOTES_FETCH_SUCCESS)

/** Used for updating search with text results */
const updateSearchList = createAction(ACTIONS.NOTES_SEARCH_UPDATE)

/** Used for setting the index of selected note. */
const setSelectedNoteID = createAction(ACTIONS.SET_SELECTED_NOTE_ID)

/** Used for updating title, content and modified values for the selected note. */
const editSelectedNote = createAction(ACTIONS.EDIT_SELECTED_NOTE)

/** Used for updating rev of the selected note. */
const updateSelectedNoteRev = createAction(ACTIONS.UPDATE_SELECTED_NOTE_REV)

/** Used for deleting a note from noteList. */
const deleteSelectedNote = createAction(ACTIONS.DELETE_SELECTED_NOTE)

/** Async method, Used for fetching all notes from database. */
const fetchAllNotes = (id) => dispatch => {
fetchNotes(id)
.then(result => {
  // Update only if there are notes.
  if (result.length > 0) {
        console.log("result" + result);
    dispatch(updateNotesList(result))
    var mode = getDefaultStartupMode()
    if (mode === 'NEW') {
      dispatch(createNote())
    } else if (mode !== 'NONE') {
      dispatch(setSelectedNoteID(getDefaultstartupNoteId()))
    }
  }
})
.catch(err => {
  logger.error('Unable to fetch notes: ' + JSON.stringify(err))
})
}

/**
 * Async method, used for saving note to database.
 */
const createNote = (id) => dispatch => {
  return new Promise((result, reject) => {
   toutAfficher(id).then(() => {
    result(true);
   })
  })
}

/**
 * Async method, used for updating note in database.
 */
const saveSelectedNote = () => (dispatch, getState) => {
  const state = getState().noteReducer
  const selectedNoteID = state.get('selectedNoteID')
  const selectedNote = state.get('notes')[selectedNoteID]
  addNote(
    selectedNoteID,
    selectedNote.title,
    selectedNote.content,
    selectedNote.modified,
    selectedNote.rev
  )
    .then(result => {
      if (result.ok) {
        // Update note rev to avoid conflicts while the next time for saving
        // this note.
        dispatch(updateSelectedNoteRev(result.rev))
      }
    })
    .catch(err => {
      logger.error('Unable to update note: ' + JSON.stringify(err))
    })
}

/** Async method, used for removing active note from database. */
/*const removeSelectedNote = () => (dispatch, getState,) => {
  const state = getState().noteReducer
  const selectedNoteID = state.get('selectedNoteID')
  const selectedNote = state.get('notes')[selectedNoteID]
  cacher(JSON.stringify(selectedNote));
  /*removeNote(selectedNoteID, selectedNote.rev)
    .then(result => {
      dispatch(deleteSelectedNote())
    })
    .catch(err => {
      logger.error('Unable to remove note ' + JSON.stringify(err))
    })*/
//}
const removeSelectedNote = (note,id) => {
  return new Promise((result, reject) => {
    console.log("note ? " + note);
    cacher(note,id).then(() => {
      result(true);
    })
  })
}

/** Async method, user for searching for note with query */
const searchNoteContains = query => dispatch => {
  searchNote(query)
    .then(result => {
      dispatch(updateSearchList(result.rows))
    })
    .catch(err => {
      logger.error('Unable to search for note ' + JSON.stringify(err))
    })
}

export {
  updateNotesList,
  addNewNote,
  setSelectedNoteID,
  editSelectedNote,
  updateSelectedNoteRev,
  fetchAllNotes,
  createNote,
  saveSelectedNote,
  deleteSelectedNote,
  removeSelectedNote,
  updateSearchList,
  searchNoteContains
}
