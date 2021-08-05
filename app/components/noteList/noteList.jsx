import React from 'react'
import PropTypes from 'prop-types'
import { Scrollbars } from 'react-custom-scrollbars'
import List from '@material-ui/core/List'
import FlipMove from 'react-flip-move'
import Styles from './style'
import { db, selectAll, syncMenu, syncUsers, loadMenuUser, fetchNotes } from '../../utils/db2'
import { removeSelectedNote } from '../../actions/note'

// UI wrappers.
import { withStyles, withTheme } from '@material-ui/core/styles'

import NoteListItem from '../noteListItem'
/**
 * NoteList Component
 */
class NoteList extends React.Component {
  static propTypes = {
    /**
     * index of current selected note
     */
    selectedNoteID: PropTypes.string.isRequired,
    /**
     * array of notes
     */
    notes: PropTypes.array.isRequired,
    /**
     * notes of the current active notebook
     */
    noteBookNotes: PropTypes.object.isRequired,

    fetchAllNotes: PropTypes.func.isRequired,

    internet: PropTypes.bool.isRequired,

    idMenu: PropTypes.string.isRequired,

    list: PropTypes.array.isRequired,
    /**
     * index of active notebook
     */
    activeNoteBookID: PropTypes.string.isRequired,
    /**
     * selects note with ID
     */
    setSelectedNoteID: PropTypes.func.isRequired,
    /**
     * set note as custom startup note
     */
    setCustomStartupNote: PropTypes.func.isRequired,
    /**
     * adds note to active notebook
     */
    addToActiveNoteBook: PropTypes.func.isRequired,
    /**
     * removes note from active notebook
     */
    removeFromActiveNoteBook: PropTypes.func.isRequired,
    /**
     * save changes for active notebook
     */
    saveActiveNoteBook: PropTypes.func.isRequired,
    /**
     * styles for this component
     */
    classes: PropTypes.object.isRequired,
    /**
     * theme used generally in App
     */
    theme: PropTypes.object.isRequired
  }

  /**
   * this is constructor description.
   * @param {object} props passed to component
   */
  constructor (props) {
    super()
    this.handleOnNoteSelect = this.handleOnNoteSelect.bind(this)
    this.handleOnNoteDelete = this.handleOnNoteDelete.bind(this)
    this.handleOnNoteBookClick = this.handleOnNoteBookClick.bind(this)
    this.handleOnCustom = this.handleOnCustom.bind(this)
    this.state = {
      listItems: props.list,
    };
    //startNoteList();
   //selectAll(afficherMenu);

    this.menuRender = () => {
      console.log("props : " + JSON.stringify(this.state.listItems))
      return this.state.listItems.map(note => (
        (note.status == 1 ? // savoir s'il faut afficher ou pas
        <NoteListItem
          key={note._id}
          id={note._id}
          text={note.title}
          selected={this.props.selectedNoteID === note._id}
          isInNoteBook={Boolean(this.props.noteBookNotes[note._id])}
          noteBookIsActive={this.props.activeNoteBookID !== 'none'}
          onClick={this.handleOnNoteSelect}
          onDelete={this.handleOnNoteDelete}
          onImportant={this.handleOnCustom}
          onNoteBook={this.handleOnNoteBookClick}
        />
        : null)
      ))

    }
  }

  afficherMenu = (temp) => {
    this.setState({
      listItems: temp,
    });
  }
  // startDisplay = () => {
  //   syncMenu().then((value) => {
  //     if (value){
  //         syncUsers().then((value2) => {
  //           if (value2){
  //             console.log("ouiii");
  //             selectAll(this.afficherMenu,this.props.idMenu);
  //           }
  //         })
  //       }
  //     })
  //   }
  startNoteList = () => {
    // if (this.props.internet){
    //   this.startDisplay();
    // }
    // else {
      selectAll(this.afficherMenu,this.props.idMenu);
    //   }
    }

    componentDidMount(){
      this.startNoteList();
    }

    componentWillReceiveProps(props){
      selectAll(this.afficherMenu,props.idMenu);
    }



  /**
   * Called when user selects a note
   */
  handleOnNoteSelect (noteID) {
    // Do nothing as it's already selected.
    if (this.props.selectedNoteID === noteID) {
      return
    }

    this.props.setSelectedNoteID(noteID)
  }

  /**
   * Called when user clicks for deleting selected note
   */
  handleOnNoteDelete () {
    const findNoteSelected = () => {
      for (let note of this.props.notes){
        if (note._id == this.props.selectedNoteID){
          return note;
        }
      }
    }
    console.log(" oui ? " + findNoteSelected());
    removeSelectedNote(findNoteSelected(),this.props.idMenu).then(() => {
      selectAll(this.afficherMenu,this.props.idMenu);
    });
  }

  /**
   * Called when user clicks on custom note
   */
  handleOnCustom (noteID) {
    this.props.setCustomStartupNote(noteID)
  }

  /**
   * Called when user clicks on notebook icon
   */
  handleOnNoteBookClick (noteID, isInNoteBook) {
    if (isInNoteBook) {
      this.props.removeFromActiveNoteBook(noteID)
      this.props.removeFromNoteIDs(noteID)
      this.props.saveActiveNoteBook()
    } else {
      this.props.addToActiveNoteBook(noteID)
      this.props.addToNoteIDs(noteID)
      this.props.saveActiveNoteBook()
    }
  }





  /**
   * Rendering method
   */
  render () {
    console.log(this.props.notes);
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Scrollbars>
          <List component='nav' className={classes.list}>
            <FlipMove typeName={null}>
              {this.menuRender()}
            </FlipMove>
          </List>
        </Scrollbars>
      </div>
    )
  }
}


export default withTheme()(withStyles(Styles)(NoteList))
