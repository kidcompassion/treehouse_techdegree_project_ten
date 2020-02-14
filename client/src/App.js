import React from 'react';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CreateCourse from './components/CreateCourse'
import UserSignOut from './components/UserSignOut';
import UpdateCourse from './components/UpdateCourse';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
import { Header } from './components/Header';
import { withContext }  from './components/Context';
import PrivateRoute from './PrivateRoute';

import {
  Route,
  Switch
} from 'react-router-dom';
import './App.css';


const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CreateCourseWithContext = withContext(CreateCourse);
const UserSignOutWithContext = withContext(UserSignOut);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const CourseDetailWithContext = withContext(CourseDetail);
const PrivateRouteWithContext = withContext(PrivateRoute);
const NotFoundWithContext = withContext(NotFound);
const ForbiddenWithContext = withContext(Forbidden);
const UnhandledErrorWithContext = withContext(UnhandledError);

function App() {
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
                <Route exact path="/courses/:id" component={CourseDetailWithContext}/>
                <Route path="/notfound" component={NotFoundWithContext} />
                <Route path="/forbidden" component={ForbiddenWithContext} />
                <Route path="/error" component={UnhandledErrorWithContext} />
                <Route component = {NotFoundWithContext} />
            </Switch>
        </div>
    );
}

export default App;
