import React from 'react'
import PropTypes from 'prop-types'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Styles from './style'
import { firebase } from '../../utils/firebaseConfig';
import { selectAll } from '../../utils/db2'


// UI wrappers.
import { withStyles, withTheme } from '@material-ui/core/styles'

import NoteList from '../noteList'

/**
 * NotesPanel Component
 */
class NotesPanel extends React.Component {
  static propTypes = {
    /**
     * adds a new note
     */
    createNote: PropTypes.func.isRequired,

    /**
     * shows dashboard
     */
    showDashboard: PropTypes.func.isRequired,
    /**
     * searches for a note
     */
    searchNote: PropTypes.func.isRequired,

    internet: PropTypes.bool.isRequired,

    setIsSignedIn: PropTypes.func,

    idMenu: PropTypes.string.isRequired,
    /**
     * clears results of search
     */
    clearSearch: PropTypes.func.isRequired,
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

    this.saveTimer = null
    this.previousQuery = null
    this.state = {
      list: [],
    };

    this.handleOnClickNewNote = this.handleOnClickNewNote.bind(this)
    this.handleViewDashboard = this.handleViewDashboard.bind(this)
    this.handleOnSearch = this.handleOnSearch.bind(this)
    this.logOut = this.logOut.bind(this)

    console.log("func = " + props.setIsSignedIn);
  }

  logOut = () => {
    if (firebase.auth().currentUser){
      firebase.auth().signOut();
    }
      this.props.setIsSignedIn(false);
  }

  afficherMenu = (temp) => {
    this.setState({
      list: temp,
    });
  }

  /**
   * Called when user clicks on new note button.
   */
  handleOnClickNewNote () {
    this.props.createNote(this.props.idMenu).then(() => {
      selectAll(this.afficherMenu,this.props.idMenu);
    })
  }

  /**
   * Called when user clicks on view dashboard button.
   */
  handleViewDashboard () {
    // deselects selected note.
    this.props.showDashboard()
  }

  /**
   * Called when user writes in searchbox.
   */
  handleOnSearch (event) {
    const query = event.target.value.trim()
    if (query === this.previousQuery) {
      return
    }

    this.previousQuery = query

    if (!query) {
      this.props.clearSearch()
      clearTimeout(this.saveTimer)
      return
    }

    // There is a change in content
    if (this.saveTimer) {
      clearTimeout(this.saveTimer)
    }
    this.saveTimer = setTimeout(() => {
      this.props.searchNote(query)
    }, 300)
  }

  /**
   * Rendering method
   */
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Toolbar variant='dense' className={classes.toolbar}>
            <img className="icons" src={require('../../assets/images/iconeMenu/refresh.png')} width="25px" onClick={this.handleOnClickNewNote}/>
            <img className="icons" src={require('../../assets/images/iconeMenu/menu.png')} width="25px" onClick={this.handleViewDashboard}/>
            <img className="icons" src={require('../../assets/images/iconeMenu/exit.png')} width="25px" onClick={this.logOut}/>
          </Toolbar>
        </AppBar>
        <NoteList list={this.state.list} idMenu={this.props.idMenu} internet={this.props.internet}/>
      </div>
    )
  }
}
export default withTheme()(withStyles(Styles)(NotesPanel))
