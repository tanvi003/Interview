import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import './AddInterview.css';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";

const Error = ({ message }) => (
  <div className="alert alert-danger" role="alert">
    OOPS! {message}
  </div>
)

class EditInterview extends Component {

  constructor(props) {
    super(props);

    let {
      pdate,
      pstarttime,
      pendtime,
    } = this.props.location.state;
    this.state = {
      date: new Date(pdate),
      startTime: pstarttime,
      endTime: pendtime,
      participants: [],
      tempPart: [],
      error: false,
      errorMsg: ""
    }

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSelectBoxChange = this.handleSelectBoxChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);

  }

  componentDidMount() {
    axios.get('http://localhost:5000/participants')
      .then((res) => {
        console.log("res => ", res);
        this.setState({
          participants: res.data,
        })

        console.log("Updated STATE : ", this.state.participants);
      })
      .catch((error) => {
        console.log("Error : ", error);
      })
  }

  componentDidUpdate() {
    console.log("State Updated: ", this.state);
  }

  handleFormSubmit(event) {
    event.preventDefault();

    let lisOfparticipants = this.state.tempPart.map((item) => {
      return item.value;
    });

    this.setState({ error: null, errorMsg: '' });

    const newInterview = {
      date: this.state.date,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      participants: lisOfparticipants
    }

    console.log("New Exercise => ", newInterview);

    // making POST REQUEST to backend  
    axios.post('http://localhost:5000/interviews', newInterview)
      .then((res) => {
        console.log("res => ", res);
        console.log(res.data);
        window.location = '/';
      })
      .catch((error) => {
        let errorMsg = error.response.data.message;
        this.setState({
          error: true,
          errorMsg: errorMsg
        })
      })
  }

  handleDateChange(newDate) {
    this.setState({
      date: newDate,
    })
  }

  handleSelectBoxChange(data) {
    this.setState({ tempPart: data });
  }

  handleStartTimeChange(event) {
    this.setState({
      startTime: event.target.value
    })
  }

  handleEndTimeChange(event) {
    this.setState({
      endTime: event.target.value
    })
  }

  getOptions = (users) => {
    const options = [];
    for (let user of users) {
      options.push({ label: user.name, value: user });
    }
    console.log(options,'options')
    return options;
  };


  render() {
    

    return (
      <div className="bg-light section">
        <h3 style={{ textAlign: "center" }}> Create Interview</h3>

        {this.state.error ?
          (<Error message={this.state.errorMsg} />) : (<></>)
        }

        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <label><strong>Select Participants : </strong></label>
            <Select
              isMulti
              closeMenuOnSelect={true}
              name="candidates"
              options={this.getOptions(this.state.participants)}
              className="basic-multi-select"
              classNamePrefix="select"
              value={!this.state.tempPart.length ? this.getOptions(this.state.participants.filter(option => 
              this.props.location.state.participants.includes(option.id))) : this.getOptions(this.state.tempPart.map((item) => item.value ))}
              onChange={(selectedOption) => {
                console.log(selectedOption)
                this.handleSelectBoxChange(selectedOption);
              }}
            />
          </div>

          < div className="form-group" >
            <label><strong>Date: </strong></label>
            <div>
              <DatePicker
                selected={this.state.date}
                onChange={this.handleDateChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label><strong>Start Time:</strong></label>
              <input type="time" className="form-control" id="start_time" value={this.state.startTime}
                onChange={this.handleStartTimeChange} />

            </div>
            <div className="form-group col-md-6">
              <label><strong>End Time:</strong></label>
              <input type="time" className="form-control" id="end_time" value={this.state.endTime}
                onChange={this.handleEndTimeChange} />
            </div>
          </div>

          <div className="form-group">
            <input type="submit" value="Save Details" className="btn btn-primary" />
          </div>
        </form>
      </div>
    )
  }
}

export default EditInterview;