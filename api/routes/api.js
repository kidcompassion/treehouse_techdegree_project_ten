var express = require('express');
var router = express.Router();
const bcryptjs = require('bcryptjs');
var auth = require('basic-auth');

const { User, Course } = require('../models');


/**
 * async try catch helper
 * @param {} callback 
 */

const asyncHandler = (callback)=>{
    return async(req, res, next) =>{
        try{
            // await results of callback
            await callback(req, res, next);
        }
        catch(error){
            res.status(500).send(error);
        }
    }
}

/**
 * Authentication Function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

const authenticateUser = async (req, res, next) => {
    // https://teamtreehouse.com/library/rest-api-authentication-with-express
    //Get auth headers
    const credentials = auth(req);

    //Set message for various errors
    let message = null;
    
    if(credentials){
        let userPassword = '';
        // Get the user based on auth header email
        const userLookup = await User.findAll({
                                    where: {
                                        emailAddress: credentials.name
                                    }
                                });

        if (userLookup.length>0){           
            // Get hashed password and set it to var for comparing
            userLookup.map((user)=> {
                userPassword = user.password;
            });
                                
            // Compare password to one in DB
            const passwordMatch = bcryptjs.compareSync(credentials.pass, userPassword);
            console.log(JSON.stringify(req.headers));

            // If correct password, set current user property
            if(passwordMatch){
                req.currentUser = userLookup;
            } else {
                message = 'Password does not match';
            }
        } else {
            message = 'No such user';
        }
    } else {
        message = 'No headers';
    }
    if(message){
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    }else {
        next();
    }

    
  };
  
/**
 * Route-level validation
 */

const validationHelper = (incomingQuery, errors, requiredValues)=>{
    // Loop through the required values
    requiredValues.map((required)=>{
        // if a required value isn't set, show an error
        if(!incomingQuery[required]){
            errors.push(`Please provide a value for "${required}"`);
        }
    });
};


/**
 * Root /API Route
 */

router.get('/', authenticateUser, (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});


/********************USER ROUTES******************************* */


/**
 * GET /api/users 200 - Returns the currently authenticated user
 */
 router.get('/users', authenticateUser, asyncHandler(async (req, res)=>{
    let userId;
    // Look in the current user array for the current user id
    req.currentUser.map((user)=> {
        userId = user.id;
    });

    // Use current user ID to return current user info
    const users = await User.findByPk(userId, {
        attributes: ["id", "firstName", "lastName", "emailAddress"]
    });
    // Return payload for current user with 200 status
    res.status(200).json(users);
 }));



 /**
  * GET /api/users/:id 200 - Returns a requested user
  */
 router.get('/users/:id', asyncHandler(async (req, res)=>{
    const user = await User.findByPk(req.params.id);
    res.status(200).json(user);
 }));


/**
 * POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
 * */
router.post('/users', asyncHandler( async (req,res)=>{
    
    // Get incoming params
    const newUser = req.body;

    console.log(req.body);
    //Get ready to grab any errors
    const errors = [];

    // Define which fields are required
    const requiredValues = ["firstName", "lastName", "emailAddress", "password"];

    // Pass required fields to validation helper on line 81
    validationHelper(newUser, errors, requiredValues);

    //Check to see if email exists
    if(newUser.emailAddress){
        const userExists = await User.findAndCountAll({
            where: {
                emailAddress: newUser.emailAddress
            }
        });
        // If the result isn't zero, email already exists
        if (userExists.count != 0){
            errors.push('Email already exists');
        }
    }

    // If there are any errors in the errors array
    if (errors.length > 0) {
        // return them in the payload
        res.status(400).json({ errors });
    } else {
        // Create user, including hashing of password
        const createUser = await User.create({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            emailAddress: newUser.emailAddress,
            password: bcryptjs.hashSync(newUser.password)
        });
        // set location header
        res.location('/');

        //Set status to 201 and return no content
        res.status(201).send();
    }
}));
  

/**
 * PUT /api/users 201 - Updates a user
 */
router.put('/users/:id', authenticateUser, asyncHandler( async (req, res)=>{
console.log('test');
    //console.log(req.body);
    const userUpdate = req.query;

    const errors= [];

    const requiredValues = ["firstName", "lastName", "emailAddress", "password"];

    validationHelper(userUpdate, errors, requiredValues);
    
    // If there are any errors...
    if (errors.length > 0) {
        // Return the validation errors to the client.
        res.status(400).json({ errors });
    } else {
        // Add the user to the `users` array.
        const user = await User.findByPk(req.params.id);
        await user.update(req.query);
        res.status(204).end();
    }
}));


/**
 * DELETE /api/users/:id 201 - Delete a user
 */
router.delete('/users/:id', asyncHandler( async (req, res)=>{
    const selectedUser = await User.findByPk(req.params.id);
    await selectedUser.destroy();
    res.status(204).end();
}));


/********************COURSE ROUTES******************************* */


/**
 * GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
 */
 router.get('/courses', asyncHandler(async (req, res)=>{
    // Get all courses
    const courses = await Course.findAll({
        // Limit which attributes are returned
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"],
        include: { //Include the user that owns the course
            model: User,
            attributes: ["id", "firstName", "lastName", "emailAddress"] 
        }
    });
    res.status(200).json(courses);
 }));

 /**
  * GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
  */
 router.get('/courses/:id', asyncHandler(async (req, res)=>{
    const course = await Course.findByPk(req.params.id,{
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"],
        // Get the associated user, limiting which of their attributes are returned
        include: {
            model: User,
            attributes: ["id", "firstName", "lastName", "emailAddress"] 
        }
    });
    res.status(200).json(course);
 }));


 /**
  * POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
  */
router.post('/courses', authenticateUser, asyncHandler( async (req,res)=>{

    console.log(req.body);
    // Get incoming params
    const newCourse = req.body;

    // Get ready for errors
    const errors = [];

    const requiredValues = ['title', 'description', 'userId'];
 
    // Set up validation as described in https://teamtreehouse.com/library/rest-api-validation-with-express
    // if there are errors, put them in the errors array

    validationHelper(newCourse, errors, requiredValues);

    if (errors.length > 0) {
        // Return the validation errors to the client.
        res.status(400).json({ errors });
    } else {
        // Create new course and return 201 status
        const createCourse = await Course.create(req.body);

        // Set location header to path to course
        res.location('/courses/'+ createCourse.id);
        res.status(201).send();
    }  
}));

/**
 * PUT /api/courses/:id 204 - Updates a course and returns no content
 */

 router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res)=>{
    
    let currentUserId = null;
    // Get ID of currently authorized user
    req.currentUser.map((user)=> {
        currentUserId = user.id;
    });

    // Get currently request course
    const requestedCourseInfo = await Course.findByPk(req.params.id);
    // Get owner of requested course
    const currCourseOwner = requestedCourseInfo.dataValues.userId;
   
    // If current authorized user is different from course owner..
    if(currentUserId === currCourseOwner){
    
        const courseUpdate = req.body;
        const errors= [];
        const requiredValues = ['title', 'description', 'userId'];

        validationHelper(courseUpdate, errors, requiredValues);

        if (errors.length > 0) {
            res.status(400).json({ errors });
        } else {
            const course = await Course.findByPk(req.params.id);
            await course.update(req.body);
            res.status(204).json(course);
        }
    } else {
        res.status(403).end();
    }
        

 }));

 /**
  * DELETE /api/courses/:id 204 - Deletes a course and returns no content
  */
router.delete('/courses/:id', authenticateUser, asyncHandler( async (req, res)=>{
    // Get currently authorized user
    let currentUserId;
    req.currentUser.map((user)=> {
        currentUserId = user.id;
    }); 
    // Get currently requestED course
    const requestedCourseInfo = await Course.findByPk(req.params.id);
    // Get owner of requested course
    const currCourseOwner = requestedCourseInfo.dataValues.userId;
    if(currentUserId === currCourseOwner){
        await requestedCourseInfo.destroy();
        res.status(204).end();
    } else {
        res.status(403).end();
    }
}));

module.exports = router;