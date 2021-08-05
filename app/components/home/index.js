import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchAllNotes } from '../../actions/note'

import Home from './home'

const mapStateToProps = state => ({
  selectedNoteID: state.noteReducer.get('selectedNoteID'),
  hasNotes: Object.keys(state.noteReducer.get('notes')).length !== 0
})

const mapDispatchToProps = dispatch => ({
  fetchAllNotes: (id) => dispatch(fetchAllNotes(id))
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Home)
