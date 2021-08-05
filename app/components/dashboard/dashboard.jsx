import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'
import Styles from './style'


// UI wrappers.
import { withStyles, withTheme } from '@material-ui/core/styles'

/**
 * Dashboard Component
 */
class Dashboard extends React.Component {
  static propTypes = {
    /**
     * adds a new note
     */
    createNote: PropTypes.func.isRequired,
    /**
     * styles for this component
     */
    classes: PropTypes.object.isRequired,
    /**
     * theme used generally in App
     */
    theme: PropTypes.object.isRequired,

    styleData: PropTypes.object.isRequired,

    internet: PropTypes.bool.isRequired,
    /**
     * gets current translation
     */
    t: PropTypes.func.isRequired,
    /**
     * used for navigation
     */
    history: PropTypes.object.isRequired
  }

  /**
   * this is constructor description.
   * @param {object} props passed to component
   */
  constructor (props) {
    super()

    this.onClickNewNote = this.onClickNewNote.bind(this)
    this.onClickNoteBook = this.onClickNoteBook.bind(this)
    this.onClickSettings = this.onClickSettings.bind(this)
    this.onClickAbout = this.onClickAbout.bind(this)
  }

  /**
   * Called when users clicks on new note button.
   */
  onClickNewNote () {
    this.props.createNote()
  }

  /**
   * Called when users clicks on notebook button.
   */
  onClickNoteBook () {
    this.props.history.push('/notebooks')
  }

  /**
   * Called when users clicks on settings button.
   */
  onClickSettings () {
    this.props.history.push('/settings')
  }

  /**
   * Called when users clicks on about button.
   */
  onClickAbout () {
    this.props.history.push('/about')
  }

  /**
   * Rendering method
   */
  render () {
    const { classes, t } = this.props
    return (
      <Fade in>
        <div className={classes.root}>
          <img className={classes.img} src={(this.props.internet ? this.props.styleData.loginPage.design.logo.backgroundImage : require('../../assets/images/Opinaka.png'))} />
          <Typography variant='h5' className={classes.item}>
            {t('dashboard:Welcome')}
          </Typography>
        </div>
      </Fade>
    )
  }
}
export default withTheme()(withStyles(Styles)(Dashboard))
