import React from 'react';
import Courses from './components/Courses';
import CourseDetails from './components/CourseDetails';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CreateCourse from './components/CreateCourse'
import UserSignOut from './components/UserSignOut';
import UpdateCourse from './components/UpdateCourse';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
import { Header } from './components/Header';
import { Data } from './components/Data';

import { withContext }  from './components/Context';
import PrivateRoute from './PrivateRoute';

import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';


const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CreateCourseWithContext = withContext(CreateCourse);
const UserSignOutWithContext = withContext(UserSignOut);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const CourseDetailsWithContext = withContext(CourseDetails);
const PrivateRouteWithContext = withContext(PrivateRoute);

const data = new Data();

function App(props) {
  //console.log(props.context.authenticatedUser);
  
  return (
    
        <div>
          
          <HeaderWithContext />
        
            <Switch>
              <Route exact path='/' component={CoursesWithContext} />
              <Route exact path='/courses' component={CoursesWithContext}/>
              <Route exact path='/signin' component={UserSignInWithContext}/>
              <Route exact path='/signup' component={UserSignUpWithContext}/>
              <Route exact path='/signout' component = {UserSignOutWithContext}/>
              <PrivateRouteWithContext exact path="/courses/create" component={CreateCourseWithContext} />
              <PrivateRouteWithContext exact path="/courses/:id/update" component={UpdateCourseWithContext} />
              <PrivateRouteWithContext exact path="/courses/:id/delete" component={UpdateCourseWithContext} />
              
              
              <Route exact path="/courses/:id" component={CourseDetailsWithContext}/>
                  
              
              
                
                <Route path="/notfound" component={NotFound} />
                <Route path="/forbidden" component={Forbidden} />
                <Route path="/error" component={UnhandledError} />
                <Route component = {NotFound} />
                <Redirect to="/notfound" />
                
              </Switch>
          </div>
      

  );
}

export default App;
