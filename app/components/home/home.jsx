import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Slide from '@material-ui/core/Slide'
import Styles from './style'

// UI wrappers.
import { withStyles, withTheme } from '@material-ui/core/styles'

import { checkRedirectToWelcomePage } from '../../utils/api.electron'
import NotesPanel from '../notesPanel'
import Dashboard from '../dashboard'
import WebView  from 'react-electron-web-view';
import { db, selectAll } from '../../utils/db2';
/**
 * Home Component
 */
class Home extends React.Component {
  static propTypes = {
    /**
     * ID of current selected note
     */
    selectedNoteID: PropTypes.string.isRequired,
    /**
     * used to determine if there are notes or not
     */
    hasNotes: PropTypes.bool.isRequired,
    /**
     * fetches notes from database into notes array
     */
    fetchAllNotes: PropTypes.func.isRequired,

    setIsSignedIn: PropTypes.func,

    internet: PropTypes.bool.isRequired,

    idMenu: PropTypes.string.isRequired,

    styleData: PropTypes.object.isRequired,
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
    this.getHomeContent = this.getHomeContent.bind(this)
    this.state = {
      url : props.url, //title de l'item du menu sélectionnée
      isUrl: true
    };
  console.log("funchome = " + this.setIsSignedIn);
  }

  /**
   * Called after mounting component.
   */
  componentDidMount () {
    // Trigger fetching notes as this component is loaded.
      this.props.fetchAllNotes(this.props.idMenu)
  }


  /**
   * Decides whether to show NoteEditor or Dashboard component.
   * @return {element}
   */
  getHomeContent () {
    const chargerPageWebView = (temp) => {
      for (let i = 0; i < temp.length; i++){
        if(temp[i]._id == this.props.selectedNoteID){ // Note sélectionné parmi toutes les notes
          var value = "";
          if (temp[i].url != "#"){
            console.log("url");
            value = temp[i].url;
            if (this.state.isUrl != true){ //éviter les raffraichissement du component
              this.setState({
                isUrl : true
              })
            }
          }
          else {
            console.log("non url");
            value = temp[i].title;
            if (this.state.isUrl != false){ //éviter les raffraichissement du component
              this.setState({
                isUrl : false
              })
            }
          }
          if (this.state.url != value){ //url déjà sélectionné ?
            this.setState({
              url : value
            })
          }
        }
      }
    }
    // Show homeContent when no note is selected.
    if (this.props.selectedNoteID) {
      selectAll(chargerPageWebView,this.props.idMenu);
      let dir = "file://"  + __dirname + "OpinakaApps/" + this.state.url + "/index.html"
      return (<WebView className="WebView" src={(this.state.isUrl ? this.state.url : dir)}
      style={{
        'height' : '100%',
        'width' : '100%',
    }} nodeintegration webpreferences="allowRunningInsecureContent" ></WebView>)
      }
    return <Dashboard internet={this.props.internet} styleData={this.props.styleData}/>
  }

  /**
   * Rendering method
   */
  render () {
    if (checkRedirectToWelcomePage()) {
      return <Redirect to='/welcome' />
    }

    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Slide in>
          <Grid container>
            {this.props.hasNotes ? (
              <Grid className="NotePanel" item xs={4}>
                <Paper className={classes.paper}>
                  {this.props.setIsSignedIn ? <NotesPanel idMenu={this.props.idMenu} internet={this.props.internet} setIsSignedIn={this.props.setIsSignedIn}/>
                  : <NotesPanel idMenu={this.props.idMenu} internet={this.props.internet}/>}
                </Paper>
              </Grid>
            ) : (
              ''
            )}
            <Grid item xs>
              <Paper className="WebView"/*{classes.paper}*/>{this.getHomeContent()}</Paper>
            </Grid>
          </Grid>
        </Slide>
      </div>
    )
  }
}
export default withTheme()(withStyles(Styles)(Home))
