import React from 'react'
import ReactDOM from 'react-dom'
import Axios from 'axios'

class ResultList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      subjects: [{_id:1,className:"test"}]
    }
  }
  componentDidMount() {
    Axios.get("/student/ishankstudent/subjects2").then(res => {
      console.log( res.data.subjects[0]._id)
      this.setState({isLoaded: true, subjects: res.data.subjects})
    }).catch(err => console.log(err))
  }
  render() {
    const {error, isLoaded, subjects} = this.state;

    return <div>
      <ul className="collection">
         {subjects.map(subject => (
           <li key={subject._id} className="collection-item">
             {subject.subjectName} {subject.className}
           </li>
         ))}
       </ul>
    </div>
  }
}

ReactDOM.render(<ResultList/>, document.getElementById('react-element'));
