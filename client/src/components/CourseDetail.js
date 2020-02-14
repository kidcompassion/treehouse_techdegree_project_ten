import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // Handles rendering markdown in description and materialsneeded
import axios from 'axios';

class CourseDetail extends Component{

    constructor(props){
        super(props);

        this.state = {
            errorMessage: {},
            authenticatedUser: this.props.context.authenticatedUser || {},
            courseId:this.props.match.params.id,
            courseData: {},
            courseOwner: {},
        }
    }

  componentDidMount(){
    const currentCourseId = this.props.match.params.id;
    let currentComponent = this; // to avoid problem with accessing 'this'
    
    axios.get(`http://localhost:5000/api/courses/${currentCourseId}`)
        .then((response)=>{      
            if(response.data != null){ // Check if this course exists in DB
                currentComponent.setState({
                    courseData: response.data,
                    courseOwner: response.data.User,
                });
            } else{
                // If course doesn'y exist, redirect to 'not found'
                this.props.history.push("/notfound");
            }
        }
        ).catch(
            (err)=>{
                console.log(err.response);
                if(err.response.status === 500){
                    this.props.history.push('/error')
                }else {
                    this.setState({errors: err.response.data.errors});
                }
            }
        )  
    }


    /**
     * Delete this course
     * Run delete course functions from context and redirects users to courses page
     * @param {*} event 
     */
    deleteCourse(event){
        event.preventDefault();
        const encodedCredentials = localStorage.getItem('authHeader');
        axios.delete(`http://localhost:5000/api/courses/${this.state.courseId}`,{headers: {"Authorization" : `Basic ${encodedCredentials}`} })
            .then((response)=>{      
               this.props.history.push('/courses')
            }).catch(
                (err)=>{
                    console.log(err.response);
                    if(err.response.status === 500){
                        this.props.history.push('/error')
                    }else {
                        this.setState({errors: err.response.data.errors});
                    }
                }
            )  
            this.props.history.push('/courses');
    }

    render(){
        return(
            <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            { 
                                // Check if currently logged in user owns this course before letting them edit it
                            }
                            {this.state.authenticatedUser.id === this.state.courseOwner.id && (
                                <span>
                                    <Link to={ `${this.props.match.url}/update`} className="button">Update Course</Link>
                                    <button className="button" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteCourse(e) } }>
                                        Delete Course
                                    </button>
                                </span>
                            )}
                            <Link to="/courses/" className="button button-secondary">
                                Return to List
                            </Link>
                        </div>
                    </div>
                </div>  
            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{this.state.courseData.title}</h3>
                        <p>By { this.state.courseOwner.firstName} { this.state.courseOwner.lastName}</p>
                    </div>
                    {/* Add description via react markdown  */}
                    <div className="course--description">
                        <ReactMarkdown source={this.state.courseData.description} />
                    </div>
                </div>
                <div className="grid-25 grid-right">
                    <div className="course--stats">
                        <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                {
                                // Check to see if this is populated. If so, show data; if not, show "details to come" so user knows it's not an error
                                }
                                {this.state.courseData.estimatedTime ?<h3>{this.state.courseData.estimatedTime}</h3>: <h3>Details coming soon</h3>}
                            </li>
                            <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                {
                                    // Check to see if this is populated. If so, show data; if not, show "details to come" so user knows it's not an error
                                }
                                {this.state.courseData.materialsNeeded ? <ReactMarkdown source={this.state.courseData.materialsNeeded} />: <h3>Details coming soon</h3>}
                                
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
      </div>        
    );
  }
}

export default CourseDetail;