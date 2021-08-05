import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Styles from './style'

// UI wrappers.
import { withStyles, withTheme } from '@material-ui/core/styles'
import { getDefaultStartupMode, getDefaultstartupNoteId } from '../../utils/api.electron'

/**
 * NoteListItem Component
 */
class NoteListItem extends React.Component {
  static propTypes = {
    /**
     * id of current item
     */
    id: PropTypes.string.isRequired,
    /**
     * text will be shown in this item
     */
    text: PropTypes.string,
    /**
     * Modification date of this item
     */
    modified: PropTypes.number,
    /**
     * is current item selected or not
     */
    selected: PropTypes.bool.isRequired,
    /**
     * callback called when user clicks on this item
     */
    onClick: PropTypes.func.isRequired,
    /**
     * callback called when user clicks on delete button
     */
    onDelete: PropTypes.func.isRequired,
    /**
     * callback called when user clicks on important button
     */
    onImportant: PropTypes.func.isRequired,
    /**
     * callback called when user clicks on notebook button
     */
    onNoteBook: PropTypes.func.isRequired,
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

    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleOnDeleteClick = this.handleOnDeleteClick.bind(this)
    this.handleOnNoteBookClick = this.handleOnNoteBookClick.bind(this)
    this.handleOnImportantClick = this.handleOnImportantClick.bind(this)
  }

  /**
   * Called when user clicks on this item
   */
  handleOnClick () {
    this.props.onClick(this.props.id)
    console.log(this.props);
  }

  /**
   * Called when user clicks on delete button
   */
  handleOnDeleteClick () {
    this.props.onDelete(this.props.id)
  }

  /**
   * called when user clicks on info button
   */
  handleOnImportantClick () {
    this.props.onImportant(this.props.id)
  }

  /**
   * called when user clicks on notebook button
   */
  handleOnNoteBookClick () {
    this.props.onNoteBook(this.props.id, this.props.isInNoteBook)
  }

  /**
   * Rendering method
   */
  render () {
    //classes contient est un tableau avec les elements de props
    const { classes } = this.props
    //text contient le titre de la note
    const text = this.props.text || 'Empty note'
    //modified contient la date de dernière modification
    const modified = this.props.modified ? moment(this.props.modified).format('llll') : ''
    return (
      /* ne se change pas à priori mais à générer tout de meme (jusqu'à div className)
      Ensuite divclassenamecustomnote, on gère celui est en train d'être custom
      Ensuite c'est le noteBook
      Ensuite le text de l'icone (titre + modification)
      Enfin, il gère le bouton supprimer
      */
      <ListItem
        button
        color='primary'
        className={classes.listItem}
        classes={{
          root: classes.listItemRoot,
          selected: classes.selected
        }}
        selected={this.props.selected}
        onClick={this.handleOnClick}
      >
        {/* <div className={classes.CustomNote}>
          {this.props.selected && getDefaultStartupMode() === 'CUSTOM' ? (
            <IconButton
              color={getDefaultstartupNoteId() === this.props.id ? 'secondary' : 'primary'}
              onClick={this.handleOnImportantClick}
            >
              <InfoIcon />
            </IconButton>
          ) : (
            ''
          )}
        </div> */}
        <ListItemText
          classes={{
            primary: classes.listItemText,
            secondary: classes.listItemText
          }}
          className={classes.listItemText}
          primary={text}
          secondary={modified}
        />
        <ListItemSecondaryAction>
          {this.props.selected ? (
            <img className="icons" src={require('../../assets/images/iconeMenu/poubelle.png')} width='25px' onClick={this.handleOnDeleteClick}/>
          ) : (
            ''
          )}
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}
export default withTheme()(withStyles(Styles)(NoteListItem))
