import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './InterviewList.css'

class InterviewList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      interviews: [],
      participants: [],
      distinctSchedules: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/distinctschedules')
      .then((res) => {
        console.log("res => ", res);
        this.setState({
          distinctSchedules: res.data,
        })

        console.log("Updated STATE : ", this.state.participants);
      })
      .catch((error) => {
        console.log("Error : ", error);
      })


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


    axios.get('http://localhost:5000/interviews')
      .then((res) => {
        console.log("res => ", res);
        this.setState({
          interviews: res.data,
        })
      })
      .catch((error) => {
        console.log("Error : ", error);
      })
  }


  render() {

    // Create Particpant Map
    let participantMap = new Map();
    if (this.state.participants) {
      this.state.participants.forEach((part) => {
        participantMap.set(part.id, `${part.name}(${part.email})`)
      })
     
    }

    

    let finalScehule = this.state.distinctSchedules.map((ds) => {
      let tempRes = this.state.interviews.filter(itr => (
        (ds.date === itr.date) &&
        (ds.startTime === itr.startTime) &&
        (ds.endTime === itr.endTime)));

      let midResult = tempRes.map((tr) => tr.participantId);
      return {
        date: ds.date,
        startTime: ds.startTime,
        endTime: ds.endTime,
        participants: midResult
      }
    })

    console.log("finalScehule : ", finalScehule);


    return (
      <div className="bg-light section">
        <p className='section-heading'>Upcoming Interviews</p>
        <div className="container">
          {finalScehule.map((itr) => {

            return (
              <div className="card">
                <div className='para-top'>
                  <p className='date'><strong>Date:</strong> {itr.date} </p>
                  <p className='time'><strong>Timing:</strong> {itr.startTime} to {itr.endTime}</p>
                </div>
                <p className='date'><strong>Participants:</strong></p>
                <ul className="list-group">
                  {itr.participants.map((oneP) => (
                    <li className="list-group-item">{participantMap.get(oneP)}</li>
                  ))}
                </ul>
                <Link
                  to={{
                    pathname: '/edit',
                    state: {
                      participants: itr.participants,
                      pdate: itr.date,
                      pstarttime: itr.startTime,
                      pendtime: itr.endTime
                    }
                  }}>
                 <button className='edit'>Edit Interview</button></Link>
              </div>
            )

          })}
        </div>
      </div >
    )
  }
}

export default InterviewList;