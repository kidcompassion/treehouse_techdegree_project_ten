import React from 'react';

const NotFound = (props) =>{
    console.log(props);
    return(
    
        <div className="grid-100">
            <div className="bounds">
                <h1>Not Found</h1>
                <p>Sorry! We couldn't find the page you're looking for.</p>
            </div>
        </div>
      
    )
}

export default NotFound;