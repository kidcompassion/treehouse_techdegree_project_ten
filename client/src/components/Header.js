import React from 'react';
import { Link } from 'react-router-dom';

export const Header  = (props) =>{

    // Pass context data into var for easier manipulation
    const { authenticatedUser } = props.context;

    return(        
        <div className="header">
            <div className="bounds">
                <h1 className="header--logo">
                    <Link to="/courses">Courses</Link>
                </h1>
                <nav>
                    {/*If the authenticatedUser isn't null, it means someone is logged in*/}
                    {authenticatedUser != null?
                    <React.Fragment>
                        {/* name shows/hides when header component re-renders, which is based on the change of state in context */}
                        <span>Welcome, {authenticatedUser.firstName} {authenticatedUser.lastName}!</span>
                        <Link className="signout" to="/signout">Sign Out</Link>
                    </React.Fragment>
                : // Else, show sign up and sign in links
                    <React.Fragment>
                        <Link className="signup" to="/signup">Sign Up</Link>
                        <Link className="signin" to="/signin">Sign In</Link>
                    </React.Fragment>
                }
            </nav>
        </div>
    </div>                    
)}
                
                
                


    
    

    
    
        
